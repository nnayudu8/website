'use client';

import ScrollReveal from './ScrollReveal';
import { PROJECTS } from '@/config/projects';
import { FiArrowUpRight } from 'react-icons/fi';

export default function ProjectsSection() {
  return (
    <section
      id="projects"
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
          projects
        </p>
      </ScrollReveal>

      {/* Card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PROJECTS.map((project, i) => (
          <ScrollReveal key={project.name} delay={i * 0.1}>
            <a
              href={project.url ?? '#'}
              target={project.url ? '_blank' : undefined}
              rel={project.url ? 'noopener noreferrer' : undefined}
              className="group block h-full p-6 rounded-md transition-all duration-300"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                cursor: project.url ? 'pointer' : 'default',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)';
              }}
              onClick={(e) => { if (!project.url) e.preventDefault(); }}
            >
              {/* Year + link icon */}
              <div className="flex justify-between items-start mb-4">
                <span
                  className="font-manrope"
                  style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}
                >
                  {project.year}
                </span>
                {project.url && (
                  <FiArrowUpRight
                    size={16}
                    style={{ color: 'var(--color-text-muted)' }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  />
                )}
              </div>

              {/* Name */}
              <p
                className="font-sentient mb-2"
                style={{ fontSize: '1.125rem', fontWeight: 400, color: 'var(--color-text)' }}
              >
                {project.name}
              </p>

              {/* Description */}
              <p
                className="font-manrope mb-5"
                style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.65 }}
              >
                {project.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-manrope"
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--color-text-muted)',
                      background: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '3px',
                      padding: '2px 8px',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          </ScrollReveal>
        ))}

        {/* Placeholder card */}
        <ScrollReveal delay={PROJECTS.length * 0.1}>
          <div
            className="p-6 rounded-md flex items-center justify-center"
            style={{
              background: 'transparent',
              border: '1px dashed var(--color-border)',
              minHeight: '180px',
            }}
          >
            <p
              className="font-manrope text-center"
              style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', opacity: 0.6 }}
            >
              more coming soon
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
