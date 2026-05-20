'use client';

import ScrollReveal from './ScrollReveal';
import { FiGithub, FiLinkedin, FiMail, FiFileText } from 'react-icons/fi';

const LINKS = [
  { Icon: FiGithub, label: 'GitHub', href: 'https://github.com/nnayudu8' },
  { Icon: FiLinkedin, label: 'LinkedIn', href: 'https://linkedin.com/in/nidhilnayudu/' },
  { Icon: FiMail, label: 'Email', href: 'mailto:nnayudu@umich.edu' },
  { Icon: FiFileText, label: 'Resume', href: '/Nidhil_Nayudu_resume.pdf' },
];

export default function HeroSection() {
  return (
    <section
      id="hero"
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

        {/* One-liner */}
        <ScrollReveal delay={0.2}>
          <p
            className="font-manrope mb-10"
            style={{ fontSize: '1rem', color: 'var(--color-text-muted)', lineHeight: 1.7, maxWidth: '480px' }}
          >
            I build clean software and teach the theory behind it — currently finishing my CS degree at Michigan.
          </p>
        </ScrollReveal>

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
