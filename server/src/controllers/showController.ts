import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/index.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { SeatStatus } from '@prisma/client';

export async function getShows(req: Request, res: Response) {
  const { movieId, theatreId, city, date } = req.query;

  const where: any = {
    status: 'ACTIVE',
  };

  if (movieId) {
    where.movieId = movieId as string;
  }

  if (theatreId) {
    where.theatreId = theatreId as string;
  }

  if (city) {
    where.theatre = {
      city: {
        OR: [
          { slug: (city as string).toLowerCase() },
          { name: { equals: city as string, mode: 'insensitive' } },
        ],
      },
    };
  }

  if (date) {
    const targetDate = new Date(date as string);
    targetDate.setHours(0, 0, 0, 0);
    const nextDate = new Date(targetDate.getTime() + 24 * 60 * 60 * 1000);
    where.date = {
      gte: targetDate,
      lt: nextDate,
    };
  }

  const shows = await prisma.show.findMany({
    where,
    include: {
      movie: {
        select: {
          id: true,
          title: true,
          posterUrl: true,
          duration: true,
          language: true,
          formats: true,
        },
      },
      theatre: {
        select: {
          id: true,
          name: true,
          location: true,
          facilities: true,
          city: true,
        },
      },
      screen: {
        select: {
          id: true,
          name: true,
          screenType: true,
        },
      },
    },
    orderBy: [
      { theatre: { name: 'asc' } },
      { startTime: 'asc' },
    ],
  });

  return sendSuccess(res, 'Shows retrieved successfully', shows);
}

export async function getShowById(req: Request, res: Response) {
  const { id } = req.params;

  const show = await prisma.show.findUnique({
    where: { id },
    include: {
      movie: true,
      theatre: {
        include: { city: true },
      },
      screen: true,
    },
  });

  if (!show) {
    return sendError(res, 'Show not found', 404);
  }

  return sendSuccess(res, 'Show retrieved', show);
}

export async function getShowSeats(req: Request, res: Response) {
  const { id: showId } = req.params;

  const show = await prisma.show.findUnique({
    where: { id: showId },
    include: {
      screen: true,
      movie: {
        select: { id: true, title: true, duration: true, formats: true, language: true },
      },
      theatre: {
        select: { id: true, name: true, location: true },
      },
    },
  });

  if (!show) {
    return sendError(res, 'Show not found', 404);
  }

  const now = new Date();

  // Fetch all show seats with seat geometry and row/number
  const showSeats = await prisma.showSeat.findMany({
    where: { showId },
    include: {
      seat: true,
    },
    orderBy: [
      { seat: { row: 'asc' } },
      { seat: { number: 'asc' } },
    ],
  });

  // Check and normalize status: if seat is LOCKED but lockedUntil has passed, treat as AVAILABLE
  const formattedSeats = showSeats.map((ss) => {
    let currentStatus = ss.status;
    if (ss.status === SeatStatus.LOCKED && ss.lockedUntil && ss.lockedUntil < now) {
      currentStatus = SeatStatus.AVAILABLE;
    }

    return {
      showSeatId: ss.id,
      seatId: ss.seatId,
      row: ss.seat.row,
      number: ss.seat.number,
      seatType: ss.seat.seatType,
      price: ss.price,
      status: currentStatus,
      lockedUntil: ss.lockedUntil,
    };
  });

  return sendSuccess(res, 'Seats retrieved successfully', {
    show: {
      id: show.id,
      date: show.date,
      startTime: show.startTime,
      endTime: show.endTime,
      screenName: show.screen.name,
      screenType: show.screen.screenType,
      rows: show.screen.rows,
      cols: show.screen.cols,
      movie: show.movie,
      theatre: show.theatre,
    },
    seats: formattedSeats,
  });
}

export async function lockSeats(req: AuthenticatedRequest, res: Response) {
  const { id: showId } = req.params;
  const schema = z.object({
    seatIds: z.array(z.string()).min(1, 'Please select at least 1 seat'),
  });

  const { seatIds } = schema.parse(req.body);
  const userId = req.user!.id;
  const now = new Date();
  const lockExpiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10-minute hold

  try {
    // Interactive transaction to lock seats atomically
    const result = await prisma.$transaction(async (tx) => {
      // Find requested seats for this show
      const seats = await tx.showSeat.findMany({
        where: {
          showId,
          seatId: { in: seatIds },
        },
        include: { seat: true },
      });

      if (seats.length !== seatIds.length) {
        throw new Error('Some requested seats could not be found for this show.');
      }

      // Check if any seat is BOOKED, or LOCKED by someone else within valid window
      for (const s of seats) {
        if (s.status === SeatStatus.BOOKED) {
          throw new Error(`Seat ${s.seat.row}${s.seat.number} is already booked.`);
        }
        if (
          s.status === SeatStatus.LOCKED &&
          s.lockedUntil &&
          s.lockedUntil > now &&
          s.lockedByUserId !== userId
        ) {
          throw new Error(`Seat ${s.seat.row}${s.seat.number} is temporarily reserved by another user.`);
        }
      }

      // Update seats to LOCKED
      await tx.showSeat.updateMany({
        where: {
          showId,
          seatId: { in: seatIds },
        },
        data: {
          status: SeatStatus.LOCKED,
          lockedUntil: lockExpiresAt,
          lockedByUserId: userId,
        },
      });

      return {
        lockedSeats: seats.map((s) => ({
          showSeatId: s.id,
          seatId: s.seatId,
          row: s.seat.row,
          number: s.seat.number,
          seatType: s.seat.seatType,
          price: s.price,
        })),
        lockExpiresAt,
      };
    });

    return sendSuccess(res, 'Seats successfully reserved for 10 minutes!', result);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to lock seats', 409);
  }
}
