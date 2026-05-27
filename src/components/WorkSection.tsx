'use client';

import Image from 'next/image';
import ScrollReveal from './ScrollReveal';

const EXPERIENCE = [
  {
    role: 'Software Engineer Intern',
    company: 'Capital One',
    logo: '/logos/capitalone.png',
    description: 'Incoming software engineer intern.',
  },
  {
    role: 'Software Engineer Intern',
    company: 'CGI',
    logo: '/logos/cgi.png',
    description:
      'Building agentic AI framework leveraging MCP to automate SDLC processes and streamline client integration.',
  },
  {
    role: 'Software Engineer Intern',
    company: '4Human Corporation',
    logo: '/logos/4human.png',
    description:
      'Engineered full-stack features and refactored APIs to speed up dev cycles for a charitable e-commerce client.',
  },
  {
    role: 'Instructional Aide (TA)',
    company: 'University of Michigan',
    logo: '/logos/umich.png',
    description:
      'Taught 1,000+ students data structures while co-leading exam design and mentoring TAs.',
  },
];

const SKILLS = [
  { category: 'Languages', items: ['TypeScript', 'JavaScript', 'Python', 'C/C++', 'SQL'] },
  { category: 'Frontend', items: ['React', 'Next.js', 'HTML5', 'CSS3', 'Tailwind CSS'] },
  { category: 'Backend', items: ['Node.js', 'Express', 'REST APIs', 'PostgreSQL'] },
  { category: 'DevOps', items: ['AWS', 'Docker', 'Git', 'Linux'] },
];

export default function WorkSection() {
  return (
    <section
      id="work"
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
          work / experience
        </p>
      </ScrollReveal>

      {/* Experience timeline */}
      <div>
        {EXPERIENCE.map((job, i) => (
          <ScrollReveal key={job.company} delay={i * 0.1}>
            <div
              className="group py-8 flex items-start gap-6"
              style={{ borderTop: '1px solid var(--color-border)' }}
            >
              {/* Logo */}
              <div className="flex-shrink-0 mt-1">
                <Image
                  src={job.logo}
                  alt={job.company}
                  width={40}
                  height={40}
                  className="object-contain"
                  style={{ width: 40, height: 40 }}
                />
              </div>

              {/* Content */}
              <div>
                <p
                  className="font-sentient leading-snug mb-1"
                  style={{ fontSize: '1.2rem', fontWeight: 400, color: 'var(--color-text)' }}
                >
                  {job.company}
                </p>
                <p
                  className="font-manrope mb-3"
                  style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}
                >
                  {job.role}
                </p>
                <p
                  className="font-manrope"
                  style={{ fontSize: '0.9375rem', color: 'var(--color-text)', lineHeight: 1.7, maxWidth: '600px' }}
                >
                  {job.description}
                </p>
              </div>
            </div>
          </ScrollReveal>
        ))}
        {/* Bottom border */}
        <div style={{ borderTop: '1px solid var(--color-border)' }} />
      </div>

      {/* Skills list */}
      <ScrollReveal delay={0.15}>
        <div className="mt-14 space-y-3">
          {SKILLS.map(({ category, items }) => (
            <div key={category} className="flex gap-6 items-baseline">
              <span
                className="font-manrope font-medium uppercase tracking-[0.18em] flex-shrink-0 w-24"
                style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}
              >
                {category}
              </span>
              <span
                className="font-manrope"
                style={{ fontSize: '0.9375rem', color: 'var(--color-text)', lineHeight: 1.7 }}
              >
                {items.join(' · ')}
              </span>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
