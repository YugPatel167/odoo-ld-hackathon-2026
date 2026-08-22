'use strict';

const crypto = require('crypto');
const db = require('../models');
const { Trip, Stop, City, Activity, ActivityCatalog, User, sequelize } = db;
const { Op } = require('sequelize');

class TripService {
  /**
   * Create a new multi-city trip. If is_public is true, generates a unique share_token.
   */
  static async createTrip(data) {
    const shareToken = data.is_public ? `gt_${crypto.randomBytes(6).toString('hex')}` : null;

    return await Trip.create({
      user_id: data.user_id,
      name: data.name,
      start_date: data.start_date,
      end_date: data.end_date,
      description: data.description,
      cover_photo_url: data.cover_photo_url,
      is_public: data.is_public || false,
      share_token: shareToken
    });
  }

  /**
   * Fetch complete trip itinerary with ordered stops, cities, and scheduled activities.
   */
  static async getTripDetails(tripId) {
    return await Trip.findByPk(tripId, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'profile_photo_url']
        },
        {
          model: Stop,
          as: 'stops',
          include: [
            {
              model: City,
              as: 'city'
            },
            {
              model: Activity,
              as: 'activities',
              include: [
                {
                  model: ActivityCatalog,
                  as: 'catalogItem'
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
  }

  /**
   * Fetch read-only public trip details using the unique share_token.
   */
  static async getPublicTripByToken(shareToken) {
    return await Trip.findOne({
      where: {
        share_token: shareToken,
        is_public: true
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'profile_photo_url']
        },
        {
          model: Stop,
          as: 'stops',
          include: [
            {
              model: City,
              as: 'city',
              attributes: ['name', 'country', 'cost_index', 'image_url']
            },
            {
              model: Activity,
              as: 'activities',
              include: [
                {
                  model: ActivityCatalog,
                  as: 'catalogItem'
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
  }

  /**
   * Add a stop (city visit leg) to an existing trip.
   */
  static async addStop(tripId, cityId, startDate, endDate, orderIndex = null) {
    if (orderIndex === null) {
      const maxStop = await Stop.findOne({
        where: { trip_id: tripId },
        order: [['order_index', 'DESC']],
        attributes: ['order_index']
      });
      orderIndex = maxStop ? maxStop.order_index + 1 : 0;
    }

    return await Stop.create({
      trip_id: tripId,
      city_id: cityId,
      start_date: startDate,
      end_date: endDate,
      order_index: orderIndex
    });
  }

  /**
   * Reorder stops in a trip atomically.
   */
  static async reorderStops(tripId, orderedStopIds) {
    return await sequelize.transaction(async (t) => {
      const updates = orderedStopIds.map((stopId, index) => {
        return Stop.update(
          { order_index: index },
          { where: { id: stopId, trip_id: tripId }, transaction: t }
        );
      });
      return await Promise.all(updates);
    });
  }

  /**
   * Add an activity to a trip stop.
   * If activity_catalog_id is provided, inherits cost and duration if not overridden.
   */
  static async addActivity(data) {
    let cost = data.cost;
    let duration = data.duration_minutes;

    if (data.activity_catalog_id && (cost === undefined || duration === undefined)) {
      const catalogItem = await ActivityCatalog.findByPk(data.activity_catalog_id);
      if (catalogItem) {
        if (cost === undefined) cost = catalogItem.estimated_cost;
        if (duration === undefined) duration = catalogItem.duration_minutes;
      }
    }

    return await Activity.create({
      stop_id: data.stop_id,
      activity_catalog_id: data.activity_catalog_id || null,
      custom_name: data.custom_name || null,
      cost: cost !== undefined ? cost : 0.0,
      duration_minutes: duration || 60,
      scheduled_time: data.scheduled_time || null,
      notes: data.notes || null
    });
  }

  /**
   * Helper / Service method: DYNAMIC TRIP BUDGET BREAKDOWN
   * Computes the budget dynamically by querying activities, stops, and cities.
   * Prevents stale data without storing a redundant table.
   *
   * @param {number} tripId
   * @returns {Promise<Object>} Budget summary with category breakdown
   */
  static async getTripBudgetBreakdown(tripId) {
    const trip = await Trip.findByPk(tripId, {
      include: [
        {
          model: Stop,
          as: 'stops',
          include: [
            {
              model: City,
              as: 'city',
              attributes: ['id', 'name', 'cost_index']
            },
            {
              model: Activity,
              as: 'activities',
              include: [
                {
                  model: ActivityCatalog,
                  as: 'catalogItem',
                  attributes: ['category']
                }
              ]
            }
          ]
        }
      ]
    });

    if (!trip) {
      throw new Error(`Trip with ID ${tripId} not found`);
    }

    // 1. Group activity costs by category (sightseeing, food, adventure, culture, other)
    const categoryTotals = {
      sightseeing: 0.0,
      food: 0.0,
      adventure: 0.0,
      culture: 0.0,
      other: 0.0
    };

    let totalActivitiesCost = 0.0;
    let totalNights = 0;
    let estimatedStayCost = 0.0;
    let estimatedMealsCost = 0.0;

    trip.stops.forEach((stop) => {
      // Calculate nights in this stop
      const start = new Date(stop.start_date);
      const end = new Date(stop.end_date);
      const nights = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
      totalNights += nights;

      // Base daily index multiplier (default baseline: $80/night stay, $40/day meals)
      const costIndex = stop.city ? stop.city.cost_index : 1.0;
      estimatedStayCost += nights * (80.0 * costIndex);
      estimatedMealsCost += nights * (40.0 * costIndex);

      // Sum activities
      stop.activities.forEach((activity) => {
        const cat = activity.catalogItem ? activity.catalogItem.category : 'other';
        const cost = parseFloat(activity.cost) || 0.0;
        categoryTotals[cat] = (categoryTotals[cat] || 0.0) + cost;
        totalActivitiesCost += cost;
      });
    });

    // Standard baseline transport allocation estimation
    const estimatedTransportCost = trip.stops.length > 1 ? (trip.stops.length * 150.0) : 100.0;

    const totalEstimatedTripCost =
      totalActivitiesCost +
      estimatedStayCost +
      estimatedMealsCost +
      estimatedTransportCost;

    return {
      trip_id: trip.id,
      trip_name: trip.name,
      total_days: totalNights,
      total_stops: trip.stops.length,
      breakdown: {
        activities: {
          total: Number(totalActivitiesCost.toFixed(2)),
          by_category: {
            sightseeing: Number(categoryTotals.sightseeing.toFixed(2)),
            food: Number(categoryTotals.food.toFixed(2)),
            adventure: Number(categoryTotals.adventure.toFixed(2)),
            culture: Number(categoryTotals.culture.toFixed(2)),
            other: Number(categoryTotals.other.toFixed(2))
          }
        },
        estimated_stay: Number(estimatedStayCost.toFixed(2)),
        estimated_meals: Number(estimatedMealsCost.toFixed(2)),
        estimated_transport: Number(estimatedTransportCost.toFixed(2))
      },
      total_estimated_budget: Number(totalEstimatedTripCost.toFixed(2))
    };
  }

  /**
   * Search master activity catalog by city or category or search query.
   */
  static async searchCatalog(filters = {}) {
    const where = {};
    if (filters.city_id) where.city_id = filters.city_id;
    if (filters.category) where.category = filters.category;
    if (filters.query) {
      where.name = { [Op.like]: `%${filters.query}%` };
    }

    return await ActivityCatalog.findAll({
      where,
      include: [
        {
          model: City,
          as: 'city',
          attributes: ['id', 'name', 'country', 'cost_index', 'image_url']
        }
      ],
      order: [['estimated_cost', 'ASC']]
    });
  }
}

module.exports = TripService;
