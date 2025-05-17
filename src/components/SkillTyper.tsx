import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NodeMeshHandle } from './NodeMesh';

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
 * Check if a position is in a safe zone by checking if it overlaps with specific UI elements
 * or is too close to screen edges
 */
function isInSafeZone(x: number, y: number): boolean {
  // Check screen edge boundaries first using percentages
  const EDGE_BUFFER_PERCENT = 0.08; // 8% from each edge
  const minX = window.innerWidth * EDGE_BUFFER_PERCENT;
  const maxX = window.innerWidth * (1 - EDGE_BUFFER_PERCENT);
  const minY = window.innerHeight * EDGE_BUFFER_PERCENT;
  const maxY = window.innerHeight * (1 - EDGE_BUFFER_PERCENT);

  if (
    x < minX ||
    x > maxX ||
    y < minY ||
    y > maxY
  ) {
    return true;
  }

  // Get only the specific elements we want to protect
  const elements = document.querySelectorAll(`
    .fixed.top-2.left-2,  /* NN logo */
    .section-dots-container,  /* Nav dots */
    #home .text-6xl,  /* Your name */
    #home .text-xl,   /* Software Engineer | Energy Shifter text */
    #home .flex.items-center.gap-8,  /* Social icons container */
    .spotify-embed    /* Spotify player */
  `);
  
  // Check if the position overlaps with any element
  return Array.from(elements).some(element => {
    const rect = element.getBoundingClientRect();
    // Add a larger buffer (20px) around elements to prevent edge cases
    const buffer = 20;
    return (
      x >= rect.left - buffer &&
      x <= rect.right + buffer &&
      y >= rect.top - buffer &&
      y <= rect.bottom + buffer
    );
  });
}

/**
 * Gets a random position that doesn't overlap with any UI elements
 */
function getRandomAllowedPosition() {
  if (typeof window === 'undefined') return { x: 0, y: 0 };
  
  let tries = 0;
  const maxTries = 50;
  
  while (tries < maxTries) {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    
    if (!isInSafeZone(x, y)) {
      return { x, y };
    }
    tries++;
  }
  
  // If we can't find a valid position, try the corners
  const corners = [
    { x: 50, y: 50 },
    { x: window.innerWidth - 50, y: 50 },
    { x: 50, y: window.innerHeight - 50 },
    { x: window.innerWidth - 50, y: window.innerHeight - 50 }
  ];
  
  for (const corner of corners) {
    if (!isInSafeZone(corner.x, corner.y)) {
      return corner;
    }
  }
  
  // Last resort: center of screen
  return { 
    x: window.innerWidth * 0.5, 
    y: window.innerHeight * 0.5 
  };
}

interface SkillTyperProps {
  active: boolean;
  nodeMeshRef: React.RefObject<NodeMeshHandle>;
  onPositionChange?: (x: number, y: number) => void;
}

/**
 * SkillTyper component that creates an interactive typing animation effect
 * for displaying technical skills. Skills can appear either automatically
 * or when the user clicks on the screen.
 */
const SkillTyper: React.FC<SkillTyperProps> = ({ active, nodeMeshRef, onPositionChange }) => {
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

    // Trigger a pulse in the neural network with position
    if (nodeMeshRef.current) {
      onPositionChange?.(x, y);
      nodeMeshRef.current.triggerPulse();
    }

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
  }, [popups, nodeMeshRef, onPositionChange]);

  /**
   * Handles automatic skill popup generation
   * Creates up to 2 auto-popups with random timing
   */
  useEffect(() => {
    if (!active) return;
    let isUnmounted = false;
    const autoTimers: NodeJS.Timeout[] = [];

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