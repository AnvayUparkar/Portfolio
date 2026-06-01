'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import CinematicLayer from './CinematicLayer';
import styles from '../styles/VideoIntro.module.css';

interface VideoIntroProps {
  videoSrc: string;
  firstName?: string;
  lastName?: string;
  tagline?: string;
  role?: string;
  onScrollDown?: () => void;
}

export default function VideoIntro({
  videoSrc,
  firstName = 'Anvay',
  lastName = 'Sharma',
  tagline = 'Full-Stack Engineer & ML Architect',
  role = 'Building immersive digital experiences at the intersection of healthcare, AI, and modern web.',
  onScrollDown,
}: VideoIntroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const soundBadgeRef = useRef<HTMLDivElement>(null);
  const soundTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showSoundHint, setShowSoundHint] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showPoster, setShowPoster] = useState(false);
  const posterRef = useRef<HTMLImageElement>(null);

  // ─── Entrance animation ───────────────────────────────────────────────────
  useEffect(() => {
    if (!videoLoaded) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        heroRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.6 }
      )
        .fromTo(
          `.${styles.tagline}`,
          { opacity: 0, y: 18, letterSpacing: '0.35em' },
          { opacity: 1, y: 0, letterSpacing: '0.22em', duration: 1.1 },
          '-=0.6'
        )
        .fromTo(
          `.${styles.firstName}`,
          { opacity: 0, y: 60, skewY: 2 },
          { opacity: 1, y: 0, skewY: 0, duration: 1.3 },
          '-=0.7'
        )
        .fromTo(
          `.${styles.lastName}`,
          { opacity: 0, y: 70, skewY: 2 },
          { opacity: 1, y: 0, skewY: 0, duration: 1.3 },
          '-=1.1'
        )
        .fromTo(
          `.${styles.roleText}`,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 1.0 },
          '-=0.7'
        )
        .fromTo(
          `.${styles.controlsRow}`,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.9 },
          '-=0.6'
        )
        .fromTo(
          `.${styles.scrollIndicator}`,
          { opacity: 0 },
          { opacity: 1, duration: 1.0 },
          '-=0.4'
        );
    }, heroRef);

    return () => ctx.revert();
  }, [videoLoaded]);

  // ─── Auto-hide sound hint ─────────────────────────────────────────────────
  useEffect(() => {
    soundTimerRef.current = setTimeout(() => {
      if (soundBadgeRef.current) {
        gsap.to(soundBadgeRef.current, {
          opacity: 0,
          y: -8,
          duration: 0.7,
          ease: 'power2.in',
          onComplete: () => setShowSoundHint(false),
        });
      }
    }, 4500);
    return () => {
      if (soundTimerRef.current) clearTimeout(soundTimerRef.current);
    };
  }, []);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    const next = !isMuted;
    videoRef.current.muted = next;
    setIsMuted(next);
    if (showSoundHint) {
      if (soundTimerRef.current) clearTimeout(soundTimerRef.current);
      setShowSoundHint(false);
    }
  }, [isMuted, showSoundHint]);

  const togglePlay = useCallback(() => {
    if (!videoRef.current || !posterRef.current) return;

    if (isPlaying) {
      // Pause: fade out video, fade in poster
      videoRef.current.pause();
      if (bgVideoRef.current) bgVideoRef.current.pause();

      const tl = gsap.timeline();
      tl.to(videoRef.current, { opacity: 0, duration: 0.6, ease: 'power2.inOut' }, 0);
      tl.to(posterRef.current, { opacity: 1, duration: 0.6, ease: 'power2.inOut' }, 0);
      tl.eventCallback('onComplete', () => {
        setShowPoster(true);
      });
    } else {
      // Play: fade out poster, fade in video
      videoRef.current.play();
      if (bgVideoRef.current) bgVideoRef.current.play();

      const tl = gsap.timeline();
      tl.to(posterRef.current, { opacity: 0, duration: 0.5, ease: 'power2.inOut' }, 0);
      tl.to(videoRef.current, { opacity: 1, duration: 0.5, ease: 'power2.inOut' }, 0);
      tl.eventCallback('onComplete', () => {
        setShowPoster(false);
      });
    }

    setIsPlaying((p) => !p);
  }, [isPlaying]);

  const handleScrollDown = useCallback(() => {
    if (onScrollDown) {
      onScrollDown();
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }
  }, [onScrollDown]);

  const handleVideoReady = useCallback(() => {
    setVideoLoaded(true);
  }, []);

  return (
    <section ref={heroRef} className={styles.hero} style={{ opacity: 0 }}>
      {/* ── Ambient blurred bg video ───────────────────────────────────────── */}
      <div className={styles.bgVideoWrap}>
        <video
          ref={bgVideoRef}
          className={styles.bgVideo}
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          suppressHydrationWarning
        />
        <div className={styles.bgVideoNoise} />
      </div>

      {/* ── Three.js bokeh layer ───────────────────────────────────────────── */}
      <CinematicLayer />

      {/* ── Gradient overlays ─────────────────────────────────────────────── */}
      <div className={styles.gradientBottom} />
      <div className={styles.gradientTop} />
      <div className={styles.gradientLeft} />
      <div className={styles.vignetteRing} />

      {/* ── Foreground video ──────────────────────────────────────────────── */}
      <div className={styles.videoFrame}>
        <video
          ref={videoRef}
          className={styles.fgVideo}
          src={videoSrc}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          onCanPlay={handleVideoReady}
          onLoadedData={handleVideoReady}
          suppressHydrationWarning
        />
        <img
          ref={posterRef}
          src="/poster.png"
          alt="Portfolio preview"
          className={styles.fgPoster}
          style={{ opacity: 0 }}
        />
        <div className={styles.videoVignette} />
        <div className={styles.scanlines} aria-hidden="true" />
      </div>

      {/* ── Content overlay ───────────────────────────────────────────────── */}
      <div ref={contentRef} className={styles.content}>
        <p className={styles.tagline}>{tagline}</p>
        <h1 className={styles.nameBlock}>
          <span className={styles.firstName}>{firstName}</span>
          <span className={styles.lastName}>{lastName}</span>
        </h1>
        <p className={styles.roleText}>{role}</p>

        {/* Controls */}
        <div className={styles.controlsRow}>
          <button
            className={styles.glassBtn}
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
          >
            {isPlaying ? (
              <PauseIcon />
            ) : (
              <PlayIcon />
            )}
          </button>
          <button
            className={styles.glassBtn}
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MuteIcon /> : <SoundIcon />}
          </button>

          {showSoundHint && (
            <div ref={soundBadgeRef} className={styles.soundBadge}>
              <span className={styles.soundPulse} />
              Tap for sound
            </div>
          )}
        </div>
      </div>

      {/* ── Scroll indicator ──────────────────────────────────────────────── */}
      <button
        className={styles.scrollIndicator}
        onClick={handleScrollDown}
        aria-label="Scroll to next section"
      >
        <span className={styles.scrollLabel}>Scroll</span>
        <span className={styles.scrollLine}>
          <span className={styles.scrollPulse} />
        </span>
      </button>
    </section>
  );
}

// ─── Inline SVG icons ─────────────────────────────────────────────────────────
function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 2.5L13 8L4 13.5V2.5Z" fill="currentColor" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="3" y="2" width="4" height="12" rx="1" fill="currentColor" />
      <rect x="9" y="2" width="4" height="12" rx="1" fill="currentColor" />
    </svg>
  );
}
function MuteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 5.5H5L9 2v12l-4-3.5H2V5.5Z" fill="currentColor" />
      <path d="M12 5.5L14.5 8M14.5 8L12 10.5M14.5 8L12 5.5M14.5 8L12 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function SoundIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 5.5H5L9 2v12l-4-3.5H2V5.5Z" fill="currentColor" />
      <path d="M11.5 5a4 4 0 0 1 0 6M13 3.5a6.5 6.5 0 0 1 0 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
