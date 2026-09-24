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
                I'm a passionate Software Development Engineer and Python
                Developer with hands-on experience in backend development,
                web applications, and data-driven systems. With a strong
                foundation in multiple programming languages and frameworks,
                I build scalable applications that solve real-world problems.
              </p>

              <p>
                Currently working as an SDE at Potenza Global Solution, I focus
                on building reliable software solutions, developing scalable
                applications, optimizing performance, and writing clean,
                maintainable code. I also have a strong interest in Data
                Science, AI, and building intelligent, data-driven solutions.
              </p>
            </motion.div>
          </div>

          {/* Current Role */}
          <motion.div variants={itemVariants} className="about-highlight">
            <h3>Current Role</h3>

            <p>
              <strong>SDE @ Potenza Global Solution</strong>
            </p>

            <p className="role-description">
              Working on software development and backend solutions, focusing
              on building scalable applications, implementing efficient
              features, debugging, testing, performance optimization, and
              collaborating with team members to deliver high-quality
              software.
            </p>
          </motion.div>

          {/* Previous Experience */}
          <motion.div variants={itemVariants} className="about-highlight">
            <h3>Previous Experience</h3>

            <p>
              <strong>Python Developer Intern @ Zapuza Technologies LLP</strong>
            </p>

            <p className="role-description">
              Developed and maintained backend components using Python while
              following clean coding principles. Implemented optimized
              modules, worked on debugging and testing, and collaborated with
              cross-functional teams using Git workflows.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
