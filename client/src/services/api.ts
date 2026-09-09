import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  ApiResponse,
  Booking,
  City,
  Coupon,
  Movie,
  PaymentMethod,
  Review,
  Show,
  ShowSeatItem,
  Theatre,
  User,
} from '../types/index.js';

// React Native & Web compatible Base URL configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT token from localStorage (or AsyncStorage in React Native)
apiClient.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('cinepulse_token') : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Unwrap data or catch standard error
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

// ---------------- AUTH API ----------------
export const authApi = {
  register: async (data: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    confirmPassword: string;
  }) => {
    const res = await apiClient.post<ApiResponse<{ user: User; token: string }>>('/auth/register', data);
    return res.data.data;
  },

  login: async (data: { email: string; password: string }) => {
    const res = await apiClient.post<ApiResponse<{ user: User; token: string }>>('/auth/login', data);
    return res.data.data;
  },

  getMe: async () => {
    const res = await apiClient.get<ApiResponse<User>>('/auth/me');
    return res.data.data;
  },

  updateProfile: async (data: { name?: string; phone?: string }) => {
    const res = await apiClient.put<ApiResponse<User>>('/auth/profile', data);
    return res.data.data;
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const res = await apiClient.put<ApiResponse<null>>('/auth/change-password', data);
    return res.data;
  },
};

// ---------------- CITIES API ----------------
export const cityApi = {
  getCities: async () => {
    const res = await apiClient.get<ApiResponse<City[]>>('/cities');
    return res.data.data;
  },
};

