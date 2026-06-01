'use client';

import { useEffect, useRef, useState } from 'react';
import styles from '../styles/ProjectsSection.module.css';
import ProjectDetailModal from './ProjectDetailModal';

interface Project {
  id: number;
  number: string;
  title: string;
  status: 'Completed' | 'In Development' | 'Production';
  description: string;
  fullDescription: string;
  tags: string[];
  liveLink?: string;
  liveUrl?: string;
  githubUrl?: string;
  images?: string[];
}

const projectsData: Project[] = [
  {
    id: 1,
    number: '01',
    title: 'AI-Driven Diagnostics For Health Innovation',
    status: 'Completed',
    description:
      'AI-powered platform for real-time disease prediction (lung cancer, diabetes, heart disease) using Machine Learning. Features smart diet planner, explainable AI insights, OCR-based medical report analysis, activity-based diet recommendations, gesture-based SOS emergency system, and hospital navigation.',
    fullDescription: `AI-powered platform for real-time disease prediction across lung cancer, diabetes, and heart disease using trained ML models. Features OCR-based medical report analysis to extract biomarkers (HbA1c, lipid profile), a smart diet planner, and explainable AI insights. Integrates Google Fit / Health Connect for activity-based recommendations. Gesture-based SOS emergency system built with OpenCV triggers live routing and alerts. Hospital navigation via Nominatim + Leaflet + OpenStreetMap.`,
    tags: ['Python', 'Machine Learning', 'Flask', 'OpenCV', 'Google Fit', 'Leaflet', 'Generative AI', 'OCR'],
    liveUrl: 'https://neuro-care-ai.netlify.app/',
    liveLink: 'https://neuro-care-ai.netlify.app/',
    images: ['/projects/health-ai-1.jpeg', '/projects/health-ai-2.jpeg'],
  },
  {
    id: 2,
    number: '02',
    title: 'JARVIS — Voice Activated Assistant',
    status: 'Completed',
    description:
      'Voice-activated desktop assistant that plays media, launches applications, and manages workflows. Integrated Google Slides and Forms APIs to automate creation of presentations and event forms. Recognized among SAKEC\'s best projects. Runner-Up at GITAM University IASF Bangalore with ₹5,000 cash prize.',
    fullDescription: `Voice-activated desktop assistant capable of playing media, launching applications, making calls, and managing complex workflows through natural language commands. Integrated Google Slides and Forms APIs to automate creation of presentations, worksheets, and event forms — built specifically for educators and students. Recognized among SAKEC's best final-year projects and presented at GITAM University IASF Bangalore, where it was awarded Runner-Up with a ₹5,000 cash prize.`,
    tags: ['Python', 'Google APIs', 'Voice AI', 'Automation', 'NLP'],
    images: ['/projects/jarvis-1.png'],
  },
  {
    id: 3,
    number: '03',
    title: 'QuickCourt — Sports Court Booking Platform',
    status: 'Completed',
    description:
      'Built during the 24-hour final round of the national Odoo Hackathon. Full-stack sports court booking platform with dashboards for administrators, managers, and users. Selected among top 350 from 19,000 participants nationally.',
    fullDescription: `Full-stack sports court booking platform built during the 24-hour final round of the national Odoo Hackathon in Gandhinagar, Gujarat. Selected among top 350 participants from 19,000 nationally. Features dedicated dashboards for administrators, facility managers, and end users. During the initial 8-hour round, built StackIt — a Quora-inspired Q&A web application.`,
    tags: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Full-Stack'],
    liveUrl: 'https://quick-court-beige.vercel.app/',
    liveLink: 'https://quick-court-beige.vercel.app/',
    images: ['/projects/quickcourt-1.png'],
  },
  // {
  //   id: 4,
  //   number: '04',
  //   title: 'Student–Faculty Ratio Application',
  //   status: 'Production',
  //   description:
  //     'Developed under the guidance of the HOD to support faculty requirement analysis based on student intake data. Currently deployed and actively used in production.',
  //   fullDescription: `Developed under the direct guidance of the HOD at SAKEC to support faculty requirement planning based on student intake data. Currently deployed and actively used by the department. Provides data-driven insights and reporting for academic administration decisions.`,
  //   tags: ['React', 'Node.js', 'Data Analysis', 'Production'],
  //   liveUrl: 'https://ai-ds-product-dev.vercel.app/login',
  //   liveLink: 'https://ai-ds-product-dev.vercel.app/login',
  //   images: ['/projects/faculty-ratio-1.svg'],
  // },
  // {
  //   id: 5,
  //   number: '05',
  //   title: 'NGO Event Participation Tracker',
  //   status: 'In Development',
  //   description:
  //     'Application to track student participation in NGO events for Agastya Foundation and Akshaya Shakti Foundation. Real-time tracking and reporting dashboard.',
  //   fullDescription: `Real-time tracking application for student participation in NGO events across Agastya Foundation, Akshaya Shakti Foundation, and partner colleges. Features an admin dashboard, participation reports, and college-wise analytics. Currently in active development.`,
  //   tags: ['React', 'Node.js', 'Dashboard', 'In Development'],
  //   images: ['/projects/ngo-tracker-1.svg'],
  // },
];

