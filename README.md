# 🌍 GlobeTrotter - Backend Database Layer (MySQL 8.0 + Sequelize)

A normalized relational database layer, ORM models, migration scripts, and seed data for **GlobeTrotter** — a collaborative multi-city travel planning app built for the Odoo Hackathon 2026.

---

## 🛠️ Stack & Architecture

- **Backend**: Node.js + Express
- **Database**: MySQL 8.0 (InnoDB Engine with utf8mb4 encoding)
- **ORM**: Sequelize 6
- **Migration & Seeding Tool**: Sequelize CLI
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

### Table Specifications & Constraints:
1. **`users`**: Auto-increment integer ID, unique indexed `email`, password hash, profile photo URL.
2. **`trips`**: `user_id` FK -> `users(id)` (`ON DELETE CASCADE`), unique indexed `share_token`, check constraint `end_date >= start_date`.
3. **`cities`**: Master global destination catalog with check constraints `cost_index >= 0` and `popularity_score BETWEEN 0 AND 100`.
4. **`stops`**: Trip legs with `trip_id` FK (`ON DELETE CASCADE`), `city_id` FK (`ON DELETE RESTRICT`), order index, check constraint `end_date >= start_date`.
5. **`activity_catalog`**: Master browsable activities per city with native MySQL `ENUM('sightseeing', 'food', 'adventure', 'culture', 'other')`, check constraints `estimated_cost >= 0`, `duration_minutes > 0`.
6. **`activities`**: Scheduled activities per stop with `stop_id` FK (`ON DELETE CASCADE`), `activity_catalog_id` FK (`ON DELETE SET NULL`), custom name support, cost, duration, scheduled time, check constraints `cost >= 0`, `duration_minutes > 0`.
7. **Dynamic Trip Budget (`TripService.getTripBudgetBreakdown`)**:
   - Instead of maintaining a stored table that risks going stale on activity edits, budget totals and breakdowns are computed on-demand via `TripService.getTripBudgetBreakdown(tripId)`.

---

## 🚀 Step-by-Step Local Setup Guide

### 1. Start MySQL 8.0 via Docker Compose

In the root directory, start the container:

```bash
docker compose up -d
```

This starts a MySQL 8.0 container on port `3306` with database `globetrotter_dev`, user `globetrotter_user`, password `globetrotter_pass`, and a persistent Docker volume `mysql_data`.

*(Check container health with `docker compose ps`)*

---

### 2. Install Project Dependencies

```bash
npm install
```

---

### 3. Run Sequelize Migrations

Run migrations in strict dependency order (`users` → `cities` → `trips` → `stops` → `activity_catalog` → `activities`):

```bash
npx sequelize-cli db:migrate
```
*(Or via npm script: `npm run db:migrate`)*

---

### 4. Run Sequelize Seeders

Seed the database with 8 master cities, 15 activity catalog items, 1 demo user, and 1 complete trip with 2 stops and 4 activities:

```bash
npx sequelize-cli db:seed:all
```
*(Or via npm script: `npm run db:seed`)*

---

### 5. Start the Server & Verify Setup

Start the Express development server:

```bash
npm run dev
```
Server starts on `http://localhost:4000`.

#### Test Verification Endpoints:
- **Database Connection**: `GET http://localhost:4000/api/health`
- **Master Cities**: `GET http://localhost:4000/api/cities`
- **Browse Activity Catalog**: `GET http://localhost:4000/api/catalog?city_id=1`
- **Full Trip Details**: `GET http://localhost:4000/api/trips/1`
- **Dynamic Budget Breakdown**: `GET http://localhost:4000/api/trips/1/budget`
- **Public Read-Only Trip**: `GET http://localhost:4000/api/trips/public/globetrotter-euro-2026-demo`

---

## 📦 Seeded Sample Data Details

| Entity | Count / Data |
| :--- | :--- |
| **Master Cities (8)** | **Paris** 🇫🇷, **Tokyo** 🇯🇵, **New York** 🇺🇸, **Cape Town** 🇿🇦, **Sydney** 🇦🇺, **Rio de Janeiro** 🇧🇷, **Bangkok** 🇹🇭, **Rome** 🇮🇹 |
| **Activity Catalog (15)** | Louvre Guided Tour, Montmartre Bakery Crawl, teamLab Planets, Tsukiji Food Safari, Shinjuku Go-Kart Drift, Central Park Bike Ride, Broadway Lion King, Table Mountain Trek, Boulders Beach Penguins, Sydney BridgeClimb, Bondi Clifftop Walk, Christ the Redeemer, Bangkok Grand Palace, Colosseum Underground, Trastevere Pasta Class |
| **Demo User** | **Name**: `Demo User` \| **Email**: `demo@globetrotter.app` \| **Password**: `Password123!` |
| **Demo Trip** | **"Grand European Summer Escape"** (10 days, July 10-20, 2026, Public link token: `globetrotter-euro-2026-demo`) |
| **Trip Stops (2)** | **Stop 1**: Paris (July 10-15) <br> **Stop 2**: Rome (July 15-20) |
| **Scheduled Activities (4)** | Louvre Tour ($75), Pastry Walk ($55), Colosseum Underground ($65), Pasta Workshop ($80) |
| **Dynamic Budget Breakdown** | **Activities**: $275 (Culture: $140, Food: $135) \| **Estimated Stay**: $1,600 \| **Estimated Meals**: $800 \| **Estimated Transport**: $300 \| **Total**: $2,975 |

---

## 📂 Project Directory Layout

```
├── .env                              # Active environment variables
├── .env.example                      # Template environment variables
├── .sequelizerc                      # Sequelize CLI path definitions
├── docker-compose.yml                # MySQL 8.0 container definition
├── package.json                      # Node dependencies and npm scripts
├── README.md                         # Documentation and setup instructions
├── config/
│   └── config.js                     # Sequelize database connection config
├── models/                           # Sequelize Models
│   ├── index.js                      # Central DB initializer & associations
│   ├── User.js                       # User model
│   ├── City.js                       # Master City reference model
│   ├── Trip.js                       # Trip model
│   ├── Stop.js                       # Stop (trip leg) model
│   ├── ActivityCatalog.js            # Master Activity catalog model
│   └── Activity.js                   # Scheduled Activity model
├── migrations/                       # Sequelize CLI Migrations
│   ├── 20260822000001-create-users.js
│   ├── 20260822000002-create-cities.js
│   ├── 20260822000003-create-trips.js
│   ├── 20260822000004-create-stops.js
│   ├── 20260822000005-create-activity-catalog.js
│   └── 20260822000006-create-activities.js
├── seeders/                          # Sequelize CLI Seeders
│   ├── 20260822000001-seed-cities.js
│   ├── 20260822000002-seed-activity-catalog.js
│   └── 20260822000003-seed-user-trip-activities.js
├── services/
│   └── tripService.js                # Trip logic & Dynamic Budget calculator
└── app.js                            # Express app entrypoint & API endpoints
```
