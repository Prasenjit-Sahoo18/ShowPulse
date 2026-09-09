import { Request, Response } from 'express';
import { prisma } from '../config/index.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export async function getTheatres(req: Request, res: Response) {
  const { city, search } = req.query;

  const where: any = {};

  if (city) {
    where.city = {
      OR: [
        { slug: (city as string).toLowerCase() },
        { name: { equals: city as string, mode: 'insensitive' } },
      ],
    };
  }

  if (search) {
    where.OR = [
      { name: { contains: search as string, mode: 'insensitive' } },
      { location: { contains: search as string, mode: 'insensitive' } },
    ];
  }

  const theatres = await prisma.theatre.findMany({
    where,
    include: {
      city: true,
      screens: {
        select: {
          id: true,
          name: true,
          screenType: true,
          totalSeats: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  return sendSuccess(res, 'Theatres retrieved successfully', theatres);
}

export async function getTheatreById(req: Request, res: Response) {
  const { id } = req.params;

  const theatre = await prisma.theatre.findUnique({
    where: { id },
    include: {
      city: true,
      screens: {
        include: {
          _count: {
            select: { seats: true },
          },
        },
      },
    },
  });

  if (!theatre) {
    return sendError(res, 'Theatre not found', 404);
  }

  return sendSuccess(res, 'Theatre details retrieved', theatre);
}
