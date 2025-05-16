import React from 'react';

/**
 * Constants for the background styling
 */
const BACKGROUND_STYLES = {
  GRADIENT: {
    FROM: '#0f172a',
    TO: '#1e293b'
  },
  Z_INDEX: -1
} as const;

/**
 * ParticleBackground component that creates a gradient background
 * with a smooth color transition effect
 */
const ParticleBackground: React.FC = () => {
  return (
    <div 
      className="fixed inset-0 pointer-events-none transition-colors duration-500"
      style={{
        background: `linear-gradient(to bottom, ${BACKGROUND_STYLES.GRADIENT.FROM}, ${BACKGROUND_STYLES.GRADIENT.TO})`,
        zIndex: BACKGROUND_STYLES.Z_INDEX
      }}
    />
  );
};

export default ParticleBackground; 