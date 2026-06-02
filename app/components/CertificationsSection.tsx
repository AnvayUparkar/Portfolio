'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FiExternalLink, FiCheckCircle } from 'react-icons/fi';
import styles from '../styles/CertificationsSection.module.css';

// ════════════════════════════════════════════════════════════════════════════
// TYPE DEFINITION
// ════════════════════════════════════════════════════════════════════════════

export type Certification = {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
  verificationUrl?: string;
  logo: string;
  description: string;
  skills: string[];

  // Enhanced storytelling properties
  outcomes?: string[];
  badgeName?: string;
};

// ════════════════════════════════════════════════════════════════════════════
// DATA CONFIGURATION
// ════════════════════════════════════════════════════════════════════════════

const certificationsData: Certification[] = [
  {
    id: 'dl-genai',
    title: 'Generative AI for All',
    issuer: 'Infosys Spring Board',
    issueDate: 'Nov 2025',
    credentialId: 'DLAI-GENAI-LLM-55',
    verificationUrl: 'https://drive.google.com/file/d/1hbjeeuwTqpqC_WkDrMGMEc2c9RDOgQz2/view?usp=drive_link',
    logo: 'dl_ai',
    description: 'Advanced training in the generative AI lifecycle, including LLM pre-training, fine-tuning (PEFT/LoRA), reinforcement learning (RLHF), and RAG pipeline architectures.',
    skills: ['Generative AI', 'LLMs', 'LoRA', 'RLHF', 'RAG', 'Python', 'PyTorch', 'Hugging Face'],
    outcomes: [
      'Fine-tuned open-source models using parameter-efficient methods',
      'Built and evaluated retrieval-augmented generation pipelines',
      'Configured reinforcement learning with human feedback loops'
    ],
    badgeName: 'GenAI Expert'
  },
  // {
  //   id: 'gcp-ace',
  //   title: 'Associate Cloud Engineer',
  //   issuer: 'Google Cloud',
  //   issueDate: 'Jan 2026',
  //   credentialId: 'GCP-ACE-9824',
  //   verificationUrl: 'https://drive.google.com/file/d/1_gcp_cert_drive_link/view?usp=sharing',
  //   logo: 'gcp',
  //   description: 'Validation of expertise in deploying applications, monitoring operations, and managing enterprise cloud projects on Google Cloud Platform.',
  //   skills: ['Google Cloud', 'Cloud Computing', 'Kubernetes (GKE)', 'Compute Engine', 'DevOps', 'IAM'],
  //   outcomes: [
  //     'Deploy and manage multi-container GKE applications',
  //     'Configure VPCs, firewalls, and cloud IAM security policies',
  //     'Implement auto-scaling and serverless cloud functions'
  //   ],
  //   badgeName: 'GCP Cloud'
  // },
  // {
  //   id: 'dl-genai',
  //   title: 'Generative AI for All',
  //   issuer: 'Infosys Spring Board',
  //   issueDate: 'Nov 2025',
  //   credentialId: 'DLAI-GENAI-LLM-55',
  //   verificationUrl: 'https://drive.google.com/file/d/1_genai_cert_drive_link/view?usp=sharing',
  //   logo: 'dl_ai',
  //   description: 'Advanced training in the generative AI lifecycle, including LLM pre-training, fine-tuning (PEFT/LoRA), reinforcement learning (RLHF), and RAG pipeline architectures.',
  //   skills: ['Generative AI', 'LLMs', 'LoRA', 'RLHF', 'RAG', 'Python', 'PyTorch', 'Hugging Face'],
  //   outcomes: [
  //     'Fine-tuned open-source models using parameter-efficient methods',
  //     'Built and evaluated retrieval-augmented generation pipelines',
  //     'Configured reinforcement learning with human feedback loops'
  //   ],
  //   badgeName: 'GenAI Expert'
  // },
  {
    id: 'ibm-ai',
    title: 'Artificial Intelligence Fundamentals ',
    issuer: 'IBM SkillsBuild',
    issueDate: 'Oct 2024',
    credentialId: 'MS-AI-102-7728',
    verificationUrl: 'https://drive.google.com/file/d/1f0EBfu-O8CU0-8j_7F-C_3IDzQNsvU7d/view?usp=drive_link',
    logo: 'ibm',
    description: 'Specialized certification for implementing AI solutions using IBM`s Generative AI services.',
    skills: ['IBM AI', 'Cognitive Services', 'IBM Watson', 'Semantic Search', 'Vector DB', 'NLP'],
    outcomes: [
      'Deployed secure private LLM endpoints with IBM Watson',
      'Built enterprise vector search indices using IBM AI Search',
      'Implemented semantic search, OCR, and speech-to-text systems'
    ],
    badgeName: 'IBM AI'
  },
  {
    id: 'dl-spec',
    title: 'Introduction to Cybersecurity',
    issuer: 'DeepLearning.AI',
    issueDate: 'Dec 2024',
    credentialId: 'DLAI-DLS-1029',
    verificationUrl: 'https://drive.google.com/file/d/1tVcBjWydTtQJfxnM8Kw5ILIMs13QkMfW/view?usp=sharing',
    logo: 'dl_ai',
    description: 'Foundational mastery of cybersecurity concepts, including security principles, threat landscapes, and best practices in secure coding and data protection.',
    skills: ['Cybersecurity', 'Network Security', 'Identity and Access Management (IAM)', 'Cryptography basics', 'Security best practices'],
    outcomes: [
      'Learned core security principles and threat landscape',
      'Understood network security fundamentals',
      'Practiced secure coding and data protection techniques'
    ],
    badgeName: 'Cybersecurity'
  }
];

