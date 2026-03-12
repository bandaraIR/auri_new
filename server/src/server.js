const express = require("express");
const cors = require("cors");
require("dotenv").config();
const session = require("express-session");
const passport = require("passport");
const initPassport = require("./config/passport");

console.log("Cloudinary loaded:", {
  cloud: process.env.CLOUDINARY_CLOUD_NAME,
  keyLast4: process.env.CLOUDINARY_API_KEY?.slice(-4),
  secretLast4: process.env.CLOUDINARY_API_SECRET?.slice(-4),
});

const connectDB = require("./config/db");
connectDB();

const app = express();
const allowedOrigins = [
  "http://localhost:3000",
  "https://auri-new.vercel.app",
  "https://auri.lk",
  "https://www.auri.lk",
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session for OAuth
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

// Initialize Passport
initPassport();
app.use(passport.initialize());
app.use(passport.session());

const authRoutes    = require("./routes/auth.routes");
const adminRoutes   = require("./routes/admin.routes");
const productRoutes = require("./routes/productRoutes");   // ✅ add this
const orderRoutes = require ("./routes/orderRoutes");

app.use("/api/auth",     authRoutes);
app.use("/api/admin",    adminRoutes);
app.use("/api/products", productRoutes);                   // ✅ add this
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.json({ ok: true, message: "AURI API running ✅  use /api/health" });
});

app.use((err, req, res, next) => {
  console.error("❌ API Error:", err);
  res.status(500).json({ message: "Server error" });
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () =>
  console.log(`🚀 API running on http://localhost:${PORT}`)
);
