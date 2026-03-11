// JewelryCollection.js - UPDATED (REMOVED STYLE CATEGORIES)
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/JewelryCollection.css";

const jewelryItems = [
  { 
    id: 1, 
    title: "Stackable Gold Rings", 
    price: "$299", 
    img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80", 
    category: "necklace",
    style: "elegant",
    description: "Exquisite diamond solitaire necklace that captures the essence of timeless elegance. Perfect for special occasions.",
    sizes: ["16\"", "18\"", "20\""],
    colors: ["White Gold", "Yellow Gold", "Rose Gold"],
    material: "14K Gold, Diamond",
    care: "Store separately, avoid chemicals"
  },
  { 
    id: 2, 
    title: "Pearl Drop Earrings", 
    price: "$159", 
    img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80", 
    category: "earrings",
    style: "classic",
    description: "Elegant freshwater pearl drop earrings that add sophistication to any outfit. Lightweight and comfortable.",
    sizes: ["Small", "Medium", "Large"],
    colors: ["White Pearl", "Pink Pearl", "Silver"],
    material: "Sterling Silver, Freshwater Pearls",
    care: "Wipe with soft cloth after wear"
  },
  { 
    id: 3, 
    title: "Diamond Soliteire Necklece", 
    price: "$89", 
    img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80", 
    category: "rings",
    style: "minimalist",
    description: "Set of three delicate stackable rings. Mix and match to create your unique combination.",
    sizes: ["Size 5", "Size 6", "Size 7", "Size 8"],
    colors: ["Yellow Gold", "White Gold", "Rose Gold"],
    material: "14K Gold Plated",
    care: "Remove when washing hands"
  },
];

const JewelryCollection = () => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const openQuickView = (item) => {
    setSelectedItem(item);
    setSelectedSize("");
    setSelectedColor("");
  };

  const closeQuickView = () => {
    setSelectedItem(null);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    if (!selectedColor) {
      alert("Please select a color");
      return;
    }
    alert(`Added ${selectedItem.title} (${selectedSize}, ${selectedColor}) to cart!`);
    closeQuickView();
  };

  return (
    <section className="jewelry-collection">
      <div className="jc-container">
        {/* Header Section */}
        <div className="jc-collection-header">
          <motion.button 
            className="jc-back-button"
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Back to All Collections
          </motion.button>
          
          <div className="jc-header-content">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Jewelry Collection
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Discover exquisite pieces that add sparkle to every moment. From timeless classics to modern statements, find jewelry that tells your story.
            </motion.p>
          </div>
        </div>

        {/* Collection Grid */}
        <motion.div 
          className="jc-jewelry-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {jewelryItems.map((item) => (
            <motion.div
              key={item.id}
              className="jc-jewelry-card"
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="jc-card-image">
                <img src={item.img} alt={item.title} />
                <div className="jc-card-overlay">
                  <motion.button 
                    className="jc-quick-view-btn"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => openQuickView(item)}
                  >
                    Quick View
                  </motion.button>
                </div>
                <div className="jc-category-badge">
                  {item.category}
                </div>
                <div className="jc-style-badge">
                  {item.style}
                </div>
              </div>
              <div className="jc-card-content">
                <h3>{item.title}</h3>
                <p className="jc-price">{item.price}</p>
                <motion.button 
                  className="jc-add-to-cart-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add to Cart
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Jewelry Features */}
        <motion.div 
          className="jc-jewelry-info"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="jc-info-card">
            <h3>💎 Premium Quality</h3>
            <p>Each piece is crafted with attention to detail using high-quality materials including genuine gemstones, sterling silver, and gold plating.</p>
          </div>
          <div className="jc-info-card">
            <h3>✨ Timeless Designs</h3>
            <p>Our jewelry collection features both classic and contemporary designs that transcend trends and become cherished pieces in your collection.</p>
          </div>
          <div className="jc-info-card">
            <h3>🎁 Perfect Gifting</h3>
            <p>Every item comes beautifully packaged, making them perfect gifts for loved ones or special treats for yourself.</p>
          </div>
        </motion.div>
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="jc-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeQuickView}
          >
            <motion.div
              className="jc-quick-view-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="jc-close-button" onClick={closeQuickView}>
                ×
              </button>
              
              <div className="jc-modal-content">
                <div className="jc-modal-image-section">
                  <div className="jc-image-container">
                    <img src={selectedItem.img} alt={selectedItem.title} />
                    <div className="jc-image-overlay">
                      <div className="jc-image-badges">
                        <span className="jc-category-badge">{selectedItem.category}</span>
                        <span className="jc-style-badge">{selectedItem.style}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="jc-modal-details">
                  <div className="jc-detail-header">
                    <h2>{selectedItem.title}</h2>
                    <p className="jc-modal-price">{selectedItem.price}</p>
                  </div>
                  
                  <p className="jc-modal-description">{selectedItem.description}</p>
                  
                  <div className="jc-selection-sections">
                    <div className="jc-detail-section">
                      <h4>Select Size</h4>
                      <div className="jc-size-options">
                        {selectedItem.sizes.map((size) => (
                          <button
                            key={size}
                            className={`jc-size-btn ${selectedSize === size ? 'selected' : ''}`}
                            onClick={() => setSelectedSize(size)}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="jc-detail-section">
                      <h4>Select Color/Material</h4>
                      <div className="jc-color-options">
                        {selectedItem.colors.map((color) => (
                          <button
                            key={color}
                            className={`jc-color-btn ${selectedColor === color ? 'selected' : ''}`}
                            onClick={() => setSelectedColor(color)}
                          >
                            <span className="jc-color-dot"></span>
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="jc-product-info-card">
                    <h4>Product Details</h4>
                    <div className="jc-info-grid">
                      <div className="jc-info-item">
                        <div className="jc-info-icon">💎</div>
                        <div className="jc-info-content">
                          <div className="jc-info-label">Material</div>
                          <div className="jc-info-value">{selectedItem.material}</div>
                        </div>
                      </div>
                      <div className="jc-info-item">
                        <div className="jc-info-icon">🔧</div>
                        <div className="jc-info-content">
                          <div className="jc-info-label">Care Instructions</div>
                          <div className="jc-info-value">{selectedItem.care}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="jc-action-buttons">
                    <motion.button 
                      className="jc-modal-add-to-cart"
                      onClick={handleAddToCart}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="jc-cart-icon">🛒</span>
                      Add to Cart - {selectedItem.price}
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

export default JewelryCollection;