import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import '../styles/Rope.css';

const InteractiveRope = () => {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const velocityRef = useRef(0);
  const smoothScrollRef = useRef(0);
  const lastScrollRef = useRef(0);
  const animationFrameRef = useRef(null);

  // Rope configuration
  const ropeSvgPoints = 30;
  const ropeHeight = isDesktop ? 800 : isDesktop ? 600 : 400;
  const containerHeight = ropeHeight;

  // Responsive settings
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll handler with smooth easing
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const newScrollProgress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;

      // Calculate velocity for inertia effect
      velocityRef.current = (newScrollProgress - lastScrollRef.current) * 0.8;
      lastScrollRef.current = newScrollProgress;

      setScrollProgress(newScrollProgress);
    };

    // Smooth animation frame for physics
    const animate = () => {
      smoothScrollRef.current += (scrollProgress - smoothScrollRef.current) * 0.15; // Easing factor
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

  // Generate rope path with wave and slack simulation
  const generateRopePath = () => {
    const points = [];
    const slack = scrollProgress * 60; // Maximum slack of 60px when scrolled down
    const waveAmplitude = 12 + Math.sin(scrollProgress * Math.PI * 4) * 6; // Wave motion

    for (let i = 0; i < ropeSvgPoints; i++) {
      const progress = i / (ropeSvgPoints - 1);
      const y = progress * containerHeight - slack * progress;

      // Create wave motion
      const wave = Math.sin(progress * Math.PI * 2 + scrollProgress * Math.PI * 6) * waveAmplitude;

      // Simulate rope compression/extension
      const tension = 1 - slack * 0.15;
      const x = 20 + wave * (0.5 + tension * 0.5);

      points.push([x, y]);
    }

    // Create smooth curve
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

  // Don't render on mobile for performance
  if (!isDesktop && window.innerWidth < 768) {
    return null;
  }

  return (
    <div ref={containerRef} className="rope-container">
      <motion.svg
        className="rope-svg"
        viewBox={`0 0 100 ${containerHeight}`}
        preserveAspectRatio="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isDesktop ? 1 : 0.7 }}
        transition={{ duration: 1 }}
      >
        {/* Rope shadow for depth */}
        <defs>
          <linearGradient id="ropeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#d1d5db', stopOpacity: 0.6 }} />
            <stop offset="50%" style={{ stopColor: '#9ca3af', stopOpacity: 0.8 }} />
            <stop offset="100%" style={{ stopColor: '#d1d5db', stopOpacity: 0.6 }} />
          </linearGradient>

          <filter id="ropeShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
          </filter>

          <filter id="ropeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.4" />
            </feComponentTransfer>
          </filter>
        </defs>

        {/* Outer rope glow */}
        <path
          d={generateRopePath()}
          stroke="url(#ropeGradient)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#ropeGlow)"
          opacity="0.4"
        />

        {/* Main rope */}
        <path
          d={generateRopePath()}
          stroke="url(#ropeGradient)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#ropeShadow)"
          style={{
            willChange: 'stroke-dasharray, filter',
            transition: 'opacity 0.3s ease-out',
          }}
        />

        {/* Subtle texture lines on rope */}
        <g opacity="0.3">
          {[...Array(Math.floor(ropeSvgPoints / 4))].map((_, i) => {
            const progress = (i / (Math.floor(ropeSvgPoints / 4) - 1 || 1)) || 0;
            const slack = scrollProgress * 60 * progress;
            const y = progress * containerHeight - slack;
            return (
              <line
                key={i}
                x1="16"
                y1={y}
                x2="24"
                y2={y}
                stroke="#9ca3af"
                strokeWidth="0.5"
                opacity="0.5"
              />
            );
          })}
        </g>
      </motion.svg>

      {/* Anchor point at top */}
      <div className="rope-anchor top" />

      {/* Anchor point at bottom */}
      <div className="rope-anchor bottom" />
    </div>
  );
};

export default InteractiveRope;
