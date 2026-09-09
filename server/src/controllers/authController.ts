import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../config/index.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { signJwt } from '../utils/jwt.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { Role } from '@prisma/client';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function register(req: Request, res: Response) {
  const validated = registerSchema.parse(req.body);

  const existing = await prisma.user.findUnique({
    where: { email: validated.email.toLowerCase() },
  });

  if (existing) {
    return sendError(res, 'Email is already registered. Please login.', 409);
  }

  const passwordHash = await bcrypt.hash(validated.password, 10);

  const user = await prisma.user.create({
    data: {
      name: validated.name,
      email: validated.email.toLowerCase(),
      phone: validated.phone || null,
      passwordHash,
      role: Role.USER,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
    },
  });

  const token = signJwt({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return sendSuccess(res, 'Account registered successfully!', {
    user,
    token,
  }, 201);
}

export async function login(req: Request, res: Response) {
  const { email, password } = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user || !user.isActive) {
    return sendError(res, 'Invalid email or password.', 401);
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return sendError(res, 'Invalid email or password.', 401);
  }

  const token = signJwt({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return sendSuccess(res, 'Logged in successfully!', {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
    },
    token,
  });
}

export async function getMe(req: AuthenticatedRequest, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      _count: {
        select: { bookings: true },
      },
    },
  });

  if (!user) {
    return sendError(res, 'User not found.', 404);
  }

  return sendSuccess(res, 'Profile retrieved', user);
}

export async function updateProfile(req: AuthenticatedRequest, res: Response) {
  const schema = z.object({
    name: z.string().min(2).optional(),
    phone: z.string().min(10).optional(),
  });

  const validated = schema.parse(req.body);

  const updated = await prisma.user.update({
    where: { id: req.user!.id },
    data: validated,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
    },
  });

  return sendSuccess(res, 'Profile updated successfully!', updated);
}

export async function changePassword(req: AuthenticatedRequest, res: Response) {
  const schema = z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  });

  const { currentPassword, newPassword } = schema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
  });

  if (!user) {
    return sendError(res, 'User not found.', 404);
  }

  const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isMatch) {
    return sendError(res, 'Incorrect current password.', 400);
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  return sendSuccess(res, 'Password changed successfully!');
}
