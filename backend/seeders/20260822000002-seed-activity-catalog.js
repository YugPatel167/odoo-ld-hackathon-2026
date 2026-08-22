'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('activity_catalog', [
      // Paris (City ID: 1)
      {
        id: 1,
        city_id: 1,
        name: 'Louvre Museum Masterpieces & Mona Lisa Guided Tour',
        category: 'culture',
        estimated_cost: 75.0,
        duration_minutes: 180,
        description: 'Skip-the-line guided walking tour of world-renowned art treasures and the Mona Lisa.',
        image_url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&auto=format&fit=crop&q=80',
        created_at: now,
        updated_at: now
      },
      {
        id: 2,
        city_id: 1,
        name: 'Montmartre Croissant, Cheese & Wine Walking Tour',
        category: 'food',
        estimated_cost: 55.0,
        duration_minutes: 120,
        description: 'Stroll through bohemian Montmartre sampling artisan baguettes, cheeses, and macarons.',
        image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
        created_at: now,
        updated_at: now
      },
      // Tokyo (City ID: 2)
      {
        id: 3,
        city_id: 2,
        name: 'teamLab Planets Immersive Digital Art',
        category: 'culture',
        estimated_cost: 38.0,
        duration_minutes: 90,
        description: 'Walk through water and an infinite crystal universe in Toyosu.',
        image_url: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&auto=format&fit=crop&q=80',
        created_at: now,
        updated_at: now
      },
      {
        id: 4,
        city_id: 2,
        name: 'Tsukiji Outer Market Seafood & Wagyu Safari',
        category: 'food',
        estimated_cost: 60.0,
        duration_minutes: 120,
        description: 'Taste fresh uni, king crab legs, tamagoyaki, and A5 wagyu skewers with a local foodie.',
        image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
        created_at: now,
        updated_at: now
      },
      {
        id: 5,
        city_id: 2,
        name: 'Tokyo Street Go-Kart & Shibuya Crossing Drift',
        category: 'adventure',
        estimated_cost: 85.0,
        duration_minutes: 120,
        description: 'Drive real street-legal go-karts in costume through Tokyo Tower and Shibuya Crossing.',
        image_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
        created_at: now,
        updated_at: now
      },
      // New York (City ID: 3)
      {
        id: 6,
        city_id: 3,
        name: 'Central Park Sunset Guided Bicycle Ride',
        category: 'adventure',
        estimated_cost: 35.0,
        duration_minutes: 120,
        description: 'Glide past Bethesda Terrace, Bow Bridge, and Strawberry Fields during golden hour.',
        image_url: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&auto=format&fit=crop&q=80',
        created_at: now,
        updated_at: now
      },
      {
        id: 7,
        city_id: 3,
        name: 'Broadway Musical Evening (The Lion King)',
        category: 'culture',
        estimated_cost: 145.0,
        duration_minutes: 150,
        description: 'Experience an unforgettable award-winning Broadway theatrical performance in Manhattan.',
        image_url: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=600&auto=format&fit=crop&q=80',
        created_at: now,
        updated_at: now
      },
      // Cape Town (City ID: 4)
      {
        id: 8,
        city_id: 4,
        name: 'Table Mountain Cable Car & Summit Nature Trek',
        category: 'adventure',
        estimated_cost: 45.0,
        duration_minutes: 180,
        description: 'Ascend the iconic flat-topped mountain for sweeping views of the Atlantic Ocean.',
        image_url: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&auto=format&fit=crop&q=80',
        created_at: now,
        updated_at: now
      },
      {
        id: 9,
        city_id: 4,
        name: 'Boulders Beach African Penguin Sanctuary Visit',
        category: 'sightseeing',
        estimated_cost: 25.0,
        duration_minutes: 120,
        description: 'Get close to a thriving land-based colony of endangered African penguins in Simon\'s Town.',
        image_url: 'https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?w=600&auto=format&fit=crop&q=80',
        created_at: now,
        updated_at: now
      },
      // Sydney (City ID: 5)
      {
        id: 10,
        city_id: 5,
        name: 'Sydney Harbour BridgeClimb Twilight Summit',
        category: 'adventure',
        estimated_cost: 210.0,
        duration_minutes: 210,
        description: 'Climb 134 meters above sea level for 360-degree views of Sydney Opera House and the harbor.',
        image_url: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&auto=format&fit=crop&q=80',
        created_at: now,
        updated_at: now
      },
      {
        id: 11,
        city_id: 5,
        name: 'Bondi to Coogee Coastal Clifftop Walk',
        category: 'sightseeing',
        estimated_cost: 0.0,
        duration_minutes: 150,
        description: 'Scenic 6km walk along dramatic ocean cliffs, pristine beaches, and rock pools.',
        image_url: 'https://images.unsplash.com/photo-1528072164453-f4e8ef0d475a?w=600&auto=format&fit=crop&q=80',
        created_at: now,
        updated_at: now
      },
      // Rio de Janeiro (City ID: 6)
      {
        id: 12,
        city_id: 6,
        name: 'Christ the Redeemer & Sugarloaf Mountain Express',
        category: 'sightseeing',
        estimated_cost: 70.0,
        duration_minutes: 240,
        description: 'Visit the iconic Corcovado statue and take the glass cable car over Guanabara Bay.',
        image_url: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600&auto=format&fit=crop&q=80',
        created_at: now,
        updated_at: now
      },
      // Bangkok (City ID: 7)
      {
        id: 13,
        city_id: 7,
        name: 'Wat Arun & Grand Palace Chao Phraya Longtail Boat Tour',
        category: 'sightseeing',
        estimated_cost: 30.0,
        duration_minutes: 180,
        description: 'Glide through Bangkok canals and visit the Temple of Dawn and the Emerald Buddha.',
        image_url: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&auto=format&fit=crop&q=80',
        created_at: now,
        updated_at: now
      },
      // Rome (City ID: 8)
      {
        id: 14,
        city_id: 8,
        name: 'Colosseum Underground & Roman Forum Arena Floor',
        category: 'culture',
        estimated_cost: 65.0,
        duration_minutes: 180,
        description: 'Exclusive access to the gladiator dungeons, arena stage, and the Palatine Hill.',
        image_url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop&q=80',
        created_at: now,
        updated_at: now
      },
      {
        id: 15,
        city_id: 8,
        name: 'Trastevere Sunset Handmade Pasta & Wine Workshop',
        category: 'food',
        estimated_cost: 80.0,
        duration_minutes: 150,
        description: 'Master authentic Roman carbonara and cacio e pepe paired with organic Italian wines.',
        image_url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80',
        created_at: now,
        updated_at: now
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('activity_catalog', null, {});
  }
};
