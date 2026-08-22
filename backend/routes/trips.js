'use strict';

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../models');
const { Trip, Stop, City, Activity, ActivityCatalog, sequelize } = db;
const authMiddleware = require('../middleware/auth');

// Protect all /api/trips routes
router.use(authMiddleware);

/**
 * GET /api/trips
 * Return all trips belonging to the authenticated user with stop counts
 */
router.get('/', async (req, res) => {
  try {
    const trips = await Trip.findAll({
      where: { user_id: req.user.id },
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM stops AS s
              WHERE s.trip_id = Trip.id
            )`),
            'stop_count'
          ]
        ]
      },
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json(trips);
  } catch (err) {
    console.error('Error fetching user trips:', err);
    return res.status(500).json({ error: 'Internal server error while fetching trips' });
  }
});

/**
 * POST /api/trips
 * Create a new trip for the authenticated user
 */
router.post('/', async (req, res) => {
  try {
    const { name, start_date, end_date, description, cover_photo_url, is_public } = req.body;

    // 1. Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Trip name is required' });
    }

    if (!start_date || !end_date) {
      return res.status(400).json({ error: 'start_date and end_date are required' });
    }

    const startDateObj = new Date(start_date);
    const endDateObj = new Date(end_date);

    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      return res.status(400).json({ error: 'Invalid date format for start_date or end_date (YYYY-MM-DD)' });
    }

    if (start_date > end_date) {
      return res.status(400).json({ error: 'end_date must be greater than or equal to start_date' });
    }

    // 2. Generate unique share_token if public
    const shareToken = is_public ? `gt_${crypto.randomBytes(6).toString('hex')}` : null;

    // 3. Create trip
    const newTrip = await Trip.create({
      user_id: req.user.id,
      name: name.trim(),
      start_date,
      end_date,
      description: description || null,
      cover_photo_url: cover_photo_url || null,
      is_public: Boolean(is_public),
      share_token: shareToken
    });

    return res.status(201).json(newTrip);
  } catch (err) {
    console.error('Error creating trip:', err);
    return res.status(500).json({ error: 'Internal server error while creating trip' });
  }
});

/**
 * GET /api/trips/:id
 * Fetch detailed nested trip for the authenticated user
 */
router.get('/:id', async (req, res) => {
  try {
    const tripId = parseInt(req.params.id, 10);
    if (isNaN(tripId)) {
      return res.status(400).json({ error: 'Invalid trip ID parameter' });
    }

    // Fetch trip scoped strictly to authenticated user
    const trip = await Trip.findOne({
      where: {
        id: tripId,
        user_id: req.user.id
      },
      include: [
        {
          model: Stop,
          as: 'stops',
          attributes: ['id', 'start_date', 'end_date', 'order_index'],
          include: [
            {
              model: City,
              as: 'city',
              attributes: ['id', 'name', 'country', 'cost_index', 'image_url']
            },
            {
              model: Activity,
              as: 'activities',
              attributes: ['id', 'custom_name', 'cost', 'duration_minutes', 'scheduled_time', 'notes'],
              include: [
                {
                  model: ActivityCatalog,
                  as: 'catalogItem',
                  attributes: ['id', 'name', 'category', 'estimated_cost', 'duration_minutes', 'image_url']
                }
              ]
            }
          ]
        }
      ],
      order: [
        [{ model: Stop, as: 'stops' }, 'order_index', 'ASC'],
        [{ model: Stop, as: 'stops' }, { model: Activity, as: 'activities' }, 'scheduled_time', 'ASC']
      ]
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    return res.status(200).json(trip);
  } catch (err) {
    console.error('Error fetching trip details:', err);
    return res.status(500).json({ error: 'Internal server error while fetching trip details' });
  }
});

module.exports = router;
