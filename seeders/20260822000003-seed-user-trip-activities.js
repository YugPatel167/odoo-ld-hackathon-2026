'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // 1. Seed Demo User
    await queryInterface.bulkInsert('users', [
      {
        id: 1,
        name: 'Demo User',
        email: 'demo@globetrotter.app',
        password_hash: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQmG6W65sfr.7qWvP/0I6', // 'Password123!'
        profile_photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        created_at: now,
        updated_at: now
      }
    ], {});

    // 2. Seed Demo Trip
    await queryInterface.bulkInsert('trips', [
      {
        id: 1,
        user_id: 1,
        name: 'Grand European Summer Escape',
        start_date: '2026-07-10',
        end_date: '2026-07-20',
        description: 'A 10-day scenic and culinary exploration across romantic Paris and historic Rome.',
        cover_photo_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&auto=format&fit=crop&q=80',
        is_public: true,
        share_token: 'globetrotter-euro-2026-demo',
        created_at: now,
        updated_at: now
      }
    ], {});

    // 3. Seed 2 Stops (Paris & Rome)
    await queryInterface.bulkInsert('stops', [
      {
        id: 1,
        trip_id: 1,
        city_id: 1, // Paris
        start_date: '2026-07-10',
        end_date: '2026-07-15',
        order_index: 0,
        created_at: now,
        updated_at: now
      },
      {
        id: 2,
        trip_id: 1,
        city_id: 8, // Rome
        start_date: '2026-07-15',
        end_date: '2026-07-20',
        order_index: 1,
        created_at: now,
        updated_at: now
      }
    ], {});

    // 4. Seed 4 Activities (2 in Paris, 2 in Rome)
    await queryInterface.bulkInsert('activities', [
      {
        id: 1,
        stop_id: 1,
        activity_catalog_id: 1,
        custom_name: null,
        cost: 75.0,
        duration_minutes: 180,
        scheduled_time: new Date('2026-07-11T10:00:00Z'),
        notes: 'Priority entrance reserved for morning slot. Meeting guide by the Pyramid.',
        created_at: now,
        updated_at: now
      },
      {
        id: 2,
        stop_id: 1,
        activity_catalog_id: 2,
        custom_name: null,
        cost: 55.0,
        duration_minutes: 120,
        scheduled_time: new Date('2026-07-12T09:30:00Z'),
        notes: 'Wear comfortable walking shoes for cobblestone hills.',
        created_at: now,
        updated_at: now
      },
      {
        id: 3,
        stop_id: 2,
        activity_catalog_id: 14,
        custom_name: null,
        cost: 65.0,
        duration_minutes: 180,
        scheduled_time: new Date('2026-07-16T14:00:00Z'),
        notes: 'Passport ID required for Colosseum security checkpoint.',
        created_at: now,
        updated_at: now
      },
      {
        id: 4,
        stop_id: 2,
        activity_catalog_id: 15,
        custom_name: null,
        cost: 80.0,
        duration_minutes: 150,
        scheduled_time: new Date('2026-07-17T18:00:00Z'),
        notes: 'Dinner included with homemade wine tasting!',
        created_at: now,
        updated_at: now
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('activities', null, {});
    await queryInterface.bulkDelete('stops', null, {});
    await queryInterface.bulkDelete('trips', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};
