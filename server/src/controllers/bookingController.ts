import { Response } from 'express';
import { z } from 'zod';
import { prisma, config } from '../config/index.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { generateQrCodeDataUrl } from '../utils/qrCode.js';
import {
  BookingStatus,
  DiscountType,
  PaymentMethod,
  PaymentStatus,
  SeatStatus,
} from '@prisma/client';

const createBookingSchema = z.object({
  showId: z.string().min(1, 'Show ID is required'),
  seatIds: z.array(z.string()).min(1, 'At least one seat must be selected'),
  paymentMethod: z.nativeEnum(PaymentMethod).default(PaymentMethod.UPI),
  couponCode: z.string().optional(),
});

export async function createBooking(req: AuthenticatedRequest, res: Response) {
  const { showId, seatIds, paymentMethod, couponCode } = createBookingSchema.parse(req.body);
  const userId = req.user!.id;
  const now = new Date();

  try {
    const bookingResult = await prisma.$transaction(async (tx) => {
      // 1. Fetch show and theatre details
      const show = await tx.show.findUnique({
        where: { id: showId },
        include: {
          movie: true,
          theatre: { include: { city: true } },
          screen: true,
        },
      });

      if (!show || show.status !== 'ACTIVE') {
        throw new Error('Show is no longer available or has been cancelled.');
      }

      // 2. Fetch and verify seat availability
      const showSeats = await tx.showSeat.findMany({
        where: {
          showId,
          seatId: { in: seatIds },
        },
        include: { seat: true },
      });

      if (showSeats.length !== seatIds.length) {
        throw new Error('Some requested seats could not be found for this show.');
      }

      for (const ss of showSeats) {
        if (ss.status === SeatStatus.BOOKED) {
          throw new Error(`Seat ${ss.seat.row}${ss.seat.number} has already been booked by another user.`);
        }
        if (
          ss.status === SeatStatus.LOCKED &&
          ss.lockedUntil &&
          ss.lockedUntil > now &&
          ss.lockedByUserId !== userId
        ) {
          throw new Error(`Seat ${ss.seat.row}${ss.seat.number} is temporarily reserved by another customer.`);
        }
      }

      // 3. Mark seats as BOOKED
      await tx.showSeat.updateMany({
        where: {
          showId,
          seatId: { in: seatIds },
        },
        data: {
          status: SeatStatus.BOOKED,
          lockedUntil: null,
          lockedByUserId: null,
        },
      });

      // 4. Calculate pricing
      const ticketPrice = showSeats.reduce((sum, ss) => sum + ss.price, 0);
      const convenienceFee = Math.round((ticketPrice * config.convenienceFeePercent) / 100);

      let discount = 0;
      let appliedCouponId: string | null = null;

      if (couponCode) {
        const coupon = await tx.coupon.findUnique({
          where: { code: couponCode.toUpperCase().trim() },
        });

        if (coupon && coupon.isActive && coupon.validTill >= now && ticketPrice >= coupon.minAmount) {
          appliedCouponId = coupon.id;
          if (coupon.discountType === DiscountType.PERCENTAGE) {
            discount = (ticketPrice * coupon.discountValue) / 100;
            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
              discount = coupon.maxDiscount;
            }
          } else {
            discount = coupon.discountValue;
          }
          discount = Math.min(discount, ticketPrice);

          // Increment coupon used count
          await tx.coupon.update({
            where: { id: coupon.id },
            data: { usedCount: { increment: 1 } },
          });
        }
      }

      const totalAmount = Math.max(0, ticketPrice + convenienceFee - discount);

      // 5. Generate unique booking reference & transaction ID
      const randomSuffix = Math.floor(100000 + Math.random() * 900000);
      const year = new Date().getFullYear();
      const bookingReference = `CP-${year}-${randomSuffix}`;
      const transactionId = `TXN-${Date.now()}-${randomSuffix}`;

      // 6. Generate QR Code Data
      const qrPayload = JSON.stringify({
        ref: bookingReference,
        movie: show.movie.title,
        seats: showSeats.map((s) => `${s.seat.row}${s.seat.number}`).join(','),
        date: show.date.toISOString().split('T')[0],
        time: show.startTime,
        theatre: show.theatre.name,
      });

      const qrCodeData = await generateQrCodeDataUrl(qrPayload);

      // 7. Create Booking
      const booking = await tx.booking.create({
        data: {
          bookingReference,
          userId,
          showId,
          totalTickets: seatIds.length,
          ticketPrice,
          convenienceFee,
          discount,
          totalAmount,
          status: BookingStatus.CONFIRMED,
          qrCodeData,
          couponId: appliedCouponId,
          bookingSeats: {
            create: showSeats.map((ss) => ({
              showSeatId: ss.id,
              seatId: ss.seatId,
              price: ss.price,
            })),
          },
          payment: {
            create: {
              transactionId,
              paymentMethod,
              amount: totalAmount,
              status: PaymentStatus.SUCCESSFUL,
              providerResponse: {
                gateway: 'CinePulse Mock Gateway',
                authorizedAt: new Date().toISOString(),
                method: paymentMethod,
              },
            },
          },
        },
        include: {
          show: {
            include: {
              movie: true,
              theatre: { include: { city: true } },
              screen: true,
            },
          },
          bookingSeats: {
            include: { seat: true },
          },
          payment: true,
        },
      });

      return booking;
    });

    return sendSuccess(res, '🎉 Booking confirmed successfully!', bookingResult, 201);
  } catch (err: any) {
    console.error('Booking Transaction Error:', err);
    return sendError(res, err.message || 'Booking failed', 409);
  }
}

