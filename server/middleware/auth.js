const jwt = require('jsonwebtoken');
require('dotenv').config();  // Important!

function auth(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: "No token, access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (err) {
    return res.status(400).json({ error: "Invalid token" });
  }
}

module.exports = auth;
