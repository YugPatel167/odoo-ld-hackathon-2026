/* ==========================================================================
   GlobeTrotter — Dashboard logic
   Expects three backend endpoints (see server/routes-example.js):
     GET /api/trips?limit=3&sort=upcoming
     GET /api/budget/summary
     GET /api/cities/recommended?limit=6
   ========================================================================== */

function daysBetween(a, b) {
  return Math.max(1, Math.round((new Date(b) - new Date(a)) / (1000 * 60 * 60 * 24)));
}
function formatDateRange(start, end) {
  const opts = { month: "short", day: "numeric" };
  return `${new Date(start).toLocaleDateString(undefined, opts)} – ${new Date(end).toLocaleDateString(undefined, opts)}`;
}
function currency(n) {
  return `$${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function renderTripTicket(trip) {
  const pct = trip.budget_total ? Math.min(100, Math.round((trip.spent_total / trip.budget_total) * 100)) : 0;
  const over = trip.spent_total > trip.budget_total;
  return `
    <a class="ticket" href="itinerary.html?trip=${trip.id}" style="text-decoration:none; color:inherit;">
      <div class="ticket-main">
        <h3>${trip.name}</h3>
        <div class="ticket-route">
          <span>${trip.stop_count || 0} stop${trip.stop_count === 1 ? "" : "s"}</span>
          <span class="line"></span>
          <span>${daysBetween(trip.start_date, trip.end_date)}d</span>
        </div>
        <div class="muted" style="font-size:0.85rem;">${formatDateRange(trip.start_date, trip.end_date)}</div>
        <div class="ticket-budget">
          <div class="progress"><div class="progress-bar ${over ? "over" : ""}" style="width:${pct}%"></div></div>
          <div class="muted" style="font-size:0.78rem; margin-top:4px;">${currency(trip.spent_total)} of ${currency(trip.budget_total)}</div>
        </div>
      </div>
      <div class="ticket-stub">
        <span class="stub-label">Trip</span>
        <span class="stub-value">#${String(trip.id).padStart(3, "0")}</span>
      </div>
    </a>`;
}

function renderDestCard(city) {
  return `
    <div class="card dest-card">
      <div class="dest-name">${city.name}</div>
      <div class="dest-meta">${city.country}</div>
      <span class="dest-badge">Cost index ${city.cost_index}</span>
    </div>`;
}

async function loadTrips() {
  const el = document.getElementById("trips-list");
  try {
    const trips = await Api.trips("?limit=3&sort=upcoming");
    if (!trips || trips.length === 0) {
      el.outerHTML = `
        <div class="empty-state" id="trips-list">
          <p>No trips yet — your next journey starts here.</p>
          <a href="create-trip.html" class="btn btn-primary btn-sm">Plan your first trip</a>
        </div>`;
      return;
    }
    el.innerHTML = trips.map(renderTripTicket).join("");
  } catch (e) {
    el.innerHTML = `<div class="empty-state">Couldn't load your trips right now (${e.message}). Try refreshing.</div>`;
  }
}

async function loadBudget() {
  const el = document.getElementById("budget-stats");
  try {
    const s = await Api.budgetSummary();
    el.innerHTML = `
      <div class="card stat">
        <div class="stat-value">${currency(s.total_planned)}</div>
        <div class="stat-label">Total planned spend</div>
      </div>
      <div class="card stat">
        <div class="stat-value">${s.trips_this_year ?? 0}</div>
        <div class="stat-label">Trips this year</div>
      </div>
      <div class="card stat">
        <div class="stat-value">${currency(s.avg_cost_per_day)}</div>
        <div class="stat-label">Avg. cost / day</div>
      </div>`;
  } catch (e) {
    el.innerHTML = `<div class="empty-state" style="grid-column: 1 / -1;">Budget data unavailable (${e.message}).</div>`;
  }
}

async function loadRecommended() {
  const el = document.getElementById("recommended-list");
  try {
    const cities = await Api.recommendedCities(6);
    if (!cities || cities.length === 0) {
      el.innerHTML = `<div class="empty-state">No recommendations yet.</div>`;
      return;
    }
    el.innerHTML = cities.map(renderDestCard).join("");
  } catch (e) {
    el.innerHTML = `<div class="empty-state">Couldn't load destinations (${e.message}).</div>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadTrips();
  loadBudget();
  loadRecommended();
});
