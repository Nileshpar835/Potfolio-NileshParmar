import React from 'react';
import { motion } from 'framer-motion';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <motion.div
          className="footer-content"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
         <div className="footer-bottom">
            <p>
              &copy; {currentYear} Nilesh Parmar. All rights reserved. Crafted with precision and passion.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
