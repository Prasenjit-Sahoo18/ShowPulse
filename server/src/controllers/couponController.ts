import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/index.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { DiscountType } from '@prisma/client';

export async function getActiveCoupons(req: Request, res: Response) {
  const coupons = await prisma.coupon.findMany({
    where: {
      isActive: true,
      validTill: { gte: new Date() },
    },
    select: {
      id: true,
      code: true,
      description: true,
      discountType: true,
      discountValue: true,
      minAmount: true,
      maxDiscount: true,
      validTill: true,
    },
    orderBy: { discountValue: 'desc' },
  });

  return sendSuccess(res, 'Active coupons retrieved', coupons);
}

export async function validateCoupon(req: Request, res: Response) {
  const schema = z.object({
    code: z.string().min(1, 'Coupon code is required'),
    amount: z.number().min(1, 'Order amount is required'),
  });

  const { code, amount } = schema.parse(req.body);

  const coupon = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase().trim() },
  });

  if (!coupon || !coupon.isActive) {
    return sendError(res, 'Invalid coupon code.', 400);
  }

  if (coupon.validTill < new Date()) {
    return sendError(res, 'This coupon has expired.', 400);
  }

  if (amount < coupon.minAmount) {
    return sendError(
      res,
      `Coupon requires a minimum booking amount of ₹${coupon.minAmount}. Current: ₹${amount.toFixed(2)}`,
      400
    );
  }

  let discount = 0;
  if (coupon.discountType === DiscountType.PERCENTAGE) {
    discount = (amount * coupon.discountValue) / 100;
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else {
    discount = coupon.discountValue;
  }

  discount = Math.min(discount, amount);

  return sendSuccess(res, `Coupon applied! You saved ₹${discount.toFixed(2)}`, {
    couponId: coupon.id,
    code: coupon.code,
    discount: parseFloat(discount.toFixed(2)),
    finalAmount: parseFloat((amount - discount).toFixed(2)),
  });
}
