/* ==========================================================================
   GlobeTrotter — Dashboard Logic (Backend Connected)
   Fetches user data, live trips from Express backend, and renders budget stats.
   ========================================================================== */

const fallbackDestinations = [
  { name: "Paris", country: "France", costIndex: "$$", tag: "Culture & Cuisine" },
  { name: "Tokyo", country: "Japan", costIndex: "$$$", tag: "Modern & Heritage" },
  { name: "Rome", country: "Italy", costIndex: "$$", tag: "Ancient History" },
  { name: "Interlaken", country: "Switzerland", costIndex: "$$$", tag: "Alpine Adventure" },
  { name: "Barcelona", country: "Spain", costIndex: "$$", tag: "Architecture & Beach" },
  { name: "Kyoto", country: "Japan", costIndex: "$$", tag: "Shrines & Nature" }
];

const cityDailyEst = {
  "Paris": 180, "Tokyo": 160, "Rome": 140, "Interlaken": 240,
  "New York": 220, "Barcelona": 130, "London": 190, "Kyoto": 140,
  "Bangkok": 60, "Singapore": 180, "Dubai": 210, "San Francisco": 200,
  "Rio de Janeiro": 75, "Sydney": 170, "Cape Town": 85, "Cairo": 55
};

function calculateDays(start, end) {
  if (!start || !end) return 1;
  const diff = new Date(end) - new Date(start);
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1);
}

function formatDateRange(start, end) {
  if (!start || !end) return 'Flexible Dates';
  const opts = { month: 'short', day: 'numeric' };
  try {
    const s = new Date(start).toLocaleDateString(undefined, opts);
    const e = new Date(end).toLocaleDateString(undefined, opts);
    return `${s} – ${e}`;
  } catch (e) {
    return `${start} – ${end}`;
  }
}

