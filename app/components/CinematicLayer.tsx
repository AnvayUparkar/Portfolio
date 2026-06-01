'use client';

import { useEffect, useRef } from 'react';
import styles from '../styles/CinematicLayer.module.css';

interface Particle {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  radius: number;
  opacity: number;
  speed: number;
  phase: number;
  phaseY: number;
  hue: number; // 0-1: 0=warm orange, 1=cool white
}

export default function CinematicLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    // ─── Sizing ─────────────────────────────────────────────────────────────
    let W = 0, H = 0;
    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // ─── Mouse parallax ─────────────────────────────────────────────────────
    const onMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      mouseRef.current = {
        x: t.clientX / window.innerWidth,
        y: t.clientY / window.innerHeight,
      };
    };
    window.addEventListener('mousemove', onMouse, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });

    // ─── Particles ──────────────────────────────────────────────────────────
    const COUNT = 90;
    const particles: Particle[] = Array.from({ length: COUNT }, () => {
      const hue = Math.random();
      return {
        x: Math.random(),
        y: Math.random(),
        z: Math.random() * 0.7 + 0.3,
        baseX: Math.random(),
        baseY: Math.random(),
        radius: Math.random() * 28 + 6,
        opacity: Math.random() * 0.22 + 0.04,
        speed: Math.random() * 0.00025 + 0.00008,
        phase: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        hue,
      };
    });

    // ─── Draw helpers ────────────────────────────────────────────────────────
    const drawBokeh = (
      p: Particle,
      mx: number,
      my: number,
      t: number
    ) => {
      const parallax = p.z * 28;
      const px =
        (p.baseX + Math.sin(t * p.speed * 0.7 + p.phase) * 0.04) * W +
        (mx - 0.5) * parallax;
      const py =
        (p.baseY + Math.cos(t * p.speed + p.phaseY) * 0.04) * H +
        (my - 0.5) * parallax;
      const r = p.radius * p.z;

      // Warm orange: hsl(28, 90%, 65%)  Cool white: hsl(200, 30%, 90%)
      const h = p.hue < 0.55
        ? `28, ${Math.floor(70 + p.hue * 30)}%, ${Math.floor(58 + p.hue * 14)}%`
        : `${Math.floor(190 + p.hue * 20)}, 25%, 88%`;

      const grad = ctx.createRadialGradient(px, py, 0, px, py, r);
      grad.addColorStop(0, `hsla(${h}, ${p.opacity * 0.9})`);
      grad.addColorStop(0.4, `hsla(${h}, ${p.opacity * 0.5})`);
      grad.addColorStop(1, `hsla(${h}, 0)`);

      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
    };

    // ─── Subtle horizontal light streak ─────────────────────────────────────
    const drawLightLeak = (t: number) => {
      const y = H * (0.38 + Math.sin(t * 0.00004) * 0.06);
      const grad = ctx.createLinearGradient(0, y - 60, 0, y + 60);
      grad.addColorStop(0, 'rgba(255,160,60,0)');
      grad.addColorStop(0.5, 'rgba(255,160,60,0.018)');
      grad.addColorStop(1, 'rgba(255,160,60,0)');
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = grad;
      ctx.fillRect(0, y - 60, W, 120);
    };

    // ─── RAF loop ────────────────────────────────────────────────────────────
    const render = (ts: number) => {
      timeRef.current = ts;
      ctx.clearRect(0, 0, W, H);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      drawLightLeak(ts);
      for (const p of particles) drawBokeh(p, mx, my, ts);

      ctx.globalCompositeOperation = 'source-over';
      frameRef.current = requestAnimationFrame(render);
    };
    frameRef.current = requestAnimationFrame(render);

    // ─── Cleanup ─────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('touchmove', onTouch);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
