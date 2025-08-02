/**
 * PersistentLogo Component
 * Creates a persistent logo that stays visible while scrolling
 * Features:
 * - Fixed position in top-left corner
 * - Click to scroll to home section
 * - Smooth hover effects
 * - 3D text animation
 */

'use client';

import React from 'react';
import Letter3DContainer from './Letter3DContainer';



/**
 * Props for the PersistentLogo component
 * @property onHomeClick - Callback function when logo is clicked
 * @property color - Optional color for the logo
 */
interface PersistentLogoProps {
  /** Optional callback function when the logo is clicked */
  onHomeClick: () => void;
  color?: string;
}

/**
 * PersistentLogo component that displays a 3D logo that stays fixed
 * in the top-left corner of the screen
 */
export default function PersistentLogo({ onHomeClick, color = "text-emerald-400" }: PersistentLogoProps) {
  return (
    <button
      onClick={onHomeClick}
      className="fixed top-4 left-4 z-50 focus:outline-none"
      aria-label="Return to home"
    >
      <div className="hover:scale-110 transition-transform duration-300">
        <Letter3DContainer 
          className="w-24 h-24" 
          color={color === "text-orange-500" ? "#fb923c" : color === "text-blue-400" ? "#60a5fa" : "#ffffff"}
        />
      </div>
    </button>
  );
} 