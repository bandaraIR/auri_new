const router = require("express").Router();
const asyncHandler = require("../utils/asyncHandler");

const { protect } = require("../middleware/auth");  // ← fixed import
const admin = require("../middleware/admin");

const { getAdminMe, listUsers, makeAdmin } = require("../controllers/admin.controller");

// ✅ admin test route
router.get("/me", protect, admin, asyncHandler(getAdminMe));

// ✅ admin utilities
router.get("/users", protect, admin, asyncHandler(listUsers));
router.patch("/users/:userId/make-admin", protect, admin, asyncHandler(makeAdmin));

module.exports = router;