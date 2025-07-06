const express = require('express');
const pool = require('../db');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Middleware to extract user from token
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token required" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// CREATE a transaction
router.post('/', authenticate, async (req, res) => {
  const { amount, type, category, date, note } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO transactions (user_id, amount, type, category, date, note)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [req.user.id, amount, type, category, date, note]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ transactions (with optional filters)
router.get('/', authenticate, async (req, res) => {
  const { start, end, type, page = 1, limit = 10 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  let baseQuery = `FROM transactions WHERE user_id = $1`;
  let params = [req.user.id];
  let idx = 2;

  if (type) {
    baseQuery += ` AND type = $${idx++}`;
    params.push(type);
  }
  if (start) {
    baseQuery += ` AND date >= $${idx++}`;
    params.push(start);
  }
  if (end) {
    baseQuery += ` AND date <= $${idx++}`;
    params.push(end);
  }

  try {
    // 🔢 Total count for pagination
    const countRes = await pool.query(`SELECT COUNT(*) ${baseQuery}`, params);
    const total = parseInt(countRes.rows[0].count);
    const totalPages = Math.ceil(total / limit);

    // 📦 Paginated data
    const dataQuery = `SELECT * ${baseQuery} ORDER BY date DESC LIMIT $${idx++} OFFSET $${idx}`;
    const dataParams = [...params, Number(limit), offset];
    const result = await pool.query(dataQuery, dataParams);

    // 📤 Structured JSON response
    res.json({
      transactions: result.rows,
      total,
      page: Number(page),
      totalPages
    });
  } catch (err) {
    console.error('❌ Pagination error:', err);
    res.status(400).json({ error: err.message });
  }
});


// GET all transactions (no pagination) for analytics
router.get('/all', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching all transactions:', err);
    res.status(400).json({ error: err.message });
  }
});



// DELETE a transaction
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await pool.query(
      `DELETE FROM transactions WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );
    res.json({ msg: 'Deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
