import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/index.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { BookingStatus, SeatStatus, PaymentStatus } from '@prisma/client';

export async function getAnalytics(req: Request, res: Response) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalUsers,
    totalMovies,
    totalBookings,
    revenueAggregate,
    todayBookingsCount,
    totalShowSeats,
    bookedShowSeats,
    recentBookings,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.movie.count(),
    prisma.booking.count(),
    prisma.booking.aggregate({
      where: { status: BookingStatus.CONFIRMED },
      _sum: { totalAmount: true },
    }),
    prisma.booking.count({
      where: {
        createdAt: { gte: today },
      },
    }),
    prisma.showSeat.count(),
    prisma.showSeat.count({
      where: { status: SeatStatus.BOOKED },
    }),
    prisma.booking.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        show: {
          include: {
            movie: { select: { title: true } },
            theatre: { select: { name: true } },
          },
        },
      },
    }),
  ]);

  const totalRevenue = revenueAggregate._sum.totalAmount || 0;
  const occupancyRate = totalShowSeats > 0
    ? parseFloat(((bookedShowSeats / totalShowSeats) * 100).toFixed(1))
    : 0;

  // Aggregate top movies
  const topMovies = await prisma.movie.findMany({
    take: 5,
    orderBy: { voteCount: 'desc' },
    select: {
      id: true,
      title: true,
      posterUrl: true,
      rating: true,
      voteCount: true,
      _count: { select: { shows: true } },
    },
  });

  // Mock / dynamic 7-day revenue trend data
  const revenueChartData = [
    { day: 'Mon', revenue: Math.round(totalRevenue * 0.11), bookings: 42 },
    { day: 'Tue', revenue: Math.round(totalRevenue * 0.13), bookings: 49 },
    { day: 'Wed', revenue: Math.round(totalRevenue * 0.14), bookings: 53 },
    { day: 'Thu', revenue: Math.round(totalRevenue * 0.12), bookings: 46 },
    { day: 'Fri', revenue: Math.round(totalRevenue * 0.18), bookings: 78 },
    { day: 'Sat', revenue: Math.round(totalRevenue * 0.22), bookings: 98 },
    { day: 'Sun', revenue: Math.round(totalRevenue * 0.20), bookings: 89 },
  ];

  return sendSuccess(res, 'Analytics fetched successfully', {
    metrics: {
      totalUsers,
      totalMovies,
      totalBookings,
      totalRevenue,
      todayBookings: todayBookingsCount,
      occupancyRate,
    },
    topMovies,
    recentBookings,
    revenueChartData,
  });
}

// ---------------- MOVIES CRUD ----------------
const movieSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(5),
  posterUrl: z.string().url(),
  backdropUrl: z.string().url(),
  trailerUrl: z.string().url().optional(),
  duration: z.number().min(1),
  releaseDate: z.string(),
  rating: z.number().min(0).max(5).default(0),
  language: z.string().min(1),
  formats: z.array(z.string()).default(['2D']),
  director: z.string().min(1),
  cast: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  isNowShowing: z.boolean().default(true),
  isComingSoon: z.boolean().default(false),
  genreIds: z.array(z.string()).default([]),
});

export async function createMovie(req: Request, res: Response) {
  const { genreIds, releaseDate, ...rest } = movieSchema.parse(req.body);

  const movie = await prisma.movie.create({
    data: {
      ...rest,
      releaseDate: new Date(releaseDate),
      genres: {
        create: genreIds.map((genreId) => ({
          genre: { connect: { id: genreId } },
        })),
      },
    },
  });

  return sendSuccess(res, 'Movie created successfully', movie, 201);
}

export async function updateMovie(req: Request, res: Response) {
  const { id } = req.params;
  const { genreIds, releaseDate, ...rest } = movieSchema.partial().parse(req.body);

  const data: any = { ...rest };
  if (releaseDate) {
    data.releaseDate = new Date(releaseDate);
  }

  if (genreIds) {
    await prisma.movieGenre.deleteMany({ where: { movieId: id } });
    data.genres = {
      create: genreIds.map((genreId) => ({
        genre: { connect: { id: genreId } },
      })),
    };
  }

  const movie = await prisma.movie.update({
    where: { id },
    data,
  });

  return sendSuccess(res, 'Movie updated successfully', movie);
}

export async function deleteMovie(req: Request, res: Response) {
  const { id } = req.params;
  await prisma.movie.delete({ where: { id } });
  return sendSuccess(res, 'Movie deleted successfully');
}

// ---------------- THEATRES & SCREENS CRUD ----------------
const theatreSchema = z.object({
  name: z.string().min(2),
  cityId: z.string().min(1),
  location: z.string().min(2),
  address: z.string().min(5),
  facilities: z.array(z.string()).default([]),
});

export async function createTheatre(req: Request, res: Response) {
  const validated = theatreSchema.parse(req.body);
  const theatre = await prisma.theatre.create({ data: validated });
  return sendSuccess(res, 'Theatre created successfully', theatre, 201);
}

