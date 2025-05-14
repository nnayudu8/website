'use client';

import { useEffect, useState } from 'react';

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'music', label: 'Music' },
];

interface SectionDotsProps {
  sectionRefs: React.RefObject<HTMLDivElement>[];
}

export default function SectionDots({ sectionRefs }: SectionDotsProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-45% 0px',
      threshold: 0
    };

    const observer = new window.IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionIdx = sectionRefs.findIndex(ref => ref.current === entry.target);
          if (sectionIdx !== -1) {
            setActive(sectionIdx);
          }
        }
      });
    }, observerOptions);

    sectionRefs.forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, [sectionRefs]);

  const handleDotClick = (idx: number) => {
    const el = sectionRefs[idx]?.current;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4 items-center">
      <style>{`
        @keyframes n-wobble {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(-8deg); }
          50% { transform: rotate(8deg); }
          80% { transform: rotate(-8deg); }
        }
        .n-wobble {
          animation: n-wobble 1.2s infinite cubic-bezier(.4,0,.2,1);
        }
      `}</style>
      {sections.map((section, idx) => (
        <button
          key={section.id}
          onClick={() => handleDotClick(idx)}
          aria-label={section.label}
          className="focus:outline-none flex items-center justify-center relative"
        >
          <span
            className={`font-extrabold select-none flex items-center justify-center transition-all duration-300 ease-in-out
              ${active === idx ? 'text-xl text-emerald-400 drop-shadow-lg n-wobble' : 'text-xs text-emerald-100/80'}
            `}
            style={{
              fontFamily: 'inherit',
              textShadow: active === idx
                ? '0 0 2px #000, 0 0 2px #000, 1px 1px 0 #000, -1px -1px 0 #000'
                : undefined
            }}
          >
            N
          </span>
        </button>
      ))}
    </div>
  );
} 