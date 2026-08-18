'use client';

import type { Application } from '@splinetool/runtime';
import { ArrowUpRight, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import {
  type AnimationEvent,
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

// Keep in sync with the `.reveal-*[data-closing='true']` durations in globals.css
const EXIT_MS = 250;

export default function SplineExperience({ services, children }: Props) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const openReveal = useCallback(() => {
    setClosing(false);
    setOpen(true);
  }, []);

  // Two-step close: flag the exit animation, unmount when it finishes.
  const closeReveal = useCallback(() => setClosing(true), []);

  const finishClose = useCallback(() => {
    setClosing(false);
    setOpen(false);
  }, []);

  const onOverlayAnimationEnd = useCallback(
    (event: AnimationEvent<HTMLDivElement>) => {
      if (event.target !== event.currentTarget || !closing) return;
      finishClose();
    },
    [closing, finishClose],
  );

  // `animationend` never fires while the tab is hidden, so back it with a
  // timer — otherwise the modal (and the body scroll lock) can get stuck.
  useEffect(() => {
    if (!closing) return;
    const timer = window.setTimeout(finishClose, EXIT_MS + 100);
    return () => window.clearTimeout(timer);
  }, [closing, finishClose]);

  const onSplineLoad = useCallback((splineApp: Application) => {
    splineApp.renderOnDemand = true;
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
        className={`fixed inset-0 z-0 overflow-hidden bg-black will-change-transform ${
          open && !closing ? 'invisible' : 'visible'
        }`}
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
      {open && (
        <div
          className="reveal-overlay fixed inset-0 z-50 flex items-start justify-center overflow-y-auto overscroll-contain px-4 py-10 md:items-center"
          data-closing={closing}
          onAnimationEnd={onOverlayAnimationEnd}
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
          <div
            className="reveal-panel relative z-10 w-full max-w-7xl"
            data-closing={closing}
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
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-[#0d0f17]/80 text-white/80 transition hover:bg-[#13151f] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                aria-label="Close"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {services.map((service, i) => (
                <a
                  key={service.href}
                  href={service.href}
                  aria-label={`${service.title} — ${service.subtitle}`}
                  style={{ animationDelay: `${80 + i * 80}ms` }}
                  className="reveal-card group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0d0f17]/90 p-7 transition duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-[#13151f]/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
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
                    {/* `bg-clip-text` only paints inside the element box —
                        without the extra leading/padding, descenders that
                        overflow the line box (the g in "Argus") get cut off. */}
                    <h3
                      className={`bg-gradient-to-r ${service.accent} bg-clip-text pb-1 text-3xl font-black leading-tight tracking-tight text-transparent`}
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

                  {/* `mt-auto` pins the CTA to the card floor so every card
                      lines up regardless of description length. */}
                  <div className="relative mt-auto flex items-center gap-2 pt-8 text-xs font-semibold uppercase tracking-[0.2em] text-white/60 transition-colors duration-300 group-hover:text-white">
                    Launch
                    <span className="h-px w-6 bg-white/30 transition-all duration-300 group-hover:w-10 group-hover:bg-white" />
                  </div>
                </a>
              ))}
            </div>

            <p className="mt-6 text-center text-xs text-white/40">
              Press{' '}
              <kbd className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 font-mono text-[10px]">
                Esc
              </kbd>{' '}
              to return to the universe
            </p>
          </div>
        </div>
      )}
    </>
  );
}
