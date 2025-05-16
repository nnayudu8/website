import React, { useState, useEffect } from 'react';

/**
 * Constants for the focus bubble behavior
 */
const INACTIVITY_TIMEOUT = 5000; // 5 seconds
const CHECK_INTERVAL = 1000; // 1 second
const USER_ACTIVITY_EVENTS = [
  'mousedown',
  'mousemove',
  'keydown',
  'scroll',
  'touchstart'
] as const;

/**
 * FocusBubble component that displays a pulsing indicator when the user
 * has been inactive for a period of time, suggesting they can enter focus mode
 */
const FocusBubble: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  /**
   * Handle user activity detection and inactivity timeout
   */
  useEffect(() => {
    const handleActivity = () => {
      setLastActivity(Date.now());
      setIsVisible(false);
    };

    const checkInactivity = () => {
      const inactiveTime = Date.now() - lastActivity;
      if (inactiveTime > INACTIVITY_TIMEOUT && !isVisible) {
        setIsVisible(true);
      }
    };

    // Add event listeners for user activity
    USER_ACTIVITY_EVENTS.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Check for inactivity periodically
    const interval = setInterval(checkInactivity, CHECK_INTERVAL);

    return () => {
      // Clean up event listeners and interval
      USER_ACTIVITY_EVENTS.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      clearInterval(interval);
    };
  }, [lastActivity, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 right-8 pointer-events-none z-50">
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.5; }
          100% { transform: scale(1); opacity: 0.3; }
        }
        .focus-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
          animation: pulse 2s ease-in-out infinite;
        }
        .focus-text {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.6);
          font-size: 12px;
          font-family: 'Fira Code', monospace;
          white-space: nowrap;
        }
      `}</style>
      <div className="relative">
        <div className="focus-indicator" />
        <div className="focus-text">focus mode</div>
      </div>
    </div>
  );
};

export default FocusBubble; 