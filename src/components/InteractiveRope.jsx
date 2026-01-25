import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import '../styles/Rope.css';

const InteractiveRope = () => {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
  const [isHovered, setIsHovered] = useState(false);
  const velocityRef = useRef(0);
  const smoothScrollRef = useRef(0);
  const lastScrollRef = useRef(0);
  const lastTimeRef = useRef(Date.now());
  const animationFrameRef = useRef(null);
  const velocityHistoryRef = useRef([]);

  // Rope configuration - Responsive sizing
  const ropeSvgPoints = 35;
  const ropeHeight = isDesktop ? 900 : isTablet ? 700 : 600;
  const containerHeight = ropeHeight;

  // Responsive settings
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Enhanced scroll handler with velocity tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const newScrollProgress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
      
      // Calculate velocity
      const currentTime = Date.now();
      const timeDelta = currentTime - lastTimeRef.current;
      
      if (timeDelta > 0) {
        const scrollDelta = newScrollProgress - lastScrollRef.current;
        velocityRef.current = (scrollDelta / timeDelta) * 1000; // Pixels per second
        setScrollVelocity(velocityRef.current);
      }

      // Keep velocity history for inertia
      velocityHistoryRef.current.push(velocityRef.current);
      if (velocityHistoryRef.current.length > 8) {
        velocityHistoryRef.current.shift();
      }

      setScrollProgress(newScrollProgress);
      lastScrollRef.current = newScrollProgress;
      lastTimeRef.current = currentTime;
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

  // Generate rope path with velocity-responsive waves
  const generateRopePath = () => {
    const points = [];
    
    // Base slack influenced by scroll position
    const baseSlack = scrollProgress * 100; // Increased visibility
    
    // Calculate average velocity for smoother wave
    const avgVelocity = velocityHistoryRef.current.length > 0 
      ? velocityHistoryRef.current.reduce((a, b) => a + b) / velocityHistoryRef.current.length 
      : 0;
    
    // Clamp velocity for stability
    const clampedVelocity = Math.max(-0.5, Math.min(0.5, avgVelocity));
    
    // Wave amplitude increases with scroll velocity
    const baseWaveAmplitude = 16 + Math.abs(clampedVelocity) * 30; // Velocity-responsive
    const waveAmplitude = baseWaveAmplitude + Math.sin(scrollProgress * Math.PI * 4) * 8;
    const microWave = Math.sin(Date.now() * 0.0015) * 3;

    // Responsive wave frequencies based on device
    const waveFrequency1 = isDesktop ? 2 : isTablet ? 1.5 : 1;
    const waveFrequency2 = isDesktop ? 3.5 : isTablet ? 2.5 : 1.8;

    for (let i = 0; i < ropeSvgPoints; i++) {
      const progress = i / (ropeSvgPoints - 1);
      
      // Slack increases towards bottom with quadratic falloff
      const slackFactor = progress * progress;
      const y = progress * containerHeight - baseSlack * slackFactor;

      // Create dynamic wave motion with multiple frequencies
      const velocityInfluence = clampedVelocity * 4;
      const wave1 = Math.sin(progress * Math.PI * waveFrequency1 + scrollProgress * Math.PI * 6 + velocityInfluence) * waveAmplitude;
      const wave2 = Math.sin(progress * Math.PI * waveFrequency2 + scrollProgress * Math.PI * 4.5) * (waveAmplitude * 0.4);
      const wave = wave1 + wave2 + microWave;

      // Simulate rope tension - stiffer when scrolling fast
      const tension = 1 - (baseSlack * 0.1) * (1 - Math.abs(clampedVelocity) * 0.3);
      
      // Responsive positioning
      const baseX = isDesktop ? 30 : isTablet ? 25 : 20;
      const x = baseX + wave * (0.6 + tension * 0.4);

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
        ref={svgRef}
        className="rope-svg"
        viewBox={`0 0 100 ${containerHeight}`}
        preserveAspectRatio="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isDesktop ? 1 : 0.9 }}
        transition={{ duration: 1.2 }}
      >
        {/* SVG Gradients and Filters */}
        <defs>
          {/* Main rope gradient - enhanced brown with golden highlights */}
          <linearGradient id="ropeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#6B4423', stopOpacity: 0.8 }} />
            <stop offset="15%" style={{ stopColor: '#8B4513', stopOpacity: 0.95 }} />
            <stop offset="25%" style={{ stopColor: '#A0522D', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#B8860B', stopOpacity: 0.98 }} />
            <stop offset="75%" style={{ stopColor: '#A0522D', stopOpacity: 1 }} />
            <stop offset="85%" style={{ stopColor: '#8B4513', stopOpacity: 0.95 }} />
            <stop offset="100%" style={{ stopColor: '#6B4423', stopOpacity: 0.8 }} />
          </linearGradient>

          {/* Rope highlight gradient - bright golden */}
          <linearGradient id="ropeHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#FFD700', stopOpacity: 0 }} />
            <stop offset="50%" style={{ stopColor: '#FFD700', stopOpacity: 0.6 }} />
            <stop offset="100%" style={{ stopColor: '#FFD700', stopOpacity: 0 }} />
          </linearGradient>

          {/* Glow effect for velocity indication */}
          <linearGradient id="velocityGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#FF6B35', stopOpacity: 0 }} />
            <stop offset="50%" style={{ stopColor: '#FF6B35', stopOpacity: 0.5 }} />
            <stop offset="100%" style={{ stopColor: '#FF6B35', stopOpacity: 0 }} />
          </linearGradient>

          {/* Deep shadow filter */}
          <filter id="deepShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" />
            <feOffset dx="1.5" dy="1.5" />
          </filter>

          {/* Soft glow filter */}
          <filter id="ropeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.6" />
            </feComponentTransfer>
          </filter>

          {/* Enhanced glow for visibility */}
          <filter id="brightGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.7" />
            </feComponentTransfer>
          </filter>

          {/* Texture filter for realism */}
          <filter id="textureFilter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" />
          </filter>
        </defs>

        {/* Background glow - creates depth and visibility */}
        <path
          d={generateRopePath()}
          stroke="#6B4423"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#ropeGlow)"
          opacity="0.5"
        />

        {/* Deep shadow layer - contrast */}
        <path
          d={generateRopePath()}
          stroke="#3D2817"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#deepShadow)"
          opacity="0.7"
        />

        {/* Main rope body - highly visible */}
        <path
          d={generateRopePath()}
          stroke="url(#ropeGradient)"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#textureFilter)"
          style={{
            willChange: 'stroke-dasharray, filter',
            transition: 'filter 0.2s ease-out',
            filter: isHovered ? 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.7))' : 'drop-shadow(0 3px 6px rgba(0, 0, 0, 0.3))',
          }}
        />

        {/* Rope highlight for dimension - golden shine */}
        <path
          d={generateRopePath()}
          stroke="url(#ropeHighlight)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.8"
        />

        {/* Velocity indicator glow - shows scroll speed */}
        {Math.abs(scrollVelocity) > 0.05 && (
          <path
            d={generateRopePath()}
            stroke="url(#velocityGlow)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={Math.min(0.8, Math.abs(scrollVelocity) * 2)}
            filter="url(#brightGlow)"
          />
        )}

        {/* Rope texture - visible fibers */}
        <g opacity="0.5">
          {[...Array(Math.floor(ropeSvgPoints / 3))].map((_, i) => {
            const progress = (i / (Math.floor(ropeSvgPoints / 3) - 1 || 1)) || 0;
            const baseSlack = scrollProgress * 100 * progress * progress;
            const y = progress * containerHeight - baseSlack;
            const baseX = isDesktop ? 30 : isTablet ? 25 : 20;
            return (
              <line
                key={i}
                x1={baseX - 4}
                y1={y}
                x2={baseX + 4}
                y2={y}
                stroke="#5C3317"
                strokeWidth="1"
                opacity="0.7"
              />
            );
          })}
        </g>

        {/* Additional texture details - rope weave */}
        <g opacity="0.4">
          {[...Array(Math.floor(ropeSvgPoints / 4))].map((_, i) => {
            const progress = (i / (Math.floor(ropeSvgPoints / 4) - 1 || 1)) || 0;
            const baseSlack = scrollProgress * 100 * progress * progress;
            const y = progress * containerHeight - baseSlack;
            const baseX = isDesktop ? 30 : isTablet ? 25 : 20;
            const offset = Math.sin(i * 0.5 + scrollProgress * 5) * 2.5;
            return (
              <circle
                key={`circle-${i}`}
                cx={baseX + offset}
                cy={y}
                r="0.6"
                fill="#B8860B"
                opacity="0.6"
              />
            );
          })}
        </g>
      </motion.svg>

      {/* Enhanced anchor points - more visible */}
      <motion.div 
        className="rope-anchor top"
        animate={{ scale: isHovered ? 1.3 : 1 }}
        transition={{ duration: 0.3 }}
      />
      <motion.div 
        className="rope-anchor bottom"
        animate={{ scale: isHovered ? 1.3 : 1 }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
};

export default InteractiveRope;
