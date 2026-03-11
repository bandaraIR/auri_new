const jwt = require("jsonwebtoken");

// ── Verify JWT ────────────────────────────────────────────────────────────────
const protect = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized. No token." });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id:   decoded.sub || decoded.id,
      role: decoded.role,
    };

    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid/expired token." });
  }
};

// ── Admin only ────────────────────────────────────────────────────────────────
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Access denied. Admins only." });
};

module.exports = { protect, adminOnly };