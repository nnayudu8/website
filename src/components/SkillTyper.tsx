/**
 * SkillTyper Component
 * Creates an interactive typing animation effect for displaying technical skills
 * Features:
 * - Automatic skill popups with random timing
 * - Click-to-spawn skill popups
 * - Typing animation effect
 * - Fade in/out transitions
 * - Neural network interaction
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NodeMeshHandle } from './NodeMesh';
import { ALL_SKILLS } from '@/config/skills';

/**
 * Interface for a skill popup that appears on the screen
 * @property id - Unique identifier for the popup
 * @property text - The full skill text to be displayed
 * @property x - X coordinate position
 * @property y - Y coordinate position
 * @property opacity - Current opacity for fade effects
 * @property displayText - Currently displayed text (for typing animation)
 * @property auto - Whether this popup was spawned automatically
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
 * Shuffles an array using the Fisher-Yates algorithm
 * @param array - The array to shuffle
 * @returns A new array with randomly shuffled elements
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Checks if a position is in a safe zone (too close to UI elements or screen edges)
 * @param x - X coordinate to check
 * @param y - Y coordinate to check
 * @returns true if the position is in a safe zone, false otherwise
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
  const elements = document.querySelectorAll(
    '.fixed.top-2.left-2,' +
    '.section-dots-container,' +
    '.main-name,' +
    '.main-title,' +
    '#home .flex.items-center.gap-8,' +
    '.spotify-embed,' +
    '.flex.items-center.gap-4.px-4.py-3.rounded-full' // Spotify player
  );
  
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
 * @returns An object with x and y coordinates, or null if no valid position found
 */
function getRandomAllowedPosition() {
  if (typeof window === 'undefined') return { x: 0, y: 0 };
  
  // Check if we're within the first page's content
  const homeSection = document.getElementById('home');
  if (!homeSection) return null;
  const homeBottom = homeSection.getBoundingClientRect().bottom;
  if (homeBottom < 0) return null;
  
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

/**
 * Props for the SkillTyper component
 * @property active - Whether the component should be active
 * @property nodeMeshRef - Reference to the NodeMesh component for interaction
 * @property onPositionChange - Callback for when skill position changes
 */
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
  // State and refs for managing popups and skill cycling
  const [popups, setPopups] = useState<SkillPopup[]>([]);
  const nextIdRef = useRef(0);
  const shuffledSkillsRef = useRef<string[]>([]);
  const currentSkillIndexRef = useRef(0);

  /**
   * Initialize shuffled skills when component mounts or becomes active
   */
  useEffect(() => {
    if (active) {
      shuffledSkillsRef.current = shuffleArray(ALL_SKILLS);
      currentSkillIndexRef.current = 0;
    }
  }, [active]);

  /**
   * Clear all popups when component becomes inactive
   */
  useEffect(() => {
    if (!active) setPopups([]);
  }, [active]);

  /**
   * Gets the next skill to display, cycling through the shuffled array
   * @returns The next skill text to display
   */
  function getNextSkill(): string {
    const skill = shuffledSkillsRef.current[currentSkillIndexRef.current];
    currentSkillIndexRef.current = (currentSkillIndexRef.current + 1) % shuffledSkillsRef.current.length;
    return skill;
  }

  /**
   * Creates a new skill popup at the specified position
   * Handles the typing animation and fade-out effect
   * @param x - X coordinate for the popup
   * @param y - Y coordinate for the popup
   * @param auto - Whether this popup was spawned automatically
   */
  const spawnSkill = useCallback((x: number, y: number, auto = false) => {
    // Enforce limits on number of popups
    const autoCount = popups.filter(p => p.auto).length;
    if (auto && autoCount >= 2) return;
    if (popups.length >= 5) return;
    if (isInSafeZone(x, y)) return;

    const skill = getNextSkill();
    const id = nextIdRef.current++;

    // Trigger a pulse in the neural network with position immediately
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
      
      // Check if we're within the first page's content
      const homeSection = document.getElementById('home');
      if (!homeSection) return;
      const homeBottom = homeSection.getBoundingClientRect().bottom;
      if (homeBottom < 0) return;

      const autoCount = popups.filter(p => p.auto).length;
      if (autoCount < 2 && popups.length < 5) {
        const position = getRandomAllowedPosition();
        if (position) {
          spawnSkill(position.x, position.y, true);
        }
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
      if (popups.length >= 5) return;

      // Check if we're within the first page's content
      const homeSection = document.getElementById('home');
      if (!homeSection) return;
      const homeBottom = homeSection.getBoundingClientRect().bottom;
      if (homeBottom < 0) return;

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
        /* Blinking cursor animation */
        @keyframes blink {
          50% { opacity: 0 }
        }
        /* Skill text styling with responsive font size */
        .skill-text {
          position: fixed;
          transform: translate(-50%, -50%);
          color: rgba(255, 255, 255, 0.9);
          font-size: clamp(0.75rem, min(2vw, 1rem), min(2vw, 1rem));
          font-family: 'Fira Code', monospace;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
          transition: opacity 0.5s ease;
          pointer-events: none;
          z-index: 50;
        }
        /* Blinking cursor after text */
        .skill-text::after {
          content: '|';
          animation: blink 1s step-end infinite;
          margin-left: 2px;
        }
      `}</style>
      {/* Render all active skill popups */}
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