'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FiFileText } from 'react-icons/fi';

type TransitionPhase = 'idle' | 'covering' | 'covered';

interface Origin {
  x: number;
  y: number;
  scale: number;
}

interface ResumeTransitionContextValue {
  openResume: (source: HTMLElement, linkId: string) => void;
  transitioning: boolean;
}

const ResumeTransitionContext = createContext<ResumeTransitionContextValue | null>(null);

const CIRCLE_SIZE = 64;
// Navigation waits until the slower inner circle has completely covered the viewport.
const INNER_CIRCLE_DELAY = 350;
const INNER_CIRCLE_DURATION = 1000;
const COVERED_AT = INNER_CIRCLE_DELAY + INNER_CIRCLE_DURATION + 50;

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
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<TransitionPhase>('idle');
  const [origin, setOrigin] = useState<Origin>({ x: 0, y: 0, scale: 1 });
  const originLinkId = useRef<string | null>(null);
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

  const resetTransition = useCallback(() => {
    clearTimers();
    setPhase('idle');
    document.body.style.overflow = '';
    delete document.body.dataset.resumeTransitioning;

    if (originLinkId.current) {
      const linkId = originLinkId.current;
      requestAnimationFrame(() => {
        document.querySelector<HTMLElement>(`[data-resume-link="${linkId}"]`)?.focus();
      });
    }
  }, [clearTimers]);

  const openResume = useCallback(
    (source: HTMLElement, linkId: string) => {
      if (phase !== 'idle') return;
      originLinkId.current = linkId;
      clearTimers();
      setOrigin(getOrigin(source));
      document.body.style.overflow = 'hidden';
      document.body.dataset.resumeTransitioning = 'true';
      setPhase('covering');

      const delay = reducedMotion ? 80 : COVERED_AT;
      schedule(() => {
        setPhase('covered');
        // A document navigation keeps this fully covered page visible until the native PDF viewer is ready.
        window.location.assign('/resume');
      }, delay);
    },
    [clearTimers, phase, reducedMotion, schedule],
  );

  useEffect(() => {
    // Back/forward cache restores the exact pre-navigation DOM, including transient React state.
    const handlePageShow = () => resetTransition();
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      clearTimers();
      document.body.style.overflow = '';
      delete document.body.dataset.resumeTransitioning;
    };
  }, [clearTimers, resetTransition]);

  const transitioning = phase !== 'idle';
  const contextValue = useMemo(
    () => ({ openResume, transitioning }),
    [openResume, transitioning],
  );

  return (
    <ResumeTransitionContext.Provider value={contextValue}>
      {children}

      {transitioning && (
        <motion.div
          className="resume-transition-overlay"
          aria-hidden="true"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
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
                  opacity: phase === 'covered' ? 0 : 1,
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
