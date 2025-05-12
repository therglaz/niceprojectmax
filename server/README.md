# AutomateEasy Backend API

Backend services for the AutomateEasy SaaS platform.

## Overview

AutomateEasy is a SaaS platform designed to simplify business and day-to-day task automation for users with low to moderate technical proficiency. It leverages the power of Make.com (formerly Integromat) on the backend but presents a highly intuitive, step-by-step, template-driven interface.

This repository contains the server-side API code that powers the AutomateEasy platform.

## Technologies

- Node.js & Express.js - API framework
- PostgreSQL - Database
- Knex.js - SQL query builder & migration tool
- Objection.js - ORM
- JWT - Authentication
- Winston - Logging
- Jest - Testing

## Getting Started

### Prerequisites

- Node.js >= 14.x
- npm >= 7.x
- PostgreSQL >= 13.x

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration values

5. Create the database:

```bash
createdb automateeasy
```

6. Run migrations:

```bash
npm run migrate
```

7. Start the development server:

```bash
npm run dev
```

The server will start on the port specified in your `.env` file (default: 3000).

### Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with hot reloading
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run migrate` - Run database migrations
- `npm run migrate:rollback` - Rollback the last batch of migrations
- `npm run seed` - Run seed files

## API Documentation

### Authentication Endpoints

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login and get JWT token
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password with token
- `GET /api/v1/auth/verify/:token` - Verify user email
- `GET /api/v1/auth/me` - Get current user profile (protected)

## Project Structure

```
/src
├── config/         # Configuration files
├── controllers/    # Route controllers
├── db/             # Database migrations and seeds
├── middlewares/    # Custom middleware
├── models/         # Database models
├── routes/         # API routes
├── services/       # Business logic services
├── utils/          # Utility functions
├── app.js          # Express app setup
└── server.js       # Server entry point
```

## License

ISC © AutomateEasy Team 