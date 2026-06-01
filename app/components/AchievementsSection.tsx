'use client';

import { useEffect, useRef, useState } from 'react';
import styles from '../styles/AchievementsSection.module.css';

interface Achievement {
  id: number;
  title: string;
  date?: string;
  detail: string;
  prize?: string;
  icon: 'trophy' | 'medal' | 'code';
}

const achievementsData: Achievement[] = [
  {
    id: 1,
    title: 'Runner-Up at GITAM Deemed University IASF Project Showcase — Bangalore',
    date: 'April 2026',
    detail: 'JARVIS recognized among SAKEC\'s best projects. Presented at GITAM University IASF Bangalore.',
    prize: '₹5,000',
    icon: 'trophy',
  },
  {
    id: 2,
    title: 'Consolation Prize — CDAC Brainathon',
    date: 'December 2024',
    detail: 'Awarded for designing and implementing a time series analysis machine learning model using IBM Watson Studio.',
    prize: '₹2,000',
    icon: 'medal',
  },
  {
    id: 3,
    title: 'National Odoo Hackathon — Top 350 of 19,000',
    date: '2024',
    detail: 'Selected among top 350 participants nationally out of 19,000. Advanced to 24-hour final round in Gandhinagar, Gujarat.',
    icon: 'code',
  },
];

const iconMap = {
  trophy: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9c0-1 1-2 2-2h8c1 0 2 1 2 2v8c0 2-1.5 4-4 4h-4c-2.5 0-4-2-4-4V9z" />
      <path d="M4 5h16M12 2v3" />
    </svg>
  ),
  medal: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="13" r="6" />
      <path d="M12 7V3" />
      <path d="M6 19h12" />
      <path d="M8 19l-2 2M16 19l2 2" />
    </svg>
  ),
  code: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
      <line x1="14" y1="4" x2="10" y2="20" />
    </svg>
  ),
};

export default function AchievementsSection() {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const itemRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -60px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const itemId = parseInt((entry.target as HTMLElement).getAttribute('data-item-id') || '0');
          setVisibleItems((prev) => new Set(prev).add(itemId));
        }
      });
    }, observerOptions);

    Object.values(itemRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.achievementsSection} id="recognition">
      {/* Section Heading */}
      <div className={styles.headingContainer}>
        <h2 className={styles.sectionHeading}>Recognition</h2>
        <div className={styles.headingUnderline}></div>
      </div>

      {/* Achievements Container */}
      <div className={styles.achievementsContainer}>
        {achievementsData.map((achievement, index) => (
          <div
            key={achievement.id}
            ref={(el) => {
              if (el) itemRefs.current[achievement.id] = el;
            }}
            data-item-id={achievement.id}
            className={`${styles.achievementCard} ${visibleItems.has(achievement.id) ? styles.visible : ''}`}
            style={{ '--delay': `${index * 120}ms` } as React.CSSProperties}
          >
            {/* Icon */}
            <div className={styles.iconWrapper}>{iconMap[achievement.icon]}</div>

            {/* Content */}
            <div className={styles.content}>
              <h3 className={styles.achievementTitle}>{achievement.title}</h3>

              {achievement.date && <div className={styles.date}>{achievement.date}</div>}

              <p className={styles.detail}>{achievement.detail}</p>

              {achievement.prize && <div className={styles.prize}>Award: {achievement.prize}</div>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
