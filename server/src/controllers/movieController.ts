import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/index.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export async function getMovies(req: Request, res: Response) {
  const {
    search,
    genre,
    language,
    format,
    status, // "nowShowing" | "comingSoon" | "featured"
    city,   // city slug or city name
    sortBy = 'popularity', // "popularity" | "rating" | "releaseDate"
    order = 'desc',
    page = '1',
    limit = '20',
  } = req.query;

  const pageNum = parseInt(page as string, 10) || 1;
  const take = parseInt(limit as string, 10) || 20;
  const skip = (pageNum - 1) * take;

  const where: any = {};

  if (search) {
    where.OR = [
      { title: { contains: search as string, mode: 'insensitive' } },
      { director: { contains: search as string, mode: 'insensitive' } },
      { description: { contains: search as string, mode: 'insensitive' } },
    ];
  }

  if (genre) {
    where.genres = {
      some: {
        genre: {
          slug: (genre as string).toLowerCase(),
        },
      },
    };
  }

  if (language) {
    where.language = { equals: language as string, mode: 'insensitive' };
  }

  if (format) {
    where.formats = { has: format as string };
  }

  if (status === 'nowShowing') {
    where.isNowShowing = true;
  } else if (status === 'comingSoon') {
    where.isComingSoon = true;
  } else if (status === 'featured') {
    where.isFeatured = true;
  }

  // If city is specified, only return movies that have scheduled shows in that city
  if (city) {
    where.shows = {
      some: {
        theatre: {
          city: {
            OR: [
              { slug: (city as string).toLowerCase() },
              { name: { equals: city as string, mode: 'insensitive' } },
            ],
          },
        },
        status: 'ACTIVE',
      },
    };
  }

  let orderBy: any = { voteCount: 'desc' };
  if (sortBy === 'rating') {
    orderBy = { rating: order === 'asc' ? 'asc' : 'desc' };
  } else if (sortBy === 'releaseDate') {
    orderBy = { releaseDate: order === 'asc' ? 'asc' : 'desc' };
  } else if (sortBy === 'popularity') {
    orderBy = { voteCount: order === 'asc' ? 'asc' : 'desc' };
  }

  const [movies, total] = await Promise.all([
    prisma.movie.findMany({
      where,
      skip,
      take,
      orderBy,
      include: {
        genres: {
          include: { genre: true },
        },
      },
    }),
    prisma.movie.count({ where }),
  ]);

  const formattedMovies = movies.map((m) => ({
    ...m,
    genres: m.genres.map((g) => g.genre),
  }));

  return sendSuccess(res, 'Movies retrieved successfully', {
    movies: formattedMovies,
    pagination: {
      total,
      page: pageNum,
      limit: take,
      totalPages: Math.ceil(total / take),
    },
  });
}

export async function getMovieById(req: Request, res: Response) {
  const { id } = req.params;

  const movie = await prisma.movie.findFirst({
    where: {
      OR: [{ id }, { slug: id }],
    },
    include: {
      genres: {
        include: { genre: true },
      },
      reviews: {
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });

  if (!movie) {
    return sendError(res, 'Movie not found', 404);
  }

  const formattedMovie = {
    ...movie,
    genres: movie.genres.map((g) => g.genre),
  };

  return sendSuccess(res, 'Movie details retrieved', formattedMovie);
}

export async function getMovieReviews(req: Request, res: Response) {
  const { id } = req.params;

  const reviews = await prisma.review.findMany({
    where: { movieId: id },
    include: {
      user: {
        select: { id: true, name: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return sendSuccess(res, 'Reviews retrieved', reviews);
}

export async function addMovieReview(req: AuthenticatedRequest, res: Response) {
  const { id: movieId } = req.params;
  const schema = z.object({
    rating: z.number().min(1).max(5),
    comment: z.string().min(3, 'Review comment must be at least 3 characters'),
  });

  const { rating, comment } = schema.parse(req.body);

  const movie = await prisma.movie.findUnique({ where: { id: movieId } });
  if (!movie) {
    return sendError(res, 'Movie not found', 404);
  }

  // Create or update review
  const review = await prisma.review.upsert({
    where: {
      userId_movieId: {
        userId: req.user!.id,
        movieId,
      },
    },
    update: {
      rating,
      comment,
    },
    create: {
      userId: req.user!.id,
      movieId,
      rating,
      comment,
    },
    include: {
      user: {
        select: { id: true, name: true },
      },
    },
  });

  // Recalculate average rating
  const allReviews = await prisma.review.findMany({
    where: { movieId },
    select: { rating: true },
  });

  const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
  await prisma.movie.update({
    where: { id: movieId },
    data: {
      rating: parseFloat(avgRating.toFixed(1)),
      voteCount: allReviews.length,
    },
  });

  return sendSuccess(res, 'Review posted successfully!', review, 201);
}
