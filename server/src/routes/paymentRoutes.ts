import { Router } from 'express';
import {
  createPaymentOrder,
  verifyPayment,
} from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/create', authenticate, createPaymentOrder);
router.post('/verify', authenticate, verifyPayment);

export default router;
