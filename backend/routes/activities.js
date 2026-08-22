'use strict';

const express = require('express');
const router = express.Router();
const db = require('../models');
const { ActivityCatalog, City } = db;

/**
 * GET /api/activities
 * Public route - Get catalog activities with optional ?city_id=X and ?category=X filters
 */
router.get('/', async (req, res) => {
  try {
    const { city_id, category } = req.query;
    const where = {};

    if (city_id) {
      const parsedCityId = parseInt(city_id, 10);
      if (!isNaN(parsedCityId)) {
        where.city_id = parsedCityId;
      }
    }

    if (category && typeof category === 'string' && category.trim().length > 0) {
      where.category = category.trim();
    }

    const activities = await ActivityCatalog.findAll({
      where,
      include: [
        {
          model: City,
          as: 'city',
          attributes: ['id', 'name', 'country']
        }
      ],
      order: [['estimated_cost', 'ASC']]
    });

    return res.status(200).json(activities);
  } catch (err) {
    console.error('Error fetching activities:', err);
    return res.status(500).json({ error: 'Internal server error while fetching activities' });
  }
});

module.exports = router;
