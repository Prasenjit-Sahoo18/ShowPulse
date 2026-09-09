export type Role = 'USER' | 'ADMIN';
export type SeatType = 'RECLINER' | 'PREMIUM' | 'EXECUTIVE' | 'NORMAL';
export type SeatStatus = 'AVAILABLE' | 'LOCKED' | 'BOOKED';
export type BookingStatus = 'CONFIRMED' | 'CANCELLED' | 'PENDING';
export type PaymentStatus = 'PENDING' | 'SUCCESSFUL' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'UPI' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'NET_BANKING' | 'WALLET';
export type DiscountType = 'PERCENTAGE' | 'FLAT';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: Role;
  isActive: boolean;
  createdAt: string;
  _count?: {
    bookings: number;
  };
}

export interface City {
  id: string;
  name: string;
  state: string;
  slug: string;
  isPopular: boolean;
  _count?: {
    theatres: number;
  };
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
}

export interface Review {
  id: string;
  userId: string;
  movieId: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
  };
}

export interface Movie {
  id: string;
  title: string;
  slug: string;
  description: string;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl?: string | null;
  duration: number; // minutes
  releaseDate: string;
  rating: number;
  voteCount: number;
  language: string;
  formats: string[];
  director: string;
  cast: string[];
  isFeatured: boolean;
  isNowShowing: boolean;
  isComingSoon: boolean;
  genres: Genre[];
  reviews?: Review[];
}

export interface Theatre {
  id: string;
  name: string;
  cityId: string;
  location: string;
  address: string;
  facilities: string[];
  city?: City;
  screens?: Screen[];
}

export interface Screen {
  id: string;
  theatreId: string;
  name: string;
  screenType: string;
  totalSeats: number;
  rows: number;
  cols: number;
}

export interface Seat {
  id: string;
  screenId: string;
  row: string;
  number: number;
  seatType: SeatType;
  basePrice: number;
}

export interface Show {
  id: string;
  movieId: string;
  theatreId: string;
  screenId: string;
  date: string;
  startTime: string;
  endTime: string;
  basePriceMultiplier: number;
  status: string;
  movie: Movie;
  theatre: Theatre;
  screen: Screen;
}

export interface ShowSeatItem {
  showSeatId: string;
  seatId: string;
  row: string;
  number: number;
  seatType: SeatType;
  price: number;
  status: SeatStatus;
  lockedUntil?: string | null;
}

export interface BookingSeat {
  id: string;
  bookingId: string;
  showSeatId: string;
  seatId: string;
  price: number;
  seat: Seat;
}

export interface Payment {
  id: string;
  bookingId: string;
  transactionId: string;
  paymentMethod: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  providerResponse?: any;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  minAmount: number;
  maxDiscount?: number | null;
  validTill: string;
  isActive: boolean;
}

export interface Booking {
  id: string;
  bookingReference: string;
  userId: string;
  showId: string;
  totalTickets: number;
  ticketPrice: number;
  convenienceFee: number;
  discount: number;
  totalAmount: number;
  status: BookingStatus;
  qrCodeData?: string | null;
  couponId?: string | null;
  createdAt: string;
  show: Show;
  bookingSeats: BookingSeat[];
  payment?: Payment | null;
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  error?: any;
}
