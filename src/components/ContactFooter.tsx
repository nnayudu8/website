'use client';

import ScrollReveal from './ScrollReveal';
import ResumeLink from './ResumeLink';

const LINKS = [
  { label: 'GitHub', href: 'https://github.com/nnayudu8' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/nidhilnayudu/' },
  { label: 'Resume ↓', href: '/resume' },
];

export default function ContactFooter() {
  return (
    <footer
      id="contact"
      style={{
        padding: 'clamp(5rem, 10vw, 8rem) clamp(1.5rem, 8vw, 6rem)',
        maxWidth: '1100px',
        margin: '0 auto',
        borderTop: '1px solid var(--color-border)',
      }}
    >
      <ScrollReveal>
        <p
          className="font-manrope font-medium uppercase tracking-[0.2em] mb-10"
          style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}
        >
          contact
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <h2
          className="font-sentient mb-5"
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 300,
            color: 'var(--color-text)',
            lineHeight: 1.1,
          }}
        >
          Let&apos;s build something together.
        </h2>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <a
          href="mailto:nnayudu@umich.edu"
          className="font-manrope transition-opacity duration-200 block mb-10"
          style={{ fontSize: '1rem', color: 'var(--color-text-muted)', opacity: 0.8 }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}
        >
          nnayudu@umich.edu
        </a>
      </ScrollReveal>

      <ScrollReveal delay={0.15}>
        <div className="flex items-center gap-6 mb-16">
          {LINKS.map(({ label, href }, i) => (
            <span key={label} className="flex items-center gap-6">
              {label.startsWith('Resume') ? (
                <ResumeLink
                  linkId="footer"
                  className="font-manrope transition-opacity duration-200"
                  style={{ fontSize: '0.9375rem', color: 'var(--color-text-muted)', opacity: 0.7 }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
                >
                  {label}
                </ResumeLink>
              ) : (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-manrope transition-opacity duration-200"
                  style={{ fontSize: '0.9375rem', color: 'var(--color-text-muted)', opacity: 0.7 }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
                >
                  {label}
                </a>
              )}
              {i < LINKS.length - 1 && (
                <span style={{ color: 'var(--color-border)', userSelect: 'none' }}>·</span>
              )}
            </span>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <p
          className="font-manrope"
          style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', opacity: 0.5 }}
        >
          © 2026 Nidhil Nayudu
        </p>
      </ScrollReveal>
    </footer>
  );
}
