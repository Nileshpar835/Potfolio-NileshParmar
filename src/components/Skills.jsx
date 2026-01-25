import React, { useState } from 'react';
import { motion } from 'framer-motion';
import '../styles/Skills.css';
import FloatingIcons from './FloatingIcons';

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const skillCategories = [
    {
      category: 'Frontend',
      skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Bootstrap', 'Tailwind'],
    },
    {
      category: 'Backend',
      skills: ['Python', 'Flask', 'FastAPI', 'Django', 'Java', 'C++', 'PHP'],
     
    },
    {
      category: 'Database & Cloud',
      skills: ['PostgreSQL', 'MySQL', 'SQL Server', 'Git', 'GitHub'],
    },
    {
      category: 'Emerging Tech',
      skills: ['Machine Learning', 'Data Science', 'AI', 'IoT'],
    },
  ];

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
    <section id="skills" className="skills">
      <FloatingIcons variant="skills" />
      <div className="container">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.h2 variants={itemVariants} className="section-title">
            Skills & Expertise
          </motion.h2>

          <div className="skills-grid">
            {skillCategories.map((category, index) => (
              <motion.div 
                key={index} 
                className="skill-category" 
                variants={itemVariants}
              >
                <div 
                  className="category-header"
                  onClick={() => setActiveCategory(activeCategory === index ? null : index)}
                >
                  <h3>{category.category}</h3>
                </div>
                
                <div className="skills-list">
                  {category.skills.map((skill, idx) => (
                    <motion.span
                      key={idx}
                      className="skill-item"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={itemVariants} className="certifications">
            <h3>Certifications</h3>
            <div className="cert-list">
              <motion.div className="cert-item" whileHover={{ x: 8 }}>
                <div className="cert-dot"></div>
                <span>Introduction to Tableau - DataCamp</span>
              </motion.div>
              <motion.div className="cert-item" whileHover={{ x: 8 }}>
                <div className="cert-dot"></div>
                <span>Python Basics - HackerRank</span>
              </motion.div>
              <motion.div className="cert-item" whileHover={{ x: 8 }}>
                <div className="cert-dot"></div>
                <span>Intermediate Python - DataCamp</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
