'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, useInView, useMotionValue, useTransform } from 'framer-motion';
import styles from '../styles/TechStackSection.module.css';
import {
  SiReact,
  SiTypescript,
  SiJavascript,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiMysql,
  SiFirebase,
  SiFlask,
  SiDjango,
  SiGit,
  SiGithub,
  SiFigma,
  SiPostman,
  SiGooglecloud,
  SiTailwindcss,
  SiBootstrap,
  SiSupabase,
  SiOpenai,
} from 'react-icons/si';
import { GiArtificialIntelligence } from 'react-icons/gi';
import { BiLogoPostgresql } from 'react-icons/bi';

// ════════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ════════════════════════════════════════════════════════════════════════════

interface Technology {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'AI/ML' | 'Database' | 'Cloud' | 'Tools';
  icon: React.ReactNode;
  description: string;
  color: string;
  orbitLayer: 1 | 2 | 3;
}

interface CategoryMetric {
  label: string;
  value: number;
  delay: number;
}

interface HoverState {
  techId: string | null;
  mouseX: number;
  mouseY: number;
}

// ════════════════════════════════════════════════════════════════════════════
// TECHNOLOGY DATA
// ════════════════════════════════════════════════════════════════════════════

const GeminiIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '1em', height: '1em' }}>
    <defs>
      <linearGradient id="geminiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9b72ff" />
        <stop offset="50%" stopColor="#4a88f7" />
        <stop offset="100%" stopColor="#ff7c7c" />
      </linearGradient>
    </defs>
    <path d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z" fill="url(#geminiGrad)" />
  </svg>
);

const TECHNOLOGIES: Technology[] = [
  // Layer 1: Frontend
  { id: 'react', name: 'React', category: 'Frontend', icon: <SiReact />, description: 'UI library for building interactive interfaces', color: '#61dafb', orbitLayer: 1 },
  { id: 'typescript', name: 'TypeScript', category: 'Frontend', icon: <SiTypescript />, description: 'Typed superset of JavaScript', color: '#3178c6', orbitLayer: 1 },
  { id: 'nodejs', name: 'Node.js', category: 'Backend', icon: <SiNodedotjs />, description: 'JavaScript runtime environment', color: '#68a063', orbitLayer: 1 },
  { id: 'mongodb', name: 'MongoDB', category: 'Database', icon: <SiMongodb />, description: 'NoSQL document database', color: '#00ed64', orbitLayer: 1 },

  // Layer 2: Mixed
  { id: 'gemini', name: 'Gemini', category: 'AI/ML', icon: <GeminiIcon />, description: 'Google\'s generative AI model', color: '#9b72ff', orbitLayer: 2 },
  { id: 'openai', name: 'OpenAI', category: 'AI/ML', icon: <SiOpenai />, description: 'Advanced AI APIs & models', color: '#10a37f', orbitLayer: 2 },
  { id: 'firebase', name: 'Firebase', category: 'Database', icon: <SiFirebase />, description: 'Backend-as-a-service platform', color: '#ffa000', orbitLayer: 2 },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'Frontend', icon: <SiTailwindcss />, description: 'Utility-first CSS framework', color: '#06b6d4', orbitLayer: 2 },
  { id: 'github', name: 'GitHub', category: 'Tools', icon: <SiGithub />, description: 'Version control & collaboration', color: '#ffffff', orbitLayer: 2 },
  { id: 'supabase', name: 'Supabase', category: 'Database', icon: <SiSupabase />, description: 'Open-source Firebase alternative', color: '#3ecf8e', orbitLayer: 2 },

  // Layer 3: Backend & Tools
  { id: 'flask', name: 'Flask', category: 'Backend', icon: <SiFlask />, description: 'Lightweight Python web framework', color: '#ffffff', orbitLayer: 3 },
  { id: 'django', name: 'Django', category: 'Backend', icon: <SiDjango />, description: 'Full-featured Python framework', color: '#092e20', orbitLayer: 3 },
  { id: 'mysql', name: 'MySQL', category: 'Database', icon: <SiMysql />, description: 'Relational database system', color: '#00758f', orbitLayer: 3 },
  { id: 'postgresql', name: 'PostgreSQL', category: 'Database', icon: <BiLogoPostgresql />, description: 'Advanced relational database', color: '#336791', orbitLayer: 3 },
  { id: 'gcp', name: 'Google Cloud', category: 'Cloud', icon: <SiGooglecloud />, description: 'Cloud computing platform', color: '#ea4335', orbitLayer: 3 },
  { id: 'git', name: 'Git', category: 'Tools', icon: <SiGit />, description: 'Version control system', color: '#f1502f', orbitLayer: 3 },
];

