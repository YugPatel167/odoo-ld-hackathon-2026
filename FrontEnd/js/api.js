/* ==========================================================================
   GlobeTrotter — API helper
   Centralizes calls to the Express/MySQL backend. Change API_BASE once
   the backend teammate gives you the real deployed URL / port.
   ========================================================================== */

const API_BASE = "http://localhost:4000/api";

/**
 * Wraps fetch() with auth cookie handling + fallback to local state if backend is offline.
 */
async function apiRequest(path, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      ...options,
    });

    if (res.status === 401) {
      return null;
    }

    let data = null;
    try { data = await res.json(); } catch (_) { /* no body */ }

    if (!res.ok) {
      const message = (data && data.error) || `Request failed (${res.status})`;
      throw new Error(message);
    }
    return data;
  } catch (err) {
    console.warn(`[Api] Server offline or request failed for ${path}, using local storage fallback:`, err.message);
    return null;
  }
}

/* ==========================================================================
   Local Storage Data Manager & Analytics Tracker
   ========================================================================== */
const GlobeStorage = {
  // Seed initial sample trips if none exist
  init() {
    if (!localStorage.getItem('globetrotter_trips')) {
      const defaultTrips = [
        {
          id: "trip_paris_2026",
          name: "Parisian Elegance & Swiss Alps",
          startDate: "2026-06-15",
          endDate: "2026-06-25",
          durationDays: 10,
          status: "Confirmed",
          targetBudget: 3500,
          notes: "Summer getaway through France and Switzerland.",
          stops: [
            {
              id: "st_1",
              city: "Paris",
              country: "France",
              startDate: "2026-06-15",
              endDate: "2026-06-20",
              activities: ["Eiffel Tower Summit", "Louvre Museum Guided Tour", "Seine River Dinner Cruise"],
              lodgingEst: 950,
              transitEst: 320
            },
            {
              id: "st_2",
              city: "Interlaken",
              country: "Switzerland",
              startDate: "2026-06-20",
              endDate: "2026-06-25",
              activities: ["Jungfraujoch Top of Europe Train", "Paragliding over Swiss Alps"],
              lodgingEst: 1100,
              transitEst: 280
            }
          ],
          customExpenses: [
            { id: "exp_1", title: "Travel Insurance", category: "Incidentals", amount: 120 },
            { id: "exp_2", title: "Swiss Travel Pass", category: "Transit", amount: 240 }
          ]
        },
        {
          id: "trip_tokyo_2026",
          name: "Tokyo & Kyoto Cherry Blossom",
          startDate: "2026-09-10",
          endDate: "2026-09-22",
          durationDays: 12,
          status: "Planning",
          targetBudget: 4200,
          notes: "Exploring Japan's ancient temples and futuristic technology.",
          stops: [
            {
              id: "st_3",
              city: "Tokyo",
              country: "Japan",
              startDate: "2026-09-10",
              endDate: "2026-09-16",
              activities: ["Shibuya Crossing & Hachiko", "TeamLab Planets Digital Art", "Mount Fuji Day Trip"],
              lodgingEst: 1200,
              transitEst: 450
            },
            {
              id: "st_4",
              city: "Kyoto",
              country: "Japan",
              startDate: "2026-09-16",
              endDate: "2026-09-22",
              activities: ["Fushimi Inari Shrine Walk", "Arashiyama Bamboo Grove"],
              lodgingEst: 850,
              transitEst: 180
            }
          ],
          customExpenses: []
        }
      ];
      localStorage.setItem('globetrotter_trips', JSON.stringify(defaultTrips));
    }

    if (!localStorage.getItem('globetrotter_profile')) {
      const defaultProfile = {
        name: "Hemil Patadiya",
        email: "hemilclg001@gmail.com",
        phone: "+1 (555) 234-5678",
        currency: "USD ($)",
        homeAirport: "New York (JFK)",
        bio: "Avid traveler, coffee enthusiast, and software designer.",
        styles: ["🏛️ Cultural & Museums", "🍷 Culinary & Food Walks", "🧗 Scenic & Hiking"],
        tier: "GlobeTrotter Gold",
        savedActivities: ["Eiffel Tower Summit", "Jungfraujoch Top of Europe Train"]
      };
      localStorage.setItem('globetrotter_profile', JSON.stringify(defaultProfile));
    }

    if (!localStorage.getItem('globetrotter_bookings')) {
      const defaultBookings = [
        {
          id: "BK-89421",
          operator: "Air France AF1824",
          type: "Flight",
          from: "New York (JFK)",
          to: "Paris (CDG)",
          depart: "22:15",
          arrive: "11:30 (+1)",
          date: "2026-06-15",
          passengers: 1,
          passengerName: "Hemil Patadiya",
          seat: "14A (Window)",
          price: 680,
          status: "Confirmed"
        }
      ];
      localStorage.setItem('globetrotter_bookings', JSON.stringify(defaultBookings));
    }

    if (!localStorage.getItem('globetrotter_messages')) {
      const defaultMsgs = [
        {
          id: "msg_1",
          name: "Alex Johnson",
          email: "alex@example.com",
          targetEmail: "hemilclg001@gmail.com",
          message: "Great work on the multi-city trip budget feature! Will Odoo integration sync invoices?",
          date: "2026-08-22 10:15",
          status: "Unread"
        }
      ];
      localStorage.setItem('globetrotter_messages', JSON.stringify(defaultMsgs));
    }

    if (!localStorage.getItem('globetrotter_analytics')) {
      const defaultAnalytics = {
        pageViews: {
          "Home": 142,
          "Dashboard": 98,
          "Activity Search": 215,
          "Trip Budget": 178,
          "Trip Calendar": 134,
          "Ticket Booking": 162,
          "Profile": 85,
          "Admin": 46,
          "Contact": 67
        },
        clicks: {
          "create_trip_btn": 64,
          "book_ticket_btn": 52,
          "add_activity_btn": 89,
          "budget_calc": 71
        }
      };
      localStorage.setItem('globetrotter_analytics', JSON.stringify(defaultAnalytics));
    }
  },

  getTrips() {
    this.init();
    try { return JSON.parse(localStorage.getItem('globetrotter_trips')) || []; } catch(e) { return []; }
  },

  saveTrips(trips) {
    localStorage.setItem('globetrotter_trips', JSON.stringify(trips));
  },

  getProfile() {
    this.init();
    try { return JSON.parse(localStorage.getItem('globetrotter_profile')) || {}; } catch(e) { return {}; }
  },

  saveProfile(profile) {
    localStorage.setItem('globetrotter_profile', JSON.stringify(profile));
  },

  getBookings() {
    this.init();
    try { return JSON.parse(localStorage.getItem('globetrotter_bookings')) || []; } catch(e) { return []; }
  },

  addBooking(booking) {
    const bookings = this.getBookings();
    bookings.unshift(booking);
    localStorage.setItem('globetrotter_bookings', JSON.stringify(bookings));
  },

  getMessages() {
    this.init();
    try { return JSON.parse(localStorage.getItem('globetrotter_messages')) || []; } catch(e) { return []; }
  },

  addMessage(msg) {
    const msgs = this.getMessages();
    msgs.unshift({
      id: 'msg_' + Date.now(),
      ...msg,
      targetEmail: "hemilclg001@gmail.com",
      date: new Date().toLocaleString(),
      status: "Unread"
    });
    localStorage.setItem('globetrotter_messages', JSON.stringify(msgs));
  },

  trackPageView(pageName) {
    this.init();
    try {
      const data = JSON.parse(localStorage.getItem('globetrotter_analytics')) || { pageViews: {}, clicks: {} };
      data.pageViews[pageName] = (data.pageViews[pageName] || 0) + 1;
      localStorage.setItem('globetrotter_analytics', JSON.stringify(data));
    } catch(e) {}
  },

  trackClick(elementId) {
    this.init();
    try {
      const data = JSON.parse(localStorage.getItem('globetrotter_analytics')) || { pageViews: {}, clicks: {} };
      data.clicks[elementId] = (data.clicks[elementId] || 0) + 1;
      localStorage.setItem('globetrotter_analytics', JSON.stringify(data));
    } catch(e) {}
  }
};

