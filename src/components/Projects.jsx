import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, ChevronDown, Download, Code, Zap, Cpu } from 'lucide-react';
import '../styles/Projects.css';

// Floating Elements Component
const FloatingElements = () => {
  const floatingVariants = {
    float: (custom) => ({
      y: [0, -20, 0],
      transition: {
        duration: 4 + custom,
        repeat: Infinity,
        ease: "easeInOut",
      },
    }),
  };

  const rotateVariants = {
    rotate: (custom) => ({
      rotate: [0, 360],
      transition: {
        duration: 8 + custom * 2,
        repeat: Infinity,
        ease: "linear",
      },
    }),
  };

  return (
    <div className="floating-elements">
      {/* Python Icon Floating */}
      <motion.div
        className="floating-icon python-icon"
        custom={0}
        variants={floatingVariants}
        animate="float"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 0.6 }}
      >
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="24" fill="#3776AB">
            🐍
          </text>
        </svg>
      </motion.div>

      {/* Code Icon Floating */}
      <motion.div
        className="floating-icon code-icon"
        custom={1}
        variants={floatingVariants}
        animate="float"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 0.5 }}
      >
        <Code size={36} color="#6366f1" strokeWidth={1.5} />
      </motion.div>

      {/* Zap Icon Floating */}
      <motion.div
        className="floating-icon zap-icon"
        custom={2}
        variants={floatingVariants}
        animate="float"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 0.5 }}
      >
        <Zap size={32} color="#f59e0b" strokeWidth={1.5} />
      </motion.div>

      {/* CPU Icon Floating */}
      <motion.div
        className="floating-icon cpu-icon"
        custom={0.5}
        variants={floatingVariants}
        animate="float"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 0.5 }}
      >
        <Cpu size={36} color="#10b981" strokeWidth={1.5} />
      </motion.div>

      {/* Rotating Orb */}
      <motion.div
        className="floating-orb"
        custom={1.5}
        variants={rotateVariants}
        animate="rotate"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.3 }}
      >
        <div className="orb-inner"></div>
      </motion.div>

      {/* Glowing Particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="floating-particle"
          animate={{
            y: [0, -100, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 5 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeInOut",
          }}
          style={{
            left: `${20 + i * 15}%`,
            top: `${10 + i * 5}%`,
          }}
        />
      ))}
    </div>
  );
};

const Projects = () => {
  const [expandedProject, setExpandedProject] = useState(null);
  const projects = [
    {
      id: 1,
      title: 'College Exam Portal',
      subtitle: 'Online Examination System',
      description: 'Secure web-based examination platform with role-based access for HOD, Faculty, and Students.',
      longDescription:
        'Built with Django and PostgreSQL. Features automated grading, result tracking, analytics dashboards, and responsive UI for seamless exam experience.',
      technologies: ['Python', 'Django', 'PostgreSQL', 'JavaScript', 'HTML/CSS'],
      features: [
        'Secure authentication system',
        'Role-based access control',
        'Automated grading engine',
        'Real-time analytics dashboard',
        'Responsive design',
      ],
      github: 'https://github.com/nileshpar835',
      liveLink: 'https://examination-bmiit.onrender.com/',
      image: '01',
      isLive: true,
    },
    {
      id: 2,
      title: 'Mobile Shop Management',
      subtitle: 'Inventory & Order Management',
      description: 'Web application for managing product inventory, customer orders, and delivery tracking.',
      longDescription:
        'Comprehensive solution with role-based access for Admin, Customer, and Delivery Personnel. Includes OTP-based delivery confirmation.',
      technologies: ['PHP', 'MySQL', 'HTML/CSS', 'JavaScript'],
      features: [
        'Product management system',
        'Inventory tracking',
        'Order management',
        'OTP delivery confirmation',
        'Role-based access control',
      ],
      github: 'https://github.com/nileshpar835',
      image: '02',
    },
    {
      id: 3,
      title: 'Event Management System',
      subtitle: 'Event Organization Platform',
      description: 'Role-based web application for event organization, bookings, and management.',
      longDescription:
        'Built with ASP.NET Core and SQL Server. Streamlined operations with automated notifications and post-event feedback handling.',
      technologies: ['ASP.NET Core', 'SQL Server', 'C#', 'JavaScript'],
      features: [
        'Venue management',
        'Event scheduling',
        'Payment processing',
        'Automated notifications',
        'Review system',
      ],
      github: 'https://github.com/nileshpar835',
      liveLink: 'https://eventmanagementsystem-qn6i.onrender.com/',
      image: '03',
      isLive: true,
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section id="work" className="projects">
      <div className="container">
        <FloatingElements />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.h2 variants={itemVariants} className="section-title">
            Featured Projects
          </motion.h2>

          <div className="projects-grid">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                className="project-card"
                variants={itemVariants}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                {/* Header: Title + Expand Button */}
                <div className="project-header">
                  <div className="project-title-group">
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-subtitle">{project.subtitle}</p>
                  </div>
                  <button
                    className="expand-btn"
                    onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
                    aria-label={expandedProject === project.id ? 'Collapse' : 'Expand'}
                  >
                    <ChevronDown size={20} />
                  </button>
                </div>

                {/* Description */}
                <p className="project-description">{project.description}</p>

                {/* Tech Tags - Full list on desktop, limited on mobile */}
                <div className="project-tech">
                  {project.technologies.map((tech, index) => (
                    <span key={index} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Desktop: Always show, Mobile: Expandable */}
                <div className="project-desktop-content">
                  {/* Key Features */}
                  <div className="project-features">
                    <h4>Key Features</h4>
                    <ul>
                      {project.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Links */}
                  <div className="project-links">
                    {project.isCV ? (
                      <a href={project.cvFile} download="Nilesh_Parmar_Resume.pdf" className="project-link cv-link">
                        <Download size={16} />
                        Download CV
                      </a>
                    ) : (
                      <>
                        {project.isLive && (
                          <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="project-link live-link">
                            <ExternalLink size={16} />
                            Live Project
                          </a>
                        )}
                        <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link">
                          <Github size={16} />
                          View Code
                        </a>
                      </>
                    )}
                  </div>
                </div>

                {/* Mobile Expandable Content */}
                <AnimatePresence>
                  {expandedProject === project.id && (
                    <motion.div
                      className="project-mobile-expanded"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Key Features for Mobile */}
                      <div className="project-features">
                        <h4>Key Features</h4>
                        <ul>
                          {project.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>

                      {/* GitHub Link for Mobile */}
                      <div className="project-links">
                        {project.isCV ? (
                          <a href={project.cvFile} download="Nilesh_Parmar_Resume.pdf" className="project-link cv-link">
                            <Download size={16} />
                            Download CV
                          </a>
                        ) : (
                          <>
                            {project.isLive && (
                              <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="project-link live-link">
                                <ExternalLink size={16} />
                                Live Project
                              </a>
                            )}
                            <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link">
                              <Github size={16} />
                              View Code
                            </a>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
