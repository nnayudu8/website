'use client';

import { useEffect, useState } from 'react';

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'music', label: 'Music' },
];

export default function SectionDots() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const observerOptions = {
      root: null, // viewport
      rootMargin: '-45% 0px', // trigger when section is in middle 10% of viewport
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          const index = sections.findIndex(s => s.id === sectionId);
          if (index !== -1) {
            setActive(index);
          }
        }
      });
    }, observerOptions);

    // Observe all sections
    sections.forEach(section => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  const handleDotClick = (idx: number) => {
    const el = document.getElementById(sections[idx].id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4 items-center">
      {sections.map((section, idx) => (
        <button
          key={section.id}
          onClick={() => handleDotClick(idx)}
          aria-label={section.label}
          className={`transition-all duration-300 focus:outline-none ${
            active === idx
              ? 'w-2.5 h-8 bg-emerald-400 rounded-full' // active: pill
              : 'w-2.5 h-2.5 bg-white/40 rounded-full hover:bg-emerald-300' // inactive: dot
          }`}
        />
      ))}
    </div>
  );
} 