export async function getMyBookings(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.id;

  const bookings = await prisma.booking.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      show: {
        include: {
          movie: true,
          theatre: { include: { city: true } },
          screen: true,
        },
      },
      bookingSeats: {
        include: { seat: true },
      },
      payment: true,
    },
  });

  return sendSuccess(res, 'User bookings retrieved', bookings);
}

export async function getBookingById(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const userId = req.user!.id;

  const booking = await prisma.booking.findFirst({
    where: {
      OR: [{ id }, { bookingReference: id }],
      ...(req.user!.role !== 'ADMIN' ? { userId } : {}),
    },
    include: {
      show: {
        include: {
          movie: true,
          theatre: { include: { city: true } },
          screen: true,
        },
      },
      bookingSeats: {
        include: { seat: true },
      },
      payment: true,
    },
  });

  if (!booking) {
    return sendError(res, 'Booking not found', 404);
  }

  return sendSuccess(res, 'Booking retrieved', booking);
}

export async function cancelBooking(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const userId = req.user!.id;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findFirst({
        where: {
          id,
          ...(req.user!.role !== 'ADMIN' ? { userId } : {}),
        },
        include: {
          bookingSeats: true,
          show: true,
          payment: true,
        },
      });

      if (!booking) {
        throw new Error('Booking not found.');
      }

      if (booking.status === BookingStatus.CANCELLED) {
        throw new Error('This booking is already cancelled.');
      }

      // Update Booking status
      const updatedBooking = await tx.booking.update({
        where: { id: booking.id },
        data: { status: BookingStatus.CANCELLED },
      });

      // Release seats back to AVAILABLE
      const seatIds = booking.bookingSeats.map((bs) => bs.seatId);
      await tx.showSeat.updateMany({
        where: {
          showId: booking.showId,
          seatId: { in: seatIds },
        },
        data: {
          status: SeatStatus.AVAILABLE,
          lockedUntil: null,
          lockedByUserId: null,
        },
      });

      // Update payment to REFUNDED
      if (booking.payment) {
        await tx.payment.update({
          where: { id: booking.payment.id },
          data: { status: PaymentStatus.REFUNDED },
        });
      }

      return updatedBooking;
    });

    return sendSuccess(res, 'Booking cancelled successfully. Refund initiated.', result);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to cancel booking', 400);
  }
}