// ════════════════════════════════════════════════════════════════════════════
// MODERN SVG LOGOS
// ════════════════════════════════════════════════════════════════════════════

const getLogoIcon = (logoName: string) => {
  switch (logoName) {
    case 'gcp':
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" fill="#4285F4" />
          <path d="M19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z" fill="#34A853" />
          <path d="M19.35 10.04a7.5 7.5 0 00-14.7 0A5 5 0 005 20h14a5 5 0 00.35-9.96z" stroke="white" strokeWidth="0.5" />
        </svg>
      );
    case 'dl_ai':
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="6" fill="#FF9838" fillOpacity="0.1" stroke="#FF9838" strokeWidth="1" />
          <circle cx="12" cy="12" r="6" stroke="#FF9838" strokeWidth="2" />
          <circle cx="12" cy="12" r="3" stroke="#FF9838" strokeWidth="1.2" strokeDasharray="2 2" />
          <circle cx="12" cy="12" r="1.2" fill="#FF9838" />
        </svg>
      );
    case 'azure':
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.5 19L11.5 6L14.5 11.5L8.5 19H5.5Z" fill="#0078D4" />
          <path d="M18.5 19L12.5 6H15.5L21.5 19H18.5Z" fill="#50E4FF" />
          <path d="M11.5 6L8.5 12.5L14.5 11.5L11.5 6Z" fill="#005B9E" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
  }
};

// ════════════════════════════════════════════════════════════════════════════
// MEDIA QUERY CUSTOM HOOK
// ════════════════════════════════════════════════════════════════════════════

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

// ════════════════════════════════════════════════════════════════════════════
// 3D TILT HOVER CARD COMPONENT
// ════════════════════════════════════════════════════════════════════════════

interface CertificationCardProps {
  cert: Certification;
  index: number;
  total: number;
  isActive: boolean;
  cardScale: number;
  cardY: number;
  cardOpacity: number;
}

