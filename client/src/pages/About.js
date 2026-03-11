// About.js
import React from "react";
import { motion } from "framer-motion";
import "../styles/About.css";

import missionImg from "../assets/images/unnamed.jpg";

const About = () => {
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="section-title">
          <h2>Our Story</h2>
          <p>Crafting timeless fashion with purpose and passion</p>
        </div>

        <div className="about-content">
          <motion.div
            className="about-text"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="about-header">
              <h2>Redefining Modern Elegance</h2>
              <div className="accent-line"></div>
            </div>
            
            <p>
              Auri was born from a simple belief: fashion should empower, not constrain. 
              We create pieces that move with you, adapt to your life, and celebrate your 
              unique journey.
            </p>
            
            <p>
              Every garment tells a story of meticulous craftsmanship, sustainable practices, 
              and timeless design. We believe in fashion that lasts beyond seasons—pieces 
              that become cherished parts of your story.
            </p>

            <div className="values-grid">
              <motion.div 
                className="value-item"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="value-icon">
                  <i className="fas fa-leaf"></i>
                </div>
                <h4>Sustainable</h4>
                <p>Eco-friendly materials and ethical production</p>
              </motion.div>

              <motion.div 
                className="value-item"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="value-icon">
                  <i className="fas fa-hands"></i>
                </div>
                <h4>Handcrafted</h4>
                <p>Attention to detail in every stitch</p>
              </motion.div>

              <motion.div 
                className="value-item"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="value-icon">
                  <i className="fas fa-infinity"></i>
                </div>
                <h4>Timeless</h4>
                <p>Designs that transcend trends</p>
              </motion.div>
            </div>

            <motion.div 
              className="about-cta"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              
            </motion.div>
          </motion.div>

          <motion.div
            className="about-visual"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="image-stack">
              <motion.div 
                className="image-main"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Auri fashion design"
                />
              </motion.div>
              <motion.div 
                className="image-secondary"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Auri craftsmanship"
                />
              </motion.div>
              <motion.div 
                className="image-tertiary"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Auri materials"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="mission-section"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="mission-content">
            <h3>Our Mission</h3>
            <p>
              To create fashion that feels as good as it looks—pieces that empower confidence, 
              celebrate individuality, and respect our planet. We're committed to transparency, 
              quality, and creating clothing you'll love for years to come.
            </p>
          </div>
          <div className="mission-image">
            <motion.img
              src={missionImg}
              alt="Auri mission"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;