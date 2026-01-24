import React from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import '../styles/Hero.css';
import resumePDF from '../assets/NIlesh Parmar-Resume.pdf';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const skills = ['Full Stack', 'AI & ML', 'Python Developer','Salesforce', 'Data Science', 'IoT Enthusiast'];

  return (
    <section id="home" className="hero">
      <div className="container">
        <div className="hero-content">

          {/* LEFT CONTENT */}
          <motion.div
            className="hero-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <h1 className="hero-title">
                Hi, I'm <span className="highlight">Nilesh</span>
              </h1>
            </motion.div>

            <motion.div variants={itemVariants}>
              <p className="hero-subtitle">
                Software Engineer || Python Developer
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="skills-container">
              <div className="skills-list">
                {skills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="cta-buttons">
              <motion.button
                className="btn btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const element = document.getElementById('contact');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Let's Connect
              </motion.button>

              <motion.a
                href={resumePDF}
                download="Nilesh_Parmar_Resume.pdf"
                className="btn btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download size={18} />
                Download CV
              </motion.a>
            </motion.div>
          </motion.div>

          {/* RIGHT VISUAL */}
          <motion.div
            className="hero-right"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="hero-visual">
              <div className="visual-circle large"></div>
              <div className="visual-circle medium"></div>
              <div className="visual-circle small"></div>

              {/* FLOATING UI ELEMENTS */}
              <div className="floating-elements-container">
                {/* Code Brackets */}
                <motion.div
                  className="floating-element code-bracket bracket-1"
                  animate={{ 
                    y: [0, 30, 0],
                    x: [0, 10, 0],
                    opacity: [0.4, 0.8, 0.4]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {'<'}
                </motion.div>

                <motion.div
                  className="floating-element code-bracket bracket-2"
                  animate={{ 
                    y: [0, -25, 0],
                    x: [0, -8, 0],
                    opacity: [0.4, 0.8, 0.4]
                  }}
                  transition={{ duration: 7, repeat: Infinity, delay: 0.5, ease: 'easeInOut' }}
                >
                  {'>'}
                </motion.div>

                {/* Curly Braces */}
                <motion.div
                  className="floating-element code-brace brace-1"
                  animate={{ 
                    y: [0, -20, 0],
                    x: [0, 15, 0],
                    rotate: [0, 5, 0],
                    opacity: [0.3, 0.7, 0.3]
                  }}
                  transition={{ duration: 8, repeat: Infinity, delay: 1, ease: 'easeInOut' }}
                >
                  {'{'}
                </motion.div>

                <motion.div
                  className="floating-element code-brace brace-2"
                  animate={{ 
                    y: [0, 35, 0],
                    x: [0, -12, 0],
                    rotate: [0, -5, 0],
                    opacity: [0.3, 0.7, 0.3]
                  }}
                  transition={{ duration: 7.5, repeat: Infinity, delay: 1.5, ease: 'easeInOut' }}
                >
                  {'}'}
                </motion.div>

                {/* AI/Node Icons */}
                <motion.div
                  className="floating-element node-icon node-1"
                  animate={{ 
                    y: [0, 25, 0],
                    opacity: [0.4, 0.9, 0.4],
                    scale: [0.9, 1.1, 0.9]
                  }}
                  transition={{ duration: 6.5, repeat: Infinity, delay: 0.3, ease: 'easeInOut' }}
                >
                  <div className="node-dot"></div>
                </motion.div>

                <motion.div
                  className="floating-element node-icon node-2"
                  animate={{ 
                    y: [0, -30, 0],
                    opacity: [0.4, 0.9, 0.4],
                    scale: [0.9, 1.1, 0.9]
                  }}
                  transition={{ duration: 7.2, repeat: Infinity, delay: 0.8, ease: 'easeInOut' }}
                >
                  <div className="node-dot"></div>
                </motion.div>

                <motion.div
                  className="floating-element node-icon node-3"
                  animate={{ 
                    y: [0, 28, 0],
                    opacity: [0.4, 0.9, 0.4],
                    scale: [0.9, 1.1, 0.9]
                  }}
                  transition={{ duration: 6.8, repeat: Infinity, delay: 1.2, ease: 'easeInOut' }}
                >
                  <div className="node-dot"></div>
                </motion.div>

                {/* Slash Symbol */}
                <motion.div
                  className="floating-element code-slash slash-1"
                  animate={{ 
                    y: [0, -28, 0],
                    x: [0, 12, 0],
                    opacity: [0.35, 0.75, 0.35]
                  }}
                  transition={{ duration: 7.8, repeat: Infinity, delay: 2, ease: 'easeInOut' }}
                >
                  /
                </motion.div>

                {/* Square Brackets */}
                <motion.div
                  className="floating-element code-bracket bracket-3"
                  animate={{ 
                    y: [0, 32, 0],
                    x: [0, -10, 0],
                    opacity: [0.3, 0.7, 0.3]
                  }}
                  transition={{ duration: 6.3, repeat: Infinity, delay: 2.5, ease: 'easeInOut' }}
                >
                  [
                </motion.div>

                <motion.div
                  className="floating-element code-bracket bracket-4"
                  animate={{ 
                    y: [0, -22, 0],
                    x: [0, 14, 0],
                    opacity: [0.3, 0.7, 0.3]
                  }}
                  transition={{ duration: 7.4, repeat: Infinity, delay: 3, ease: 'easeInOut' }}
                >
                  ]
                </motion.div>

                {/* Concept Labels */}
                <motion.div
                  className="floating-element concept-label concept-code"
                  animate={{ 
                    y: [0, 20, 0],
                    opacity: [0.3, 0.7, 0.3],
                    scale: [0.95, 1.05, 0.95]
                  }}
                  transition={{ duration: 7.2, repeat: Infinity, delay: 0.5, ease: 'easeInOut' }}
                >
                  code
                </motion.div>

                <motion.div
                  className="floating-element concept-label concept-logic"
                  animate={{ 
                    y: [0, -24, 0],
                    opacity: [0.25, 0.65, 0.25],
                    scale: [0.95, 1.05, 0.95]
                  }}
                  transition={{ duration: 8, repeat: Infinity, delay: 1.2, ease: 'easeInOut' }}
                >
                  logic
                </motion.div>

                <motion.div
                  className="floating-element concept-label concept-data"
                  animate={{ 
                    y: [0, 28, 0],
                    opacity: [0.3, 0.75, 0.3],
                    scale: [0.95, 1.05, 0.95]
                  }}
                  transition={{ duration: 7.5, repeat: Infinity, delay: 1.8, ease: 'easeInOut' }}
                >
                  data
                </motion.div>

                <motion.div
                  className="floating-element concept-label concept-ai"
                  animate={{ 
                    y: [0, -18, 0],
                    opacity: [0.35, 0.8, 0.35],
                    scale: [0.95, 1.05, 0.95]
                  }}
                  transition={{ duration: 6.8, repeat: Infinity, delay: 2.2, ease: 'easeInOut' }}
                >
                  AI
                </motion.div>
              </div>

              {/* FLOATING TEXT */}
              <div className="floating-text-container">
                <motion.div
                  className="floating-text floating-text-1"
                  animate={{ y: [0, 25, 0], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  Create
                </motion.div>

                <motion.div
                  className="floating-text floating-text-2"
                  animate={{ y: [0, 20, 0], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 6, repeat: Infinity, delay: 0.8, ease: 'easeInOut' }}
                >
                  Iterate
                </motion.div>

                <motion.div
                  className="floating-text floating-text-3"
                  animate={{ y: [0, 20, 0], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 5.5, repeat: Infinity, delay: 1.6, ease: 'easeInOut' }}
                >
                  Innovate
                </motion.div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
