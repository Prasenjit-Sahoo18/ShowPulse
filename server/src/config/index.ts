import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'cinepulse_default_super_secret_jwt_key_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  convenienceFeePercent: parseFloat(process.env.CONVENIENCE_FEE_PERCENT || '8'),
  defaultCity: process.env.DEFAULT_CITY || 'Bhubaneswar',
  mockPaymentEnabled: process.env.MOCK_PAYMENT_ENABLED === 'true' || true,
};

export const prisma = new PrismaClient();
