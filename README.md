# Aurora Table - Restaurant Reservation System

A complete production-style restaurant reservation system with a React/Vite frontend,
Express TypeScript API, JWT admin authentication, SQL Server 2022, and the `mssql` package.

## Stack

- React, TypeScript, Vite, React Router
- Tailwind CSS, Framer Motion, React Icons, React Hot Toast
- Axios, React Hook Form, Zod, react-qr-code
- Node.js, Express, TypeScript
- JWT authentication, bcrypt password hashing
- SQL Server 2022 with parameterized `mssql` queries

## Features

- Modern responsive restaurant website with home, menu, reservation, about, and contact pages
- Searchable/filterable menu with category filters and price sorting
- Mobile-first QR menu page
- QR code generation and SVG download for menu, reservations, and QR menu
- Visual 20-table restaurant floor layout
- Reservation form with validation, table capacity checks, and double-booking prevention
- Admin login with seeded credentials
- Admin dashboard with statistics, reservation management, table status controls, and menu CRUD

## Requirements

- Node.js 20+
- SQL Server 2022 database
- npm

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create an environment file:

   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your SQL Server connection settings and JWT secret:

   ```env
   JWT_SECRET="replace-with-a-long-random-secret"
   PORT=4000
   CLIENT_URL="http://localhost:5173"
   SQL_SERVER="localhost"
   SQL_PORT=1433
   SQL_DATABASE="restaurant_reservations"
   SQL_USER="sa"
   SQL_PASSWORD="YourStrong!Passw0rd"
   SQL_ENCRYPT=false
   SQL_TRUST_SERVER_CERTIFICATE=true
   ```

4. Create the SQL Server database, then initialize the schema:

   ```bash
   npm run db:init
   ```

5. Seed the database:

   ```bash
   npm run seed
   ```

6. Start the frontend and backend together:

   ```bash
   npm run dev
   ```

The frontend runs on `http://localhost:5173` and the API runs on `http://localhost:4000`.

## Admin Account

- Email: `admin@restaurant.com`
- Password: `Admin123!`

## Scripts

- `npm run dev` - start Express API and Vite frontend concurrently
- `npm run dev:client` - start Vite only
- `npm run dev:server` - start Express API only
- `npm run build` - type-check and build frontend/server
- `npm run db:init` - create SQL Server tables, constraints, and indexes
- `npm run seed` - seed admin, tables, menu items, and testimonials

## API Endpoints

### Auth

- `POST /api/auth/login`

### Menu

- `GET /api/menu`
- `GET /api/menu/:id`
- `POST /api/menu` - admin JWT required
- `PUT /api/menu/:id` - admin JWT required
- `DELETE /api/menu/:id` - admin JWT required

### Tables

- `GET /api/tables`
- `PUT /api/tables/:id` - admin JWT required

### Reservations

- `POST /api/reservations`
- `GET /api/reservations` - admin JWT required
- `GET /api/reservations/:id` - admin JWT required
- `PUT /api/reservations/:id` - admin JWT required
- `DELETE /api/reservations/:id` - admin JWT required
- `GET /api/reservations/stats/dashboard` - admin JWT required

### Testimonials

- `GET /api/testimonials`

## Project Structure

```text
src/
  api/
  assets/
  components/
  data/
  hooks/
  layouts/
  pages/
  routes/
  services/
  types/
  utils/

server/
  controllers/
  db/
  middleware/
  routes/
  services/
  types/
  utils/
```

## Notes

- Public reservation creation validates required name, email, phone, date, time, guests, and table selection.
- SQL Server enforces a unique reservation per table/date/time to prevent double booking.
- Admin-only API endpoints require an `Authorization: Bearer <token>` header.
