import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/Collection.css";
import dress from "../assets/images/DSCF0864 Large.jpeg";

const API = process.env.REACT_APP_API_URL || "http://localhost:5050";

// ── Static category cards (images stay static, products are real) ─────────────
const CATEGORY_CONFIG = [
  {
    category: "Dress",
    label:     "Dress",
    img:       dress,
    route:     "/summer-collection",
    description: "Elegant and stylish dresses for every occasion. Perfect for summer outings and special events.",
  },
  {
    category: "Maxi Dress",
    label:     "Maxi Dress",
    img:       "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=1000&q=80",
    route:     "/casual-collection",
    description: "Flowy and comfortable maxi dresses. Ideal for casual wear, beach days, and relaxed outings.",
  },
  {
    category: "Juwellery",
    label:     "Jewellery",
    img:       "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=80",
    route:     "/jewelry-collection",
    description: "Exquisite jewelry pieces to complement your style. From elegant necklaces to statement pieces.",
  },
];

const Collection = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [counts, setCounts]             = useState({}); // { Dress: 4, "Maxi Dress": 2, ... }
  const navigate = useNavigate();

  // Fetch product counts per category from MongoDB
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res  = await fetch(`${API}/api/products`);
        const data = await res.json();
        if (!res.ok) return;

        const c = {};
        (data.products || []).forEach(p => {
          c[p.category] = (c[p.category] || 0) + 1;
        });
        setCounts(c);
      } catch (err) {
        console.error("Collection count fetch error:", err);
      }
    };
    fetchCounts();
  }, []);

  const filters = [
    { key: "all",        label: "All"        },
    { key: "Dress",      label: "Dress"      },
    { key: "Maxi Dress", label: "Maxi Dress" },
    { key: "Juwellery",  label: "Jewellery"  },
  ];

  const displayed = activeFilter === "all"
    ? CATEGORY_CONFIG
    : CATEGORY_CONFIG.filter(c => c.category === activeFilter);

  const handleFilterClick = (key) => {
    setActiveFilter(key);
    if (key !== "all") {
      const config = CATEGORY_CONFIG.find(c => c.category === key);
      if (config) navigate(config.route);
    }
  };

  return (
    <section id="collection" className="collection">
      <div className="container">
        <div className="section-title">
          <h2>Our Collection</h2>
          <p>Discover pieces that reflect your unique style and personality</p>
        </div>

        <div className="collection-filters">
          {filters.map(f => (
            <button
              key={f.key}
              className={`filter-btn ${activeFilter === f.key ? "active" : ""}`}
              onClick={() => handleFilterClick(f.key)}
            >
              {f.label}
              {f.key !== "all" && counts[f.key] !== undefined && (
                <span className="filter-count">{counts[f.key]}</span>
              )}
            </button>
          ))}
        </div>

        <motion.div className="collection-grid" layout>
          {displayed.map((item) => (
            <motion.div
              key={item.category}
              className="card"
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="card-image">
                <img src={item.img} alt={item.label} />
                <div className="card-overlay">
                  <motion.button
                    className="quick-view-btn"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate(item.route)}
                  >
                    Explore Collection
                  </motion.button>
                </div>
                {/* Live product count badge */}
                {counts[item.category] !== undefined && (
                  <div className="collection-count-badge">
                    {counts[item.category]} item{counts[item.category] !== 1 ? "s" : ""}
                  </div>
                )}
              </div>
              <div className="card-content">
                <h3>{item.label}</h3>
                <p className="description">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Collection;