'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { Application } from '@splinetool/runtime';
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 animate-pulse bg-[radial-gradient(ellipse_at_center,#0a0c14_0%,#05060a_50%,#000_100%)]" />
  ),
});

type Service = {
  title: string;
  subtitle: string;
  description: string;
  href: string;
  accent: string;
  glow: string;
  index: string;
};

type Props = {
  services: Service[];
  children: ReactNode;
};

const SPLINE_SCENE =
  'https://prod.spline.design/yEWkAjJuCo873kcF/scene.splinecode';

export default function SplineExperience({ services, children }: Props) {
  const [open, setOpen] = useState(false);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const openReveal = useCallback(() => setOpen(true), []);
  const closeReveal = useCallback(() => setOpen(false), []);
  const onSplineLoad = useCallback((splineApp: Application) => {
    splineApp.renderOnDemand = true;
    setSplineLoaded(true);
  }, []);

  // ESC to close + lock body scroll when modal is open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeReveal();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Move focus into the modal for screen readers / keyboard users
    closeButtonRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, closeReveal]);

  return (
    <>
      {/*
        Fixed Spline canvas. Kept at z-0 (not -z-10) so it receives pointer
        events; the hero overlay sits at z-10 with `pointer-events-none` so
        clicks fall through to the canvas (laptop stays interactive).
      */}
      <div
        className={`fixed inset-0 z-0 overflow-hidden bg-black will-change-transform ${open ? 'invisible' : 'visible'}`}
        aria-hidden="true"
        style={{ contain: 'strict' }}
      >
        <Spline
          scene={SPLINE_SCENE}
          onSplineMouseDown={openReveal}
          onLoad={onSplineLoad}
        />
        {/* Subtle gradient vignette to keep hero text legible */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.7)_100%)]" />
        {/* Bottom fade to anchor the laptop glow */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      {/*
        Hero copy overlay.
        `pointer-events-none` on the section so clicks pass through to the
        Spline canvas beneath (so the laptop stays clickable). Only actual
        interactive children re-enable pointer events with `pointer-events-auto`.
        Hero copy (badge, h1, subtitle) is server-rendered via `children` so it
        paints on first HTML, independent of JS hydration.
      */}
      <section className="pointer-events-none relative z-10 flex min-h-screen flex-col items-center px-6 pt-16 text-center md:pt-20">
        {children}

        {/* Spacer pushes the CTA down so it lands near the laptop */}
        <div className="flex-1" />

        {/* CTA anchored above the laptop — visible immediately, no scene gating */}
        <div className="mb-[6vh] flex flex-col items-center gap-3 md:mb-[18vh]">
          <p
            className="hidden items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/60 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] md:flex md:text-xs"
            aria-hidden="true"
          >
            <span className="inline-block h-px w-6 bg-white/40" />
            Open the laptop
            <span className="inline-block h-px w-6 bg-white/40" />
          </p>
          <button
            type="button"
            onClick={openReveal}
            className="pointer-events-auto group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow-[0_0_60px_rgba(255,255,255,0.25)] transition hover:shadow-[0_0_80px_rgba(255,255,255,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Enter the universe
            <ArrowUpRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </button>
        </div>

        {/* Footer stays anchored */}
        <footer className="relative z-10 w-full border-t border-white/10 py-6 text-center text-xs text-white/40">
          <p>2026 Yeomniverse. All rights reserved.</p>
        </footer>
      </section>

      {/* Services reveal modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto overscroll-contain px-4 py-10 md:items-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="services-reveal-title"
          >
            {/* Scrim — solid overlay instead of backdrop-blur for perf */}
            <button
              type="button"
              aria-label="Close services"
              onClick={closeReveal}
              className="fixed inset-0 bg-black/80"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-full max-w-6xl"
            >
              <div className="mb-6 flex items-end justify-between gap-4">
                <div className="text-left">
                  <p className="text-xs font-medium uppercase tracking-[0.25em] text-white/50">
                    Now booting
                  </p>
                  <h2
                    id="services-reveal-title"
                    className="mt-2 text-3xl font-black text-white md:text-4xl"
                  >
                    Pick a world.
                  </h2>
                </div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={closeReveal}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-[#0d0f17]/80 text-white/80 transition hover:bg-[#13151f] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                {services.map((service, i) => (
                  <motion.div
                    key={service.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.08 + i * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Link
                      href={service.href}
                      aria-label={`${service.title} — ${service.subtitle}`}
                      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0d0f17]/90 p-7 transition duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-[#13151f]/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    >
                      {/* Accent glow */}
                      <div
                        aria-hidden="true"
                        className={`pointer-events-none absolute -top-24 -right-20 h-56 w-56 rounded-full opacity-40 blur-3xl transition-opacity duration-500 group-hover:opacity-70 ${service.glow}`}
                      />

                      <div className="relative flex items-center justify-between">
                        <span className="font-mono text-xs text-white/40">
                          {service.index}
                        </span>
                        <ArrowUpRight
                          aria-hidden="true"
                          className="h-5 w-5 text-white/50 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                        />
                      </div>

                      <div className="relative mt-10">
                        <h3
                          className={`bg-gradient-to-r ${service.accent} bg-clip-text text-3xl font-black tracking-tight text-transparent`}
                        >
                          {service.title}
                        </h3>
                        <p className="mt-1 text-sm font-medium text-white/60">
                          {service.subtitle}
                        </p>
                      </div>

                      <p className="relative mt-5 text-sm leading-relaxed text-white/70">
                        {service.description}
                      </p>

                      <div className="relative mt-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/60 transition-colors duration-300 group-hover:text-white">
                        Launch
                        <span className="h-px w-6 bg-white/30 transition-all duration-300 group-hover:w-10 group-hover:bg-white" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <p className="mt-6 text-center text-xs text-white/40">
                Press{' '}
                <kbd className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 font-mono text-[10px]">
                  Esc
                </kbd>{' '}
                to return to the universe
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
