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
 * Constants for the logo styling
 */
const LOGO_STYLES = {
  SIZE: {
    CONTAINER: 'w-24 h-24',
    TEXT: 3
  },
  POSITION: 'top-2 left-2',
  Z_INDEX: 'z-50'
} as const;

/**
 * Props for the PersistentLogo component
 * @property onHomeClick - Callback function when logo is clicked
 */
interface PersistentLogoProps {
  /** Optional callback function when the logo is clicked */
  onHomeClick?: () => void;
}

/**
 * PersistentLogo component that displays a 3D logo that stays fixed
 * in the top-left corner of the screen
 */
export default function PersistentLogo({ onHomeClick }: PersistentLogoProps) {
  return (
    <div 
      className={`fixed ${LOGO_STYLES.POSITION} ${LOGO_STYLES.Z_INDEX} ${LOGO_STYLES.SIZE.CONTAINER} cursor-pointer transition-transform duration-200`}
      onClick={onHomeClick}
      role="button"
      tabIndex={0}
      aria-label="Return to home"
    >
      <div className="w-full h-full">
        <Letter3DContainer 
          size={LOGO_STYLES.SIZE.TEXT} 
          className="w-full h-full" 
        />
      </div>
    </div>
  );
} 