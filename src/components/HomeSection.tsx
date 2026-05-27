'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import ScrollReveal from './ScrollReveal';
import { FiGithub, FiLinkedin, FiMail, FiFileText } from 'react-icons/fi';

const LINKS = [
  { Icon: FiGithub, label: 'GitHub', href: 'https://github.com/nnayudu8' },
  { Icon: FiLinkedin, label: 'LinkedIn', href: 'https://linkedin.com/in/nidhilnayudu/' },
  { Icon: FiMail, label: 'Email', href: 'mailto:nnayudu@umich.edu' },
  { Icon: FiFileText, label: 'Resume', href: '/Nidhil_Nayudu_resume.pdf' },
];

const WORDS = ['building.', 'teaching.', 'hooping.', 'cooking.'];

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

function OneLiner() {
  const ref = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [highlighted, setHighlighted] = useState(-1);
  const [initialDone, setInitialDone] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // Mark initial stagger complete after last word finishes
  useEffect(() => {
    if (!isInView) return;
    const t = setTimeout(() => setInitialDone(true), (WORDS.length - 1) * 100 + 600);
    return () => clearTimeout(t);
  }, [isInView]);

  useEffect(() => {
    if (!isInView || reducedMotion) return;

    let cancelled = false;

    const cycle = async () => {
      for (let i = 0; i < WORDS.length; i++) {
        if (cancelled) return;
        setHighlighted(i);
        await delay(500);
        if (cancelled) return;
        setHighlighted(-1);
        await delay(300);
      }
    };

    // wait for stagger to finish, then start first cycle
    const initialTimer = setTimeout(async () => {
      await cycle();
      if (cancelled) return;
      intervalRef.current = setInterval(async () => {
        if (!cancelled) await cycle();
      }, 6000);
    }, 2000);

    return () => {
      cancelled = true;
      clearTimeout(initialTimer);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isInView, reducedMotion]);

  return (
    <div ref={ref} className="flex flex-wrap gap-x-3 mb-10 font-manrope" style={{ fontSize: '1rem' }}>
      {WORDS.map((word, i) => (
        <motion.span
          key={word}
          initial={{ opacity: 0, y: 8 }}
          animate={
            isInView
              ? {
                  opacity: highlighted === i ? 1 : 0.63,
                  y: highlighted === i ? -2 : 0,
                }
              : { opacity: 0, y: 8 }
          }
          transition={
            !initialDone
              ? { duration: 0.6, delay: i * 0.1, ease: 'easeOut' }
              : { duration: 0.4, ease: 'easeOut' }
          }
          style={{ color: 'var(--color-text)' }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}

export default function HomeSection() {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center"
      style={{
        padding: 'clamp(5rem, 10vw, 8rem) clamp(1.5rem, 8vw, 6rem)',
        maxWidth: '1100px',
        margin: '0 auto',
      }}
    >
      <div className="max-w-[760px]">
        {/* Section label */}
        <ScrollReveal delay={0}>
          <p
            className="font-manrope font-medium uppercase tracking-[0.2em] mb-6"
            style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}
          >
            hello, i&apos;m
          </p>
        </ScrollReveal>

        {/* Name */}
        <ScrollReveal delay={0.05}>
          <h1
            className="font-sentient leading-[1.05] tracking-[-0.02em] mb-6"
            style={{
              fontSize: 'clamp(3.5rem, 8vw, 7rem)',
              fontWeight: 300,
              color: 'var(--color-text)',
            }}
          >
            Nidhil Nayudu
          </h1>
        </ScrollReveal>

        {/* Divider */}
        <ScrollReveal delay={0.1}>
          <hr style={{ borderColor: 'var(--color-border)', marginBottom: '1.5rem' }} />
        </ScrollReveal>

        {/* Subtitle */}
        <ScrollReveal delay={0.15}>
          <p
            className="font-manrope tracking-[0.12em] mb-8"
            style={{
              fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
              color: 'var(--color-text-muted)',
            }}
          >
            software engineer — cs @ michigan &apos;26
          </p>
        </ScrollReveal>

        {/* One-liner with stagger + idle pulse */}
        <OneLiner />

        {/* Links */}
        <ScrollReveal delay={0.25}>
          <div className="flex items-center gap-6">
            {LINKS.map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                aria-label={label}
                className="transition-opacity duration-200"
                style={{ color: 'var(--color-text-muted)', opacity: 0.6 }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
