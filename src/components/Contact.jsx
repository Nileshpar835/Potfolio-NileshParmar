import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Linkedin, Github, Twitter } from 'lucide-react';
import '../styles/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Send email using Formspree
      const response = await fetch('https://formspree.io/f/xzzldpzq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => {
          setSubmitted(false);
        }, 3000);
      } else {
        setError('Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message. Please try again or contact directly.');
    } finally {
      setLoading(false);
    }
  };

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

  const socialLinks = [
    {
      icon: Mail,
      label: 'Email',
      href: 'mailto:nileshapr835@gmail.com',
      color: '#000000',
    },
    {
      icon: Phone,
      label: 'Phone',
      href: 'tel:+919016070514',
      color: '#000000',
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/nileshpar835',
      color: '#0a66c2',
    },
    {
      icon: Github,
      label: 'GitHub',
      href: 'https://github.com/nileshpar835',
      color: '#000000',
    }
  ];

  return (
    <section id="contact" className="contact">
      <div className="container">
        <motion.div
          className="contact-content"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.h2 variants={itemVariants} className="section-title">
            Let's Talk
          </motion.h2>

          <motion.p variants={itemVariants} className="contact-intro">
            I'm always interested in hearing about new projects and opportunities. 
            Whether you have a question or just want to say hi, feel free to reach out!
          </motion.p>

          <div className="contact-methods">
            <motion.div variants={itemVariants} className="contact-form-wrapper">
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project or inquiry..."
                    rows="5"
                    required
                  ></textarea>
                </div>

                <motion.button
                  type="submit"
                  className="btn btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={loading}
                >
                  {loading ? 'Sending...' : submitted ? 'Message Sent!' : 'Send Message'}
                </motion.button>

                {submitted && (
                  <motion.div
                    className="success-message"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    ✓ Thanks for reaching out! I'll get back to you soon.
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    className="error-message"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    ✗ {error}
                  </motion.div>
                )}
              </form>
            </motion.div>

            <motion.div variants={itemVariants} className="contact-info">
              <h3>Get in Touch</h3>

              <div className="info-cards">
                <motion.a
                  href="mailto:nileshapr835@gmail.com"
                  className="info-card"
                  whileHover={{ y: -4 }}
                >
                  <Mail size={24} />
                  <div>
                    <div className="info-label">Email</div>
                    <div className="info-value">nileshapr835@gmail.com</div>
                  </div>
                </motion.a>

                <motion.a
                  href="tel:+919016070514"
                  className="info-card"
                  whileHover={{ y: -4 }}
                >
                  <Phone size={24} />
                  <div>
                    <div className="info-label">Phone</div>
                    <div className="info-value">+91 9016070514</div>
                  </div>
                </motion.a>
              </div>

              <div className="social-section">
                <h4>Connect with me</h4>
                <div className="social-links">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <motion.a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                        title={social.label}
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Icon size={20} color={social.color} />
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
