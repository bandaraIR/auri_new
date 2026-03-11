// CasualCollection.js - UPDATED (REMOVED DESCRIPTION)
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/CasualCollection.css";

const casualItems = [
  { 
    id: 1, 
    title: "Weekend Comfort Top", 
    price: "$45", 
    img: "https://plus.unsplash.com/premium_photo-1693242804347-38b4382b3c4d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=987", 
    category: "top",
    style: "casual",
    description: "Soft and comfortable top perfect for weekend relaxation. Made with premium cotton blend for ultimate comfort.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Black", "Navy", "Gray"],
    material: "Cotton Blend",
    care: "Machine wash cold, tumble dry low"
  },
  { 
    id: 2, 
    title: "Relaxed Fit Jeans", 
    price: "$65", 
    img: "https://plus.unsplash.com/premium_photo-1708276238428-4131c56a5487?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1035", 
    category: "pants",
    style: "casual",
    description: "Comfortable jeans with a relaxed fit for all-day wear. Perfect for casual outings and everyday activities.",
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Dark Blue", "Light Blue", "Black"],
    material: "Denim",
    care: "Machine wash cold, hang dry"
  },
  { 
    id: 3, 
    title: "Cozy Sweater", 
    price: "$78", 
    img: "https://images.unsplash.com/photo-1759056911301-59c6f138e397?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNvenklMjBzd2VhdGVyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=900", 
    category: "sweater",
    style: "casual",
    description: "Warm and cozy sweater for chilly days. Features a comfortable fit perfect for layering.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Cream", "Gray", "Navy", "Burgundy"],
    material: "Wool Blend",
    care: "Hand wash recommended, lay flat to dry"
  },
  { 
    id: 4, 
    title: "Everyday T-Shirt", 
    price: "$32", 
    img: "https://plus.unsplash.com/premium_photo-1691367279675-0e466cfb5135?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTgxfHx0LXNoaXJ0c3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=900", 
    category: "top",
    style: "casual",
    description: "Classic t-shirt for everyday casual wear. Made with soft, breathable fabric.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["White", "Black", "Gray", "Navy"],
    material: "100% Cotton",
    care: "Machine wash warm"
  },
  { 
    id: 5, 
    title: "Comfort Joggers", 
    price: "$55", 
    img: "https://plus.unsplash.com/premium_photo-1693242804621-4f8d163abf97?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fGNhc3VhbCUyMGNsb3RoZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=900", 
    category: "pants",
    style: "casual",
    description: "Soft joggers perfect for lounging or casual outings. Features elastic waistband and pockets.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Gray", "Navy", "Olive"],
    material: "French Terry",
    care: "Machine wash cold, tumble dry low"
  },
  { 
    id: 6, 
    title: "Casual Cardigan", 
    price: "$68", 
    img: "https://plus.unsplash.com/premium_photo-1692574096254-4fac86b0c007?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fGNhc3VhbCUyMGNsb3RoZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=900", 
    category: "sweater",
    style: "casual",
    description: "Lightweight cardigan for layering in any season. Perfect for transitioning between temperatures.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Beige", "Gray", "Navy", "Camel"],
    material: "Cotton Blend",
    care: "Machine wash cold, lay flat to dry"
  },
];

const CasualCollection = () => {
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
    <section className="casual-collection">
      <div className="container">
        {/* Header Section */}
        <div className="collection-header">
          <motion.button 
            className="back-button"
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Back to All Collections
          </motion.button>
          
          <div className="header-content">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Maxi Dress Collection
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Comfort meets style in our casual collection. Perfect for everyday wear, relaxed moments, and creating effortless looks that feel as good as they look.
            </motion.p>
          </div>
        </div>

        {/* Collection Grid */}
        <motion.div 
          className="casual-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {casualItems.map((item) => (
            <motion.div
              key={item.id}
              className="casual-card"
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="card-image">
                <img src={item.img} alt={item.title} />
                <div className="card-overlay">
                  <motion.button 
                    className="quick-view-btn"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => openQuickView(item)}
                  >
                    Quick View
                  </motion.button>
                </div>
                <div className="category-badge">
                  {item.category}
                </div>
                <div className="style-badge">
                  {item.style}
                </div>
              </div>
              <div className="card-content">
                <h3>{item.title}</h3>
                <p className="price">{item.price}</p>
                <motion.button 
                  className="add-to-cart-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add to Cart
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Collection Features */}
        <motion.div 
          className="casual-features"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="feature-card">
            <div className="feature-icon">👕</div>
            <h3>Everyday Comfort</h3>
            <p>Designed for maximum comfort without sacrificing style. Perfect for your daily routine.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3>Versatile Styles</h3>
            <p>Mix and match pieces to create multiple outfits for different occasions.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌿</div>
            <h3>Quality Materials</h3>
            <p>Made with soft, breathable fabrics that stand the test of time and wear.</p>
          </div>
        </motion.div>
      </div>

      {/* Quick View Modal - Same as SummerCollection */}
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
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="sc-close-button" onClick={closeQuickView}>
                ×
              </button>
              
              <div className="sc-modal-content">
                <div className="sc-modal-image-section">
                  <div className="sc-image-container">
                    <img src={selectedItem.img} alt={selectedItem.title} />
                    <div className="sc-image-overlay">
                      <div className="sc-image-badges">
                        <span className="sc-category-badge">{selectedItem.category}</span>
                        <span className="sc-style-badge">{selectedItem.style}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="sc-modal-details">
                  <div className="sc-detail-header">
                    <h2>{selectedItem.title}</h2>
                    <p className="sc-modal-price">{selectedItem.price}</p>
                  </div>
                  
                  <p className="sc-modal-description">{selectedItem.description}</p>
                  
                  <div className="sc-selection-sections">
                    <div className="sc-detail-section">
                      <h4>Select Size</h4>
                      <div className="sc-size-options">
                        {selectedItem.sizes.map((size) => (
                          <button
                            key={size}
                            className={`sc-size-btn ${selectedSize === size ? 'selected' : ''}`}
                            onClick={() => setSelectedSize(size)}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="sc-detail-section">
                      <h4>Select Color</h4>
                      <div className="sc-color-options">
                        {selectedItem.colors.map((color) => (
                          <button
                            key={color}
                            className={`sc-color-btn ${selectedColor === color ? 'selected' : ''}`}
                            onClick={() => setSelectedColor(color)}
                          >
                            <span className="sc-color-dot"></span>
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Product Info Card */}
                  <div className="sc-product-info-card">
                    <h4>Product Details</h4>
                    <div className="sc-info-grid">
                      <div className="sc-info-item">
                        <div className="sc-info-icon">🧵</div>
                        <div className="sc-info-content">
                          <div className="sc-info-label">Material</div>
                          <div className="sc-info-value">{selectedItem.material}</div>
                        </div>
                      </div>
                      <div className="sc-info-item">
                        <div className="sc-info-icon">👕</div>
                        <div className="sc-info-content">
                          <div className="sc-info-label">Care Instructions</div>
                          <div className="sc-info-value">{selectedItem.care}</div>
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
                    >
                      <span className="sc-cart-icon">🛒</span>
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

export default CasualCollection;