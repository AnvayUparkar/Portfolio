'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import styles from '../styles/ProjectDetailModal.module.css';

interface Project {
  id: number;
  number: string;
  title: string;
  status: 'Completed' | 'In Development' | 'Production';
  fullDescription: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  images?: string[];
}

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: HTMLElement | null;
}

export default function ProjectDetailModal({
  project,
  isOpen,
  onClose,
  triggerRef,
}: ProjectDetailModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [imageAutoAdvance, setImageAutoAdvance] = useState(true);
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const projectImages = project?.images && project.images.length > 0 ? project.images : [];
  const hasMultipleImages = projectImages.length > 1;

  // Auto-advance slideshow
  useEffect(() => {
    if (!isOpen || !hasMultipleImages || !imageAutoAdvance) {
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
      return;
    }

    autoAdvanceTimerRef.current = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % projectImages.length);
    }, 3500);

    return () => {
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    };
  }, [isOpen, hasMultipleImages, imageAutoAdvance, projectImages.length]);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsExiting(true);
        setTimeout(() => {
          onClose();
          setIsExiting(false);
          setActiveImageIndex(0);
          if (triggerRef && typeof triggerRef.focus === 'function') {
            triggerRef.focus();
          }
        }, 350);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, triggerRef]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  // Cleanup all state on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    };
  }, []);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll(
      'button, a, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
      setIsExiting(false);
      setActiveImageIndex(0);
      if (triggerRef && typeof triggerRef.focus === 'function') {
        triggerRef.focus();
      }
    }, 350);
  };

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? projectImages.length - 1 : prev - 1));
    setImageAutoAdvance(false);
    setTimeout(() => setImageAutoAdvance(true), 500);
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % projectImages.length);
    setImageAutoAdvance(false);
    setTimeout(() => setImageAutoAdvance(true), 500);
  };

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

  if (!project) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`${styles.backdrop} ${isExiting ? styles.backdropExit : isOpen ? styles.backdropEnter : ''}`}
        onClick={handleOutsideClick}
        aria-hidden={!isOpen}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`${styles.modal} ${isExiting ? styles.modalExit : isOpen ? styles.modalEnter : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={`${project.title} details`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Close modal"
          tabIndex={0}
        >
          ✕
        </button>

        {/* Modal Content */}
        <div ref={contentRef} className={styles.content}>
          {/* Left Column - Image(s) */}
          <div className={styles.leftColumn}>
            {projectImages.length > 0 ? (
              <div
                className={styles.imageContainer}
                ref={imageContainerRef}
                onMouseEnter={() => setImageAutoAdvance(false)}
                onMouseLeave={() => setImageAutoAdvance(true)}
              >
                {/* Image Display */}
                <div className={styles.imageWrapper}>
                  <img
                    key={`${project.id}-${activeImageIndex}`}
                    src={projectImages[activeImageIndex]}
                    alt={`${project.title} - Image ${activeImageIndex + 1}`}
                    className={styles.image}
                  />
                </div>

                {/* Gradient Overlay */}
                <div className={styles.imageGradient} />

                {/* Navigation Controls - Only show if multiple images */}
                {hasMultipleImages && (
                  <>
                    {/* Prev Button */}
                    <button
                      className={`${styles.navButton} ${styles.prevButton}`}
                      onClick={handlePrevImage}
                      aria-label="Previous image"
                      tabIndex={0}
                    >
                      ‹
                    </button>

                    {/* Next Button */}
                    <button
                      className={`${styles.navButton} ${styles.nextButton}`}
                      onClick={handleNextImage}
                      aria-label="Next image"
                      tabIndex={0}
                    >
                      ›
                    </button>

                    {/* Dot Indicators */}
                    <div className={styles.dotIndicators}>
                      {projectImages.map((_, idx) => (
                        <button
                          key={idx}
                          className={`${styles.dot} ${idx === activeImageIndex ? styles.activeDot : ''}`}
                          onClick={() => {
                            setActiveImageIndex(idx);
                            setImageAutoAdvance(false);
                            setTimeout(() => setImageAutoAdvance(true), 500);
                          }}
                          aria-label={`Go to image ${idx + 1}`}
                          aria-current={idx === activeImageIndex}
                          tabIndex={0}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className={styles.placeholderImage}>
                <div className={styles.placeholderNumber}>{project.number}</div>
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className={styles.rightColumn}>
            {/* Project Number */}
            <div className={styles.projectNumber}>{project.number}</div>

            {/* Title */}
            <h2 className={styles.title}>{project.title}</h2>

            {/* Status Badge */}
            <div
              className={styles.statusBadge}
              style={{ borderColor: getStatusColor(project.status) }}
            >
              <span style={{ color: getStatusColor(project.status) }}>{project.status}</span>
            </div>

            {/* Divider */}
            <div className={styles.divider} />

            {/* Full Description */}
            <p className={styles.description}>{project.fullDescription}</p>

            {/* Divider */}
            <div className={styles.divider} />

            {/* Tags */}
            <div className={styles.tagsContainer}>
              {project.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Divider */}
            <div className={styles.divider} />

            {/* Action Buttons */}
            <div className={styles.buttonGroup}>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.actionButton}
                  tabIndex={0}
                >
                  Live Demo ↗
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.actionButton} ${styles.githubButton}`}
                  tabIndex={0}
                >
                  GitHub ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