// Initialize default storage immediately
GlobeStorage.init();

// Track current page view automatically
(function autoTrackPage() {
  const path = window.location.pathname.split('/').pop().replace('.html', '') || 'home';
  const nameMap = {
    'home': 'Home',
    'dashboard': 'Dashboard',
    'activity-search': 'Activity Search',
    'city-search': 'City Search',
    'trip-budget': 'Trip Budget',
    'trip-calendar': 'Trip Calendar',
    'ticket-booking': 'Ticket Booking',
    'profile': 'Profile',
    'admin-dashboard': 'Admin',
    'contact': 'Contact',
    'about': 'About',
    'create-trip': 'Create Trip',
    'itinerary-builder': 'Itinerary Builder',
    'itinerary-view': 'Itinerary View'
  };
  GlobeStorage.trackPageView(nameMap[path] || path);
})();

const Api = {
  me: () => apiRequest("/me") || GlobeStorage.getProfile(),
  logout: () => apiRequest("/logout", { method: "POST" }),
  trips: () => GlobeStorage.getTrips(),
  saveTrips: (trips) => GlobeStorage.saveTrips(trips),
  getProfile: () => GlobeStorage.getProfile(),
  saveProfile: (p) => GlobeStorage.saveProfile(p),
  getBookings: () => GlobeStorage.getBookings(),
  addBooking: (b) => GlobeStorage.addBooking(b),
  getMessages: () => GlobeStorage.getMessages(),
  contactSubmit: async (payload) => {
    // Try backend dispatch, fallback to local state + mailto prompt
    const apiRes = await apiRequest("/contact", { method: "POST", body: JSON.stringify(payload) });
    GlobeStorage.addMessage(payload);
    return apiRes || { success: true, target: "hemilclg001@gmail.com" };
  },
  getAnalytics: () => {
    try { return JSON.parse(localStorage.getItem('globetrotter_analytics')) || {}; } catch(e) { return {}; }
  }
};

