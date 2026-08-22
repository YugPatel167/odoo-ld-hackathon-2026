/**
 * GlobeTrotter Canonical City & Activity Database
 * Shared single source of truth across Itinerary Builder, Itinerary View, and Activity Search.
 */

const cityDatabase = {
  "Paris": {
    country: "France",
    activities: [
      { name: "Eiffel Tower Summit", cost: 35, duration: "3h", type: "Sightseeing", desc: "Ascend to the top deck for 360-degree vistas across Paris." },
      { name: "Louvre Museum Guided Tour", cost: 45, duration: "4h", type: "Culture", desc: "Skip-the-line access to the Mona Lisa and classical antiquities." },
      { name: "Seine River Dinner Cruise", cost: 75, duration: "2.5h", type: "Food", desc: "Four-course French gourmet meal gliding past illuminated monuments." },
      { name: "Montmartre Walking Tour", cost: 20, duration: "2h", type: "Culture", desc: "Explore Bohemian streets, artists' squares, and the Sacré-Cœur Basilica." }
    ]
  },
  "Tokyo": {
    country: "Japan",
    activities: [
      { name: "Shibuya Crossing & Hachiko", cost: 0, duration: "1.5h", type: "Sightseeing", desc: "Experience the world's busiest pedestrian intersection." },
      { name: "TeamLab Planets Digital Art", cost: 28, duration: "2.5h", type: "Culture", desc: "Walk through water and immersive glowing light installations." },
      { name: "Mount Fuji Day Trip", cost: 95, duration: "8h", type: "Adventure", desc: "Full-day scenic excursion to 5th Station and Lake Kawaguchiko." },
      { name: "Tsukiji Outer Market Food Tour", cost: 40, duration: "2.5h", type: "Food", desc: "Sample fresh sashimi, wagyu skewers, and street food delicacies." }
    ]
  },
  "Rome": {
    country: "Italy",
    activities: [
      { name: "Colosseum & Roman Forum Tour", cost: 40, duration: "3.5h", type: "Culture", desc: "Walk the gladiatorial arena and ancient imperial ruins." },
      { name: "Vatican Museums & Sistine Chapel", cost: 55, duration: "4h", type: "Culture", desc: "Marvel at Michelangelo's ceiling frescos and St. Peter's Basilica." },
      { name: "Trastevere Food Tasting", cost: 65, duration: "3h", type: "Food", desc: "Authentic handmade pasta, supplì, pecorino, and local wine." },
      { name: "Trevi Fountain Gelato Walk", cost: 8, duration: "1h", type: "Leisure", desc: "Evening stroll through Roman piazzas with artisanal Italian gelato." }
    ]
  },
  "Interlaken": {
    country: "Switzerland",
    activities: [
      { name: "Jungfraujoch Top of Europe Train", cost: 180, duration: "6h", type: "Adventure", desc: "Cogwheel train climbing to 3,454m glacier wonderland." },
      { name: "Paragliding over Swiss Alps", cost: 160, duration: "2h", type: "Adventure", desc: "Tandem flight with panoramic views of Eiger and Jungfrau." },
      { name: "Lake Brienz Cruise", cost: 35, duration: "2h", type: "Leisure", desc: "Relaxing turquoise water cruise surrounded by towering alpine peaks." }
    ]
  },
  "New York": {
    country: "USA",
    activities: [
      { name: "Statue of Liberty & Ellis Island", cost: 30, duration: "4h", type: "Sightseeing", desc: "Ferry cruise and museum tour of American immigration history." },
      { name: "Broadway Show Musical", cost: 120, duration: "3h", type: "Culture", desc: "World-class theatrical performance in the heart of Times Square." },
      { name: "Central Park Bike Rental", cost: 25, duration: "2h", type: "Adventure", desc: "Scenic cycling route past iconic landmarks, bridges, and Bethesda Terrace." }
    ]
  },
  "Barcelona": {
    country: "Spain",
    activities: [
      { name: "Sagrada Família Guided Tour", cost: 35, duration: "2.5h", type: "Culture", desc: "Gaudí's unfinished basilica masterpiece with stained-glass towers." },
      { name: "Park Güell Discovery", cost: 15, duration: "2h", type: "Sightseeing", desc: "Mosaic dragons, wavy benches, and Mediterranean views." },
      { name: "Tapas Crawl in Gothic Quarter", cost: 45, duration: "3h", type: "Food", desc: "Taste authentic pintxos, jamón ibérico, and regional wines." }
    ]
  },
  "London": {
    country: "United Kingdom",
    activities: [
      { name: "Tower of London Tour", cost: 40, duration: "3h", type: "Culture", desc: "See the Crown Jewels and 1,000 years of royal intrigue." },
      { name: "London Eye Flight", cost: 38, duration: "1h", type: "Sightseeing", desc: "Panoramic observation wheel overlooking the River Thames." },
      { name: "British Museum Highlights", cost: 15, duration: "2.5h", type: "Culture", desc: "Guided tour of world history wonders including the Rosetta Stone." }
    ]
  },
  "Kyoto": {
    country: "Japan",
    activities: [
      { name: "Fushimi Inari Shrine Walk", cost: 0, duration: "3h", type: "Culture", desc: "Thousands of vermillion torii gates winding up Mount Inari." },
      { name: "Arashiyama Bamboo Grove", cost: 0, duration: "2h", type: "Sightseeing", desc: "Towering green bamboo stalks and tranquil walking trails." },
      { name: "Traditional Tea Ceremony", cost: 35, duration: "1.5h", type: "Culture", desc: "Mindful matcha preparation ritual in a historic Kyoto teahouse." }
    ]
  },
  "Bangkok": {
    country: "Thailand",
    activities: [
      { name: "Grand Palace & Wat Pho", cost: 18, duration: "3.5h", type: "Culture", desc: "Golden spires, the Emerald Buddha, and the 46m Reclining Buddha." },
      { name: "Floating Markets Longtail Boat", cost: 30, duration: "4h", type: "Adventure", desc: "Cruise bustling canal markets sampling fresh tropical fruits." },
      { name: "Chinatown Street Food Tour", cost: 25, duration: "2.5h", type: "Food", desc: "Vibrant night food stalls with famous Michelin-rated street bites." }
    ]
  },
  "Singapore": {
    country: "Singapore",
    activities: [
      { name: "Gardens by the Bay Cloud Forest", cost: 25, duration: "3h", type: "Sightseeing", desc: "35-meter indoor waterfall and futuristic Supertree Grove." },
      { name: "Marina Bay Sands SkyPark", cost: 28, duration: "1.5h", type: "Sightseeing", desc: "Observation deck views across Marina Bay and Singapore strait." }
    ]
  },
  "Dubai": {
    country: "United Arab Emirates",
    activities: [
      { name: "Burj Khalifa 148th Floor", cost: 95, duration: "2h", type: "Sightseeing", desc: "Highest observation deck on earth with lounge access." },
      { name: "Desert 4x4 Safari & BBQ", cost: 65, duration: "5h", type: "Adventure", desc: "Dune bashing, camel riding, sandboarding, and bedouin dinner." }
    ]
  },
  "San Francisco": {
    country: "USA",
    activities: [
      { name: "Alcatraz Island Night Tour", cost: 55, duration: "3h", type: "Culture", desc: "Infamous former maximum-security federal penitentiary audio tour." },
      { name: "Golden Gate Bridge Bike Tour", cost: 35, duration: "3h", type: "Adventure", desc: "Ride across the iconic bridge to coastal Sausalito." }
    ]
  },
  "Rio de Janeiro": {
    country: "Brazil",
    activities: [
      { name: "Christ the Redeemer Train", cost: 25, duration: "3h", type: "Sightseeing", desc: "Cog train up Corcovado mountain through Tijuca rainforest." },
      { name: "Sugarloaf Mountain Cable Car", cost: 30, duration: "2.5h", type: "Sightseeing", desc: "Panoramic glass cable car ride overlooking Guanabara Bay." }
    ]
  },
  "Sydney": {
    country: "Australia",
    activities: [
      { name: "Sydney Opera House Tour", cost: 35, duration: "2h", type: "Culture", desc: "Behind-the-scenes architectural tour of the iconic sail shells." },
      { name: "Bondi to Coogee Coastal Walk", cost: 0, duration: "2.5h", type: "Leisure", desc: "Iconic clifftop trail past beaches, rock pools, and ocean views." }
    ]
  },
  "Cape Town": {
    country: "South Africa",
    activities: [
      { name: "Table Mountain Cableway", cost: 22, duration: "3h", type: "Adventure", desc: "360-degree rotating cable car to flat-top summit." },
      { name: "Cape Peninsula & Boulders Beach", cost: 50, duration: "6h", type: "Sightseeing", desc: "Scenic drive to Cape Point and visit the African penguin colony." }
    ]
  },
  "Cairo": {
    country: "Egypt",
    activities: [
      { name: "Giza Pyramids & Sphinx Camel Tour", cost: 45, duration: "4h", type: "Culture", desc: "Ancient wonders of the world with licensed Egyptologist guide." },
      { name: "Egyptian Museum & Treasures", cost: 20, duration: "3h", type: "Culture", desc: "Ancient pharaonic artifacts and royal mummies in historic Cairo." }
    ]
  }
};

// Flattened list of all activities with city and country attached for activity search & filtering
const allActivities = Object.entries(cityDatabase).flatMap(([city, data]) =>
  data.activities.map(act => ({
    ...act,
    city: city,
    country: data.country,
    desc: act.desc || ''
  }))
);
