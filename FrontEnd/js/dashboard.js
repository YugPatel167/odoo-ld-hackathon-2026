/* ==========================================================================
   GlobeTrotter — Dashboard logic
   Reads trip and budget data from localStorage (shared with my-trips & budget)
   ========================================================================== */

const defaultTrips = [
  {
    id: 'trip_1',
    name: 'Grand European Discovery',
    startDate: '2026-06-15',
    endDate: '2026-06-25',
    durationDays: 11,
    status: 'Planning',
    cover: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=700&auto=format&fit=crop&q=80',
    description: 'Scenic journey across Paris and Rome exploring art, cuisine, and history.',
    stops: [
      { id: 'stop_1', city: 'Paris', startDate: '2026-06-15', endDate: '2026-06-20', activities: ['Eiffel Tower Summit', 'Louvre Museum Guided Tour'] },
      { id: 'stop_2', city: 'Rome', startDate: '2026-06-20', endDate: '2026-06-25', activities: ['Colosseum & Roman Forum Tour'] }
    ]
  },
  {
    id: 'trip_2',
    name: 'Tokyo & Kyoto Highlights',
    startDate: '2026-09-10',
    endDate: '2026-09-22',
    durationDays: 13,
    status: 'Confirmed',
    cover: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=700&auto=format&fit=crop&q=80',
    description: 'Ultra-modern tech, historic shrines, culinary exploration, and Mount Fuji.',
    stops: [
      { id: 'stop_1', city: 'Tokyo', startDate: '2026-09-10', endDate: '2026-09-16', activities: ['TeamLab Planets Digital Art', 'Mount Fuji Day Trip'] },
      { id: 'stop_2', city: 'Kyoto', startDate: '2026-09-16', endDate: '2026-09-22', activities: ['Fushimi Inari Shrine Walk', 'Arashiyama Bamboo Grove'] }
    ]
  }
];

const cityDailyEst = {
  "Paris": 180, "Tokyo": 160, "Rome": 140, "Interlaken": 240,
  "New York": 220, "Barcelona": 130, "London": 190, "Kyoto": 140,
  "Bangkok": 60, "Singapore": 180, "Dubai": 210, "San Francisco": 200,
  "Rio de Janeiro": 75, "Sydney": 170, "Cape Town": 85, "Cairo": 55
};

const recommendedDestinations = [
  { name: "Paris", country: "France", costIndex: "$$$", tag: "Culture & Cuisine" },
  { name: "Tokyo", country: "Japan", costIndex: "$$$$", tag: "Modern & Heritage" },
  { name: "Rome", country: "Italy", costIndex: "$$$", tag: "Ancient History" },
  { name: "Interlaken", country: "Switzerland", costIndex: "$$$$", tag: "Alpine Adventure" },
  { name: "Barcelona", country: "Spain", costIndex: "$$", tag: "Architecture & Beach" },
  { name: "Kyoto", country: "Japan", costIndex: "$$$", tag: "Shrines & Nature" }
];

function getTrips() {
  const data = localStorage.getItem('globetrotter_trips');
  if (!data) {
    localStorage.setItem('globetrotter_trips', JSON.stringify(defaultTrips));
    return defaultTrips;
  }
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : defaultTrips;
  } catch (e) {
    return defaultTrips;
  }
}

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
  const totalDays = trip.durationDays || calculateDays(trip.startDate, trip.endDate);
  const stops = trip.stops || [];

  let staysCost = 0;
  let transitCost = Math.max(200, stops.length * 120);
  let activitiesCost = 0;
  let foodCost = totalDays * 45;

  stops.forEach(stop => {
    const days = calculateDays(stop.startDate, stop.endDate);
    const dailyRate = cityDailyEst[stop.city] || 150;
    staysCost += days * dailyRate;
    activitiesCost += (stop.activities || []).length * 35;
  });

  if (staysCost === 0) staysCost = totalDays * 120;
  if (activitiesCost === 0) activitiesCost = 140;

  const total = staysCost + transitCost + activitiesCost + foodCost;
  return { total, totalDays };
}

function renderTripTicket(trip, index) {
  const stopCount = (trip.stops && trip.stops.length) || 1;
  const days = trip.durationDays || calculateDays(trip.startDate, trip.endDate);
  const costInfo = estimateTripCost(trip);
  const formattedDates = formatDateRange(trip.startDate, trip.endDate);
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
    <div class="card dest-card" onclick="window.location.href='city-search.html'">
      <div class="dest-name">${city.name}</div>
      <div class="dest-meta">${city.country} &bull; ${city.tag}</div>
      <span class="dest-badge">Cost index: ${city.costIndex}</span>
    </div>`;
}

function loadDashboard() {
  // Populate user name if span is present
  document.querySelectorAll('[data-user-name]').forEach(el => {
    el.textContent = 'Traveler';
  });

  const trips = getTrips();

  // 1. Populate Recent Trips
  const tripsContainer = document.getElementById('trips-list');
  if (tripsContainer) {
    if (!trips || trips.length === 0) {
      tripsContainer.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1; text-align:center; padding: 40px 20px;">
          <p class="muted" style="margin-bottom: 12px;">No trips yet — your next journey starts here.</p>
          <a href="create-trip.html" class="btn btn-primary btn-sm">Plan your first trip</a>
        </div>`;
    } else {
      const recent = trips.slice(0, 3);
      tripsContainer.innerHTML = recent.map((t, idx) => renderTripTicket(t, idx)).join('');
    }
  }

  // 2. Populate Budget Highlights
  const budgetContainer = document.getElementById('budget-stats');
  if (budgetContainer) {
    if (!trips || trips.length === 0) {
      budgetContainer.innerHTML = `
        <div class="card stat">
          <div class="stat-value">$0</div>
          <div class="stat-label">Total planned spend</div>
        </div>
        <div class="card stat">
          <div class="stat-value">0</div>
          <div class="stat-label">Trips planned</div>
        </div>
        <div class="card stat">
          <div class="stat-value">$0</div>
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
          <div class="stat-value ok">${currency(grandTotal)}</div>
          <div class="stat-label">Total planned spend</div>
        </div>
        <div class="card stat">
          <div class="stat-value">${trips.length}</div>
          <div class="stat-label">Active & planned trips</div>
        </div>
        <div class="card stat">
          <div class="stat-value ok">${currency(avgDaily)}</div>
          <div class="stat-label">Avg. cost / day</div>
        </div>`;
    }
  }

  // 3. Populate Recommended Destinations
  const recommendedContainer = document.getElementById('recommended-list');
  if (recommendedContainer) {
    recommendedContainer.innerHTML = recommendedDestinations.map(renderDestCard).join('');
  }
}

document.addEventListener('DOMContentLoaded', loadDashboard);
