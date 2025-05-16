import React from 'react';

/**
 * Constants for the grid styling
 */
const GRID_STYLES = {
  GRID_SIZE: '40px',
  BLUEPRINT_SIZE: '80px',
  GRID_COLOR: 'rgba(255,255,255,0.15)',
  GRID_LINE_WIDTH: '1px',
  BLUEPRINT_COLOR: 'rgba(0,100,255,0.03)',
  GRID_OPACITY: {
    MIN: 0.25,
    MAX: 0.35
  },
  PERSPECTIVE: '1000px',
  ROTATION: '60deg'
} as const;

/**
 * IsometricGrid component that creates a 3D isometric grid background
 * with a subtle blueprint overlay and animated opacity
 */
const IsometricGrid: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none">
      <style>{`
        @keyframes gridFade {
          0%, 100% { opacity: ${GRID_STYLES.GRID_OPACITY.MIN}; }
          50% { opacity: ${GRID_STYLES.GRID_OPACITY.MAX}; }
        }
        .grid-container {
          position: absolute;
          inset: 0;
          transform: perspective(${GRID_STYLES.PERSPECTIVE}) rotateX(${GRID_STYLES.ROTATION});
          transform-origin: center top;
          background: 
            linear-gradient(90deg, ${GRID_STYLES.GRID_COLOR} ${GRID_STYLES.GRID_LINE_WIDTH}, transparent ${GRID_STYLES.GRID_LINE_WIDTH}),
            linear-gradient(0deg, ${GRID_STYLES.GRID_COLOR} ${GRID_STYLES.GRID_LINE_WIDTH}, transparent ${GRID_STYLES.GRID_LINE_WIDTH});
          background-size: ${GRID_STYLES.GRID_SIZE} ${GRID_STYLES.GRID_SIZE};
          animation: gridFade 6s ease-in-out infinite;
        }
        .grid-container::before {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%),
            repeating-linear-gradient(
              0deg,
              rgba(255,255,255,0.08) 0px,
              rgba(255,255,255,0.08) ${GRID_STYLES.GRID_LINE_WIDTH},
              transparent ${GRID_STYLES.GRID_LINE_WIDTH},
              transparent 30px
            );
          pointer-events: none;
        }
        .blueprint-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, ${GRID_STYLES.BLUEPRINT_COLOR} 25%, transparent 25%);
          background-size: ${GRID_STYLES.BLUEPRINT_SIZE} ${GRID_STYLES.BLUEPRINT_SIZE};
          pointer-events: none;
        }
      `}</style>
      <div className="grid-container" />
      <div className="blueprint-overlay" />
    </div>
  );
};

export default IsometricGrid; 