'use strict';

const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const db = require('../models');
const { City } = db;

/**
 * GET /api/cities
 * Public route - Get all cities with optional ?country=X and ?search=X filters
 */
router.get('/', async (req, res) => {
  try {
    const { country, search } = req.query;
    const where = {};

    if (country && typeof country === 'string' && country.trim().length > 0) {
      where.country = country.trim();
    }

    if (search && typeof search === 'string' && search.trim().length > 0) {
      where.name = { [Op.like]: `%${search.trim()}%` };
    }

    const cities = await City.findAll({
      where,
      order: [['popularity_score', 'DESC']]
    });

    return res.status(200).json(cities);
  } catch (err) {
    console.error('Error fetching cities:', err);
    return res.status(500).json({ error: 'Internal server error while fetching cities' });
  }
});

module.exports = router;
