'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FiFileText } from 'react-icons/fi';
import { isMobileResumeViewer } from '@/utils/isMobileResumeViewer';

type TransitionPhase = 'idle' | 'covering' | 'covered' | 'revealing';

interface Origin {
  x: number;
  y: number;
  scale: number;
}

interface ResumeTransitionContextValue {
  openResume: (source: HTMLElement, linkId: string) => void;
  closeResume: (source: HTMLElement) => void;
  markResumeReady: () => void;
  transitioning: boolean;
}

const ResumeTransitionContext = createContext<ResumeTransitionContextValue | null>(null);

const CIRCLE_SIZE = 64;
// Navigation waits until the slower inner circle has completely covered the viewport.
const INNER_CIRCLE_DELAY = 350;
const INNER_CIRCLE_DURATION = 1000;
const COVERED_AT = INNER_CIRCLE_DELAY + INNER_CIRCLE_DURATION + 50;
const REVEAL_AT = 1900;
const MAX_HOLD_AT = 4000;
const FADE_DURATION = 250;

function getOrigin(source: HTMLElement): Origin {
  const rect = source.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const farthestX = Math.max(x, window.innerWidth - x);
  const farthestY = Math.max(y, window.innerHeight - y);
  const diameter = Math.hypot(farthestX, farthestY) * 2 + 128;

  return { x, y, scale: diameter / CIRCLE_SIZE };
}

