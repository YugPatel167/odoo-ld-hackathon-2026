/* ==========================================================================
   GlobeTrotter — Central Full-Stack API Helper
   Connects frontend views to the Express + MySQL backend on http://localhost:4000/api
   with automatic local storage fallback for offline resilience.
   ========================================================================== */

const API_BASE = "http://localhost:4000/api";

/**
 * Universal authenticated fetch wrapper
 */
async function apiRequest(path, options = {}) {
  const token = Api.getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers
    });

    let data = null;
    try {
      data = await res.json();
    } catch (_) {
      /* empty body */
    }

    if (res.status === 401) {
      // If unauthorized on a protected endpoint
      if (token && path.startsWith('/trips')) {
        Api.clearToken();
      }
      const message = (data && data.error) || 'Unauthorized (401)';
      const err = new Error(message);
      err.status = 401;
      throw err;
    }

    if (!res.ok) {
      const message = (data && data.error) || `Request failed with status ${res.status}`;
      const err = new Error(message);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (err) {
    if (err.status) {
      throw err;
    }
    console.warn(`[Api] Backend offline or network error on ${path}.`, err.message);
    return null;
  }
}

/* ==========================================================================
   Local Storage Data Manager & Offline Fallback Engine
   ========================================================================== */
const GlobeStorage = {
  init() {
    if (!localStorage.getItem('globetrotter_trips')) {
      const defaultTrips = [
        {
          id: "trip_paris_2026",
          name: "Parisian Elegance & Swiss Alps",
          startDate: "2026-06-15",
          start_date: "2026-06-15",
          endDate: "2026-06-25",
          end_date: "2026-06-25",
          durationDays: 10,
          status: "Confirmed",
          targetBudget: 3500,
          description: "Summer getaway through France and Switzerland.",
          cover: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=700&auto=format&fit=crop&q=80",
          cover_photo_url: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=700&auto=format&fit=crop&q=80",
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
          start_date: "2026-09-10",
          endDate: "2026-09-22",
          end_date: "2026-09-22",
          durationDays: 12,
          status: "Planning",
          targetBudget: 4200,
          description: "Exploring Japan's ancient temples and futuristic technology.",
          cover: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=700&auto=format&fit=crop&q=80",
          cover_photo_url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=700&auto=format&fit=crop&q=80",
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
          "City Search": 164,
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
    try {
      return JSON.parse(localStorage.getItem('globetrotter_trips')) || [];
    } catch(e) {
      return [];
    }
  },

  saveTrips(trips) {
    localStorage.setItem('globetrotter_trips', JSON.stringify(trips));
  },

  getProfile() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem('globetrotter_profile')) || {};
    } catch(e) {
      return {};
    }
  },

  saveProfile(profile) {
    localStorage.setItem('globetrotter_profile', JSON.stringify(profile));
  },

  getBookings() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem('globetrotter_bookings')) || [];
    } catch(e) {
      return [];
    }
  },

  addBooking(booking) {
    const bookings = this.getBookings();
    bookings.unshift(booking);
    localStorage.setItem('globetrotter_bookings', JSON.stringify(bookings));
  },

  getMessages() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem('globetrotter_messages')) || [];
    } catch(e) {
      return [];
    }
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

GlobeStorage.init();

/* ==========================================================================
   Api Client Service
   ========================================================================== */
