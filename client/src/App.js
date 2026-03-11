// App.js - UPDATED VERSION
import React from "react";
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
    </div>
  );
}

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