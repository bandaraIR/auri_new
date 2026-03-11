// Navbar.js - UPDATED WITH REAL MONGODB SEARCH
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

const API = process.env.REACT_APP_API_URL || "http://localhost:5050";

// Category → route mapping
const CATEGORY_ROUTES = {
  "Dress":      "/summer-collection",
  "Maxi Dress": "/casual-collection",
  "Juwellery":  "/jewelry-collection",
};

const Navbar = () => {
  const [scrolled, setScrolled]         = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen]     = useState(false);
  const [searchQuery, setSearchQuery]   = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError]   = useState("");
  const [cartOpen, setCartOpen]         = useState(false);
  const [profileOpen, setProfileOpen]   = useState(false);

  const navigate   = useNavigate();
  const location   = useLocation();
  const searchRef  = useRef(null);
  const debounceRef = useRef(null);

  const { cart, getCartCount, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  // ── Scroll listener ──────────────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Click outside to close dropdowns ────────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchOpen  && !e.target.closest(".nav-search-container"))  setSearchOpen(false);
      if (cartOpen    && !e.target.closest(".nav-cart-container"))    setCartOpen(false);
      if (profileOpen && !e.target.closest(".nav-profile-container")) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchOpen, cartOpen, profileOpen]);

  // ── Real MongoDB search with debounce ────────────────────────────────────────
  const searchProducts = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearchError("");
      return;
    }

    try {
      setSearchLoading(true);
      setSearchError("");

      // Search by name/description using the text search endpoint
      const res  = await fetch(
        `${API}/api/products?search=${encodeURIComponent(query)}&limit=8`
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Search failed");

      // If text search returns nothing, try category match
      let results = data.products || [];

      if (results.length === 0) {
        // Fallback: fetch all and filter client-side by name/category
        const res2  = await fetch(`${API}/api/products?limit=100`);
        const data2 = await res2.json();
        const q = query.toLowerCase();
        results = (data2.products || []).filter(p =>
          p.name.toLowerCase().includes(q)        ||
          p.category.toLowerCase().includes(q)    ||
          p.description?.toLowerCase().includes(q)||
          p.colors?.some(c => c.toLowerCase().includes(q)) ||
          p.sizes?.some(s => s.toLowerCase().includes(q))
        );
      }

      setSearchResults(results.slice(0, 6));
    } catch (err) {
      setSearchError("Search failed. Try again.");
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  // Debounce search — wait 350ms after user stops typing
  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    debounceRef.current = setTimeout(() => {
      searchProducts(searchQuery);
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [searchQuery, searchProducts]);

  // ── Navigate to product's collection page ─────────────────────────────────
  const handleProductClick = (product) => {
    const route = CATEGORY_ROUTES[product.category] || "/summer-collection";
    navigate(route);
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  // ── Search submit (Enter key / button) ───────────────────────────────────
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      handleProductClick(searchResults[0]);
    }
  };

  // ── Toggle handlers ───────────────────────────────────────────────────────
  const handleSearchToggle = () => {
    const next = !searchOpen;
    setSearchOpen(next);
    if (!next) { setSearchQuery(""); setSearchResults([]); setSearchError(""); }
    setCartOpen(false);
    setProfileOpen(false);
  };

  const handleCartToggle = () => {
    setCartOpen(c => !c);
    setSearchOpen(false);
    setProfileOpen(false);
  };

  const handleProfileToggle = () => {
    setProfileOpen(p => !p);
    setSearchOpen(false);
    setCartOpen(false);
  };

  // ── Cart helpers ───────────────────────────────────────────────────────────
  const handleIncreaseQuantity = (item) => updateQuantity(item, item.quantity + 1);
  const handleDecreaseQuantity = (item) => {
    if (item.quantity > 1) updateQuantity(item, item.quantity - 1);
    else removeFromCart(item);
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const goToSection = (id) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } else {
      scrollToSection(id);
    }
    setMobileMenuOpen(false);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <motion.nav
      className={`nav-main ${scrolled ? "scrolled" : ""}`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="nav-main-container">
        <motion.h1
          className="nav-logo"
          whileHover={{ scale: 1.05 }}
          onClick={() => goToSection("home")}
          style={{ cursor: "pointer" }}
        >
          AURI
        </motion.h1>

        <ul className={`nav-main-links ${mobileMenuOpen ? "active" : ""}`}>
          <li>
            <a
              href="#home"
              onClick={e => {
                e.preventDefault();
                goToSection("home");
              }}
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#collection"
              onClick={e => {
                e.preventDefault();
                goToSection("collection");
              }}
            >
              Collection
            </a>
          </li>
          <li>
            <a
              href="#about"
              onClick={e => {
                e.preventDefault();
                goToSection("about");
              }}
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#contact"
              onClick={e => {
                e.preventDefault();
                goToSection("contact");
              }}
            >
              Contact
            </a>
          </li>
        </ul>

        <div className="nav-main-actions">

          {/* ── Search ── */}
          <div className="nav-search-container" ref={searchRef}>
            <button
              className={`nav-search-btn ${searchOpen ? "active" : ""}`}
              onClick={handleSearchToggle}
            >
              <i className="fas fa-search" />
            </button>

            <AnimatePresence>
              {searchOpen && (
                <motion.div
                  className="nav-search-bar"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <form onSubmit={handleSearchSubmit}>
                    <input
                      type="text"
                      placeholder="Search products, colors, sizes…"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      autoFocus
                      className="nav-search-input"
                    />
                    <button type="submit" className="nav-search-submit">
                      {searchLoading
                        ? <span className="nav-search-spinner" />
                        : <i className="fas fa-arrow-right" />}
                    </button>
                  </form>

                  {/* Results */}
                  <AnimatePresence>
                    {searchResults.length > 0 && (
                      <motion.div
                        className="nav-search-results"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {searchResults.map(product => (
                          <div
                            key={product._id}
                            className="nav-search-result-item"
                            onClick={() => handleProductClick(product)}
                          >
                            <img
                              src={product.images?.[0]?.url || "https://via.placeholder.com/60x60?text=No+Img"}
                              alt={product.name}
                            />
                            <div className="nav-result-info">
                              <h4>{product.name}</h4>
                              <p>${Number(product.price).toFixed(2)} · {product.category}</p>
                            </div>
                            {product.stock === 0 && (
                              <span className="nav-result-oos">Out of stock</span>
                            )}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* No results */}
                  {searchQuery && !searchLoading && searchResults.length === 0 && !searchError && (
                    <motion.div
                      className="nav-search-no-results"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      No products found for "<strong>{searchQuery}</strong>"
                    </motion.div>
                  )}

                  {/* Error */}
                  {searchError && (
                    <div className="nav-search-error">{searchError}</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Cart ── */}
          <div className="nav-cart-container">
            <button
              className={`nav-cart-btn ${cartOpen ? "active" : ""}`}
              onClick={handleCartToggle}
            >
              <i className="fas fa-shopping-bag" />
              <span className="nav-cart-count">{getCartCount()}</span>
            </button>

            <AnimatePresence>
              {cartOpen && (
                <motion.div
                  className="nav-cart-dropdown"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="nav-cart-header">
                    <h3>Shopping Cart ({getCartCount()} items)</h3>
                  </div>

                  <div className="nav-cart-items">
                    {cart.items.length === 0 ? (
                      <div className="nav-empty-cart"><p>Your cart is empty</p></div>
                    ) : (
                      cart.items.map(item => (
                        <div
                          key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                          className="nav-cart-item"
                        >
                          <img src={item.img} alt={item.title} />
                          <div className="nav-cart-item-info">
                            <h4>{item.title}</h4>
                            <p>{item.selectedSize} · {item.selectedColor}</p>
                            <p className="nav-cart-item-price">{item.price}</p>
                          </div>
                          <div className="nav-cart-item-actions">
                            <div className="nav-quantity-controls">
                              <button onClick={() => handleDecreaseQuantity(item)}>-</button>
                              <span>{item.quantity}</span>
                              <button onClick={() => handleIncreaseQuantity(item)}>+</button>
                            </div>
                            <button
                              className="nav-remove-btn"
                              onClick={() => removeFromCart(item)}
                              title="Remove item"
                            >×</button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {cart.items.length > 0 && (
                    <div className="nav-cart-footer">
                      <div className="nav-cart-total">
                        <strong>Total: ${getCartTotal().toFixed(2)}</strong>
                      </div>
                      <button
                        className="nav-checkout-btn"
                        onClick={() => { setCartOpen(false); navigate("/cart") }}
                      >
                        Proceed to Checkout
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Profile ── */}
          <div className="nav-profile-container">
            <button
              className={`nav-profile-btn ${profileOpen ? "active" : ""}`}
              onClick={handleProfileToggle}
            >
              <i className="fas fa-user" />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  className="nav-profile-dropdown"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {isAuthenticated ? (
                    <>
                      <div className="nav-profile-header">
                        <h3>Welcome, {user?.firstName || "User"}!</h3>
                        <p>{user?.email}</p>
                      </div>
                      <div className="nav-profile-menu">
                        <button className="nav-profile-item" onClick={() => { setProfileOpen(false); navigate("/profile"); }}>
                          <i className="fas fa-user-circle" /> My Profile
                        </button>
                        <button
                          className="nav-profile-item nav-profile-logout"
                          onClick={() => {
                            clearCart();
                            logout();
                            setProfileOpen(false);
                            navigate("/");
                          }}
                        >
                          <i className="fas fa-sign-out-alt" /> Logout
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="nav-profile-menu">
                      <button className="nav-profile-item" onClick={() => { setProfileOpen(false); navigate("/login"); }}>
                        <i className="fas fa-sign-in-alt" /> Login
                      </button>
                      <button className="nav-profile-item" onClick={() => { setProfileOpen(false); navigate("/signup"); }}>
                        <i className="fas fa-user-plus" /> Sign Up
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile menu toggle */}
          <button
            className={`nav-mobile-menu-btn ${mobileMenuOpen ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(m => !m)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;