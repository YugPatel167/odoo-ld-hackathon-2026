'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('cities', [
      {
        id: 1,
        name: 'Paris',
        country: 'France',
        cost_index: 2.2,
        popularity_score: 98,
        image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop&q=80',
        created_at: now,
        updated_at: now
      },
      {
        id: 2,
        name: 'Tokyo',
        country: 'Japan',
        cost_index: 1.9,
        popularity_score: 96,
        image_url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80',
        created_at: now,
        updated_at: now
      },
      {
        id: 3,
        name: 'New York',
        country: 'United States',
        cost_index: 2.8,
        popularity_score: 95,
        image_url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&auto=format&fit=crop&q=80',
        created_at: now,
        updated_at: now
      },
      {
        id: 4,
        name: 'Cape Town',
        country: 'South Africa',
        cost_index: 1.1,
        popularity_score: 87,
        image_url: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&auto=format&fit=crop&q=80',
        created_at: now,
        updated_at: now
      },
      {
        id: 5,
        name: 'Sydney',
        country: 'Australia',
        cost_index: 2.1,
        popularity_score: 90,
        image_url: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&auto=format&fit=crop&q=80',
        created_at: now,
        updated_at: now
      },
      {
        id: 6,
        name: 'Rio de Janeiro',
        country: 'Brazil',
        cost_index: 1.2,
        popularity_score: 88,
        image_url: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&auto=format&fit=crop&q=80',
        created_at: now,
        updated_at: now
      },
      {
        id: 7,
        name: 'Bangkok',
        country: 'Thailand',
        cost_index: 0.9,
        popularity_score: 92,
        image_url: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&auto=format&fit=crop&q=80',
        created_at: now,
        updated_at: now
      },
      {
        id: 8,
        name: 'Rome',
        country: 'Italy',
        cost_index: 1.7,
        popularity_score: 94,
        image_url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop&q=80',
        created_at: now,
        updated_at: now
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('cities', null, {});
  }
};