export default function ProjectsSection() {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cardRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const detailsButtonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});

  useEffect(() => {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const cardId = parseInt((entry.target as HTMLElement).getAttribute('data-card-id') || '0');
          setVisibleCards((prev) => new Set(prev).add(cardId));
        }
      });
    }, observerOptions);

    Object.values(cardRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return '#ff9838';
      case 'Production':
        return '#4ade80';
      case 'In Development':
        return '#fbbf24';
      default:
        return '#ff9838';
    }
  };

  const openModal = (project: Project) => {
    setActiveProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActiveProject(null);
  };

  return (
    <section className={styles.projectsSection} id="projects">
      {/* Section Heading */}
      <div className={styles.headingContainer}>
        <h2 className={styles.sectionHeading}>Selected Work</h2>
        <div className={styles.headingUnderline}></div>
      </div>

      {/* Projects Grid */}
      <div className={styles.projectsGrid}>
        {projectsData.map((project, index) => (
          <div
            key={project.id}
            ref={(el) => {
              if (el) cardRefs.current[project.id] = el;
            }}
            data-card-id={project.id}
            className={`${styles.projectCard} ${visibleCards.has(project.id) ? styles.visible : ''}`}
            style={{ '--delay': `${index * 120}ms` } as React.CSSProperties}
          >
            {/* Card Number */}
            <div className={styles.cardNumber}>{project.number}</div>

            {/* Project Title */}
            <h3 className={styles.projectTitle}>{project.title}</h3>

            {/* Status Badge */}
            <div
              className={styles.statusBadge}
              style={{ '--status-color': getStatusColor(project.status) } as React.CSSProperties}
            >
              {project.status}
            </div>

            {/* Description */}
            <p className={styles.projectDescription}>{project.description}</p>

            {/* Tags */}
            <div className={styles.tagsContainer}>
              {project.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Button Container */}
            <div className={styles.buttonContainer}>
              {/* View Details Button */}
              <button
                ref={(el) => {
                  if (el) detailsButtonRefs.current[project.id] = el;
                }}
                className={styles.viewDetailsButton}
                onClick={() => openModal(project)}
                aria-label={`View details for ${project.title}`}
              >
                View Details
              </button>

              {/* Live Link Button */}
              {(project.liveLink || project.liveUrl) && (
                <a href={project.liveLink || project.liveUrl} target="_blank" rel="noopener noreferrer" className={styles.liveButton}>
                  View Live →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={activeProject}
        isOpen={isModalOpen}
        onClose={closeModal}
        triggerRef={activeProject ? detailsButtonRefs.current[activeProject.id] : undefined}
      />
    </section>
  );
}