const CertificationCard: React.FC<CertificationCardProps> = ({
  cert,
  index,
  total,
  isActive,
  cardScale,
  cardY,
  cardOpacity,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const px = (x / rect.width) - 0.5;
    const py = (y / rect.height) - 0.5;

    const maxTilt = 6;
    setTilt({
      x: -py * maxTilt,
      y: px * maxTilt,
    });
    setGlowPos({ x, y });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <motion.div
      className={styles.cardWrapper}
      animate={{
        scale: cardScale,
        y: cardY,
        opacity: cardOpacity,
      }}
      transition={{
        type: 'spring',
        stiffness: 120,
        damping: 20,
        mass: 0.8,
      }}
      style={{
        zIndex: isActive ? 100 : 10 + index,
      }}
    >
      <div
        ref={cardRef}
        className={styles.cardContainer}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isHovered
            ? `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`
            : 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: isHovered ? 'none' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className={styles.card}>
          {/* Spotlight cursor glow */}
          <div
            className={styles.cardGlow}
            style={{
              left: `${glowPos.x}px`,
              top: `${glowPos.y}px`,
              opacity: isHovered ? 1 : 0,
            }}
          />

          {/* Separated animated content wrapper to hide/blur inactive cards text layers */}
          <motion.div
            className={styles.cardContentWrapper}
            animate={{
              opacity: isActive ? 1 : 0,
              filter: isActive ? 'blur(0px)' : 'blur(10px)',
            }}
            transition={{
              duration: 0.4,
              ease: 'easeInOut',
            }}
            style={{
              pointerEvents: isActive ? 'auto' : 'none',
            }}
          >
            {/* Left Side Details */}
            <div className={styles.cardLeft}>
              <div>
                <div className={styles.cardTop}>
                  <div className={styles.logoWrapper}>
                    {getLogoIcon(cert.logo)}
                  </div>
                  <div className={styles.metaInfo}>
                    <span className={styles.issuer}>{cert.issuer}</span>
                    <span className={styles.date}>{cert.issueDate}</span>
                  </div>
                </div>

                <div className={styles.cardCenter}>
                  <h3 className={styles.certTitle}>{cert.title}</h3>
                  <p className={styles.certDescription}>{cert.description}</p>

                  {cert.outcomes && (
                    <ul className={styles.outcomesList}>
                      {cert.outcomes.map((outcome, oIdx) => (
                        <li key={oIdx} className={styles.outcomeItem}>
                          <span className={styles.outcomeCheck}>
                            <FiCheckCircle size={14} />
                          </span>
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className={styles.tags}>
                {cert.skills.map((skill) => (
                  <span key={skill} className={styles.tag}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Side Credentials */}
            <div className={styles.cardRight}>
              <div className={styles.badgeWrapper}>
                <div className={styles.certBadge}>
                  <div className={styles.badgeRibbon} />
                  <span>{cert.badgeName || 'Certified'}</span>
                </div>
              </div>

              {cert.verificationUrl && (
                <a
                  href={cert.verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.verifyBtn}
                >
                  Verify <FiExternalLink size={12} style={{ marginLeft: '4px' }} />
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// MAIN CERTIFICATIONS SECTION
// ════════════════════════════════════════════════════════════════════════════

export default function CertificationsSection() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [activeIndex, setActiveIndex] = useState(0);

  const totalCards = certificationsData.length;

  // Header Animation States (in-view reveal)
  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  // Timeline progress line animated height percentage
  const progressPercent = (activeIndex / (totalCards - 1)) * 100;

  return (
    <section className={styles.section} id="certifications">
      {/* Background visual components */}
      <div className={styles.backgroundLayer}>
        <div className={styles.gradientRadial} />
        <div className={styles.glowCenter} />
        <div className={styles.gridFade} />
        <div className={styles.lightRay1} />
        <div className={styles.lightRay2} />
      </div>

      <div className={styles.content}>
        {/* Section Header */}
        <motion.div
          className={styles.header}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={headerVariants}
        >
          <motion.div className={styles.badge} variants={itemVariants}>
            <span className={styles.badgeOuter} />
            <span className={styles.badgeText}>Professional Growth</span>
          </motion.div>

          <motion.h2 className={styles.title} variants={itemVariants}>
            Certifications & Continuous Learning
          </motion.h2>

          <motion.p className={styles.description} variants={itemVariants}>
            Industry-recognized certifications and specialized training that strengthen my expertise in Artificial Intelligence, Cloud Computing, Software Engineering, Full Stack Development, and Emerging Technologies.
          </motion.p>
        </motion.div>

        {isMobile ? (
          // ── MOBILE VIEW (Standard vertical layout) ──
          <div className="space-y-6">
            {certificationsData.map((cert, index) => (
              <motion.div
                key={cert.id}
                className={styles.mobileCard}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
              >
                <div className={styles.mobileTop}>
                  <div className={styles.mobileIssuerRow}>
                    <div className={styles.mobileLogo}>
                      {getLogoIcon(cert.logo)}
                    </div>
                    <div>
                      <span className={styles.issuer}>{cert.issuer}</span>
                      <div className={styles.date}>{cert.issueDate}</div>
                    </div>
                  </div>
                  <span className={styles.tag} style={{ opacity: 1, borderColor: 'rgba(var(--color-glow-base), 0.25)', color: 'var(--color-accent)' }}>
                    {cert.badgeName || 'Certified'}
                  </span>
                </div>

                <div className={styles.mobileCenter}>
                  <h3 className={styles.mobileTitle}>{cert.title}</h3>
                  <p className={styles.mobileDescription}>{cert.description}</p>

                  {cert.outcomes && (
                    <ul className={styles.outcomesList} style={{ marginTop: '0.8rem' }}>
                      {cert.outcomes.map((outcome, oIdx) => (
                        <li key={oIdx} className={styles.outcomeItem}>
                          <span className={styles.outcomeCheck}>
                            <FiCheckCircle size={12} />
                          </span>
                          <span style={{ fontSize: '0.85rem' }}>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className={styles.mobileBottom}>
                  <div className={styles.tags}>
                    {cert.skills.map((skill) => (
                      <span key={skill} className={styles.tag}>
                        {skill}
                      </span>
                    ))}
                  </div>

                  {cert.verificationUrl && (
                    <a
                      href={cert.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.mobileVerifyBtn}
                    >
                      Verify Credential <FiExternalLink size={12} style={{ marginLeft: '6px' }} />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          // ── DESKTOP/TABLET VIEW (Node Selection Stack) ──
          <div className={styles.scrollTrack}>
            <div className={styles.stickyContainer}>
              <div className={styles.layoutGrid}>

                {/* Vertical Interactive Timeline */}
                <div className={styles.timelineWrapper}>
                  <div className={styles.timelineItems}>
                    {/* Centered progress lines inside flex container */}
                    <div className={styles.timelineLineBase} />
                    <motion.div
                      className={styles.timelineLineProgress}
                      animate={{ height: `${progressPercent}%` }}
                      transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                      style={{ height: '0%' }}
                    />

                    {certificationsData.map((cert, index) => {
                      const isActive = index === activeIndex;
                      const isCompleted = index < activeIndex;

                      return (
                        <div
                          key={cert.id}
                          className={`${styles.timelineNode} ${isActive ? styles.nodeActive : ''} ${isCompleted ? styles.nodeCompleted : ''}`}
                          onClick={() => setActiveIndex(index)}
                        >
                          <div className={styles.nodeDotWrapper}>
                            <div className={`${styles.nodeDot} ${isActive ? styles.nodeDotActive : ''} ${isCompleted ? styles.nodeDotCompleted : ''}`} />
                          </div>
                          <div className={styles.nodeContent}>
                            <span className={styles.nodeIssuer}>{cert.issuer}</span>
                            <span className={styles.nodeTitle}>{cert.title}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Overlapping Card Stack */}
                <div className={styles.stackWrapper}>
                  {certificationsData.map((cert, index) => {
                    const isActive = index === activeIndex;
                    const d = activeIndex - index;

                    let cardScale = 0.95;
                    let cardY = 150;
                    let cardOpacity = 0;

                    if (isActive) {
                      cardScale = 1.0;
                      cardY = 0;
                      cardOpacity = 1.0;
                    } else if (index < activeIndex) {
                      // Stacked underneath active card (Cards N-1, N-2, N-3+)
                      cardScale = Math.max(0.88, 1.0 - d * 0.04);
                      cardY = -d * 22;
                      cardOpacity = Math.max(0.2, 1.0 - d * 0.3);
                    } else {
                      // Sits below the stack (Card N+1, N+2)
                      cardScale = 0.95;
                      cardY = 150;
                      cardOpacity = 0;
                    }

                    return (
                      <CertificationCard
                        key={cert.id}
                        cert={cert}
                        index={index}
                        total={totalCards}
                        isActive={isActive}
                        cardScale={cardScale}
                        cardY={cardY}
                        cardOpacity={cardOpacity}
                      />
                    );
                  })}
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
