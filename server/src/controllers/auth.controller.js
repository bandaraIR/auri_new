const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const User = require("../models/User");

const signToken = (user) =>
  jwt.sign(
    { sub: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

exports.signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Basic validation
  const errors = [];
  if (!firstName?.trim()) errors.push({ field: "firstName", message: "First name is required" });
  if (!lastName?.trim()) errors.push({ field: "lastName", message: "Last name is required" });

  if (!email?.trim()) errors.push({ field: "email", message: "Email is required" });
  else if (!validator.isEmail(email)) errors.push({ field: "email", message: "Email is invalid" });

  if (!password) errors.push({ field: "password", message: "Password is required" });
  else if (password.length < 6) errors.push({ field: "password", message: "Password must be at least 6 characters" });

  if (errors.length) return res.status(400).json({ message: "Validation failed", errors });

  // Check existing
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return res.status(409).json({ message: "Email already in use", errors: [{ field: "email", message: "Email already in use" }] });

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.toLowerCase().trim(),
    passwordHash,
  });

  const token = signToken(user);

  return res.status(201).json({
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
    token,
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const errors = [];
  if (!email?.trim()) errors.push({ field: "email", message: "Email is required" });
  if (!password) errors.push({ field: "password", message: "Password is required" });

  if (errors.length) return res.status(400).json({ message: "Validation failed", errors });

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) return res.status(401).json({ message: "Invalid email or password" });

  // If this account was created via Google, it won't have a password
  if (!user.passwordHash) {
    return res.status(401).json({ message: "This account uses Google Sign-In. Please login with Google." });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid email or password" });

  const token = signToken(user);

  return res.status(200).json({
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    },
    token,
  });
};

// ✅ Google OAuth callback success handler (req.user is set by Passport)
exports.googleCallback = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Google authentication failed" });

    const token = signToken(user);

    // Redirect back to client with token and user info (client can store token and user)
    const base = process.env.CLIENT_URL || "http://localhost:3000";
    const query = new URLSearchParams({
      token,
      id: user._id.toString(),
      email: user.email || "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      role: user.role || "user"
    }).toString();

    return res.redirect(`${base}/oauth-success?${query}`);
  } catch (err) {
    console.error("googleCallback error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Delete logged-in user account
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.sub || req.user._id || req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent accidental admin deletion
    if (user.role === "admin") {
      return res.status(403).json({ message: "Admin account cannot be deleted." });
    }

    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      message: "Account deleted successfully"
    });

  } catch (err) {
    console.error("deleteAccount error:", err);
    return res.status(500).json({
      message: "Failed to delete account"
    });
  }
};