export function ResumeTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<TransitionPhase>('idle');
  const [origin, setOrigin] = useState<Origin>({ x: 0, y: 0, scale: 1 });
  const originLinkId = useRef<string | null>(null);
  const resumeReady = useRef(false);
  const minimumRevealReached = useRef(false);
  const revealStarted = useRef(false);
  const restoreFocusAfterReveal = useRef(false);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current.clear();
  }, []);

  const schedule = useCallback((callback: () => void, delay: number) => {
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      callback();
    }, delay);
    timers.current.add(timer);
  }, []);

  const finish = useCallback(
    (restoreFocus: boolean) => {
      setPhase('idle');
      document.body.style.overflow = '';
      delete document.body.dataset.resumeTransitioning;

      if (restoreFocus && originLinkId.current) {
        const linkId = originLinkId.current;
        requestAnimationFrame(() => {
          document.querySelector<HTMLElement>(`[data-resume-link="${linkId}"]`)?.focus();
        });
      }
    },
    [],
  );

  const revealTransition = useCallback((fadeDuration = FADE_DURATION) => {
    if (revealStarted.current) return;
    revealStarted.current = true;
    setPhase('revealing');
    schedule(() => finish(restoreFocusAfterReveal.current), fadeDuration);
  }, [finish, schedule]);

  const runTransition = useCallback(
    (source: HTMLElement, destination: string, restoreFocus: boolean, waitForResume = false) => {
      if (phase !== 'idle') return;

      clearTimers();
      setOrigin(getOrigin(source));
      document.body.style.overflow = 'hidden';
      document.body.dataset.resumeTransitioning = 'true';
      resumeReady.current = false;
      minimumRevealReached.current = false;
      revealStarted.current = false;
      restoreFocusAfterReveal.current = restoreFocus;
      setPhase('covering');

      if (reducedMotion) {
        schedule(() => router.push(destination), 40);
        schedule(() => revealTransition(80), 80);
        return;
      }

      schedule(() => {
        setPhase('covered');
        router.push(destination);
      }, COVERED_AT);

      if (waitForResume) {
        // Keep the wipe opaque until both its minimum runtime and the PDF iframe are ready.
        schedule(() => {
          minimumRevealReached.current = true;
          if (resumeReady.current) revealTransition();
        }, REVEAL_AT);
        schedule(revealTransition, MAX_HOLD_AT);
      } else {
        schedule(revealTransition, REVEAL_AT);
      }
    },
    [clearTimers, phase, reducedMotion, revealTransition, router, schedule],
  );

  const openResume = useCallback(
    (source: HTMLElement, linkId: string) => {
      originLinkId.current = linkId;

      if (isMobileResumeViewer()) {
        if (phase !== 'idle') return;
        clearTimers();
        setOrigin(getOrigin(source));
        document.body.style.overflow = 'hidden';
        document.body.dataset.resumeTransitioning = 'true';
        setPhase('covering');

        const delay = reducedMotion ? 80 : COVERED_AT;
        schedule(() => window.location.assign('/resume'), delay);
        return;
      }

      runTransition(source, '/resume/view', false, true);
    },
    [clearTimers, phase, reducedMotion, runTransition, schedule],
  );

  const closeResume = useCallback(
    (source: HTMLElement) => runTransition(source, '/', true),
    [runTransition],
  );

  const markResumeReady = useCallback(() => {
    resumeReady.current = true;
    if (minimumRevealReached.current && phase !== 'idle') revealTransition();
  }, [phase, revealTransition]);

  useEffect(() => {
    return () => {
      clearTimers();
      document.body.style.overflow = '';
      delete document.body.dataset.resumeTransitioning;
    };
  }, [clearTimers]);

  const transitioning = phase !== 'idle';
  const contextValue = useMemo(
    () => ({ openResume, closeResume, markResumeReady, transitioning }),
    [closeResume, markResumeReady, openResume, transitioning],
  );

  return (
    <ResumeTransitionContext.Provider value={contextValue}>
      {children}

      {transitioning && (
        <motion.div
          className="resume-transition-overlay"
          aria-hidden="true"
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === 'revealing' ? 0 : 1 }}
          transition={{ duration: reducedMotion ? 0.12 : 0.18, ease: 'easeOut' }}
        >
          {reducedMotion ? (
            <div className="resume-transition-reduced" />
          ) : (
            <>
              <motion.div
                className="resume-transition-circle resume-transition-circle--accent"
                initial={{ x: origin.x, y: origin.y, scale: 0.25 }}
                animate={{ x: window.innerWidth / 2, y: window.innerHeight / 2, scale: origin.scale }}
                transition={{ duration: 1.06, delay: 0.12, ease: [0.65, 0, 0.35, 1] }}
              />
              <motion.div
                className="resume-transition-circle resume-transition-circle--surface"
                initial={{ x: origin.x, y: origin.y, scale: 0.12 }}
                animate={{ x: window.innerWidth / 2, y: window.innerHeight / 2, scale: origin.scale }}
                transition={{
                  duration: INNER_CIRCLE_DURATION / 1000,
                  delay: INNER_CIRCLE_DELAY / 1000,
                  ease: [0.65, 0, 0.35, 1],
                }}
              />
              <motion.div
                className="resume-transition-emblem"
                initial={{ x: origin.x, y: origin.y, scale: 0.28, opacity: 0.7 }}
                animate={{
                  x: window.innerWidth / 2,
                  y: window.innerHeight / 2,
                  scale: phase === 'covering' ? 0.95 : 1.05,
                  opacity: phase === 'covered' || phase === 'revealing' ? 0 : 1,
                }}
                transition={{
                  x: {
                    duration: INNER_CIRCLE_DURATION / 1000,
                    delay: INNER_CIRCLE_DELAY / 1000,
                    ease: [0.65, 0, 0.35, 1],
                  },
                  y: {
                    duration: INNER_CIRCLE_DURATION / 1000,
                    delay: INNER_CIRCLE_DELAY / 1000,
                    ease: [0.65, 0, 0.35, 1],
                  },
                  scale: {
                    duration: phase === 'covering' ? INNER_CIRCLE_DURATION / 1000 : 0.3,
                    delay: phase === 'covering' ? INNER_CIRCLE_DELAY / 1000 : 0,
                  },
                  opacity: { duration: 0.3 },
                }}
              >
                <FiFileText size={68} />
              </motion.div>
            </>
          )}
        </motion.div>
      )}

      <span className="sr-only" role="status" aria-live="polite">
        {transitioning ? 'Opening résumé' : ''}
      </span>
    </ResumeTransitionContext.Provider>
  );
}

export function useResumeTransition() {
  const context = useContext(ResumeTransitionContext);
  if (!context) throw new Error('useResumeTransition must be used within ResumeTransitionProvider');
  return context;
}