const CATEGORIES: CategoryMetric[] = [
  { label: '20+ Technologies', value: 20, delay: 0 },
  { label: 'AI-Powered Solutions', value: 100, delay: 0.2 },
  { label: 'Full Stack Development', value: 100, delay: 0.4 },
  { label: 'Cloud Native Apps', value: 100, delay: 0.6 },
];



// ════════════════════════════════════════════════════════════════════════════
// TOOLTIP COMPONENT
// ════════════════════════════════════════════════════════════════════════════

interface TooltipProps {
  tech: Technology;
  mouseX: number;
  mouseY: number;
}

const Tooltip: React.FC<TooltipProps> = ({ tech, mouseX, mouseY }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={styles.tooltip}
      style={{
        left: `${mouseX}px`,
        top: `${mouseY - 80}px`,
      }}
    >
      <div className={styles.tooltipHeader}>
        <span className={styles.tooltipName}>{tech.name}</span>
        <span className={styles.tooltipCategory}>{tech.category}</span>
      </div>
      <p className={styles.tooltipDescription}>{tech.description}</p>
    </motion.div>
  );
};

// ════════════════════════════════════════════════════════════════════════════


// ════════════════════════════════════════════════════════════════════════════
// CENTRAL AI CORE
// ════════════════════════════════════════════════════════════════════════════