// ---------------- MOVIES API ----------------
export const movieApi = {
  getMovies: async (params?: {
    search?: string;
    genre?: string;
    language?: string;
    format?: string;
    status?: 'nowShowing' | 'comingSoon' | 'featured';
    city?: string;
    sortBy?: 'popularity' | 'rating' | 'releaseDate';
    order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) => {
    const res = await apiClient.get<
      ApiResponse<{ movies: Movie[]; pagination: { total: number; page: number; limit: number; totalPages: number } }>
    >('/movies', { params });
    return res.data.data;
  },

  getMovieById: async (id: string) => {
    const res = await apiClient.get<ApiResponse<Movie>>(`/movies/${id}`);
    return res.data.data;
  },

  getMovieReviews: async (id: string) => {
    const res = await apiClient.get<ApiResponse<Review[]>>(`/movies/${id}/reviews`);
    return res.data.data;
  },

  addMovieReview: async (id: string, data: { rating: number; comment: string }) => {
    const res = await apiClient.post<ApiResponse<Review>>(`/movies/${id}/reviews`, data);
    return res.data.data;
  },
};

// ---------------- THEATRES API ----------------
export const theatreApi = {
  getTheatres: async (params?: { city?: string; search?: string }) => {
    const res = await apiClient.get<ApiResponse<Theatre[]>>('/theatres', { params });
    return res.data.data;
  },

  getTheatreById: async (id: string) => {
    const res = await apiClient.get<ApiResponse<Theatre>>(`/theatres/${id}`);
    return res.data.data;
  },
};

// ---------------- SHOWS & SEATS API ----------------
export const showApi = {
  getShows: async (params?: { movieId?: string; theatreId?: string; city?: string; date?: string }) => {
    const res = await apiClient.get<ApiResponse<Show[]>>('/shows', { params });
    return res.data.data;
  },

  getShowById: async (id: string) => {
    const res = await apiClient.get<ApiResponse<Show>>(`/shows/${id}`);
    return res.data.data;
  },

  getShowSeats: async (showId: string) => {
    const res = await apiClient.get<ApiResponse<{ show: any; seats: ShowSeatItem[] }>>(`/shows/${showId}/seats`);
    return res.data.data;
  },

  lockSeats: async (showId: string, seatIds: string[]) => {
    const res = await apiClient.post<ApiResponse<{ lockedSeats: any[]; lockExpiresAt: string }>>(
      `/shows/${showId}/lock-seats`,
      { seatIds }
    );
    return res.data.data;
  },
};

// ---------------- BOOKINGS API ----------------
export const bookingApi = {
  createBooking: async (data: {
    showId: string;
    seatIds: string[];
    paymentMethod: PaymentMethod;
    couponCode?: string;
  }) => {
    const res = await apiClient.post<ApiResponse<Booking>>('/bookings', data);
    return res.data.data;
  },

  getMyBookings: async () => {
    const res = await apiClient.get<ApiResponse<Booking[]>>('/bookings/my-bookings');
    return res.data.data;
  },

  getBookingById: async (id: string) => {
    const res = await apiClient.get<ApiResponse<Booking>>(`/bookings/${id}`);
    return res.data.data;
  },

  cancelBooking: async (id: string) => {
    const res = await apiClient.post<ApiResponse<Booking>>(`/bookings/${id}/cancel`);
    return res.data.data;
  },
};

// ---------------- PAYMENTS API ----------------
export const paymentApi = {
  createPaymentOrder: async (data: { amount: number; bookingData: { showId: string; seatIds: string[] } }) => {
    const res = await apiClient.post<ApiResponse<any>>('/payments/create', data);
    return res.data.data;
  },

  verifyPayment: async (data: { orderId: string; paymentMethod: PaymentMethod; simulateFailure?: boolean }) => {
    const res = await apiClient.post<ApiResponse<any>>('/payments/verify', data);
    return res.data.data;
  },
};

// ---------------- COUPONS API ----------------
export const couponApi = {
  getActiveCoupons: async () => {
    const res = await apiClient.get<ApiResponse<Coupon[]>>('/coupons/active');
    return res.data.data;
  },

  validateCoupon: async (code: string, amount: number) => {
    const res = await apiClient.post<ApiResponse<{ couponId: string; code: string; discount: number; finalAmount: number }>>(
      '/coupons/validate',
      { code, amount }
    );
    return res.data.data;
  },
};

// ---------------- ADMIN API ----------------
export const adminApi = {
  getAnalytics: async () => {
    const res = await apiClient.get<ApiResponse<any>>('/admin/analytics');
    return res.data.data;
  },

  createMovie: async (data: any) => {
    const res = await apiClient.post<ApiResponse<Movie>>('/admin/movies', data);
    return res.data.data;
  },

  updateMovie: async (id: string, data: any) => {
    const res = await apiClient.put<ApiResponse<Movie>>(`/admin/movies/${id}`, data);
    return res.data.data;
  },

  deleteMovie: async (id: string) => {
    const res = await apiClient.delete<ApiResponse<null>>(`/admin/movies/${id}`);
    return res.data;
  },

  createTheatre: async (data: any) => {
    const res = await apiClient.post<ApiResponse<Theatre>>('/admin/theatres', data);
    return res.data.data;
  },

  updateTheatre: async (id: string, data: any) => {
    const res = await apiClient.put<ApiResponse<Theatre>>(`/admin/theatres/${id}`, data);
    return res.data.data;
  },

  deleteTheatre: async (id: string) => {
    const res = await apiClient.delete<ApiResponse<null>>(`/admin/theatres/${id}`);
    return res.data;
  },

  createShow: async (data: any) => {
    const res = await apiClient.post<ApiResponse<Show>>('/admin/shows', data);
    return res.data.data;
  },

  deleteShow: async (id: string) => {
    const res = await apiClient.delete<ApiResponse<null>>(`/admin/shows/${id}`);
    return res.data;
  },

  getBookings: async (params?: { search?: string; status?: string; page?: number; limit?: number }) => {
    const res = await apiClient.get<ApiResponse<{ bookings: Booking[]; pagination: any }>>('/admin/bookings', { params });
    return res.data.data;
  },

  refundBooking: async (id: string) => {
    const res = await apiClient.post<ApiResponse<any>>(`/admin/bookings/${id}/refund`);
    return res.data.data;
  },

  getUsers: async () => {
    const res = await apiClient.get<ApiResponse<User[]>>('/admin/users');
    return res.data.data;
  },

  toggleUserStatus: async (id: string) => {
    const res = await apiClient.put<ApiResponse<User>>(`/admin/users/${id}/toggle-status`);
    return res.data.data;
  },
};
