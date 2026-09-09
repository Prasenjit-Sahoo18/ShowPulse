import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { prisma } from '../src/config/index.js';

describe('🎬 CinePulse Backend API Test Suite', () => {
  let authToken = '';
  let testUserId = '';
  let sampleShowId = '';
  let availableSeatIds: string[] = [];
  const testEmail = `tester_${Date.now()}@example.com`;

  beforeAll(async () => {
    // Find an active show to test seats
    const show = await prisma.show.findFirst({
      where: { status: 'ACTIVE' },
      include: {
        showSeats: {
          where: { status: 'AVAILABLE' },
          take: 4,
        },
      },
    });

    if (show && show.showSeats.length >= 2) {
      sampleShowId = show.id;
      availableSeatIds = show.showSeats.map((s) => s.seatId);
    }
  });

  afterAll(async () => {
    // Clean up test user if created
    if (testUserId) {
      await prisma.booking.deleteMany({ where: { userId: testUserId } });
      await prisma.user.deleteMany({ where: { id: testUserId } });
    }
    await prisma.$disconnect();
  });

  // 1. Authentication Tests
  describe('🔐 Authentication Flow', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Integration Tester',
          email: testEmail,
          phone: '9876500000',
          password: 'TestPassword@123',
          confirmPassword: 'TestPassword@123',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(testEmail.toLowerCase());
      expect(res.body.data.token).toBeDefined();

      testUserId = res.body.data.user.id;
      authToken = res.body.data.token;
    });

    it('should reject registration with duplicate email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Duplicate User',
          email: testEmail,
          password: 'TestPassword@123',
          confirmPassword: 'TestPassword@123',
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('should login successfully with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'TestPassword@123',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    });

    it('should reject login with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'WrongPassword',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should fetch user profile with authenticated token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(testEmail.toLowerCase());
    });
  });

  // 2. Movies & Discovery Tests
  describe('🍿 Movie Discovery & Cities', () => {
    it('should list all available cities', async () => {
      const res = await request(app).get('/api/cities');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.some((c: any) => c.name === 'Bhubaneswar')).toBe(true);
    });

    it('should fetch movies with filtering and pagination', async () => {
      const res = await request(app).get('/api/movies?page=1&limit=10');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.movies)).toBe(true);
      expect(res.body.data.movies.length).toBeGreaterThan(0);
      expect(res.body.data.pagination).toBeDefined();
    });

    it('should filter movies by city', async () => {
      const res = await request(app).get('/api/movies?city=bhubaneswar');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.movies)).toBe(true);
    });
  });

  // 3. Coupon Validation Tests
  describe('🏷️ Coupon Validation', () => {
    it('should list active coupons', async () => {
      const res = await request(app).get('/api/coupons/active');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should successfully validate WELCOME50 for eligible amount', async () => {
      const res = await request(app)
        .post('/api/coupons/validate')
        .send({
          code: 'WELCOME50',
          amount: 500,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.discount).toBeGreaterThan(0);
      expect(res.body.data.finalAmount).toBeLessThan(500);
    });

    it('should reject coupon if amount is below minimum threshold', async () => {
      const res = await request(app)
        .post('/api/coupons/validate')
        .send({
          code: 'WELCOME50',
          amount: 50, // Below 300 min amount
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject invalid coupon code', async () => {
      const res = await request(app)
        .post('/api/coupons/validate')
        .send({
          code: 'NON_EXISTENT_CODE_XYZ',
          amount: 500,
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  // 4. Shows, Seats & Concurrency Tests
  describe('💺 Show Seats, Locking & Booking Concurrency', () => {
    it('should fetch seat layout for a show', async () => {
      if (!sampleShowId) return;

      const res = await request(app).get(`/api/shows/${sampleShowId}/seats`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.show).toBeDefined();
      expect(Array.isArray(res.body.data.seats)).toBe(true);
      expect(res.body.data.seats.length).toBeGreaterThan(0);
    });

    it('should lock seats for 10 minutes', async () => {
      if (!sampleShowId || availableSeatIds.length < 2) return;

      const seatsToLock = [availableSeatIds[0], availableSeatIds[1]];

      const res = await request(app)
        .post(`/api/shows/${sampleShowId}/lock-seats`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ seatIds: seatsToLock });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.lockExpiresAt).toBeDefined();
    });

    it('should prevent another user from locking already-locked seats', async () => {
      if (!sampleShowId || availableSeatIds.length < 2) return;

      // Create a secondary user token
      const otherUserRes = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Concurrent User',
          email: `concurrent_${Date.now()}@example.com`,
          password: 'TestPassword@123',
          confirmPassword: 'TestPassword@123',
        });

      const otherToken = otherUserRes.body.data.token;

      // Attempt to lock the same seat
      const res = await request(app)
        .post(`/api/shows/${sampleShowId}/lock-seats`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ seatIds: [availableSeatIds[0]] });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/reserved|booked/i);
    });

    it('should confirm booking and generate QR code ticket', async () => {
      if (!sampleShowId || availableSeatIds.length < 2) return;

      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          showId: sampleShowId,
          seatIds: [availableSeatIds[0], availableSeatIds[1]],
          paymentMethod: 'UPI',
          couponCode: 'WELCOME50',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.bookingReference).toBeDefined();
      expect(res.body.data.qrCodeData).toBeDefined();
      expect(res.body.data.status).toBe('CONFIRMED');
      expect(res.body.data.payment.status).toBe('SUCCESSFUL');
    });

    it('should prevent booking seats that have already been booked', async () => {
      if (!sampleShowId || availableSeatIds.length < 2) return;

      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          showId: sampleShowId,
          seatIds: [availableSeatIds[0]], // already confirmed
          paymentMethod: 'UPI',
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/already.*booked/i);
    });

    it('should display confirmed booking under /api/bookings/my-bookings', async () => {
      const res = await request(app)
        .get('/api/bookings/my-bookings')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });
});
