'use client';

import { useEffect, useRef, useState } from 'react';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import Letter3DContainer from './Letter3DContainer';

const NAV_LINKS = [
  { label: 'work', href: '#work' },
  { label: 'projects', href: '#projects' },
  { label: 'now', href: '#now' },
  { label: 'contact', href: '#contact' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLinkClick = () => setMenuOpen(false);

  const pointerStart = useRef({ x: 0, y: 0 });
  const didDrag = useRef(false);
  const handleLogoPointerDown = (e: React.PointerEvent) => {
    pointerStart.current = { x: e.clientX, y: e.clientY };
    didDrag.current = false;
  };
  const handleLogoPointerMove = (e: React.PointerEvent) => {
    const dx = Math.abs(e.clientX - pointerStart.current.x);
    const dy = Math.abs(e.clientY - pointerStart.current.y);
    if (dx > 4 || dy > 4) didDrag.current = true;
  };
  const handleLogoClick = () => {
    if (!didDrag.current) {
      document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'color-mix(in srgb, var(--color-bg) 92%, transparent)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--color-border)' : 'none',
      }}
    >
      <div
        className="max-w-[1100px] mx-auto h-14 flex items-center justify-between"
        style={{ paddingLeft: 'clamp(1.5rem, 8vw, 6rem)', paddingRight: 'clamp(1.5rem, 8vw, 6rem)' }}
      >
        <button
          className="block w-16 h-16 shrink-0 cursor-pointer"
          style={{ marginLeft: '-0.9rem', background: 'none', border: 'none', padding: 0 }}
          onPointerDown={handleLogoPointerDown}
          onPointerMove={handleLogoPointerMove}
          onClick={handleLogoClick}
        >
          <Letter3DContainer size={3} className="w-full h-full" />
        </button>

        {/* Desktop links */}
        {/* <div className="hidden sm:flex items-center gap-8">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-[0.875rem] font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors duration-200 tracking-[0.05em]"
            >
              {label}
            </a>
          ))}
        </div> */}

        {/* Mobile hamburger */}
        {/* <button
          className="sm:hidden text-[var(--color-text)] opacity-70 hover:opacity-100 transition-opacity"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <RiCloseLine size={22} /> : <RiMenu3Line size={22} />}
        </button> */}
      </div>

      {/* Mobile dropdown */}
      {/* {menuOpen && (
        <div
          className="sm:hidden px-6 pb-5 flex flex-col gap-4"
          style={{ background: 'var(--color-bg)', borderTop: '1px solid var(--color-border)' }}
        >
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={handleLinkClick}
              className="text-[0.95rem] font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors duration-200 tracking-[0.05em] py-1"
            >
              {label}
            </a>
          ))}
        </div>
      )} */}
    </nav>
  );
}