export async function updateTheatre(req: Request, res: Response) {
  const { id } = req.params;
  const validated = theatreSchema.partial().parse(req.body);
  const theatre = await prisma.theatre.update({
    where: { id },
    data: validated,
  });
  return sendSuccess(res, 'Theatre updated successfully', theatre);
}

export async function deleteTheatre(req: Request, res: Response) {
  const { id } = req.params;
  await prisma.theatre.delete({ where: { id } });
  return sendSuccess(res, 'Theatre deleted successfully');
}

// ---------------- SHOWS CRUD ----------------
const showSchema = z.object({
  movieId: z.string().min(1),
  theatreId: z.string().min(1),
  screenId: z.string().min(1),
  date: z.string(),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  basePriceMultiplier: z.number().default(1.0),
});

export async function createShow(req: Request, res: Response) {
  const validated = showSchema.parse(req.body);

  const screen = await prisma.screen.findUnique({
    where: { id: validated.screenId },
    include: { seats: true },
  });

  if (!screen) {
    return sendError(res, 'Screen not found', 404);
  }

  // Create show and its seats in a transaction
  const show = await prisma.$transaction(async (tx) => {
    const newShow = await tx.show.create({
      data: {
        movieId: validated.movieId,
        theatreId: validated.theatreId,
        screenId: validated.screenId,
        date: new Date(validated.date),
        startTime: validated.startTime,
        endTime: validated.endTime,
        basePriceMultiplier: validated.basePriceMultiplier,
        status: 'ACTIVE',
      },
      include: {
        movie: true,
        theatre: true,
        screen: true,
      },
    });

    const showSeatsData = screen.seats.map((seat) => ({
      showId: newShow.id,
      seatId: seat.id,
      status: SeatStatus.AVAILABLE,
      price: Math.round(seat.basePrice * validated.basePriceMultiplier),
    }));

    await tx.showSeat.createMany({
      data: showSeatsData,
    });

    return newShow;
  });

  return sendSuccess(res, 'Show created with seat inventory!', show, 201);
}

export async function deleteShow(req: Request, res: Response) {
  const { id } = req.params;
  await prisma.show.delete({ where: { id } });
  return sendSuccess(res, 'Show deleted successfully');
}

// ---------------- BOOKINGS & USERS ----------------
export async function getAdminBookings(req: Request, res: Response) {
  const { search, status, page = '1', limit = '20' } = req.query;
  const pageNum = parseInt(page as string, 10) || 1;
  const take = parseInt(limit as string, 10) || 20;
  const skip = (pageNum - 1) * take;

  const where: any = {};
  if (status) {
    where.status = status as BookingStatus;
  }
  if (search) {
    where.OR = [
      { bookingReference: { contains: search as string, mode: 'insensitive' } },
      { user: { email: { contains: search as string, mode: 'insensitive' } } },
      { user: { name: { contains: search as string, mode: 'insensitive' } } },
      { show: { movie: { title: { contains: search as string, mode: 'insensitive' } } } },
    ];
  }

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        show: {
          include: {
            movie: { select: { title: true, posterUrl: true } },
            theatre: { select: { name: true, location: true } },
            screen: { select: { name: true } },
          },
        },
        payment: true,
      },
    }),
    prisma.booking.count({ where }),
  ]);

  return sendSuccess(res, 'Admin bookings retrieved', {
    bookings,
    pagination: { total, page: pageNum, limit: take, totalPages: Math.ceil(total / take) },
  });
}

export async function refundBooking(req: Request, res: Response) {
  const { id } = req.params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { bookingSeats: true, payment: true },
  });

  if (!booking) {
    return sendError(res, 'Booking not found', 404);
  }

  await prisma.$transaction([
    prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.CANCELLED },
    }),
    prisma.showSeat.updateMany({
      where: {
        showId: booking.showId,
        seatId: { in: booking.bookingSeats.map((b) => b.seatId) },
      },
      data: { status: SeatStatus.AVAILABLE, lockedUntil: null, lockedByUserId: null },
    }),
    ...(booking.payment
      ? [
          prisma.payment.update({
            where: { id: booking.payment.id },
            data: { status: PaymentStatus.REFUNDED },
          }),
        ]
      : []),
  ]);

  return sendSuccess(res, 'Booking cancelled and seats refunded');
}

export async function getAdminUsers(req: Request, res: Response) {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isActive: true,
      createdAt: true,
      _count: { select: { bookings: true } },
    },
  });

  return sendSuccess(res, 'Users retrieved', users);
}

export async function toggleUserStatus(req: Request, res: Response) {
  const { id } = req.params;

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return sendError(res, 'User not found', 404);
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { isActive: !user.isActive },
    select: { id: true, name: true, email: true, isActive: true },
  });

  return sendSuccess(res, `User ${updated.isActive ? 'enabled' : 'disabled'} successfully`, updated);
}
