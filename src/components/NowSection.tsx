'use client';

import ScrollReveal from './ScrollReveal';
import NowPlaying from './NowPlaying';

const CURRENTLY = [
  { label: 'Working on', value: 'portfolio redesign & side projects' },
  { label: 'Listening to', value: '— see widget →' },
  { label: 'Thinking about', value: 'systems design, and what makes good software feel alive' },
  { label: 'Based in', value: 'Ann Arbor, MI' },
];

export default function NowSection() {
  return (
    <section
      id="now"
      style={{
        padding: 'clamp(5rem, 10vw, 8rem) clamp(1.5rem, 8vw, 6rem)',
        maxWidth: '1100px',
        margin: '0 auto',
      }}
    >
      {/* Section label */}
      <ScrollReveal>
        <p
          className="font-manrope font-medium uppercase tracking-[0.2em] mb-10"
          style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}
        >
          now
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
        {/* Currently block */}
        <ScrollReveal delay={0.05}>
          <div>
            <h2
              className="font-sentient mb-8"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 300, color: 'var(--color-text)' }}
            >
              Currently
            </h2>
            <div className="space-y-5">
              {CURRENTLY.map(({ label, value }) => (
                <div key={label} className="flex gap-4 items-baseline">
                  <span
                    className="font-manrope font-medium flex-shrink-0"
                    style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', width: '100px' }}
                  >
                    {label}
                  </span>
                  <span
                    className="font-manrope"
                    style={{ fontSize: '0.9375rem', color: 'var(--color-text)', lineHeight: 1.6 }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Spotify widget */}
        <ScrollReveal delay={0.1}>
          <div>
            <h2
              className="font-sentient mb-8"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 300, color: 'var(--color-text)' }}
            >
              Listening to
            </h2>
            <NowPlaying />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
