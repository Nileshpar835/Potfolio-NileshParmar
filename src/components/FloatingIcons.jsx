import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useVelocity, useTransform, useSpring } from 'framer-motion';
import {
  Code2,
  Code,
  Zap,
  Square,
  Palette,
  GitBranch,
  Database,
  Lightbulb,
} from 'lucide-react';
import '../styles/FloatingIcons.css';

const FloatingIcons = ({ variant = 'hero' }) => {
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const containerRef = useRef(null);
  const velocityRef = useRef(0);
  const lastScrollRef = useRef(0);
  const lastTimeRef = useRef(Date.now());

  // Use Framer Motion scroll tracking
  const { scrollY: scrollYMotion, scrollYProgress } = useScroll();
  const scrollYVelocity = useVelocity(scrollYMotion);

  // Tech stack with color mappings and descriptions
  const icons = [
    {
      id: 1,
      name: 'Python',
      Icon: Code2,
      color: '#3776AB',
      glowColor: 'rgba(55, 118, 171, 0.6)',
      description: 'Data Science, Backend',
      position: { x: '-12%', y: '-10%' },
      mobilePosition: { x: '-5%', y: '-5%' },
      tabletPosition: { x: '-8%', y: '-8%' },
      duration: 8,
      delayOffset: 0,
    },
    {
      id: 2,
      name: 'JavaScript',
      Icon: Zap,
      color: '#F7DF1E',
      glowColor: 'rgba(247, 223, 30, 0.5)',
      description: 'Web Development',
      position: { x: '85%', y: '5%' },
      mobilePosition: { x: '85%', y: '10%' },
      tabletPosition: { x: '80%', y: '8%' },
      duration: 10,
      delayOffset: 0.2,
    },
    {
      id: 3,
      name: 'React',
      Icon: Code,
      color: '#61DAFB',
      glowColor: 'rgba(97, 218, 251, 0.6)',
      description: 'Frontend Frameworks',
      position: { x: '10%', y: '75%' },
      mobilePosition: { x: '15%', y: '70%' },
      tabletPosition: { x: '12%', y: '72%' },
      duration: 12,
      delayOffset: 0.4,
    },
    {
      id: 4,
      name: 'HTML',
      Icon: Square,
      color: '#E34C26',
      glowColor: 'rgba(227, 76, 38, 0.5)',
      description: 'Markup Language',
      position: { x: '80%', y: '70%' },
      mobilePosition: { x: '75%', y: '65%' },
      tabletPosition: { x: '78%', y: '68%' },
      duration: 9,
      delayOffset: 0.6,
    },
    {
      id: 5,
      name: 'CSS',
      Icon: Palette,
      color: '#1572B6',
      glowColor: 'rgba(21, 114, 182, 0.6)',
      description: 'Styling & Design',
      position: { x: '5%', y: '35%' },
      mobilePosition: { x: '10%', y: '40%' },
      tabletPosition: { x: '8%', y: '38%' },
      duration: 11,
      delayOffset: 0.8,
    },
    {
      id: 6,
      name: 'Node.js',
      Icon: Lightbulb,
      color: '#339933',
      glowColor: 'rgba(51, 153, 51, 0.6)',
      description: 'Runtime Environment',
      position: { x: '75%', y: '35%' },
      mobilePosition: { x: '70%', y: '32%' },
      tabletPosition: { x: '72%', y: '34%' },
      duration: 13,
      delayOffset: 1.0,
    },
    {
      id: 7,
      name: 'Git',
      Icon: GitBranch,
      color: '#F1502F',
      glowColor: 'rgba(241, 80, 47, 0.5)',
      description: 'Version Control',
      position: { x: '40%', y: '10%' },
      mobilePosition: { x: '50%', y: '15%' },
      tabletPosition: { x: '45%', y: '12%' },
      duration: 10,
      delayOffset: 1.2,
    },
    {
      id: 8,
      name: 'SQL',
      Icon: Database,
      color: '#336791',
      glowColor: 'rgba(51, 103, 145, 0.6)',
      description: 'Database Management',
      position: { x: '50%', y: '75%' },
      mobilePosition: { x: '55%', y: '72%' },
      tabletPosition: { x: '52%', y: '74%' },
      duration: 12,
      delayOffset: 1.4,
    },
  ];

  // Determine responsive settings and track scroll velocity
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const currentTime = Date.now();
      const timeDelta = currentTime - lastTimeRef.current;
      
      // Calculate scroll velocity (pixels per millisecond)
      if (timeDelta > 0) {
        velocityRef.current = (currentScroll - lastScrollRef.current) / timeDelta;
      }
      
      setScrollY(currentScroll);
      setScrollVelocity(velocityRef.current);
      lastScrollRef.current = currentScroll;
      lastTimeRef.current = currentTime;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Get appropriate positions based on device
  const getPosition = (icon) => {
    if (isMobile) return icon.mobilePosition;
    if (isTablet) return icon.tabletPosition;
    return icon.position;
  };

  // Get animation duration based on device
  const getAnimationDuration = (duration) => {
    if (isMobile) return duration * 1.5; // Slower on mobile
    if (isTablet) return duration * 1.2; // Slightly slower on tablet
    return duration;
  };

  // Filter icons based on variant and device
  const getDisplayIcons = () => {
    let displayIcons = icons;

    // On mobile, show only 3-4 icons
    if (isMobile) {
      displayIcons = [icons[0], icons[2], icons[4], icons[6]]; // Python, React, CSS, Git
    }
    // On tablet, show 5-6 icons
    else if (isTablet) {
      displayIcons = [icons[0], icons[1], icons[2], icons[4], icons[6], icons[7]];
    }

    // Filter for specific variant sections
    if (variant === 'skills') {
      // Skills section can show all or a subset
      return isMobile ? displayIcons.slice(0, 3) : displayIcons;
    }

    return displayIcons;
  };

  // Rope physics calculations
  const getRopePhysics = (delayOffset) => {
    // Clamp velocity for stability
    const clampedVelocity = Math.max(-1, Math.min(1, scrollVelocity * 200));
    
    // Base rope stretch influenced by scroll position
    const ropeStretch = scrollY * 0.15;
    
    // Rope tension increases with velocity (faster scroll = stronger wave)
    const ropeTension = Math.abs(clampedVelocity) * 0.8;
    
    // Swing amplitude increases with velocity and varies by delay offset
    const swingAmplitude = (ropeTension + 0.3) * (15 + delayOffset * 10);
    
    // Apply delayed response based on delayOffset (lag effect)
    const lagDelay = delayOffset * 50;
    
    return {
      baseY: ropeStretch,
      swingAmplitude,
      tension: ropeTension,
      velocity: clampedVelocity,
      lagDelay,
    };
  };

  // Pendulum swing calculation
  const getPendulumSwing = (delayOffset, amplitude, tension) => {
    // Time-based pendulum oscillation
    const time = scrollY / 50 + delayOffset * 2;
    const baseSwing = Math.sin(time) * amplitude;
    
    // Side to side swing influenced by velocity direction
    const sideSwing = Math.cos(time * 0.7) * amplitude * 0.4;
    
    return { x: sideSwing, y: baseSwing };
  };

  const displayIcons = getDisplayIcons();

  // Get responsive rope physics settings
  const getResponsiveRopeSettings = () => {
    if (isMobile) {
      return {
        swingMultiplier: 0.3, // Subtle rope drag only
        tensionMultiplier: 0.4,
        enableWaves: false,
      };
    }
    if (isTablet) {
      return {
        swingMultiplier: 0.6, // Reduced swing
        tensionMultiplier: 0.7,
        enableWaves: true,
      };
    }
    return {
      swingMultiplier: 1.0, // Full rope physics on desktop
      tensionMultiplier: 1.0,
      enableWaves: true,
    };
  };

  const ropeSettings = getResponsiveRopeSettings();

  return (
    <div className="floating-icons-container" ref={containerRef}>
      {displayIcons.map((icon) => {
        const position = getPosition(icon);
        const ropePhysics = getRopePhysics(icon.delayOffset);
        const pendulum = getPendulumSwing(
          icon.delayOffset,
          ropePhysics.swingAmplitude * ropeSettings.swingMultiplier,
          ropePhysics.tension
        );

        // Responsive-aware motion values
        const responsiveBaseY = isMobile
          ? ropePhysics.baseY * 0.3 // Minimal vertical movement on mobile
          : ropePhysics.baseY;

        const responsiveSwingX = isMobile
          ? pendulum.x * 0.2 // Subtle side swing on mobile
          : pendulum.x;

        const responsiveSwingY = isMobile
          ? pendulum.y * 0.2 // Minimal swing on mobile
          : pendulum.y;

        // Micro vibration after scroll stops (damped oscillation)
        const isMostlyScrolling = Math.abs(scrollVelocity) > 0.1;
        const vibrationIntensity = isMostlyScrolling ? 0 : 2;
        const microVibrationX = Math.sin(scrollY * 0.1) * vibrationIntensity;
        const microVibrationY = Math.cos(scrollY * 0.15) * vibrationIntensity;

        // Calculate total translation with spring damping
        const totalY =
          responsiveBaseY +
          responsiveSwingY +
          microVibrationY;
        const totalX =
          responsiveSwingX +
          microVibrationX;

        return (
          <motion.div
            key={icon.id}
            className="floating-icon-wrapper"
            style={{
              left: position.x,
              top: position.y,
              willChange: 'transform',
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: icon.delayOffset, duration: 0.8 }}
          >
            <motion.div
              className="floating-icon"
              animate={{
                x: totalX,
                y: totalY,
              }}
              transition={{
                type: 'spring',
                stiffness: isMobile ? 80 : 60, // Stiffer on mobile for less swing
                damping: isMobile ? 20 : 15, // More damping on mobile
                mass: 0.5,
              }}
            >
              <motion.div
                className="icon-inner"
                whileHover={{
                  scale: 1.15,
                  rotate: 5,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 10,
                }}
              >
                <motion.div
                  className="icon-glow"
                  style={{ backgroundColor: icon.glowColor }}
                  whileHover={{
                    opacity: 0.8,
                    scale: 1.2,
                  }}
                  transition={{ duration: 0.3 }}
                />

                <motion.div
                  className="icon-content"
                  style={{ color: icon.color }}
                  whileHover={{ scale: 1.05 }}
                >
                  <icon.Icon size={40} />
                </motion.div>

                {/* Tooltip */}
                <motion.div
                  className="icon-tooltip"
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="tooltip-title">{icon.name}</div>
                  <div className="tooltip-desc">{icon.description}</div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default FloatingIcons;
