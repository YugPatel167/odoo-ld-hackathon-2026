# 🌍 GlobeTrotter - Backend (Node.js + Express + Sequelize + MySQL 8.0)

A normalized relational database layer, ORM models, migration scripts, authentication, and API routes for **GlobeTrotter** — a collaborative multi-city travel planning platform built for the Odoo Hackathon 2026.

---

## 🛠️ Stack & Architecture

- **Backend**: Node.js + Express
- **Database**: MySQL 8.0 (InnoDB Engine with `utf8mb4` encoding)
- **ORM**: Sequelize 6
- **Migration & Seeding Tool**: Sequelize CLI
- **Authentication**: JWT (`jsonwebtoken`) + Password Hashing (`bcryptjs`)
- **Containerization**: Docker Compose (`globetrotter_dev` on port `3306`)

---

## 📊 Relational Database Schema (InnoDB)

```
+-----------------------------------------------------------------------------------+
|                                      USERS                                        |
|  id (INT PK AUTO_INC) | name | email (UQ) | password_hash | profile_photo_url     |
+-----------------------------------------------------------------------------------+
                                         |
                                  1 : N  | (ON DELETE CASCADE)
                                         v
+-----------------------------------------------------------------------------------+
|                                      TRIPS                                        |
|  id (INT PK AUTO_INC) | user_id (FK) | name | start_date | end_date | share_token |
+-----------------------------------------------------------------------------------+
                                         |
                                  1 : N  | (ON DELETE CASCADE)
                                         v
+-----------------------------------------------------------------------------------+
|                                      STOPS                                        |
|  id (INT PK AUTO_INC) | trip_id (FK) | city_id (FK -> cities)                     |
|  start_date | end_date | order_index                                              |
+-----------------------------------------------------------------------------------+
         |                                                   ^
  1 : N  | (ON DELETE CASCADE)                               | N : 1 (ON DELETE RESTRICT)
         v                                                   |
+------------------------------------+  +-------------------------------------------+
|             ACTIVITIES             |  |                   CITIES                  |
| id (INT PK AUTO_INC)               |  | id (INT PK AUTO_INC) | name | country     |
| stop_id (FK -> stops)              |  | cost_index (FLOAT) | popularity_score     |
| activity_catalog_id (FK, SET NULL)-+->| image_url                                 |
| custom_name | cost                 |  +-------------------------------------------+
| duration_minutes | scheduled_time  |                       |
+------------------------------------+                1 : N  | (ON DELETE CASCADE)
                                                             v
                                        +-------------------------------------------+
                                        |              ACTIVITY_CATALOG             |
                                        | id (INT PK AUTO_INC) | city_id (FK)       |
                                        | name | category (ENUM) | estimated_cost   |
                                        +-------------------------------------------+
```

---

## 🚀 Quick Start Guide

### 1. Start MySQL 8.0 (Docker Compose)
Inside the `backend/` folder:
```bash
docker compose up -d
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Migrations & Seeders
```bash
# Run migrations (users -> cities -> trips -> stops -> activity_catalog -> activities)
npm run db:migrate

# Seed database (8 cities, 15 activities, Demo User, 1 trip with 2 stops and 4 activities)
npm run db:seed
```

### 4. Start the Express Server
```bash
npm run dev
```
Server runs on: `http://localhost:4000`

---

## 🔌 API Endpoints Summary

### Authentication
- `POST /api/auth/signup` - Register a new user (`name`, `email`, `password`)
- `POST /api/auth/login` - Login (`email`, `password`) -> Returns JWT token

### Trips (Requires `Authorization: Bearer <token>`)
- `GET /api/trips` - List all trips for current authenticated user
- `POST /api/trips` - Create a trip (`name`, `start_date`, `end_date`, `description`, `is_public`)
- `GET /api/trips/:id` - Get full trip details with nested stops, cities, and scheduled activities

### Public & Helper Endpoints
- `GET /api/trips/public/:share_token` - View read-only shared trip by token (no auth required)
- `GET /api/trips/:id/budget` - Real-time dynamically calculated trip budget breakdown
- `GET /api/cities` - Master searchable cities catalog
- `GET /api/catalog?city_id=1&category=food` - Search activities by city/category
- `GET /api/health` - Check API and MySQL database connection status

---

## 📦 Seeded Demo User Credentials
- **Email**: `demo@globetrotter.app`
- **Password**: `Password123!`
- **Public Share Token**: `globetrotter-euro-2026-demo`