const AiCore: React.FC = () => {
  return (
    <div className={styles.aiCore}>
      {/* Outer glow ring */}
      <motion.div
        className={styles.glowRing}
        animate={{
          opacity: [0.3, 0.8, 0.3],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Inner core */}
      <motion.div
        className={styles.coreInner}
        animate={{
          boxShadow: [
            '0 0 20px rgba(var(--color-glow-base), 0.4)',
            '0 0 40px rgba(var(--color-glow-base), 0.8)',
            '0 0 20px rgba(var(--color-glow-base), 0.4)',
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <motion.div
          className={styles.corePulse}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <GiArtificialIntelligence size={40} />
        </motion.div>
      </motion.div>

      {/* Rotating rings */}
      <motion.div
        className={styles.rotatingRing}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className={styles.rotatingRing}
        style={{ animationDelay: '0.5s' }}
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      />

      {/* Text */}
      <div className={styles.coreText}>
        <p className={styles.coreRole}>AI Engineer</p>
        <p className={styles.coreRole}>Full Stack Developer</p>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// CATEGORY PILLS
// ════════════════════════════════════════════════════════════════════════════

interface CategoryPillsProps {
  inView: boolean;
}

const CategoryPills: React.FC<CategoryPillsProps> = ({ inView }) => {
  const categories = ['Frontend', 'Backend', 'AI & ML', 'Database', 'Cloud', 'Tools'];

  return (
    <motion.div
      className={styles.categoryPills}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      {categories.map((category, idx) => (
        <motion.div
          key={category}
          className={styles.categoryPill}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.4, delay: 0.5 + idx * 0.08 }}
          whileHover={{
            scale: 1.05,
            boxShadow: '0 0 25px rgba(var(--color-glow-base), 0.4)',
          }}
        >
          {category}
        </motion.div>
      ))}
    </motion.div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// METRICS DISPLAY
// ════════════════════════════════════════════════════════════════════════════

interface MetricsProps {
  inView: boolean;
}

const Metrics: React.FC<MetricsProps> = ({ inView }) => {
  return (
    <motion.div
      className={styles.metricsContainer}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      {CATEGORIES.map((metric) => (
        <div key={metric.label} className={styles.metricItem}>
          <motion.div
            className={styles.metricValue}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 0.8 + metric.delay }}
          >
            {inView ? <AnimatedNumber target={metric.value} /> : '0'}
            {metric.label === '20+ Technologies' ? '+' : '%'}
          </motion.div>
          <p className={styles.metricLabel}>{metric.label}</p>
        </div>
      ))}
    </motion.div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// ANIMATED NUMBER COUNTER
// ════════════════════════════════════════════════════════════════════════════

interface AnimatedNumberProps {
  target: number;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ target }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const animation = { duration: 1, ease: 'easeOut' };
    count.set(target);
  }, [target, count]);

  return <motion.span>{rounded}</motion.span>;
};

// ════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════

export default function TechStackSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.05 });
  const [hoverState, setHoverState] = useState<HoverState>({ techId: null, mouseX: 0, mouseY: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [orbitRadius, setOrbitRadius] = useState(180);

  // Refs for 3D sphere DOM manipulation
  const sphereRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const hoveredTechIdRef = useRef<string | null>(null);

  const angleRef = useRef({ x: 0, y: 0 });
  const currentSpeed = useRef({ x: 0.03, y: 0.03 });
  const targetSpeed = useRef({ x: 0.03, y: 0.03 });

  // Drag interaction states
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const totalDragDist = useRef(0);

  // Handle responsive orbit size and window mouseup drag release
  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      if (width < 640) setOrbitRadius(120);
      else if (width < 768) setOrbitRadius(150);
      else if (width < 1024) setOrbitRadius(160);
      else setOrbitRadius(180);
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    const handleWindowMouseUp = () => {
      isDragging.current = false;
    };
    window.addEventListener('mouseup', handleWindowMouseUp);

    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, []);

  const handleHover = useCallback((techId: string | null, mouseX: number, mouseY: number) => {
    setHoverState({ techId, mouseX, mouseY });
  }, []);

  // Compute uniform distribution of points on a sphere using Fibonacci Sphere algorithm
  const initialPoints = useMemo(() => {
    const points = [];
    const total = TECHNOLOGIES.length;
    const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle in radians

    for (let i = 0; i < total; i++) {
      const y = 1 - (i / (total - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y); // radius at y

      const theta = phi * i; // golden angle increment

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      points.push({ x, y, z });
    }
    return points;
  }, []);

  // Animation loop for 3D rotation of the sphere
  useEffect(() => {
    if (isMobile) return;

    let active = true;
    const animate = () => {
      if (!active) return;

      // Smoothly interpolate current speed towards target speed
      currentSpeed.current.x += (targetSpeed.current.x - currentSpeed.current.x) * 0.05;
      currentSpeed.current.y += (targetSpeed.current.y - currentSpeed.current.y) * 0.05;

      // Update rotation angles
      angleRef.current.x += currentSpeed.current.x;
      angleRef.current.y += currentSpeed.current.y;

      const cosX = Math.cos(angleRef.current.x);
      const sinX = Math.sin(angleRef.current.x);
      const cosY = Math.cos(angleRef.current.y);
      const sinY = Math.sin(angleRef.current.y);

      const radius = orbitRadius * 1.25; // Scale sphere radius slightly larger

      initialPoints.forEach((point, idx) => {
        const el = elementsRef.current[idx];
        if (!el) return;

        // 3D rotation around Y and X axes
        // Rotate around Y axis
        const x1 = point.x * cosY - point.z * sinY;
        const z1 = point.x * sinY + point.z * cosY;

        // Rotate around X axis
        const y2 = point.y * cosX - z1 * sinX;
        const pz = point.y * sinX + z1 * cosX;

        const px = x1 * radius;
        const py = y2 * radius;

        // Perspective scaling
        const depth = radius * 2.2;
        const scale = (depth + pz) / depth;

        // Hover scale factor
        const isHovered = hoveredTechIdRef.current === TECHNOLOGIES[idx].id;
        const hoverScale = isHovered ? 1.35 : 1.0;
        const finalScale = scale * hoverScale;

        // Opacity mapping (range 0.2 to 1)
        const opacity = 0.2 + 0.8 * ((pz + radius) / (2 * radius));

        // Z-Index mapping (range 1 to 200, boosted on hover to render on top)
        const zIndex = isHovered ? 99999 : Math.round((pz + radius) * 100);

        // Direct DOM updates for 60fps performance
        el.style.transform = `translate3d(${px}px, ${py}px, ${pz}px) scale(${finalScale})`;
        el.style.opacity = opacity.toString();
        el.style.zIndex = zIndex.toString();

        if (isHovered) {
          el.classList.add(styles.orbHovered);
        } else {
          el.classList.remove(styles.orbHovered);
        }
      });

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
    return () => {
      active = false;
    };
  }, [isMobile, initialPoints, orbitRadius]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    totalDragDist.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sphereRef.current) return;

    if (isDragging.current) {
      const deltaX = e.clientX - dragStart.current.x;
      const deltaY = e.clientY - dragStart.current.y;

      totalDragDist.current += Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      dragStart.current = { x: e.clientX, y: e.clientY };

      // Horizontal dragging rotates Y axis, vertical dragging rotates X axis
      angleRef.current.y += deltaX * 0.005;
      angleRef.current.x -= deltaY * 0.005;

      // Update target speed to reflect drag momentum on release
      targetSpeed.current = {
        x: -deltaY * 0.001,
        y: deltaX * 0.001,
      };
    } else {
      // Normal hover speed adjustment
      const rect = sphereRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mx = (e.clientX - centerX) / (rect.width / 2);
      const my = (e.clientY - centerY) / (rect.height / 2);

      targetSpeed.current = {
        x: -my * 0.012, // vertical movement rotates around X-axis
        y: mx * 0.012,  // horizontal movement rotates around Y-axis
      };
    }
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
    targetSpeed.current = {
      x: 0.002,
      y: 0.002,
    };
    hoveredTechIdRef.current = null;
    handleHover(null, 0, 0);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <section ref={containerRef} className={styles.section}>
      {/* Background Effects */}
      <div className={styles.backgroundLayer}>
        <div className={styles.gradientRadial} />
        <div className={styles.glowCenter} />
        <div className={styles.gridFade} />
        <div className={styles.particleField} />
      </div>

      <div className={styles.content}>
        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className={styles.badge}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <span className={styles.badgeOuter} />
            <span className={styles.badgeText}>Technology Ecosystem</span>
          </motion.div>

          <motion.h2
            className={styles.title}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Technologies Behind My AI Systems
          </motion.h2>

          <motion.p
            className={styles.description}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            A carefully selected ecosystem of technologies I use to design, develop, deploy, and scale intelligent applications.
          </motion.p>
        </motion.div>

        {/* Orbital System */}
        {isMobile ? (
          // Mobile: Grid layout
          <motion.div
            className={styles.mobileGrid}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {TECHNOLOGIES.map((tech, idx) => (
              <motion.div
                key={tech.id}
                className={styles.mobileCard}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: 0.5 + idx * 0.03 }}
                whileHover={{
                  scale: 1.08,
                  boxShadow: `0 0 25px ${tech.color}40`,
                }}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  handleHover(tech.id, rect.left + rect.width / 2, rect.top);
                }}
                onMouseLeave={() => handleHover(null, 0, 0)}
              >
                <div className={styles.mobileCardIcon} style={{ color: tech.color }}>
                  {tech.icon}
                </div>
                <p className={styles.mobileCardName}>{tech.name}</p>
                <span className={styles.mobileCardCategory}>{tech.category}</span>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          // Desktop: 3D Sphere of Technologies
          <motion.div
            className={styles.orbitalContainer}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
          >
            {/* Central AI Core sits in the center of the 3D Sphere */}
            <div className={styles.orbitalCenter}>
              <AiCore />
            </div>

            {/* 3D Sphere wrapper with preserve-3d style */}
            <div ref={sphereRef} className={styles.orbitalsWrapper} style={{ transformStyle: 'preserve-3d' }}>
              {TECHNOLOGIES.map((tech, idx) => (
                <div
                  key={tech.id}
                  ref={(el) => {
                    elementsRef.current[idx] = el;
                  }}
                  className={styles.techOrb}
                  onMouseEnter={(e) => {
                    hoveredTechIdRef.current = tech.id;
                    const rect = e.currentTarget.getBoundingClientRect();
                    handleHover(tech.id, rect.left + rect.width / 2, rect.top);
                  }}
                  onMouseLeave={() => {
                    hoveredTechIdRef.current = null;
                    handleHover(null, 0, 0);
                  }}
                  onClick={(e) => {
                    if (totalDragDist.current > 7) {
                      e.preventDefault();
                      return;
                    }
                    const rect = e.currentTarget.getBoundingClientRect();
                    handleHover(tech.id, rect.left + rect.width / 2, rect.top);
                  }}
                  style={{
                    '--tech-color': tech.color,
                  } as React.CSSProperties}
                >
                  <div className={styles.orbIcon}>{tech.icon}</div>
                  <span className={styles.orbLabel}>{tech.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tooltip */}
        {hoverState.techId && !isMobile && (
          <Tooltip
            tech={TECHNOLOGIES.find((t) => t.id === hoverState.techId)!}
            mouseX={hoverState.mouseX}
            mouseY={hoverState.mouseY}
          />
        )}

        {/* Category Pills */}
        <CategoryPills inView={isInView} />

        {/* Metrics */}
        <Metrics inView={isInView} />
      </div>
    </section>
  );
}
