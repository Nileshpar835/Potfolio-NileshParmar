import React from 'react';
import { motion } from 'framer-motion';
import '../styles/About.css';

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section id="about" className="about">
      <div className="container">
        <motion.div
          className="about-content"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.h2 variants={itemVariants} className="section-title">
            About Me
          </motion.h2>

          <div className="about-grid">
            <motion.div variants={itemVariants} className="about-text">
              <p>
                I'm a passionate Software Engineer and Python Developer with hands-on experience in backend development, 
                web applications, and data-driven systems. With a strong foundation in multiple programming languages and frameworks, 
                I build scalable applications that solve real-world problems.
              </p>
              <p>
                Currently transitioning toward Data Science and AI-driven solutions, I focus on clean architecture, 
                performance optimization, and delivering high-quality code that makes an impact.
              </p>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="about-highlight">
            <h3>Current Role</h3>
            <p>
              <strong>Python Developer Intern @ Zapuza Technologies LLP</strong> (Nov 2025 - May 2026)
            </p>
            <p className="role-description">
              Developing and maintaining backend components using Python, following clean coding principles. 
              Implementing optimized modules, debugging, testing, and collaborating with cross-functional teams using Git workflows.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
