# 🎬 ShowPulse — Every Seat Has a Story

<p align="center">
  <strong>Discover movies. Reserve your seats. Experience the magic.</strong>
</p>

<p align="center">
  A full-stack cinema discovery and ticket-booking platform designed to deliver a seamless movie-going experience across web and mobile.
</p>

<p align="center">
  <a href="https://github.com/Prasenjit-Sahoo18/ShowPulse">GitHub Repository</a> •
  <a href="https://cinepulse-7ajb.onrender.com">Live Demo</a> •
  <a href="#-getting-started">Get Started</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/React_Native-Mobile-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Native" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
</p>

---

## 📌 Table of Contents

- [About the Project](#-about-the-project)
- [What Makes ShowPulse Different?](#-what-makes-showpulse-different)
- [Features](#-features)
- [React Native Mobile Experience](#-react-native-mobile-experience)
- [Booking Workflow](#-booking-workflow)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Database Design](#-database-design)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [API Overview](#-api-overview)
- [Security and Reliability](#-security-and-reliability)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [Future Roadmap](#-future-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Connect](#-connect)

---

## 🎥 About the Project

**ShowPulse** is a full-stack cinema discovery and ticket-booking platform built to simplify the journey from finding a movie to receiving a digital ticket.

The project combines a modern web interface, a backend REST API, relational data management, and React Native mobile development into a cinema-booking ecosystem.

Users can explore movies, discover theatre showtimes, select seats, manage reservations, and access digital ticket information. Administrators have dedicated tools for managing movies, theatres, screenings, bookings, and platform activity.

The project focuses on more than UI development. It explores practical backend engineering challenges such as authentication, reservation expiration, database transactions, role-based access, and booking consistency.

### 🎯 Project Vision

Build a cinema platform that connects movie discovery, secure booking workflows, and cross-platform experiences through a maintainable architecture.

**Project links**

- Repository: [ShowPulse on GitHub](https://github.com/Prasenjit-Sahoo18/ShowPulse)
- Web demo: [CinePulse](https://cinepulse-7ajb.onrender.com)

> **Naming note:** The repository is named ShowPulse, while the existing application/deployment documentation uses CinePulse. Update the application branding and links consistently if ShowPulse is intended to be the final product name.

---

## 🌟 What Makes ShowPulse Different?

### 1. Booking is more than selecting a seat

A cinema-booking system must account for shared seat availability, temporary reservations, payment outcomes, and booking confirmation. ShowPulse is designed around these connected workflows rather than treating each screen as an isolated feature.

### 2. Web and mobile development

React powers the web experience, while React Native provides the mobile development technology for extending the platform to mobile devices. A shared REST API can support both clients without requiring the booking logic to be duplicated.

### 3. A complete booking lifecycle

The platform's documented workflow covers movie discovery, seat selection, temporary holds, checkout, simulated payment, booking history, digital tickets, and cancellation workflows.

### 4. An administrator experience

The platform also includes administrative workflows for managing the cinema catalogue, scheduling screenings, monitoring bookings, and reviewing operational metrics.

### 5. A practical full-stack engineering project

The combination of React, React Native, Express, TypeScript, PostgreSQL, Prisma, and automated API testing provides an opportunity to explore both user-facing development and backend reliability.

---

## ✨ Features

### 🍿 Movie Discovery

- Browse a catalogue of movies with posters, backdrops, descriptions, genres, cast, and trailers.
- Search and filter movies.
- Explore movie showtimes by city and theatre.
- View movie details, reviews, and ratings.
- Browse listings for supported cinema locations.

### 🪑 Interactive Seat Booking

- Visual auditorium seating layouts.
- Different seat categories and pricing.
- Available, selected, temporarily locked, and booked seat states.
- Temporary seat reservations with a countdown.
- Server-side validation of seat availability.
- Transaction-based booking operations.

### 🎟️ Booking and Checkout

- Review selected seats and ticket totals.
- Calculate applicable convenience fees.
- Validate promotional coupons.
- Simulate payment outcomes.
- Generate booking references.
- View booking history.
- Cancel eligible reservations through the booking workflow.

### 📱 Digital Tickets

- QR-code ticket generation.
- Booking references and screening details.
- Digital ticket viewing.
- Ticket verification workflow support.

### 👤 User Authentication

- Registration and login.
- JWT-based authentication.
- Password hashing.
- Protected customer routes.
- Profile and password management.
- Role-based access for administrators.

### 🛠️ Admin Dashboard

- Movie catalogue management.
- Theatre and screen management.
- Showtime scheduling.
- Seat inventory configuration.
- Booking search and management.
- Dashboard statistics and revenue summaries.
- Customer account management.

### 🎨 User Experience

- Responsive web interface.
- Dark and light themes.
- Reusable UI components.
- Search suggestions and interactive countdowns.
- Loading states and booking feedback.

---

## 📱 React Native Mobile Experience

React Native is part of ShowPulse's mobile development technology stack, enabling the platform to extend beyond the browser to native Android and iOS experiences.

The mobile client can use the same Express REST API as the web application, allowing both clients to work with a consistent backend and data model.

### Mobile development goals

- **Cross-platform development:** Build mobile interfaces for Android and iOS using React Native.
- **Movie discovery:** Provide a mobile-friendly movie catalogue and showtime browsing experience.
- **Seat selection:** Adapt the cinema seating experience to smaller screens.
- **Booking management:** Support viewing reservations and digital ticket information.
- **API integration:** Communicate with the backend through HTTP and JSON.
- **Consistent experience:** Maintain common booking rules and business logic across web and mobile clients.

### Shared backend architecture

```text
             ┌─────────────────────┐
             │   Express REST API  │
             └──────────┬──────────┘
                        │
             ┌──────────┴──────────┐
             │                     │
    ┌────────▼────────┐  ┌─────────▼────────┐
    │   React Web     │  │ React Native App │
    │    Frontend     │  │   Mobile Client  │
    └─────────────────┘  └──────────────────┘
```

The backend can centralize authentication, seat availability, pricing, reservations, and booking rules so the web and mobile clients follow the same business logic.

> **Implementation note:** The React Native features described above are intended capabilities unless the corresponding mobile screens and workflows already exist in the repository. The web development commands in this README do not automatically start a separate React Native application.

---

## 🔄 Booking Workflow

The intended booking workflow connects the main customer-facing features.

```mermaid
flowchart TD
    A[Discover Movies] --> B[Choose a Movie]
    B --> C[Select City, Theatre and Show]
    C --> D[Explore Available Seats]
    D --> E[Select Seats]
    E --> F[Create Temporary Hold]
    F --> G{Hold Valid?}
    G -- No --> D
    G -- Yes --> H[Review Order]
    H --> I[Simulated Payment]
    I --> J{Payment Successful?}
    J -- No --> K[Handle Failure]
    J -- Yes --> L[Confirm Booking]
    L --> M[Generate QR Ticket]
    M --> N[Manage Bookings]
```

### Handling simultaneous booking attempts

If multiple customers attempt to reserve the same seat, the backend must resolve the conflict using server-side checks, database constraints, and appropriate transaction handling.

Temporary holds help prevent other customers from claiming a seat while a reservation is being completed. Expired holds should release the seat for future customers.

The exact guarantees depend on the database transaction strategy and the implemented locking and expiration logic.

---

## 🧰 Technology Stack

| Category | Technologies |
|---|---|
| Web frontend | React 18, Vite |
| Mobile development | React Native |
| Programming languages | TypeScript, JavaScript |
| UI styling | Tailwind CSS |
| Web routing | React Router |
| State management | React Context |
| HTTP communication | Axios |
| Backend | Node.js, Express.js |
| Validation | Zod |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | JWT, bcryptjs |
| Digital tickets | QRCode |
| Testing | Vitest, Supertest |
| Deployment | Render |

### Why these technologies?

- **React:** Component-based development for the web interface.
- **React Native:** A foundation for native mobile application development using React concepts.
- **TypeScript:** Static type checking across supported TypeScript code.
- **Express.js:** REST API development and server-side request handling.
- **PostgreSQL:** Relational data storage and transactional operations.
- **Prisma:** Typed database access and schema management.
- **Vitest and Supertest:** Automated testing for server-side behavior and HTTP endpoints.

---

## 🏗️ System Architecture

ShowPulse follows a client-server architecture that separates user interfaces from backend business logic.

```mermaid
flowchart TD
    U[Users and Administrators]

    U --> W[React Web Client]
    U --> M[React Native Mobile Client]

    W --> API[Express REST API]
    M --> API

    API --> V[Zod Validation]
    V --> AUTH[Authentication and Authorization]
    AUTH --> S[Controllers and Services]

    S --> P[Prisma ORM]
    S --> Q[QR Ticket Generation]

    P --> DB[(PostgreSQL)]
```

### Architecture responsibilities

| Component | Responsibility |
|---|---|
| React web client | Browser-based discovery and booking experience |
| React Native client | Native mobile experience |
| Express API | Request handling and business workflows |
| Validation layer | Validate incoming request data |
| Authentication middleware | Verify identity and permissions |
| Service and controller layers | Implement application workflows |
| Prisma ORM | Query and update relational data |
| PostgreSQL | Store users, shows, seats, bookings, and related records |
| QR utilities | Generate digital ticket data |

The API-first design allows future clients to reuse backend capabilities without duplicating core booking logic.

---

## 🗄️ Database Design

The application uses a relational data model for its cinema-booking domain.

```mermaid
erDiagram
    USER ||--o{ BOOKING : places
    BOOKING ||--o{ BOOKING_SEAT : contains
    SEAT ||--o{ BOOKING_SEAT : references
    MOVIE ||--o{ SHOW : scheduled_for
    THEATRE ||--o{ SCREEN : contains
    SCREEN ||--o{ SEAT : has
    SHOW ||--o{ SHOW_SEAT : manages
    SEAT ||--o{ SHOW_SEAT : allocated_to
    BOOKING ||--o{ PAYMENT : records
    CITY ||--o{ THEATRE : contains
    MOVIE ||--o{ REVIEW : receives
    USER ||--o{ REVIEW : writes
```

### Main entities

- **User:** Customer details, credentials, and account role.
- **City:** Supported cinema locations.
- **Movie:** Titles, descriptions, genres, and metadata.
- **Theatre:** Cinema information and location.
- **Screen:** Auditorium configuration.
- **Seat:** Physical seat identifiers and categories.
- **Show:** Scheduled movie screenings.
- **ShowSeat:** Show-specific seat status and availability.
- **Booking:** Reservation records and booking references.
- **BookingSeat:** Seats associated with bookings.
- **Payment:** Simulated payment records and transaction status.
- **Coupon:** Discount rules and promotional codes.
- **Review:** User ratings and feedback.

The exact entity relationships and constraints should be confirmed against `server/prisma/schema.prisma`.

---

## 💻 Getting Started

### Prerequisites

Install the following tools:

- [Node.js](https://nodejs.org/)
- npm
- [Git](https://git-scm.com/)
- [PostgreSQL](https://www.postgresql.org/)

For React Native development, you may also need:

- [React Native documentation](https://reactnative.dev/docs/getting-started)
- [Android Studio](https://developer.android.com/studio) for Android development.
- Xcode for native iOS builds on macOS.

### 1. Clone the repository

```bash
git clone https://github.com/Prasenjit-Sahoo18/ShowPulse.git
cd ShowPulse
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the provided environment template to the backend configuration file.

**Windows PowerShell**

```powershell
Copy-Item .env.example server/.env
```

**macOS / Linux / Git Bash**

```bash
cp .env.example server/.env
```

Update the values in `server/.env` before starting the application.

### 4. Create the database

Create a PostgreSQL database and configure its connection string.

Then run the documented database setup command:

```bash
npm run db:push
```

Populate the database with sample records:

```bash
npm run seed
```

Use only the appropriate seed data and database when running these commands.

### 5. Start the web application and backend

```bash
npm run dev
```

The documented local development URLs are:

| Service | URL |
|---|---|
| Web frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| API health check | http://localhost:5000/api/health |

Run each service separately if needed:

```bash
npm run dev:server
```

```bash
npm run dev:client
```

### 6. Build the project

```bash
npm run build
```

Start the compiled server:

```bash
npm start
```

These commands refer to the existing web/backend workspace. If the React Native client lives in a separate directory or repository, install its dependencies and follow its own development scripts.

---

## 🔐 Environment Variables

Configure the following variables in `server/.env`, matching the actual names and requirements in the repository's environment template.

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `PORT` | Backend port |
| `NODE_ENV` | Runtime environment |
| `CLIENT_URL` | Web frontend origin |
| `JWT_SECRET` | JWT signing secret |
| `JWT_EXPIRES_IN` | Token expiration duration |
| `MOCK_PAYMENT_ENABLED` | Enables simulated payments |
| `CONVENIENCE_FEE_PERCENT` | Ticket convenience fee |
| `DEFAULT_CITY` | Default cinema city |

Example:

```dotenv
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/cinepulse?schema=public"

PORT=5000
NODE_ENV=development
CLIENT_URL="http://localhost:5173"

JWT_SECRET="REPLACE_WITH_A_LONG_RANDOM_SECRET"
JWT_EXPIRES_IN="7d"

MOCK_PAYMENT_ENABLED=true
CONVENIENCE_FEE_PERCENT=8
DEFAULT_CITY="Bhubaneswar"
```

**Important:** This is an example configuration, not a verified copy of every variable in the repository. Preserve the exact variable names expected by the application and replace the example credentials.

For a React Native client, configure the API base URL using the mobile application's own environment configuration. An Android emulator generally cannot access the host machine through `localhost`; use the appropriate emulator host address or a reachable development server address.

Never commit secrets, production database credentials, or real customer information.

---

## 📜 Available Scripts

The root workspace documents the following commands:

| Command | Description |
|---|---|
| `npm run dev` | Start the frontend and backend in development |
| `npm run dev:server` | Start the backend |
| `npm run dev:client` | Start the web frontend |
| `npm run build` | Build the frontend and backend |
| `npm run build:server` | Build the backend |
| `npm run build:client` | Build the web frontend |
| `npm start` | Start the compiled server |
| `npm run test:server` | Run backend tests |
| `npm run seed` | Populate sample database data |
| `npm run db:push` | Synchronize the Prisma schema |

Check the respective `package.json` files for the exact commands supported by each workspace.

---

## 📡 API Overview

The Express backend provides endpoints for the application's core workflows.

All endpoints below use `/api` as the documented API prefix.

### Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/register` | Register a user |
| POST | `/auth/login` | Authenticate a user |
| GET | `/auth/me` | Retrieve the current user |
| PUT | `/auth/profile` | Update profile information |
| PUT | `/auth/change-password` | Change password |

### Movies and theatres

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/cities` | List supported cities |
| GET | `/movies` | Browse and filter movies |
| GET | `/movies/:id` | Retrieve movie details |
| GET | `/movies/:id/reviews` | Retrieve movie reviews |
| POST | `/movies/:id/reviews` | Submit a review |
| GET | `/theatres` | Browse theatres |
| GET | `/theatres/:id` | Retrieve theatre information |
| GET | `/shows` | Browse showtimes |
| GET | `/shows/:id/seats` | Retrieve seat availability |

### Booking and payment

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/shows/:id/lock-seats` | Create a temporary seat hold |
| GET | `/coupons/active` | List active coupons |
| POST | `/coupons/validate` | Validate a coupon |
| POST | `/bookings` | Create a booking |
| GET | `/bookings/my-bookings` | View booking history |
| GET | `/bookings/:id` | Retrieve booking details |
| POST | `/bookings/:id/cancel` | Request cancellation |
| POST | `/payments/create` | Create a simulated payment intent |
| POST | `/payments/verify` | Verify a simulated payment result |

### Administration

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/admin/analytics` | Retrieve dashboard metrics |
| POST | `/admin/movies` | Add a movie |
| PUT | `/admin/movies/:id` | Update a movie |
| DELETE | `/admin/movies/:id` | Delete a movie |
| POST | `/admin/theatres` | Create a theatre |
| POST | `/admin/shows` | Schedule a screening |
| GET | `/admin/bookings` | Search bookings |
| GET | `/admin/users` | Manage customer records |

Protected endpoints require the appropriate authentication and authorization.

> This is a high-level API overview based on the documented application workflows. Verify route paths, HTTP methods, and request/response formats against the actual server routes before using this as a formal API specification.

---

## 🔒 Security and Reliability

ShowPulse incorporates several backend security and reliability concepts.

| Area | Approach |
|---|---|
| Authentication | JWT |
| Password storage | bcryptjs |
| Request validation | Zod |
| Authorization | Role-based access control |
| Data persistence | PostgreSQL |
| Database access | Prisma ORM |
| Booking consistency | Database transactions and seat-state validation |
| Payment behavior | Simulated payment processing |
| Automated verification | API integration tests |

### Important reliability considerations

- Validate all booking requests on the server.
- Reject conflicting reservations.
- Expire temporary holds correctly.
- Use database constraints and suitable transaction isolation.
- Ensure payment simulation results cannot be manipulated through untrusted client requests.
- Restrict administrative routes to authorized users.
- Avoid exposing secrets or sensitive data in API responses.

Payment processing is simulated; the application should not be used to process real financial transactions without a properly integrated payment provider and appropriate security controls.

---

## 🧪 Testing

The project documents backend tests using Vitest and Supertest.

Run the server test suite with:

```bash
npm run test:server
```

Alternatively, run the server workspace's own test command:

```bash
cd server
npm test
```

The documented test areas include:

- Registration and authentication.
- Password hashing and JWT issuance.
- Movie discovery and filtering.
- Coupon validation.
- Seat availability and temporary holds.
- Booking conflicts.
- Customer booking history.

For a stronger production-ready test suite, consider adding:

- Concurrent seat-booking tests.
- Expired reservation tests.
- Payment failure and recovery tests.
- Cancellation and seat-release tests.
- Unauthorized admin access tests.
- Mobile API integration tests.
- End-to-end web and mobile booking tests.

---

## 🌍 Deployment

The repository documents a Render deployment configuration.

### Deploying the web application

1. Push the project to GitHub.
2. Open [Render](https://render.com/).
3. Create a Blueprint deployment from the repository.
4. Review the `render.yaml` configuration.
5. Configure the PostgreSQL connection and environment variables.
6. Deploy the application.
7. Check the service logs and health endpoint.
8. Test the booking workflow against the deployed environment.

**Web demo:** [CinePulse on Render](https://cinepulse-7ajb.onrender.com)

For a mobile application, use the appropriate React Native build and distribution workflow. A hosted web frontend does not automatically create an Android APK or iOS application.

---

## 📂 Project Structure

The following is a conceptual overview of the documented web/backend workspace. Add the actual mobile directory if React Native has a separate application folder.

```text
ShowPulse/
├── client/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   ├── package.json
│   └── vite.config.ts
│
├── server/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── tests/
│   └── package.json
│
├── .env.example
├── render.yaml
├── package.json
├── package-lock.json
└── README.md
```

### Suggested structure for a separate React Native client

If your mobile app is maintained in the same repository, it can be documented with a structure such as:

```text
mobile/
├── src/
│   ├── components/
│   ├── screens/
│   ├── navigation/
│   ├── services/
│   ├── hooks/
│   └── types/
├── assets/
├── App.tsx
├── package.json
└── app.json
```

This mobile structure is a suggestion, not a claim that these files already exist.

---

## 🔮 Future Roadmap

Potential improvements for ShowPulse include:

- [ ] Complete and expand the React Native Android and iOS experiences.
- [ ] Share API types and validation contracts across web and mobile clients.
- [ ] Add push notifications for booking confirmations and reminders.
- [ ] Integrate a real payment provider securely.
- [ ] Add email and SMS ticket confirmations.
- [ ] Expand automated tests for reservation concurrency.
- [ ] Introduce continuous integration for builds and tests.
- [ ] Improve accessibility and mobile performance.
- [ ] Add advanced theatre analytics and operational reports.
- [ ] Improve monitoring, structured logging, and error reporting.

These items represent potential development directions rather than confirmed existing functionality.

---

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome.

1. Fork the repository.
2. Create a feature branch.

   ```bash
   git checkout -b feat/your-feature
   ```

3. Implement your changes and add appropriate tests.
4. Run the available test suite and production build.
5. Commit your changes.

   ```bash
   git commit -m "feat: describe your change"
   ```

6. Push your branch and open a pull request.

Please do not commit credentials, environment files, or sensitive customer information.

---

## 📄 License

Refer to the repository's `LICENSE` file for the applicable license and terms of use.

---

## 👨‍💻 Connect

**Prasenjit Sahoo**

- GitHub: [@Prasenjit-Sahoo18](https://github.com/Prasenjit-Sahoo18)
- LinkedIn: [Prasenjit Sahoo](https://www.linkedin.com/in/prasenjit-sahoo18)

If you find ShowPulse interesting, consider starring the repository ⭐ and sharing feedback or suggestions.

---

<p align="center">
  <strong>ShowPulse — From the first search to the final scene. 🎬</strong>
</p>
