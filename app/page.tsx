'use client';

import VideoIntro from './components/VideoIntro';
import ProjectsSection from './components/ProjectsSection';
import TechStackSection from './components/TechStackSection';
import AchievementsSection from './components/AchievementsSection';
import ThemeToggle from './components/ThemeToggle';
import styles from './styles/page.module.css';

export default function Home() {
  return (
    <>
      <ThemeToggle />
      <main className={styles.main}>
        {/* ── Hero / VideoIntro ─────────────────────────────────────────────── */}
        <VideoIntro
          videoSrc="/video/hero.mp4"   /* put your video here in /public/video/ */
          firstName="Anvay"
          lastName="Uparkar"
          tagline="Full-Stack Engineer & ML Architect"
          role="Building immersive digital experiences at the intersection of healthcare, AI, and modern web."
        />

        {/* ── Projects Section ──────────────────────────────────────────────── */}
        <ProjectsSection />

        {/* ── Achievements Section ──────────────────────────────────────────── */}
        <AchievementsSection />

        {/* ── Technology Ecosystem Section ──────────────────────────────────── */}
        <TechStackSection />
      </main>
    </>
  );
}
