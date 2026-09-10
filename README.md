# 🎬 CinePulse — Next-Gen Entertainment & Movie Ticket Booking Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-violet.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff.svg)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-336791.svg)](https://www.postgresql.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-6.4-2D3748.svg)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)

> **CinePulse** is a production-grade, full-stack entertainment ticket booking platform inspired by BookMyShow, featuring an original brand identity, premium dark/light UI design, real-time cinema seat reservations with atomic concurrency locking, digital QR entrance tickets, admin analytics dashboards, and an API architecture decoupled for consumption by web and React Native mobile applications.

---

## 🌟 Key Features

### 🍿 Customer Experience
- **City & Location Selector**: Switch between 8 major metropolitan entertainment hubs (*Bhubaneswar*, *Mumbai*, *Delhi-NCR*, *Bengaluru*, *Hyderabad*, *Chennai*, *Kolkata*, *Pune*). All movie listings, theatres, and showtimes dynamically filter by city.
- **Global Search & Debounced Suggestions**: Real-time search across titles, directors, and genres with instant popup previews.
- **Movie Catalog & Multi-Faceted Filters**: Filter by genre chips, languages (*English*, *Hindi*, *Odia*, *Telugu*), and cinema formats (*2D*, *3D*, *IMAX 3D*, *4DX*), sorted by popularity or critic ratings.
- **Cinematic Movie Showcase**: High-res posters, atmospheric backdrops, embedded official YouTube trailers, director & cast credits, and verified audience reviews.
- **Interactive Auditorium Seat Layout**:
  - Realistic curved cinema screen projection SVG indicator.
  - Multi-tiered seat categories: **Recliner (₹400-₹450)**, **Premium (₹300-₹320)**, **Executive (₹220-₹250)**, and **Normal (₹160-₹180)**.
  - Visual seat states: *Available*, *Selected*, *Booked*, and *Locked*.
  - Prevents selection of already-booked or reserved seats.
- **Atomic 10-Minute Hold Lock**: Database transactions (`prisma.$transaction`) atomically reserve selected seats with a live 10-minute hold countdown timer to eliminate double bookings and race conditions.
- **Dynamic Cart & Offers**: Real-time breakdown of ticket subtotal, convenience fee (8%), and promo code deductions (*WELCOME50*, *MOVIE100*, *WEEKEND20*, etc.).
- **Mock Payment Gateway Sandbox**: Support for UPI, Credit Card, Debit Card, Net Banking, and Wallets with test failure toggles to simulate real gateway exception recovery.
- **Digital QR Entry Pass**: Automatically generates scannable QR verification passes with perforated ticket designs, print/PDF saving, and turnstile verification data.
- **My Bookings & Cancellation**: View active and historical bookings, display digital tickets, or cancel with instant seat release and automated refund processing.
- **User Profile Management**: Update personal info and change passwords securely.
- **Dark / Light Theme Toggle**: Sleek midnight theme with electric violet/fuchsia accents or pearl-white mode, persisted locally.

### 🛡️ Enterprise Admin Dashboard
- **Analytics & KPIs**: Real-time metrics for total gross revenue, ticket volume, today's sales, active auditorium occupancy rate, and dynamic 7-day revenue trend bar charts.
- **Movie Catalogue Management**: Full CRUD capabilities to publish movies, update synopsis, assign formats, and configure cast/crew.
- **Theatres & Screens**: Register new cinema properties, manage audi screens, and configure seat configurations.
- **Show Scheduling**: Schedule showtime slots with custom date, time, and dynamic price multipliers.
- **Bookings & Auditing**: Search transactions by reference or customer email, review status, and trigger refunds.
- **User Administration**: Inspect registered customers and toggle account statuses.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Web** | React 18, Vite, TypeScript, Tailwind CSS, React Router v6, Axios, Lucide React, Canvas Confetti |
| **Backend API** | Node.js, Express.js, TypeScript, RESTful JSON APIs, Zod, QRCode |
| **Database & ORM**| PostgreSQL 18, Prisma ORM (with ACID Interactive Transactions & Foreign Keys) |
| **Authentication**| JWT (JSON Web Tokens), bcryptjs password hashing |
| **Testing** | Vitest, Supertest (18 automated integration tests) |

---

## 📁 Project Architecture & Monorepo Structure

