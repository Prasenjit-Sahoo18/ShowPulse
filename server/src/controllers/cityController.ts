import { Request, Response } from 'express';
import { prisma } from '../config/index.js';
import { sendSuccess } from '../utils/apiResponse.js';

export async function getCities(req: Request, res: Response) {
  const cities = await prisma.city.findMany({
    orderBy: [
      { isPopular: 'desc' },
      { name: 'asc' },
    ],
    include: {
      _count: {
        select: { theatres: true },
      },
    },
  });

  return sendSuccess(res, 'Cities fetched successfully', cities);
}
