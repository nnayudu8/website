import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * List of technical skills to be displayed in the typing animation
 */
const skills = [
  "TypeScript",
  "React",
  "Node.js",
  "Python",
  "AWS",
  "Docker",
  "GraphQL",
  "MongoDB"
];

/**
 * Interface for a skill popup that appears on the screen
 */
interface SkillPopup {
  id: number;
  text: string;
  x: number;
  y: number;
  opacity: number;
  displayText: string;
  auto: boolean;
}

/**
 * Constants defining the safe zones where popups should not appear
 * These zones are relative to the window dimensions
 */
const OUTER_MARGIN = 0.10; // 10% margin from each edge
const CENTER_WIDTH = 0.60; // 60% of width (centered)
const CENTER_HEIGHT = 0.32; // 32% of height (centered)

/**
 * Determines if a given position is in a safe zone where popups should not appear
 * Safe zones include the outer margins and the center area
 */
function isInSafeZone(x: number, y: number): boolean {
  if (typeof window === 'undefined') return true;
  
  const w = window.innerWidth;
  const h = window.innerHeight;
  const px = x / w;
  const py = y / h;

  // Check outer margins
  if (px < OUTER_MARGIN || px > 1 - OUTER_MARGIN || 
      py < OUTER_MARGIN || py > 1 - OUTER_MARGIN) {
    return true;
  }

  // Check center area
  const centerLeft = 0.5 - CENTER_WIDTH / 2;
  const centerRight = 0.5 + CENTER_WIDTH / 2;
  const centerTop = 0.5 - CENTER_HEIGHT / 2;
  const centerBottom = 0.5 + CENTER_HEIGHT / 2;

  return px > centerLeft && px < centerRight && 
         py > centerTop && py < centerBottom;
}

interface SkillTyperProps {
  active: boolean;
}

/**
 * SkillTyper component that creates an interactive typing animation effect
 * for displaying technical skills. Skills can appear either automatically
 * or when the user clicks on the screen.
 */
const SkillTyper: React.FC<SkillTyperProps> = ({ active }) => {
  const [popups, setPopups] = useState<SkillPopup[]>([]);
  const nextIdRef = useRef(0);
  const lastSkillIndexRef = useRef(-1);

  // Clear all popups when component becomes inactive
  useEffect(() => {
    if (!active) setPopups([]);
  }, [active]);

  /**
   * Gets the next skill to display, ensuring we cycle through all skills
   * before repeating and avoiding duplicates
   */
  function getNextSkill(visibleSkills: string[]): string {
    let idx = lastSkillIndexRef.current;
    for (let i = 0; i < skills.length; i++) {
      idx = (idx + 1) % skills.length;
      if (!visibleSkills.includes(skills[idx])) {
        lastSkillIndexRef.current = idx;
        return skills[idx];
      }
    }
    // Fallback: pick next skill in sequence
    lastSkillIndexRef.current = (lastSkillIndexRef.current + 1) % skills.length;
    return skills[lastSkillIndexRef.current];
  }

  /**
   * Creates a new skill popup at the specified position
   * Handles the typing animation and fade-out effect
   */
  const spawnSkill = useCallback((x: number, y: number, auto = false) => {
    // Enforce limits on number of popups
    const autoCount = popups.filter(p => p.auto).length;
    if (auto && autoCount >= 2) return;
    if (popups.length >= 4) return;
    if (isInSafeZone(x, y)) return;

    const visibleSkills = popups.map(p => p.text);
    const skill = getNextSkill(visibleSkills);
    const id = nextIdRef.current++;

    const newPopup: SkillPopup = {
      id,
      text: skill,
      x,
      y,
      opacity: 1,
      displayText: '',
      auto
    };

    setPopups(prev => [...prev, newPopup]);

    // Type out the skill text character by character
    let charIndex = 0;
    const typeInterval = setInterval(() => {
      setPopups(prev =>
        prev.map(popup =>
          popup.id === newPopup.id
            ? { ...popup, displayText: skill.slice(0, charIndex + 1) }
            : popup
        )
      );
      charIndex++;

      if (charIndex >= skill.length) {
        clearInterval(typeInterval);
        // Fade out after 2 seconds
        setTimeout(() => {
          setPopups(prev =>
            prev.map(popup =>
              popup.id === newPopup.id
                ? { ...popup, opacity: 0 }
                : popup
            )
          );
          // Remove popup after fade out
          setTimeout(() => {
            setPopups(prev => prev.filter(popup => popup.id !== newPopup.id));
          }, 500);
        }, 2000);
      }
    }, 100);
  }, [popups]);

  /**
   * Handles automatic skill popup generation
   * Creates up to 2 auto-popups with random timing
   */
  useEffect(() => {
    if (!active) return;
    let isUnmounted = false;
    const autoTimers: NodeJS.Timeout[] = [];

    function getRandomAllowedPosition() {
      if (typeof window === 'undefined') return { x: 0, y: 0 };
      let tries = 0;
      while (tries < 50) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        if (!isInSafeZone(x, y)) return { x, y };
        tries++;
      }
      // Fallback position if no valid position found
      return { 
        x: window.innerWidth * 0.5, 
        y: window.innerHeight * (OUTER_MARGIN + 0.05) 
      };
    }

    function scheduleAutoSkill() {
      if (isUnmounted) return;
      const autoCount = popups.filter(p => p.auto).length;
      if (autoCount < 2 && popups.length < 4) {
        const { x, y } = getRandomAllowedPosition();
        spawnSkill(x, y, true);
      }
      // Schedule next auto skill with random delay
      const nextDelay = 2000 + Math.random() * 2000;
      const timer = setTimeout(scheduleAutoSkill, nextDelay);
      autoTimers.push(timer);
    }

    // Start auto-scheduling with staggered initial delays
    scheduleAutoSkill();
    setTimeout(scheduleAutoSkill, 1000 + Math.random() * 1000);

    return () => {
      isUnmounted = true;
      autoTimers.forEach(clearTimeout);
    };
  }, [active, popups, spawnSkill]);

  /**
   * Handles click events to create skill popups at click positions
   */
  useEffect(() => {
    if (!active) return;
    
    function handleGlobalClick(e: MouseEvent) {
      if (typeof window === 'undefined') return;
      if (e.button !== 0) return; // Only handle left clicks
      if (!(e.target instanceof HTMLElement)) return;
      if (popups.length >= 4) return;

      const x = e.clientX;
      const y = e.clientY;
      if (!isInSafeZone(x, y)) {
        spawnSkill(x, y, false);
      }
    }

    window.addEventListener('click', handleGlobalClick, true);
    return () => {
      window.removeEventListener('click', handleGlobalClick, true);
    };
  }, [active, popups, spawnSkill]);

  return (
    <div className="fixed inset-0 pointer-events-none z-20">
      <style>{`
        @keyframes blink {
          50% { opacity: 0 }
        }
        .skill-text {
          position: fixed;
          transform: translate(-50%, -50%);
          color: rgba(255, 255, 255, 0.9);
          font-size: 16px;
          font-family: 'Fira Code', monospace;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
          transition: opacity 0.5s ease;
          pointer-events: none;
          z-index: 50;
        }
        .skill-text::after {
          content: '|';
          animation: blink 1s step-end infinite;
          margin-left: 2px;
        }
      `}</style>
      {popups.map(popup => (
        <div
          key={popup.id}
          className="skill-text"
          style={{
            left: popup.x,
            top: popup.y,
            opacity: popup.opacity
          }}
        >
          {popup.displayText}
        </div>
      ))}
    </div>
  );
};

export default SkillTyper; 