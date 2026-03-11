const User = require("../models/User");

// ✅ simple test route: returns current admin info
exports.getAdminMe = async (req, res) => {
  const user = await User.findById(req.user.id).select("-passwordHash");
  if (!user) return res.status(404).json({ message: "User not found" });

  return res.json({ user });
};

// ✅ list users (admin only)
exports.listUsers = async (req, res) => {
  const users = await User.find().select("-passwordHash").sort({ createdAt: -1 });
  return res.json({ users });
};

// ✅ promote user to admin (admin only)
exports.makeAdmin = async (req, res) => {
  const { userId } = req.params;

  const updated = await User.findByIdAndUpdate(
    userId,
    { role: "admin" },
    { new: true }
  ).select("-passwordHash");

  if (!updated) return res.status(404).json({ message: "User not found" });

  return res.json({ message: "User promoted to admin", user: updated });
};