// HeroSection.js
import React from "react";
import { motion } from "framer-motion";
import "../styles/HeroSection.css";

const HeroSection = () => {
  const scrollToCollection = () => {
    const element = document.getElementById('collection');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="hero">
      {/* Animated Background Elements */}
      <div className="hero-background">
        <div className="floating-shapes">
          <motion.div 
            className="shape shape-1"
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="shape shape-2"
            animate={{ 
              y: [0, 30, 0],
              rotate: [0, -8, 0]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          <motion.div 
            className="shape shape-3"
            animate={{ 
              y: [0, -15, 0],
              x: [0, 10, 0]
            }}
            transition={{ 
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </div>
        
        {/* Gradient Overlays */}
        <div className="gradient-overlay-1"></div>
        <div className="gradient-overlay-2"></div>
      </div>
      
      {/* Main Content */}
      <div className="hero-container">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <motion.div
            className="badge"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            New Collection 2026
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Elevate Your
            <span className="highlight"> Everyday Style</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            Discover modern, confident, and elegant women's fashion from Auri. 
            Where comfort meets sophistication in every stitch.
          </motion.p>
          
          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
          >
            <motion.button 
              whileHover={{ scale: 1.05, y: -2 }} 
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary"
              onClick={scrollToCollection}
            >
              <span>Shop Collection</span>
              <i className="fas fa-arrow-right"></i>
            </motion.button>
            
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="hero-stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
          >
            <div className="stat">
              <h4>20+</h4>
              <p>Styles</p>
            </div>
            <div className="stat">
              <h4>90%</h4>
              <p>Happy Clients</p>
            </div>
            <div className="stat">
              <h4>5+</h4>
              <p>Designers</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Hero Image with Floating Elements */}
        <motion.div 
          className="hero-visual"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
        >
          <div className="image-container">
            <motion.img
              src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              alt="Auri Fashion"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Floating Product Cards */}
            <motion.div 
              className="floating-card card-1"
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, -3, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="card-content">
                <span>The Sora Puff</span>
                <strong>RS 8000</strong>
              </div>
            </motion.div>

            <motion.div 
              className="floating-card card-2"
              animate={{ 
                y: [0, 20, 0],
                rotate: [0, 2, 0]
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            >
              <div className="card-content">
                <span>The Stella Set</span>
                <strong>RS 8500</strong>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        onClick={scrollToCollection}
      >
        <div className="scroll-text">Scroll to Explore</div>
        <motion.div
          className="scroll-arrow"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <i className="fas fa-chevron-down"></i>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;