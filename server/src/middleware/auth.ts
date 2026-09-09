import { Request, Response, NextFunction } from 'express';
import { verifyJwt, JwtPayload } from '../utils/jwt.js';
import { sendError } from '../utils/apiResponse.js';
import { prisma } from '../config/index.js';
import { Role } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: Role;
    name?: string;
  };
}

export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Authentication required. No token provided.', 401);
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyJwt(token);

  if (!decoded) {
    return sendError(res, 'Invalid or expired session token.', 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { id: true, email: true, role: true, name: true, isActive: true },
  });

  if (!user || !user.isActive) {
    return sendError(res, 'User account not found or suspended.', 401);
  }

  req.user = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  };

  next();
}

export function requireAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user || req.user.role !== Role.ADMIN) {
    return sendError(res, 'Access denied. Administrator privileges required.', 403);
  }
  next();
}
