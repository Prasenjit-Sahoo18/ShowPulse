import { Router } from 'express';
import {
  getShows,
  getShowById,
  getShowSeats,
  lockSeats,
} from '../controllers/showController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', getShows);
router.get('/:id', getShowById);
router.get('/:id/seats', getShowSeats);
router.post('/:id/lock-seats', authenticate, lockSeats);

export default router;
