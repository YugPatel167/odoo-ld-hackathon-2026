/* ==========================================================================
   GlobeTrotter — API helper
   Centralizes calls to the Express/MySQL backend. Change API_BASE once
   the backend teammate gives you the real deployed URL / port.
   ========================================================================== */

const API_BASE = "http://localhost:3000/api";

/**
 * Wraps fetch() with auth cookie handling + consistent error shape.
 * Assumes the backend sets an httpOnly session cookie on login (safer
 * than localStorage for a token). credentials: "include" sends it along.
 */
async function apiRequest(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  if (res.status === 401) {
    // Session expired or not logged in — bounce to login
    window.location.href = "login.html";
    return null;
  }

  let data = null;
  try { data = await res.json(); } catch (_) { /* no body */ }

  if (!res.ok) {
    const message = (data && data.error) || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}

const Api = {
  me: () => apiRequest("/me"),
  logout: () => apiRequest("/logout", { method: "POST" }),
  trips: (params = "") => apiRequest(`/trips${params}`),
  recommendedCities: (limit = 6) => apiRequest(`/cities/recommended?limit=${limit}`),
  budgetSummary: () => apiRequest("/budget/summary"),
  createTrip: (payload) => apiRequest("/trips", { method: "POST", body: JSON.stringify(payload) }),
  contactSubmit: (payload) => apiRequest("/contact", { method: "POST", body: JSON.stringify(payload) }),
};