```
ticket-booking-app/
├── package.json                   # Root workspace scripts (dev, build, seed, test)
├── .env.example                   # Environment configuration template
├── README.md                      # Complete system & React Native API documentation
│
├── server/                        # Express + TypeScript + Prisma REST API
│   ├── package.json
│   ├── tsconfig.json
│   ├── vitest.config.ts
│   ├── prisma/
│   │   ├── schema.prisma          # PostgreSQL relational schema
│   │   └── seed.ts                # Realistic seed: 16 movies, 10 theatres, 120 shows, seats, coupons, users
│   ├── src/
│   │   ├── config/                # Environment variables, database client
│   │   ├── controllers/           # Auth, Movie, Theatre, Show, Booking, Payment, Coupon, Admin
│   │   ├── middleware/            # JWT auth, Admin guard, central error handler
│   │   ├── routes/                # Modular REST route definitions
│   │   ├── utils/                 # Standard ApiResponse, JWT signer, QR code generator
│   │   ├── app.ts                 # Express configuration and middleware
│   │   └── server.ts              # Server bootstrapper on port 5000
│   └── tests/
│       └── api.test.ts            # Automated Vitest test suite (18 tests passing)
│
└── client/                        # Vite + React + TypeScript + Tailwind CSS
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── src/
    │   ├── assets/                # Logos and icons
    │   ├── components/
    │   │   ├── common/            # Navbar, Footer, Modal, Button, Badge, Skeleton, CityModal
    │   │   ├── movies/            # MovieCard, MovieFilters, TrailerModal
    │   │   └── booking/           # SeatGrid, SeatLegend, BookingSummary, TicketCard
    │   ├── context/               # AuthContext, CityContext, ThemeContext, BookingContext
    │   ├── hooks/                 # useDebounce, useCountdown
    │   ├── layouts/               # MainLayout
    │   ├── pages/                 # Home, Movies, MovieDetails, SeatSelection, Checkout, Confirmation, MyBookings, Profile, Offers, AdminDashboard, Login, Register, NotFound
    │   ├── services/              # api.ts (Centralized Axios client shared with React Native)
    │   └── types/                 # TypeScript interfaces
```

---

## 🗄️ Relational Database Design (Prisma)

```
[User] ────< [Booking] >──── [BookingSeat] >──── [Seat]
  │               │                                │
  │               ├──── [Payment]                  │
  │               │                                │
  │               └──── [Coupon]                   │
  │                                                │
[Review] >─── [Movie] ───< [Show] >─── [ShowSeat] ─┘
                 │            │
            [MovieGenre]   [Screen]
                 │            │
              [Genre]     [Theatre] >─── [City]
```

Key models and relationships:
- **`User`**: Account details, encrypted `passwordHash`, `role` (`USER` or `ADMIN`), active status.
- **`City`**: Supported cinema hubs with slug indices.
- **`Theatre` & `Screen`**: Multiplex properties with audi types (`IMAX 3D`, `Dolby Cinema`, `4DX`).
- **`Seat` & `ShowSeat`**: Base seat layout mapped to time-slot inventory with real-time status (`AVAILABLE`, `LOCKED`, `BOOKED`), lock expiration timestamps, and user associations.
- **`Booking` & `BookingSeat`**: Confirmed reservations with unique `bookingReference` (e.g. `CP-2026-98124`), fee breakdowns, and generated base64 QR code tickets.
- **`Payment`**: Transaction records supporting mock statuses (`SUCCESSFUL`, `FAILED`, `REFUNDED`).
- **`Coupon`**: Promotional discount rules (percentage or flat amount with min spend and maximum savings cap).

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js**: v18+ (tested on Node v22)
- **PostgreSQL**: PostgreSQL 14+ running on port `5432` (or via Docker)

### 1. Clone & Configure Environment
```bash
cd ticket-booking-app
cp .env.example server/.env
```

Ensure `server/.env` contains your PostgreSQL credentials:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cinepulse?schema=public"
PORT=5000
NODE_ENV=development
CLIENT_URL="http://localhost:5173"
JWT_SECRET="cinepulse_ultra_secure_jwt_secret_key_2026_production"
JWT_EXPIRES_IN="7d"
MOCK_PAYMENT_ENABLED=true
CONVENIENCE_FEE_PERCENT=8
DEFAULT_CITY="Bhubaneswar"
```

### 2. Install Dependencies
Install packages for both the server and the web client:
```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 3. Database Migration & Seed Data
Synchronize the PostgreSQL schema and populate the rich catalog:
```bash
cd server
npx prisma db push
npm run prisma:seed
```

> **Demo Seed Highlights**:
> - **16 Movies** (with high-res posters, backdrops, trailers, cast, and genres)
> - **8 Cities** (Bhubaneswar, Mumbai, Delhi-NCR, Bengaluru, Hyderabad, Chennai, Kolkata, Pune)
> - **10 Multiplex Theatres** with screens and hundreds of tiered seats
> - **120 Scheduled Showtimes** with live seat inventories
> - **5 Active Promotional Coupons** (*WELCOME50*, *MOVIE100*, *WEEKEND20*, *CINEPULSE50*, *VIPRECLINER*)
> - **Demo Admin**: `admin@example.com` / `Admin@123`
> - **Demo User**: `rahul.sharma@example.com` / `User@123`

