import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/Dress.css";

const API = process.env.REACT_APP_API_URL || "http://localhost:5050";

// ── Color name → hex (shared with admin panel) ────────────────────────────────
const COLOR_MAP = {
  Black: "#1a1a1a", White: "#efefef", Red: "#ef4444", Blue: "#3b82f6",
  Green: "#22c55e", Pink: "#ec4899", Yellow: "#eab308", Coral: "#f97316",
  Navy:  "#1e3a5f", Mint:  "#6ee7b7",
};

// ── Skeleton card ─────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="summer-card sc-skeleton">
    <div className="sc-sk-img" />
    <div className="card-content">
      <div className="sc-sk-line sc-sk-long" />
      <div className="sc-sk-line sc-sk-short" />
      <div className="sc-sk-btn" />
    </div>
  </div>
);

const SummerCollection = () => {
  const { addToCart } = useCart();

  const [products, setProducts]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState("");
  const [selectedItem, setSelectedItem]   = useState(null);
  const [selectedSize, setSelectedSize]   = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [activeImg, setActiveImg]         = useState(0);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchDresses = async () => {
      try {
        setLoading(true);
        setError("");
        const res  = await fetch(`${API}/api/products?category=Dress&limit=50`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load products");
        setProducts(data.products || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDresses();
  }, []);

  // ── Quick view ────────────────────────────────────────────────────────────
  const openQuickView = (item) => {
    setSelectedItem(item);
    setSelectedSize("");
    setSelectedColor("");
    setActiveImg(0);
    document.body.style.overflow = "hidden";
  };

  const closeQuickView = () => {
    setSelectedItem(null);
    document.body.style.overflow = "";
  };

  // ── Color select → switch image by matching index ─────────────────────────
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    if (!selectedItem) return;
    const idx = selectedItem.colors?.indexOf(color);
    if (idx !== -1 && selectedItem.images?.[idx]?.url) {
      setActiveImg(idx);
    }
    // else: stay on current image
  };

  // ── Add to cart (modal) ───────────────────────────────────────────────────
  const handleAddToCart = () => {
    if (!selectedSize)  { alert("Please select a size");  return; }
    if (!selectedColor) { alert("Please select a color"); return; }
    addToCart({
      id:            selectedItem._id,
      title:         selectedItem.name,
      price:         `Rs ${Number(selectedItem.price).toLocaleString()}`,
      img:           selectedItem.images?.[activeImg]?.url || selectedItem.images?.[0]?.url || "",
      selectedSize,
      selectedColor,
    });
    alert(`Added ${selectedItem.name} (${selectedSize}, ${selectedColor}) to cart!`);
    closeQuickView();
  };

  // ── Direct add to cart (card button) ─────────────────────────────────────
  const handleDirectAddToCart = (item) => {
    addToCart({
      id:            item._id,
      title:         item.name,
      price:         `Rs ${Number(item.price).toLocaleString()}`,
      img:           item.images?.[0]?.url || "",
      selectedSize:  item.sizes?.[0]  || "",
      selectedColor: item.colors?.[0] || "",
    });
    alert(`Added ${item.name} to cart!`);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <section id="collection" className="summer-collection">
      <div className="container">

        {/* Header */}
        <div className="collection-header">
          <div className="header-content">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              Collection
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              Embrace the sunshine with our exclusive dress styles.
            </motion.p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="sc-error">
            ⚠️ {error} —{" "}
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        )}

        {/* Grid */}
        <motion.div
          className="summer-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {loading ? (
            [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
          ) : products.length === 0 ? (
            <div className="sc-empty">No dresses found.</div>
          ) : (
            products.map((item, index) => (
              <motion.div
                key={item._id}
                className="summer-card"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.07 }}
                whileHover={{ y: -6 }}
              >
                <div className="card-image">
                  <img
                    src={item.images?.[0]?.url || "https://via.placeholder.com/400x500?text=No+Image"}
                    alt={item.name}
                  />

                  {/* Color swatches preview on card */}
                  {item.colors?.length > 0 && (
                    <div className="sc-card-colors">
                      {item.colors.slice(0, 5).map(c => (
                        <span
                          key={c}
                          className="sc-card-color-dot"
                          title={c}
                          style={{ background: COLOR_MAP[c] || "#aaa" }}
                        />
                      ))}
                      {item.colors.length > 5 && (
                        <span className="sc-card-color-more">+{item.colors.length - 5}</span>
                      )}
                    </div>
                  )}

                  <div className="card-overlay">
                    <motion.button
                      className="quick-view-btn"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openQuickView(item)}
                    >
                      Quick View
                    </motion.button>
                  </div>

                  {item.stock === 0 && (
                    <div className="sc-out-of-stock-badge">Out of Stock</div>
                  )}
                </div>

                <div className="card-content">
                  <h3>{item.name}</h3>
                  <p className="price">Rs {Number(item.price).toLocaleString()}</p>
                  <motion.button
                    className="add-to-cart-btn"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleDirectAddToCart(item)}
                    disabled={item.stock === 0}
                  >
                    {item.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>

      {/* ── Quick View Modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="sc-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeQuickView}
          >
            <motion.div
              className="sc-quick-view-modal"
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1,    opacity: 1, y: 0  }}
              exit={{    scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="sc-close-button" onClick={closeQuickView}>×</button>

              <div className="sc-modal-content">

                {/* LEFT — image panel */}
                <div className="sc-modal-image-section">
                  <div className="sc-image-container">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={activeImg}
                        src={
                          selectedItem.images?.[activeImg]?.url ||
                          "https://via.placeholder.com/400x500?text=No+Image"
                        }
                        alt={selectedItem.name}
                        initial={{ opacity: 0, scale: 1.04 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{    opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      />
                    </AnimatePresence>
                  </div>


                </div>

                {/* RIGHT — details panel */}
                <div className="sc-modal-details">
                  <div className="sc-detail-header">
                    <h2>{selectedItem.name}</h2>
                    <p className="sc-modal-price">
                      Rs {Number(selectedItem.price).toLocaleString()}
                    </p>
                  </div>

                  <p className="sc-modal-description">{selectedItem.description}</p>

                  <div className="sc-selection-sections">

                    {/* Sizes */}
                    <div className="sc-detail-section">
                      <h4>Select Size</h4>
                      <div className="sc-size-options">
                        {selectedItem.sizes?.map(size => (
                          <button
                            key={size}
                            className={`sc-size-btn ${selectedSize === size ? "selected" : ""}`}
                            onClick={() => setSelectedSize(size)}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Colors — clicking switches main image */}
                    <div className="sc-detail-section">
                      <h4>
                        Select Color
                        {selectedColor && (
                          <span className="sc-selected-color-label"> — {selectedColor}</span>
                        )}
                      </h4>
                      <div className="sc-color-options">
                        {selectedItem.colors?.map((color, i) => (
                          <button
                            key={color}
                            className={`sc-color-btn ${selectedColor === color ? "selected" : ""}`}
                            onClick={() => handleColorSelect(color)}
                            title={selectedItem.images?.[i]?.url ? `View ${color}` : color}
                          >
                            <span
                              className="sc-color-dot"
                              style={{ background: COLOR_MAP[color] || "#aaa" }}
                            />
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Product info */}
                  <div className="sc-product-info-card">
                    <h4>Product Details</h4>
                    <div className="sc-info-grid">
                      {selectedItem.material && (
                        <div className="sc-info-item">
                          <div className="sc-info-icon">🧵</div>
                          <div className="sc-info-content">
                            <div className="sc-info-label">Material</div>
                            <div className="sc-info-value">{selectedItem.material}</div>
                          </div>
                        </div>
                      )}
                      {selectedItem.care && (
                        <div className="sc-info-item">
                          <div className="sc-info-icon">👕</div>
                          <div className="sc-info-content">
                            <div className="sc-info-label">Care</div>
                            <div className="sc-info-value">{selectedItem.care}</div>
                          </div>
                        </div>
                      )}
                      <div className="sc-info-item">
                        <div className="sc-info-icon">📦</div>
                        <div className="sc-info-content">
                          <div className="sc-info-label">In Stock</div>
                          <div className="sc-info-value">{selectedItem.stock ?? 0} units</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="sc-action-buttons">
                    <motion.button
                      className="sc-modal-add-to-cart"
                      onClick={handleAddToCart}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={!selectedSize || !selectedColor || selectedItem.stock === 0}
                    >
                      <span className="sc-cart-icon">🛒</span>
                      {selectedItem.stock === 0
                        ? "Out of Stock"
                        : `Add to Cart — Rs ${Number(selectedItem.price).toLocaleString()}`}
                    </motion.button>
                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default SummerCollection;