function currency(n) {
  return `$${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function estimateTripCost(trip) {
  const totalDays = trip.durationDays || calculateDays(trip.startDate || trip.start_date, trip.endDate || trip.end_date);
  const stops = trip.stops || [];

  let staysCost = 0;
  let transitCost = Math.max(200, stops.length * 120);
  let activitiesCost = 0;
  let foodCost = totalDays * 45;

  stops.forEach(stop => {
    const days = calculateDays(stop.startDate || stop.start_date, stop.endDate || stop.end_date);
    const cityName = typeof stop.city === 'object' ? stop.city.name : stop.city;
    const dailyRate = cityDailyEst[cityName] || 150;
    staysCost += days * dailyRate;
    activitiesCost += (stop.activities || []).length * 35;
  });

  if (staysCost === 0) staysCost = totalDays * 120;
  if (activitiesCost === 0) activitiesCost = 140;

  const total = staysCost + transitCost + activitiesCost + foodCost;
  return { total, totalDays };
}

function renderTripTicket(trip, index) {
  const stopCount = (trip.stops && trip.stops.length) || trip.stop_count || 1;
  const startDate = trip.startDate || trip.start_date;
  const endDate = trip.endDate || trip.end_date;
  const days = trip.durationDays || calculateDays(startDate, endDate);
  const costInfo = estimateTripCost(trip);
  const formattedDates = formatDateRange(startDate, endDate);
  const tripNum = String(index + 1).padStart(3, '0');

  return `
    <a class="ticket" href="itinerary-view.html?id=${trip.id}" style="text-decoration:none; color:inherit;">
      <div class="ticket-main">
        <h3>${trip.name}</h3>
        <div class="ticket-route">
          <span>${stopCount} stop${stopCount === 1 ? '' : 's'}</span>
          <span class="line"></span>
          <span>${days}d</span>
        </div>
        <div class="muted" style="font-size:0.85rem;">${formattedDates}</div>
        <div class="ticket-budget">
          <div class="progress"><div class="progress-bar" style="width:75%"></div></div>
          <div class="muted" style="font-size:0.78rem; margin-top:4px;">Est. budget: ${currency(costInfo.total)}</div>
        </div>
      </div>
      <div class="ticket-stub">
        <span class="stub-label">Trip</span>
        <span class="stub-value">#${tripNum}</span>
      </div>
    </a>`;
}

function renderDestCard(city) {
  return `
    <div class="card dest-card" onclick="window.location.href='city-search.html'" style="cursor: pointer;">
      <div class="dest-name" style="font-weight: 600; color: var(--ink);">${city.name}</div>
      <div class="dest-meta muted" style="font-size: 0.82rem;">${city.country} &bull; ${city.tag || 'Popular Destination'}</div>
      <span class="dest-badge" style="display: inline-block; margin-top: 8px; font-size: 0.75rem; color: var(--brass);">Cost index: ${city.costIndex || city.cost_index || '$$'}</span>
    </div>`;
}

async function loadDashboard() {
  // 1. Greet current user
  const currentUser = (typeof Api !== 'undefined' && Api.getCurrentUser()) || {};
  const userName = currentUser.name || (currentUser.email ? currentUser.email.split('@')[0] : 'Traveler');

  document.querySelectorAll('[data-user-name]').forEach(el => {
    el.textContent = userName;
  });

  // 2. Fetch User Trips from Backend
  let trips = [];
  try {
    trips = (typeof Api !== 'undefined' && await Api.getTrips()) || [];
  } catch (err) {
    console.warn('[Dashboard] Fallback trips loaded:', err);
    trips = (typeof Api !== 'undefined' && Api.trips()) || [];
  }

  // 3. Populate Recent Trips
  const tripsContainer = document.getElementById('trips-list');
  if (tripsContainer) {
    if (!trips || trips.length === 0) {
      tripsContainer.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1; text-align:center; padding: 40px 20px;">
          <p class="muted" style="margin-bottom: 12px;">No trips yet — your next journey starts here.</p>
          <a href="create-trip.html" class="btn btn-primary btn-sm">+ Plan your first trip</a>
        </div>`;
    } else {
      const recent = trips.slice(0, 6);
      tripsContainer.innerHTML = recent.map((t, idx) => renderTripTicket(t, idx)).join('');
    }
  }

  // 4. Populate Budget Highlights
  const budgetContainer = document.getElementById('budget-stats');
  if (budgetContainer) {
    if (!trips || trips.length === 0) {
      budgetContainer.innerHTML = `
        <div class="card stat">
          <div class="stat-value" style="color: var(--sage);">$0</div>
          <div class="stat-label">Total planned spend</div>
        </div>
        <div class="card stat">
          <div class="stat-value" style="color: var(--brass);">0</div>
          <div class="stat-label">Trips planned</div>
        </div>
        <div class="card stat">
          <div class="stat-value" style="color: var(--coral);">$0</div>
          <div class="stat-label">Avg. cost / day</div>
        </div>`;
    } else {
      let grandTotal = 0;
      let grandDays = 0;

      trips.forEach(t => {
        const est = estimateTripCost(t);
        grandTotal += est.total;
        grandDays += est.totalDays;
      });

      const avgDaily = grandDays > 0 ? Math.round(grandTotal / grandDays) : 0;

      budgetContainer.innerHTML = `
        <div class="card stat">
          <div class="stat-value ok" style="color: var(--sage);">${currency(grandTotal)}</div>
          <div class="stat-label">Total planned spend</div>
        </div>
        <div class="card stat">
          <div class="stat-value" style="color: var(--brass);">${trips.length}</div>
          <div class="stat-label">Active & planned trips</div>
        </div>
        <div class="card stat">
          <div class="stat-value ok" style="color: var(--coral);">${currency(avgDaily)}</div>
          <div class="stat-label">Avg. cost / day</div>
        </div>`;
    }
  }

  // 5. Populate Recommended Destinations from Backend or Fallback
  const recommendedContainer = document.getElementById('recommended-list');
  if (recommendedContainer) {
    let dests = fallbackDestinations;
    try {
      if (typeof Api !== 'undefined') {
        const remoteCities = await Api.getCities();
        if (remoteCities && remoteCities.length > 0) {
          dests = remoteCities.slice(0, 6).map(c => ({
            name: c.name,
            country: c.country,
            costIndex: c.cost_index,
            tag: `${c.country} Exploration`
          }));
        }
      }
    } catch(e) {}
    recommendedContainer.innerHTML = dests.map(renderDestCard).join('');
  }
}

document.addEventListener('DOMContentLoaded', loadDashboard);
