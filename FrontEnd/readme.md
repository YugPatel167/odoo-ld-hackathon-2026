# 🌐 GlobeTrotter - Frontend Client

A responsive, multi-page frontend interface for the **GlobeTrotter** travel planner web application.

---

## ⚙️ Backend Integration

- **Target API Base**: `http://localhost:4000/api` (Node.js + Express + Sequelize + MySQL)
- **Authentication**: JWT Bearer token stored in `localStorage` under `token`, attached to every protected request via `Authorization: Bearer <token>`.
- **API Client Helper**: [`js/api.js`](file:///FrontEnd/js/api.js) centralizes all API interactions.

---

## 📑 Pages Breakdown & Support Status

### ✅ Fully Supported Pages (Ready with Working Backend)

| Page | Description | Backend Routes Used |
| :--- | :--- | :--- |
| [`login.html`](file:///FrontEnd/login.html) | User Authentication (Sign up & Log in) | `POST /api/auth/signup`, `POST /api/auth/login` |
| [`home.html`](file:///FrontEnd/home.html) | Public Landing Page & Featured Highlights | `GET /api/cities`, `GET /api/activities` |
| [`dashboard.html`](file:///FrontEnd/dashboard.html) | User Dashboard with overview & upcoming trips | `GET /api/trips`, local storage user profile |
| [`my-trips.html`](file:///FrontEnd/my-trips.html) | Lists all user-created trips with stop counts | `GET /api/trips` |
| [`create-trip.html`](file:///FrontEnd/create-trip.html) | Multi-city trip creation modal & form | `POST /api/trips` |
| [`itinerary-builder.html`](file:///FrontEnd/itinerary-builder.html) | Add stops and activities to an existing trip | `GET /api/trips/:id`, `POST /api/trips/:id/stops`, `GET /api/cities`, `GET /api/activities` |
| [`itinerary-view.html`](file:///FrontEnd/itinerary-view.html) | Full detailed view of scheduled stops & activities | `GET /api/trips/:id` |
| [`shared-itinerary.html`](file:///FrontEnd/shared-itinerary.html) | Public read-only trip viewer for shared links | `GET /api/trips/public/:share_token` |
| [`trip-budget.html`](file:///FrontEnd/trip-budget.html) | Real-time budget breakdown (stays, transport, activities) | `GET /api/trips/:id/budget` |
| [`trip-calendar.html`](file:///FrontEnd/trip-calendar.html) | Calendar visualization of scheduled trip legs | `GET /api/trips/:id` |
| [`city-search.html`](file:///FrontEnd/city-search.html) | Master city catalog browser with search & filter | `GET /api/cities?country=X&search=X` |
| [`activity-search.html`](file:///FrontEnd/activity-search.html) | Master activity browser with city/category filter | `GET /api/activities?city_id=X&category=X` |
| [`about.html`](file:///FrontEnd/about.html) | Static about and information page | None (Static) |

---

### ⚠️ Pages Referencing Future / Missing Backend Features

| Page | Description | Missing Backend Route / Feature |
| :--- | :--- | :--- |
| [`contact.html`](file:///FrontEnd/contact.html) | Support and contact submission form | `POST /api/contact` (currently mocked in `api.js`) |
| [`profile.html`](file:///FrontEnd/profile.html) | User profile and settings management | `PUT /api/users/profile`, `PUT /api/users/password` |
| [`ticket-booking.html`](file:///FrontEnd/ticket-booking.html) | Flight/Train booking simulation | `POST /api/tickets/book`, `GET /api/tickets` |
| [`admin-dashboard.html`](file:///FrontEnd/admin-dashboard.html) | Platform metrics, user administration | `GET /api/admin/metrics`, `GET /api/admin/users` |

---

## 📁 Directory Structure

```
FrontEnd/
├── css/
│   ├── styles.css        # Main stylesheet & component design tokens
│   ├── home.css          # Landing page styles
│   └── dashboard.css     # Dashboard layout & card styling
├── js/
│   ├── api.js            # Centralized API fetch wrapper with JWT auth
│   ├── nav.js            # Responsive navigation & mobile menu handling
│   ├── dashboard.js      # Dashboard charts and metrics interactions
│   ├── chatbot.js        # Travel assistant chatbot component
│   └── cursor.js         # Interactive cursor enhancements
├── *.html                # Frontend views
└── readme.md             # Frontend documentation
```
