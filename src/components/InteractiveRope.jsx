import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import '../styles/Rope.css';

const InteractiveRope = () => {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [isHovered, setIsHovered] = useState(false);
  const velocityRef = useRef(0);
  const smoothScrollRef = useRef(0);
  const lastScrollRef = useRef(0);
  const animationFrameRef = useRef(null);
  const velocityHistoryRef = useRef([]);

  // Rope configuration
  const ropeSvgPoints = 35;
  const ropeHeight = isDesktop ? 900 : isDesktop ? 700 : 500;
  const containerHeight = ropeHeight;

  // Responsive settings
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll handler with enhanced physics
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const newScrollProgress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;

      // Calculate velocity with momentum
      const currentVelocity = (newScrollProgress - lastScrollRef.current) * 0.8;
      velocityRef.current = currentVelocity;
      lastScrollRef.current = newScrollProgress;

      // Keep velocity history for inertia
      velocityHistoryRef.current.push(currentVelocity);
      if (velocityHistoryRef.current.length > 5) {
        velocityHistoryRef.current.shift();
      }

      setScrollProgress(newScrollProgress);
    };

    // Enhanced animation frame with spring-like easing
    const animate = () => {
      // Use cubic easing for smoother spring effect
      const diff = scrollProgress - smoothScrollRef.current;
      const springForce = diff * 0.12; // Spring constant
      smoothScrollRef.current += springForce * (1 - Math.abs(velocityRef.current) * 0.05);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    animate();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [scrollProgress]);

  // Generate rope path with realistic wave and slack
  const generateRopePath = () => {
    const points = [];
    const baseSlack = scrollProgress * 80; // More noticeable slack
    
    // Add velocity-based jitter reduction through averaging
    const avgVelocity = velocityHistoryRef.current.length > 0 
      ? velocityHistoryRef.current.reduce((a, b) => a + b) / velocityHistoryRef.current.length 
      : 0;
    
    // Multi-layered wave for organic motion
    const waveAmplitude = 14 + Math.sin(scrollProgress * Math.PI * 4) * 8;
    const microWave = Math.sin(Date.now() * 0.001) * 2;

    for (let i = 0; i < ropeSvgPoints; i++) {
      const progress = i / (ropeSvgPoints - 1);
      
      // Slack increases towards bottom
      const slackFactor = progress * progress; // Quadratic for realistic sagging
      const y = progress * containerHeight - baseSlack * slackFactor;

      // Create dynamic wave motion with multiple frequencies
      const wave1 = Math.sin(progress * Math.PI * 2 + scrollProgress * Math.PI * 6) * waveAmplitude;
      const wave2 = Math.sin(progress * Math.PI * 3.5 + scrollProgress * Math.PI * 4.5) * (waveAmplitude * 0.4);
      const wave = wave1 + wave2 + microWave;

      // Simulate rope tension with better physics
      const tension = 1 - baseSlack * 0.1;
      const x = 20 + wave * (0.6 + tension * 0.4);

      points.push([x, y]);
    }

    // Create smooth quadratic curve
    let pathData = `M ${points[0][0]} ${points[0][1]}`;
    for (let i = 1; i < points.length - 1; i++) {
      const xc = (points[i][0] + points[i + 1][0]) / 2;
      const yc = (points[i][1] + points[i + 1][1]) / 2;
      pathData += ` Q ${points[i][0]} ${points[i][1]}, ${xc} ${yc}`;
    }
    const lastPoint = points[points.length - 1];
    pathData += ` T ${lastPoint[0]} ${lastPoint[1]}`;

    return pathData;
  };

  return (
    <div 
      ref={containerRef} 
      className="rope-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.svg
        className="rope-svg"
        viewBox={`0 0 100 ${containerHeight}`}
        preserveAspectRatio="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isDesktop ? 1 : 0.8 }}
        transition={{ duration: 1.2 }}
      >
        {/* SVG Gradients and Filters */}
        <defs>
          {/* Main rope gradient - realistic brown */}
          <linearGradient id="ropeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#8B4513', stopOpacity: 0.7 }} />
            <stop offset="25%" style={{ stopColor: '#A0522D', stopOpacity: 0.9 }} />
            <stop offset="50%" style={{ stopColor: '#8B6914', stopOpacity: 0.95 }} />
            <stop offset="75%" style={{ stopColor: '#A0522D', stopOpacity: 0.9 }} />
            <stop offset="100%" style={{ stopColor: '#8B4513', stopOpacity: 0.7 }} />
          </linearGradient>

          {/* Rope highlight gradient */}
          <linearGradient id="ropeHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#D2691E', stopOpacity: 0 }} />
            <stop offset="50%" style={{ stopColor: '#CD853F', stopOpacity: 0.4 }} />
            <stop offset="100%" style={{ stopColor: '#D2691E', stopOpacity: 0 }} />
          </linearGradient>

          {/* Deep shadow filter */}
          <filter id="deepShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
            <feOffset dx="1" dy="1" />
          </filter>

          {/* Soft glow filter */}
          <filter id="ropeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5" />
            </feComponentTransfer>
          </filter>

          {/* Texture filter for realism */}
          <filter id="textureFilter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
          </filter>
        </defs>

        {/* Far background glow - creates depth */}
        <path
          d={generateRopePath()}
          stroke="#6B4423"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#ropeGlow)"
          opacity="0.3"
        />

        {/* Medium shadow layer */}
        <path
          d={generateRopePath()}
          stroke="#5C3317"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#deepShadow)"
          opacity="0.6"
        />

        {/* Main rope body */}
        <path
          d={generateRopePath()}
          stroke="url(#ropeGradient)"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#textureFilter)"
          style={{
            willChange: 'stroke-dasharray, filter',
            transition: 'filter 0.2s ease-out',
            filter: isHovered ? 'drop-shadow(0 0 8px rgba(205, 133, 63, 0.5))' : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
          }}
        />

        {/* Rope highlight for dimension */}
        <path
          d={generateRopePath()}
          stroke="url(#ropeHighlight)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.6"
        />

        {/* Rope texture - fibers */}
        <g opacity="0.4">
          {[...Array(Math.floor(ropeSvgPoints / 3))].map((_, i) => {
            const progress = (i / (Math.floor(ropeSvgPoints / 3) - 1 || 1)) || 0;
            const baseSlack = scrollProgress * 80 * progress * progress;
            const y = progress * containerHeight - baseSlack;
            return (
              <line
                key={i}
                x1="14"
                y1={y}
                x2="26"
                y2={y}
                stroke="#5C3317"
                strokeWidth="0.7"
                opacity="0.6"
              />
            );
          })}
        </g>

        {/* Additional texture details */}
        <g opacity="0.25">
          {[...Array(Math.floor(ropeSvgPoints / 4))].map((_, i) => {
            const progress = (i / (Math.floor(ropeSvgPoints / 4) - 1 || 1)) || 0;
            const baseSlack = scrollProgress * 80 * progress * progress;
            const y = progress * containerHeight - baseSlack;
            const offset = Math.sin(i * 0.5) * 2;
            return (
              <circle
                key={`circle-${i}`}
                cx={20 + offset}
                cy={y}
                r="0.4"
                fill="#8B6914"
                opacity="0.4"
              />
            );
          })}
        </g>
      </motion.svg>

      {/* Enhanced anchor points */}
      <motion.div 
        className="rope-anchor top"
        animate={{ scale: isHovered ? 1.2 : 1 }}
        transition={{ duration: 0.3 }}
      />
      <motion.div 
        className="rope-anchor bottom"
        animate={{ scale: isHovered ? 1.2 : 1 }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
};

export default InteractiveRope;
