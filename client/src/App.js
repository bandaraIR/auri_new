// App.js - WITH FLOATING MUSIC BUTTON
import React, { useState, useRef, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import HeroSection from "./pages/HeroSection";
import About from "./pages/About";
import Footer from "./pages/Footer";
import Dress from "./pages/Dress";
import CasualCollection from "./pages/CasualCollection";
import JewelryCollection from "./pages/JewelryCollection";
import OAuthSuccess from "./pages/OAuthSuccess";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import CartPage from "./pages/CartPage";
import ScrollToTop from "./pages/ScrollToTop";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AddProduct from "./pages/Admin/AddProduct";
import AdminProducts from "./pages/Admin/AdminProduct";
import EditProduct from "./pages/Admin/EditProduct";
import AdminRoute from "./routes/AdminRoute";
import "./App.css";

// ── Floating Music Button ─────────────────────────────────────────────────────
const MusicButton = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Show button after 2 seconds
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/music/Silk Display.mp3" loop />

      <button
        onClick={toggleMusic}
        title={isPlaying ? "Pause Music" : "Play Music"}
        style={{
          position:     "fixed",
          bottom:       "30px",
          right:        "30px",
          width:        "48px",
          height:       "48px",
          borderRadius: "50%",
          background:   "#000",
          color:        "#fff",
          border:       "none",
          cursor:       "pointer",
          display:      "flex",
          alignItems:   "center",
          justifyContent: "center",
          fontSize:     "18px",
          boxShadow:    "0 4px 20px rgba(0,0,0,0.3)",
          zIndex:       9999,
          opacity:      isVisible ? 1 : 0,
          transform:    isVisible ? "scale(1)" : "scale(0.5)",
          transition:   "opacity 0.5s ease, transform 0.5s ease",
        }}
      >
        {isPlaying ? "⏸" : "♪"}
      </button>
    </>
  );
};

// ── App Layout ────────────────────────────────────────────────────────────────
function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const hideNavbar =
    isAdminRoute ||
    location.pathname === "/profile" ||
    location.pathname === "/cart";

  return (
    <div className="app">
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroSection />
              <Dress />
              <About />
            </>
          }
        />

        <Route path="/collection" element={<Dress />} />
        <Route path="/about" element={<About />} />
        <Route path="/summer-collection" element={<Dress />} />
        <Route path="/casual-collection" element={<CasualCollection />} />
        <Route path="/jewelry-collection" element={<JewelryCollection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/add-product" element={<AddProduct />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/edit-product/:id" element={<EditProduct />} />
        </Route>
      </Routes>

      {!isAdminRoute && <Footer />}

      {/* Music button — hidden on admin pages */}
      {!isAdminRoute && <MusicButton />}
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <AppLayout />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;