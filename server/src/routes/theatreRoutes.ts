import { Router } from 'express';
import { getTheatres, getTheatreById } from '../controllers/theatreController.js';

const router = Router();

router.get('/', getTheatres);
router.get('/:id', getTheatreById);

export default router;
