// Footer.js
import React from "react";
import { motion } from "framer-motion";
import "../styles/Footer.css";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="footer">
      <div className="container">
        <div className="footer-content">
          <motion.div
            className="footer-brand"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 onClick={scrollToTop} style={{ cursor: 'pointer' }}>AURI</h3>
            <p>Modern women's fashion that celebrates confidence, creativity, and comfort in every design.</p>
            <div className="social-links">
              <a href="https://www.instagram.com/_auri.official_?igsh=MWFwM3VkbGMzNGtuNg==&utm_source=ig_contact_invite" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://www.tiktok.com/@_auri.official_?_r=1&_t=ZS-91CC3CMCcc8" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-tiktok"></i>
              </a>
            </div>
          </motion.div>

          <motion.div
            className="footer-links"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#collection">Collection</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </motion.div>

          <motion.div
            className="footer-contact"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4>Contact Info</h4>
            <p><i className="fas fa-envelope"></i> shop.auriofficial@gmail.com</p>
            <p><i className="fas fa-phone"></i> +94 71 464 2233</p>
          </motion.div>

          <motion.div
            className="footer-newsletter"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4>Newsletter</h4>
            <p>Subscribe to get updates on new collections and exclusive offers.</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Your email address" />
              <button className="btn">Subscribe</button>
            </div>
          </motion.div>
        </div>

        <div className="footer-bottom">
  <p>&copy; 2025 Auri Fashion. All rights reserved.</p>

  <div className="designer">
    <p>Designed <span className="heart"></span> by IR</p>
    <p className="designer-number">imalbandara624@gmail.com</p>
  </div>
</div>
      </div>
    </footer>
  );
};

export default Footer;