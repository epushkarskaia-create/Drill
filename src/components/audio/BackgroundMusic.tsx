"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/lib/store/useAppStore";

/** Soft ambient melody notes (freq in Hz, duration in seconds) */
const MELODY = [
  { f: 261.63, d: 0.4 }, // C4
  { f: 293.66, d: 0.4 }, // D4
  { f: 329.63, d: 0.4 }, // E4
  { f: 349.23, d: 0.5 }, // F4
  { f: 392.0, d: 0.4 },  // G4
  { f: 349.23, d: 0.4 }, // F4
  { f: 329.63, d: 0.6 }, // E4
  { f: 261.63, d: 0.8 }, // C4
];

const GAIN = 0.12;
const FADE_MS = 200;

export function BackgroundMusic() {
  const sound = useAppStore((s) => s.audio.sound);
  const music = useAppStore((s) => s.audio.music);
  const ctxRef = useRef<AudioContext | null>(null);
  const nextTimeRef = useRef(0);
  const rafRef = useRef<number>(0);

  const play = useRef(false);
  play.current = sound && music;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    ctxRef.current = ctx;
    nextTimeRef.current = ctx.currentTime;

    const totalDuration = MELODY.reduce((a, n) => a + n.d, 0);

    function scheduleNext() {
      if (!ctxRef.current || !play.current) return;
      const ctx = ctxRef.current;
      if (ctx.state === "suspended") ctx.resume();
      let t = nextTimeRef.current;
      if (t < ctx.currentTime) t = ctx.currentTime;
      nextTimeRef.current = t;
      MELODY.forEach(({ f, d }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = f;
        osc.type = "sine";
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(GAIN, t + FADE_MS / 1000);
        gain.gain.setValueAtTime(GAIN, t + d - FADE_MS / 1000);
        gain.gain.linearRampToValueAtTime(0, t + d);
        osc.start(t);
        osc.stop(t + d);
        t += d;
      });
      nextTimeRef.current = t;
    }

    function tick() {
      if (!ctxRef.current) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const ctx = ctxRef.current;
      if (play.current) {
        if (nextTimeRef.current < ctx.currentTime + totalDuration * 0.5)
          scheduleNext();
      } else {
        nextTimeRef.current = ctx.currentTime;
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      ctxRef.current?.close();
      ctxRef.current = null;
    };
  }, []);

  return null;
}
