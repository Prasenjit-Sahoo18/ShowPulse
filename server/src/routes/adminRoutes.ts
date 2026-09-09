import { Router } from 'express';
import {
  getAnalytics,
  createMovie,
  updateMovie,
  deleteMovie,
  createTheatre,
  updateTheatre,
  deleteTheatre,
  createShow,
  deleteShow,
  getAdminBookings,
  refundBooking,
  getAdminUsers,
  toggleUserStatus,
} from '../controllers/adminController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Protect all admin routes
router.use(authenticate, requireAdmin);

// Analytics
router.get('/analytics', getAnalytics);

// Movies CRUD
router.post('/movies', createMovie);
router.put('/movies/:id', updateMovie);
router.delete('/movies/:id', deleteMovie);

// Theatres CRUD
router.post('/theatres', createTheatre);
router.put('/theatres/:id', updateTheatre);
router.delete('/theatres/:id', deleteTheatre);

// Shows CRUD
router.post('/shows', createShow);
router.delete('/shows/:id', deleteShow);

// Bookings Management
router.get('/bookings', getAdminBookings);
router.post('/bookings/:id/refund', refundBooking);

// Users Management
router.get('/users', getAdminUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);

export default router;