### 4. Run Development Servers
From the root workspace, launch both backend and frontend concurrently:
```bash
npm run dev
```
Or run individually:
- **Backend API**: `cd server && npm run dev` → `http://localhost:5000`
- **Frontend Web**: `cd client && npm run dev` → `http://localhost:5173`

### 5. Deploy to Render
This repository includes `render.yaml` for a single Render Node web service. It serves the built React client and Express API together, which keeps the frontend `/api` requests on the same origin. The Render build explicitly installs development dependencies because TypeScript, Prisma CLI, and Node type declarations are required during compilation.

1. Deploy this repository as a **Blueprint** so Render reads `render.yaml`. The Blueprint creates the web service and PostgreSQL database together.
2. Set a strong `JWT_SECRET` in the web service environment. `DATABASE_URL` is wired automatically from the provisioned database.
3. After the first deploy, run `npm run seed` from the project shell or run `npm run prisma:seed -w server` against the Render database to load the movies, theatres, shows, and coupons.

The health check is available at `/api/health`. Do not deploy this app as a Render Static Site because that does not run the Express API.

---

## 🧪 Automated Testing

CinePulse includes a full automated test suite covering all critical business logic:
- User registration & duplicate email rejection
- Password hashing & JWT issuance
- Movie listing, city filtering, and pagination
- Coupon validation, minimum amounts, and discounts
- Auditorium seat retrieval and 10-minute hold locking
- **Concurrent booking prevention & race condition rejection (ACID transactions)**
- User booking history verification

To run tests:
```bash
cd server
npm test
```

---

## 📱 React Native Mobile Integration Guide

> [!IMPORTANT]
> The CinePulse backend is 100% decoupled from the web frontend. All endpoints exchange pure JSON without browser-specific dependencies. The exact same REST APIs can be consumed directly by a React Native iOS and Android application.

