/* ==========================================================================
   GlobeTrotter — API Helper & Client
   Centralizes calls to the Express/MySQL backend (Port 4000).
   Uses JWT Bearer token authentication stored in localStorage.
   ========================================================================== */

const API_BASE = "http://localhost:4000/api";

// -----------------------------------------------------------------------------
// JWT Token & Auth State Helpers
// -----------------------------------------------------------------------------
function getToken() {
  return localStorage.getItem("token") || null;
}

function setToken(token) {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
}

function getUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

function setUser(user) {
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    localStorage.removeItem("user");
  }
}

function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

/**
 * Core apiRequest wrapper:
 * - Automatically injects "Authorization: Bearer <token>" header
 * - Sets "Content-Type: application/json"
 * - Handles 401 Unauthorized by clearing session and redirecting to login.html
 */
async function apiRequest(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    // Unauthorized / Token expired -> clear local auth & redirect
    clearAuth();
    if (!window.location.pathname.endsWith("login.html")) {
      window.location.href = "login.html";
    }
    return null;
  }

  let data = null;
  try {
    data = await res.json();
  } catch (_) {
    /* response has no body */
  }

  if (!res.ok) {
    const message = (data && data.error) || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

// -----------------------------------------------------------------------------
// Api Client Object (Aligned with Express/MySQL Backend)
// -----------------------------------------------------------------------------
const Api = {
  // --- AUTHENTICATION ---
  /**
   * Login with email and password.
   * Stores JWT token & user object in localStorage on success.
   */
  login: async (email, password) => {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (data && data.token) {
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  },

  /**
   * Register a new account.
   */
  signup: (name, email, password, profile_photo_url = null) => {
    return apiRequest("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password, profile_photo_url }),
    });
  },

  /**
   * Logout user and redirect to login page.
   */
  logout: () => {
    clearAuth();
    window.location.href = "login.html";
  },

  /**
   * Get cached current user info from localStorage.
   */
  getCurrentUser: () => getUser(),

  /**
   * Check if user is authenticated.
   */
  isAuthenticated: () => Boolean(getToken()),

  // --- TRIPS (Protected) ---
  /**
   * Get all trips belonging to current user (includes stop_count).
   */
  getTrips: () => apiRequest("/trips"),

  /**
   * Get detailed trip with nested stops, cities, and scheduled activities.
   */
  getTrip: (tripId) => apiRequest(`/trips/${tripId}`),

  /**
   * Create a new trip.
   * payload: { name, start_date, end_date, description, cover_photo_url, is_public }
   */
  createTrip: (payload) => {
    return apiRequest("/trips", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Add a stop (city leg) to a trip.
   * payload: { city_id, start_date, end_date, order_index }
   */
  addStop: (tripId, payload) => {
    return apiRequest(`/trips/${tripId}/stops`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Get public read-only trip by share token (No auth required).
   */
  getPublicTrip: (shareToken) => apiRequest(`/trips/public/${shareToken}`),

  /**
   * Get dynamic trip budget calculation breakdown.
   */
  getTripBudget: (tripId) => apiRequest(`/trips/${tripId}/budget`),

  // --- CITIES & ACTIVITIES (Public) ---
  /**
   * Query master cities with optional country or search keyword filters.
   * params: { country?: string, search?: string }
   */
  getCities: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/cities${query ? `?${query}` : ""}`);
  },

  /**
   * Query master activity catalog with optional city_id or category filters.
   * params: { city_id?: number, category?: string }
   */
  getActivities: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/activities${query ? `?${query}` : ""}`);
  },

  // --- HEALTH CHECK ---
  health: () => apiRequest("/health"),

  // ---------------------------------------------------------------------------
  // STUBS FOR FUTURE ENDPOINTS (NOT YET IMPLEMENTED IN BACKEND)
  // ---------------------------------------------------------------------------
  /**
   * [NOT YET IMPLEMENTED IN BACKEND]
   * Recommended cities: Fallback uses getCities() sorted by popularity_score.
   */
  recommendedCities: async (limit = 6) => {
    const cities = await Api.getCities();
    return (cities || []).slice(0, limit);
  },

  /**
   * [NOT YET IMPLEMENTED IN BACKEND]
   * Contact form submission.
   */
  contactSubmit: async (payload) => {
    console.warn("POST /api/contact is NOT YET IMPLEMENTED IN BACKEND. Mocking success.");
    return { success: true, message: "Thank you for reaching out!" };
  },

  /**
   * [NOT YET IMPLEMENTED IN BACKEND]
   * Ticket booking mock.
   */
  bookTicket: async (payload) => {
    console.warn("POST /api/tickets/book is NOT YET IMPLEMENTED IN BACKEND. Mocking response.");
    return { success: true, booking_id: "BK-" + Math.floor(Math.random() * 1000000) };
  },
};