const Api = {
  // Token & User Auth Management
  getToken() {
    return localStorage.getItem('globetrotter_token') || null;
  },

  setToken(token) {
    if (token) {
      localStorage.setItem('globetrotter_token', token);
    } else {
      localStorage.removeItem('globetrotter_token');
    }
  },

  clearToken() {
    localStorage.removeItem('globetrotter_token');
    localStorage.removeItem('globetrotter_user');
  },

  isAuthenticated() {
    return Boolean(this.getToken());
  },

  getCurrentUser() {
    try {
      const stored = localStorage.getItem('globetrotter_user');
      if (stored) return JSON.parse(stored);
    } catch(e) {}
    // Fallback to local profile
    return this.getProfile();
  },

  setCurrentUser(user) {
    if (user) {
      localStorage.setItem('globetrotter_user', JSON.stringify(user));
      // Also update local profile for seamless display
      const currentProf = this.getProfile();
      this.saveProfile({
        ...currentProf,
        name: user.name || currentProf.name,
        email: user.email || currentProf.email
      });
    } else {
      localStorage.removeItem('globetrotter_user');
    }
  },

  // 1. Authentication
  async login(email, password) {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    if (data && data.token) {
      this.setToken(data.token);
      this.setCurrentUser(data.user);
      return data;
    }

    // Fallback simulation for offline testing
    const fallbackUser = { id: 1, name: email.split('@')[0] || "Traveler", email };
    this.setToken('dummy_jwt_token_offline');
    this.setCurrentUser(fallbackUser);
    return { token: 'dummy_jwt_token_offline', user: fallbackUser };
  },

  async signup(name, email, password) {
    const data = await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });

    if (data && data.id) {
      // Auto login after signup if token returned, or log in
      return data;
    }

    // Offline fallback
    const fallbackUser = { id: Date.now(), name, email };
    return fallbackUser;
  },

  async logout() {
    this.clearToken();
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch(e) {}
    window.location.href = 'login.html';
  },

  // 2. Trips CRUD
  async getTrips() {
    const remoteTrips = await apiRequest('/trips', { method: 'GET' });
    if (remoteTrips && Array.isArray(remoteTrips)) {
      // Normalize remote trips to match UI format
      const normalized = remoteTrips.map(t => ({
        id: String(t.id),
        name: t.name,
        startDate: t.start_date,
        start_date: t.start_date,
        endDate: t.end_date,
        end_date: t.end_date,
        description: t.description || '',
        cover: t.cover_photo_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=700&auto=format&fit=crop&q=80',
        cover_photo_url: t.cover_photo_url,
        is_public: t.is_public,
        share_token: t.share_token,
        stops: t.stops || []
      }));
      this.saveTrips(normalized);
      return normalized;
    }
    return this.trips();
  },

  async getTrip(id) {
    const remoteTrip = await apiRequest(`/trips/${id}`, { method: 'GET' });
    if (remoteTrip) {
      return {
        id: String(remoteTrip.id),
        name: remoteTrip.name,
        startDate: remoteTrip.start_date,
        start_date: remoteTrip.start_date,
        endDate: remoteTrip.end_date,
        end_date: remoteTrip.end_date,
        description: remoteTrip.description || '',
        cover: remoteTrip.cover_photo_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=700&auto=format&fit=crop&q=80',
        cover_photo_url: remoteTrip.cover_photo_url,
        is_public: remoteTrip.is_public,
        share_token: remoteTrip.share_token,
        stops: (remoteTrip.stops || []).map(s => ({
          id: String(s.id),
          city: s.city ? s.city.name : 'Destination',
          country: s.city ? s.city.country : '',
          startDate: s.start_date,
          endDate: s.end_date,
          activities: (s.activities || []).map(a => a.custom_name || (a.catalogItem && a.catalogItem.name) || 'Activity')
        }))
      };
    }
    const localTrips = this.trips();
    return localTrips.find(t => String(t.id) === String(id)) || null;
  },

  async createTrip(payload) {
    const requestBody = {
      name: payload.name,
      start_date: payload.start_date || payload.startDate,
      end_date: payload.end_date || payload.endDate,
      description: payload.description || payload.notes || '',
      cover_photo_url: payload.cover_photo_url || payload.cover || null,
      is_public: Boolean(payload.is_public)
    };

    const remoteTrip = await apiRequest('/trips', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });

    const newTrip = remoteTrip ? {
      id: String(remoteTrip.id),
      name: remoteTrip.name,
      startDate: remoteTrip.start_date,
      start_date: remoteTrip.start_date,
      endDate: remoteTrip.end_date,
      end_date: remoteTrip.end_date,
      description: remoteTrip.description,
      cover: remoteTrip.cover_photo_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=700&auto=format&fit=crop&q=80',
      cover_photo_url: remoteTrip.cover_photo_url,
      stops: []
    } : {
      id: 'trip_' + Date.now(),
      name: payload.name,
      startDate: payload.start_date || payload.startDate,
      start_date: payload.start_date || payload.startDate,
      endDate: payload.end_date || payload.endDate,
      end_date: payload.end_date || payload.endDate,
      description: payload.description || '',
      cover: payload.cover_photo_url || payload.cover || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=700&auto=format&fit=crop&q=80',
      stops: []
    };

    const trips = this.trips();
    trips.unshift(newTrip);
    this.saveTrips(trips);
    return newTrip;
  },

  async addStop(tripId, payload) {
    const requestBody = {
      city_id: payload.city_id,
      start_date: payload.start_date || payload.startDate,
      end_date: payload.end_date || payload.endDate,
      order_index: payload.order_index
    };

    const remoteStop = await apiRequest(`/trips/${tripId}/stops`, {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });

    return remoteStop;
  },

  // 3. Search & Catalog
  async getCities(params = {}) {
    let queryStr = '';
    const qs = [];
    if (params.search) qs.push(`search=${encodeURIComponent(params.search)}`);
    if (params.country) qs.push(`country=${encodeURIComponent(params.country)}`);
    if (qs.length > 0) queryStr = `?${qs.join('&')}`;

    const cities = await apiRequest(`/cities${queryStr}`, { method: 'GET' });
    if (cities && Array.isArray(cities)) {
      return cities;
    }
    return null;
  },

  async getActivities(params = {}) {
    let queryStr = '';
    const qs = [];
    if (params.category && params.category !== 'all') qs.push(`category=${encodeURIComponent(params.category)}`);
    if (params.city_id) qs.push(`city_id=${encodeURIComponent(params.city_id)}`);
    if (qs.length > 0) queryStr = `?${qs.join('&')}`;

    const activities = await apiRequest(`/activities${queryStr}`, { method: 'GET' });
    if (activities && Array.isArray(activities)) {
      return activities;
    }
    return null;
  },

  async getTripBudget(tripId) {
    return await apiRequest(`/trips/${tripId}/budget`, { method: 'GET' });
  },

  async getPublicTrip(shareToken) {
    return await apiRequest(`/trips/public/${shareToken}`, { method: 'GET' });
  },

  // Backward compatibility & Storage Sync
  trips: () => GlobeStorage.getTrips(),
  saveTrips: (trips) => GlobeStorage.saveTrips(trips),
  getProfile: () => GlobeStorage.getProfile(),
  saveProfile: (p) => GlobeStorage.saveProfile(p),
  getBookings: () => GlobeStorage.getBookings(),
  addBooking: (b) => GlobeStorage.addBooking(b),
  getMessages: () => GlobeStorage.getMessages(),
  getAnalytics: () => {
    try {
      return JSON.parse(localStorage.getItem('globetrotter_analytics')) || {};
    } catch(e) {
      return {};
    }
  },

  contactSubmit: async (payload) => {
    const apiRes = await apiRequest("/contact", { method: "POST", body: JSON.stringify(payload) });
    GlobeStorage.addMessage(payload);
    return apiRes || { success: true, target: "hemilclg001@gmail.com" };
  }
};