### 1. Base API URL Configuration
In your React Native project (e.g. `apps/mobile/src/services/api.ts`):
```typescript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// In local mobile development:
// Android Emulator uses 10.0.2.2 to access host machine localhost
// iOS Simulator uses localhost
const BASE_URL = Platform.OS === 'android' 
  ? 'http://10.0.2.2:5000/api' 
  : 'http://localhost:5000/api';

export const mobileApiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Attach JWT from AsyncStorage
mobileApiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('cinepulse_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 2. Mobile Authentication Flow
1. **Register**: `POST /api/auth/register` with `{ name, email, phone, password, confirmPassword }`.
2. **Login**: `POST /api/auth/login` with `{ email, password }`.
3. **Persist Token**: Store `res.data.data.token` via `AsyncStorage.setItem('cinepulse_token', token)`.
4. **Current Profile**: `GET /api/auth/me` with `Authorization: Bearer <token>`.

### 3. Movie Discovery & City Filtering
- Fetch cities: `GET /api/cities`
- Fetch movies in city: `GET /api/movies?city=bhubaneswar&status=nowShowing`
- Search movies: `GET /api/movies?search=dune`
- Movie details: `GET /api/movies/:id`

### 4. Showtime & Seat Selection Flow
1. **Fetch Shows for Movie**:
   `GET /api/shows?movieId=<movieId>&city=<city>&date=2026-09-08`
2. **Fetch Auditorium Seat Matrix**:
   `GET /api/shows/<showId>/seats`
   Returns rows (`A`, `B`, `C`), seat numbers, categories (`RECLINER`, `PREMIUM`), prices, and status (`AVAILABLE`, `LOCKED`, `BOOKED`).
3. **Lock Seats on Hold**:
   ```typescript
   POST /api/shows/<showId>/lock-seats
   Headers: { Authorization: 'Bearer <token>' }
   Body: { seatIds: ['seat-uuid-1', 'seat-uuid-2'] }
   ```
   Returns `{ lockedSeats: [...], lockExpiresAt: "2026-09-08T02:17:00Z" }`.

### 5. Coupon & Payment Flow
1. **Validate Coupon**:
   ```typescript
   POST /api/coupons/validate
   Body: { code: 'WELCOME50', amount: 800 }
   ```
2. **Confirm Booking & Payment**:
   ```typescript
   POST /api/bookings
   Headers: { Authorization: 'Bearer <token>' }
   Body: {
     showId: '<showId>',
     seatIds: ['seat-uuid-1', 'seat-uuid-2'],
     paymentMethod: 'UPI',
     couponCode: 'WELCOME50'
   }
   ```
   **Response Schema**:
   ```json
   {
     "success": true,
     "message": "🎉 Booking confirmed successfully!",
     "data": {
       "id": "bkg-uuid-123",
       "bookingReference": "CP-2026-560175",
       "totalTickets": 2,
       "ticketPrice": 900.0,
       "convenienceFee": 72.0,
       "discount": 150.0,
       "totalAmount": 822.0,
       "status": "CONFIRMED",
       "qrCodeData": "data:image/png;base64,iVBORw0KGgo...",
       "show": {
         "movie": { "title": "Dune: Part Two" },
         "theatre": { "name": "CinePulse IMAX" },
         "date": "2026-09-08T00:00:00.000Z",
         "startTime": "07:30 PM"
       },
       "payment": {
         "transactionId": "TXN-1725741436-12345",
         "paymentMethod": "UPI",
         "status": "SUCCESSFUL"
       }
     }
   }
   ```
3. **Display Ticket in Mobile App**:
   Render `data.qrCodeData` using React Native's `<Image source={{ uri: qrCodeData }} />`.

---

## 📡 REST API Reference

| Endpoint | Method | Auth | Description |
| :--- | :---: | :---: | :--- |
| `/api/auth/register` | `POST` | Public | Register new customer account |
| `/api/auth/login` | `POST` | Public | Authenticate user and return JWT session token |
| `/api/auth/me` | `GET` | User | Get authenticated customer profile |
| `/api/auth/profile` | `PUT` | User | Update name and phone number |
| `/api/auth/change-password`| `PUT` | User | Change user password |
| `/api/cities` | `GET` | Public | List all supported entertainment cities |
| `/api/movies` | `GET` | Public | List movies with search, filters, and pagination |
| `/api/movies/:id` | `GET` | Public | Get movie details, cast, formats, and reviews |
| `/api/movies/:id/reviews` | `GET` | Public | Get reviews for a specific movie |
| `/api/movies/:id/reviews` | `POST` | User | Submit rating and review |
| `/api/theatres` | `GET` | Public | List theatres by city and search query |
| `/api/theatres/:id` | `GET` | Public | Get single theatre and screens |
| `/api/shows` | `GET` | Public | Get shows filtered by movie, theatre, city, date |
| `/api/shows/:id` | `GET` | Public | Get show details |
| `/api/shows/:id/seats` | `GET` | Public | Get auditorium seat layout and availability |
| `/api/shows/:id/lock-seats`| `POST` | User | Hold seats for 10 minutes in ACID transaction |
| `/api/coupons/active` | `GET` | Public | List active promotional coupons |
| `/api/coupons/validate` | `POST` | Public | Validate coupon against order subtotal |
| `/api/bookings` | `POST` | User | Confirm booking and process payment atomically |
| `/api/bookings/my-bookings`| `GET` | User | List authenticated user's bookings |
| `/api/bookings/:id` | `GET` | User | Get single booking with QR entry pass |
| `/api/bookings/:id/cancel` | `POST` | User | Cancel booking and refund seats |
| `/api/payments/create` | `POST` | User | Create payment order intent |
| `/api/payments/verify` | `POST` | User | Verify payment completion |
| `/api/admin/analytics` | `GET` | Admin | Aggregate dashboard KPIs and revenue charts |
| `/api/admin/movies` | `POST` | Admin | Create new movie in catalogue |
| `/api/admin/movies/:id` | `PUT` | Admin | Update movie details |
| `/api/admin/movies/:id` | `DELETE`| Admin | Delete movie |
| `/api/admin/theatres` | `POST` | Admin | Create theatre property |
| `/api/admin/theatres/:id` | `PUT` | Admin | Update theatre |
| `/api/admin/theatres/:id` | `DELETE`| Admin | Delete theatre |
| `/api/admin/shows` | `POST` | Admin | Schedule show and generate seat inventory |
| `/api/admin/shows/:id` | `DELETE`| Admin | Cancel show |
| `/api/admin/bookings` | `GET` | Admin | Search and audit all customer bookings |
| `/api/admin/bookings/:id/refund` | `POST` | Admin | Refund and cancel booking |
| `/api/admin/users` | `GET` | Admin | List all registered users |
| `/api/admin/users/:id/toggle-status`| `PUT` | Admin | Enable or disable user account |

---

## 🔒 Security Best Practices
- **Password Hashing**: Passwords are encrypted using `bcryptjs` with salt rounds.
- **JWT Authorization**: Session tokens signed with server secrets and verified on protected endpoints.
- **Role-Based Access Control**: Strict `requireAdmin` middleware guard on `/api/admin/*`.
- **Concurrency Protection**: Interactive transactions (`prisma.$transaction`) prevent double-booking race conditions during high-volume demand.
- **No Real Card Storage**: Mock payment tokens prevent financial data liabilities.
- **Sanitized Inputs**: Validated with `zod` schemas.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
