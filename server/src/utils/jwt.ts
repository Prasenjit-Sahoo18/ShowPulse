import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/index.js';
import { Role } from '@prisma/client';

export interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
}

export function signJwt(payload: JwtPayload): string {
  const options: SignOptions = {
    expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
  };
  return jwt.sign(payload, config.jwtSecret, options);
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, config.jwtSecret) as JwtPayload;
  } catch (err) {
    return null;
  }
}
