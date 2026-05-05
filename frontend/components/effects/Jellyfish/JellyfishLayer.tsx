"use client";

import { useEffect, useRef } from "react";
import { type Jellyfish, createJellyfish, drawJellyfish } from "./jellyfish";

type Props = {
  count?: number;
};

export default function JellyfishLayer({ count = 4 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const jellyRef = useRef<Jellyfish[]>([]);
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    jellyRef.current = Array.from({ length: count }, () =>
      createJellyfish(window.innerWidth, window.innerHeight),
    );

    const animate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      timeRef.current += 0.016;
      ctx.clearRect(0, 0, w, h);
      drawJellyfish(ctx, w, h, 1, timeRef.current, jellyRef.current);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
