const router = require("express").Router();
const asyncHandler = require("../utils/asyncHandler");
const { signup, login, googleCallback, deleteAccount } = require("../controllers/auth.controller");
const passport = require("passport");
const { protect } = require("../middleware/auth");
const User = require("../models/User");

router.post("/signup", asyncHandler(signup));
router.post("/login", asyncHandler(login)); // ✅ works now
router.delete("/delete-account", protect, deleteAccount);

// Google OAuth start
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: true, failureRedirect: "/login" }),
  asyncHandler(googleCallback)
);

// Get current logged-in user (used after Google OAuth)
router.get(
  "/me",
  protect,
  asyncHandler(async (req, res) => {
    const userId = req.user?._id || req.user?.id || req.user?.sub;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId).select(
      "firstName lastName email role avatar googleId"
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({
      user: {
        id: user._id.toString(),
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        role: user.role || "user",
        avatar: user.avatar || "",
        googleId: user.googleId || "",
      },
    });
  })
);

module.exports = router;