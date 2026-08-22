# 🌍 GlobeTrotter - Travel Planning Platform

A multi-city travel planning web application built for the Odoo Hackathon 2026.

---

## 🏗️ Project Architecture

```
odoo-ld-hackathon-2026/
├── backend/              # Node.js + Express + Sequelize + MySQL 8.0 API Layer
│   ├── config/           # Database configuration
│   ├── middleware/       # JWT Authentication middleware
│   ├── migrations/       # Sequelize relational migrations
│   ├── models/           # Sequelize ORM models (User, Trip, City, Stop, Activity)
│   ├── routes/           # Express API route handlers (/auth, /trips, /cities, /activities)
│   ├── seeders/          # Database seeders (cities, activities, demo user & trip)
│   ├── services/         # Trip and dynamic budget calculation business logic
│   ├── docker-compose.yml# Containerized MySQL 8.0 instance
│   └── app.js            # Express app entrypoint (Port 4000)
│
└── FrontEnd/             # Client-side Web Application (HTML / CSS / Vanilla JS)
    ├── css/              # Global styles, themes, and page-specific stylesheets
    ├── js/               # API helper (JWT auth), navigation, interactive widgets
    └── *.html            # Application pages (Home, Dashboard, Itinerary, Search, etc.)
```

---

## 🚀 Getting Started

### 1. Run Backend & Database
```bash
cd backend
docker compose up -d
npm install
npm run db:migrate
npm run db:seed
npm run dev
```
Backend API will be running at `http://localhost:4000`.

### 2. Run Frontend
Open `FrontEnd/home.html` or `FrontEnd/login.html` in your browser (or use Live Server / any static file server).

### 🔑 Demo Account Credentials
- **Email**: `demo@globetrotter.app`
- **Password**: `Password123!`
