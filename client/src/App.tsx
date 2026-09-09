import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.js';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { CityProvider } from './context/CityContext.js';
import { BookingProvider } from './context/BookingContext.js';

import { MainLayout } from './layouts/MainLayout.js';
import { Home } from './pages/Home.js';
import { Movies } from './pages/Movies.js';
import { MovieDetails } from './pages/MovieDetails.js';
import { SeatSelection } from './pages/SeatSelection.js';
import { Checkout } from './pages/Checkout.js';
import { BookingConfirmation } from './pages/BookingConfirmation.js';
import { MyBookings } from './pages/MyBookings.js';
import { Profile } from './pages/Profile.js';
import { Offers } from './pages/Offers.js';
import { AdminDashboard } from './pages/AdminDashboard.js';
import { Login } from './pages/Login.js';
import { Register } from './pages/Register.js';
import { NotFound } from './pages/NotFound.js';

// Protected Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Admin Route Guard
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CityProvider>
          <BookingProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/movies" element={<Movies />} />
                  <Route path="/movies/:id" element={<MovieDetails />} />
                  <Route path="/shows/:id/seats" element={<SeatSelection />} />
                  <Route path="/checkout/:id" element={<Checkout />} />
                  <Route path="/booking-confirmed/:id" element={<BookingConfirmation />} />
                  <Route path="/offers" element={<Offers />} />

                  {/* Authenticated user routes */}
                  <Route
                    path="/my-bookings"
                    element={
                      <ProtectedRoute>
                        <MyBookings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin routes */}
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    }
                  />

                  {/* Auth routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </BookingProvider>
        </CityProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
