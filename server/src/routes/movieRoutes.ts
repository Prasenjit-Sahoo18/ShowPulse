import { Router } from 'express';
import {
  getMovies,
  getMovieById,
  getMovieReviews,
  addMovieReview,
} from '../controllers/movieController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', getMovies);
router.get('/:id', getMovieById);
router.get('/:id/reviews', getMovieReviews);
router.post('/:id/reviews', authenticate, addMovieReview);

export default router;
