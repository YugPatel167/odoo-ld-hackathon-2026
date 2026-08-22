'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models');
const authRoutes = require('./routes/auth');
const tripRoutes = require('./routes/trips');
const citiesRoutes = require('./routes/cities');
const activitiesRoutes = require('./routes/activities');
const TripService = require('./services/tripService');

const app = express();

// Enable CORS for all origins during development
app.use(cors());

// Body Parser Middleware
app.use(express.json());

const PORT = process.env.PORT || 4000;

// Health Check Endpoint
app.get('/api/health', async (req, res) => {
  try {
    await db.sequelize.authenticate();
    res.json({ status: 'ok', database: 'connected', timestamp: new Date() });
  } catch (error) {
    console.error('Healthcheck DB connection error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// -----------------------------------------------------------------------------
// MOUNTED RESOURCE ROUTES
// -----------------------------------------------------------------------------

// Auth Routes (/api/auth/signup, /api/auth/login)
app.use('/api/auth', authRoutes);

// Protected Trip Routes (/api/trips, /api/trips/:id, /api/trips/:id/stops)
app.use('/api/trips', tripRoutes);

// Public Cities Routes (/api/cities?country=X&search=X)
app.use('/api/cities', citiesRoutes);

// Public Activities Catalog Routes (/api/activities?city_id=X&category=X)
app.use('/api/activities', activitiesRoutes);

// -----------------------------------------------------------------------------
// PUBLIC MASTER & HELPER ROUTES
// -----------------------------------------------------------------------------

// Search Activity Catalog (Legacy alias)
app.get('/api/catalog', async (req, res) => {
  try {
    const { city_id, category, query } = req.query;
    const items = await TripService.searchCatalog({ city_id, category, query });
    res.json(items);
  } catch (error) {
    console.error('Error searching catalog:', error);
    res.status(500).json({ error: 'Internal server error while searching catalog' });
  }
});

// Public Read-Only Trip by Share Token (No Auth Required)
app.get('/api/trips/public/:share_token', async (req, res) => {
  try {
    const trip = await TripService.getPublicTripByToken(req.params.share_token);
    if (!trip) return res.status(404).json({ error: 'Public trip not found or link is private' });
    res.json(trip);
  } catch (error) {
    console.error('Error fetching public trip:', error);
    res.status(500).json({ error: 'Internal server error while fetching public trip' });
  }
});

// Dynamic Trip Budget Breakdown (Calculated in real-time)
app.get('/api/trips/:id/budget', async (req, res) => {
  try {
    const budget = await TripService.getTripBudgetBreakdown(req.params.id);
    res.json(budget);
  } catch (error) {
    console.error('Error computing trip budget:', error);
    res.status(500).json({ error: error.message || 'Internal server error while computing budget' });
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled application error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 GlobeTrotter Backend listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
