/* ==========================================================================
   GlobeTrotter — Example Express routes (give this shape to your backend dev)
   Assumes: npm i express mysql2 bcrypt jsonwebtoken cookie-parser cors
   These match exactly what js/api.js calls. Adjust table/column names to
   whatever the DB teammate actually built, but keep the response shapes.
   ========================================================================== */

const express = require("express");
const router = express.Router();
const pool = require("./db"); // a mysql2/promise createPool() instance
const { requireAuth } = require("./auth"); // middleware reading the session cookie

/* GET /api/me — current logged-in user, used to fill nav avatar/name */
router.get("/me", requireAuth, async (req, res) => {
  const [[user]] = await pool.query(
    "SELECT id, name, email FROM users WHERE id = ?",
    [req.userId]
  );
  if (!user) return res.status(401).json({ error: "Not logged in" });
  res.json(user);
});

/* GET /api/trips?limit=3&sort=upcoming — dashboard trip tickets */
router.get("/trips", requireAuth, async (req, res) => {
  const limit = Number(req.query.limit) || 20;
  const [trips] = await pool.query(
    `SELECT t.id, t.name, t.start_date, t.end_date,
            COUNT(DISTINCT s.id) AS stop_count,
            COALESCE(SUM(sa.cost), 0) AS spent_total,
            t.budget_total
     FROM trips t
     LEFT JOIN stops s ON s.trip_id = t.id
     LEFT JOIN stop_activities sa ON sa.stop_id = s.id
     WHERE t.user_id = ?
     GROUP BY t.id
     ORDER BY t.start_date ASC
     LIMIT ?`,
    [req.userId, limit]
  );
  res.json(trips);
});

/* GET /api/budget/summary — three stat cards on the dashboard */
router.get("/budget/summary", requireAuth, async (req, res) => {
  const [[row]] = await pool.query(
    `SELECT
        COALESCE(SUM(t.budget_total), 0) AS total_planned,
        COUNT(DISTINCT CASE WHEN YEAR(t.start_date) = YEAR(CURDATE()) THEN t.id END) AS trips_this_year
     FROM trips t WHERE t.user_id = ?`,
    [req.userId]
  );
  const [[days]] = await pool.query(
    `SELECT COALESCE(SUM(DATEDIFF(end_date, start_date)), 0) AS total_days FROM trips WHERE user_id = ?`,
    [req.userId]
  );
  const avg = days.total_days > 0 ? row.total_planned / days.total_days : 0;
  res.json({
    total_planned: row.total_planned,
    trips_this_year: row.trips_this_year,
    avg_cost_per_day: Math.round(avg),
  });
});

/* GET /api/cities/recommended?limit=6 — seeded master data, simplest possible query */
router.get("/cities/recommended", async (req, res) => {
  const limit = Number(req.query.limit) || 6;
  const [cities] = await pool.query(
    `SELECT id, name, country, cost_index FROM cities ORDER BY popularity DESC LIMIT ?`,
    [limit]
  );
  res.json(cities);
});

/* POST /api/logout — clears the session cookie */
router.post("/logout", requireAuth, (req, res) => {
  res.clearCookie("session_token");
  res.json({ ok: true });
});

/* POST /api/contact — stores a contact message (or just email it, up to you) */
router.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: "Missing fields" });
  await pool.query(
    "INSERT INTO contact_messages (name, email, message, created_at) VALUES (?, ?, ?, NOW())",
    [name, email, message]
  );
  res.json({ ok: true });
});

module.exports = router;

/* ==========================================================================
   Minimal matching MySQL schema for reference — hand to your DB teammate
   ==========================================================================

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  country VARCHAR(120) NOT NULL,
  cost_index INT DEFAULT 50,
  popularity INT DEFAULT 0
);

CREATE TABLE trips (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(160) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  description TEXT,
  budget_total DECIMAL(10,2) DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE stops (
  id INT AUTO_INCREMENT PRIMARY KEY,
  trip_id INT NOT NULL,
  city_id INT NOT NULL,
  arrival_date DATE,
  departure_date DATE,
  sequence INT DEFAULT 0,
  FOREIGN KEY (trip_id) REFERENCES trips(id),
  FOREIGN KEY (city_id) REFERENCES cities(id)
);

CREATE TABLE activities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  city_id INT NOT NULL,
  name VARCHAR(160) NOT NULL,
  type VARCHAR(60),
  cost DECIMAL(10,2) DEFAULT 0,
  duration_minutes INT,
  FOREIGN KEY (city_id) REFERENCES cities(id)
);

CREATE TABLE stop_activities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  stop_id INT NOT NULL,
  activity_id INT NOT NULL,
  scheduled_date DATE,
  cost DECIMAL(10,2) DEFAULT 0,
  FOREIGN KEY (stop_id) REFERENCES stops(id),
  FOREIGN KEY (activity_id) REFERENCES activities(id)
);

CREATE TABLE contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120),
  email VARCHAR(160),
  message TEXT,
  created_at DATETIME
);
*/
