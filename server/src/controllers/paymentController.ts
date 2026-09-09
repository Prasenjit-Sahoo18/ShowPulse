import { Request, Response } from 'express';
import { z } from 'zod';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { PaymentMethod } from '@prisma/client';

export async function createPaymentOrder(req: Request, res: Response) {
  const schema = z.object({
    amount: z.number().min(1),
    currency: z.string().default('INR'),
    bookingData: z.object({
      showId: z.string(),
      seatIds: z.array(z.string()),
    }),
  });

  const { amount, currency, bookingData } = schema.parse(req.body);

  // Generate mock transaction order ID
  const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  return sendSuccess(res, 'Payment order initiated', {
    orderId,
    amount,
    currency,
    bookingData,
    supportedMethods: Object.values(PaymentMethod),
  });
}

export async function verifyPayment(req: Request, res: Response) {
  const schema = z.object({
    orderId: z.string(),
    paymentMethod: z.nativeEnum(PaymentMethod),
    simulateFailure: z.boolean().optional().default(false),
  });

  const { orderId, paymentMethod, simulateFailure } = schema.parse(req.body);

  if (simulateFailure) {
    return sendError(res, 'Payment transaction declined by bank. Please try another payment method.', 402);
  }

  return sendSuccess(res, 'Payment verified successfully', {
    transactionId: `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
    orderId,
    paymentMethod,
    status: 'SUCCESSFUL',
    verifiedAt: new Date().toISOString(),
  });
}
