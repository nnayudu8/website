/**
 * NowPlaying Component
 * Displays the current Spotify track with animated equalizer and scrolling text
 * Features:
 * - Real-time Spotify integration
 * - Animated equalizer bars
 * - Smooth text scrolling
 * - Progress bar
 * - Responsive design
 */

'use client';

import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { FaSpotify } from 'react-icons/fa';
import type { IconBaseProps } from 'react-icons';

const SpotifyIcon = FaSpotify as React.FC<IconBaseProps>;

/**
 * Interface for the Spotify now playing data
 * @property isPlaying - Whether a track is currently playing
 * @property title - Title of the current track
 * @property artist - Artist of the current track
 * @property album - Album name
 * @property albumArtUrl - URL to the album art
 * @property songUrl - URL to the track on Spotify
 * @property progress - Current playback progress in milliseconds
 * @property duration - Total duration of the track in milliseconds
 */
interface NowPlayingData {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumArtUrl?: string;
  songUrl?: string;
  progress?: number;
  duration?: number;
}

/**
 * Constants for animation and timing
 * Defines durations, intervals, and delays for various animations
 */
const SCROLL_DURATION = '4s';
const RESET_DURATION = '0.6s';
const IDLE_TIMEOUT = 5000;
const PROGRESS_UPDATE_INTERVAL = 1000;
const SPOTIFY_UPDATE_INTERVAL = 10000;
const SCROLL_DELAY = 120;
const TRANSITION_DELAY = 350;

/**
 * Equalizer bars component with animated bars
 * Creates a visual representation of music playback
 */
const Bars = React.memo(({ isPlaying }: { isPlaying: boolean }) => (
  <div className="flex items-end gap-[3px] h-6 w-8 mr-4">
    {[1, 2, 3, 4].map((bar) => (
      <div
        key={bar}
        className={`w-1.5 rounded animate-eq-bar${bar}`}
        style={{ animationPlayState: isPlaying ? 'running' : 'paused', background: 'var(--color-accent)' }}
      />
    ))}
    <style>{`
      @keyframes eq-bar1 { 0%, 100% { height: 35%; } 50% { height: 95%; } }
      @keyframes eq-bar2 { 0%, 100% { height: 55%; } 50% { height: 75%; } }
      @keyframes eq-bar3 { 0%, 100% { height: 75%; } 50% { height: 35%; } }
      @keyframes eq-bar4 { 0%, 100% { height: 45%; } 50% { height: 85%; } }
      .animate-eq-bar1 { animation: eq-bar1 1.1s infinite ease-in-out; }
      .animate-eq-bar2 { animation: eq-bar2 1.3s infinite ease-in-out; }
      .animate-eq-bar3 { animation: eq-bar3 1s infinite ease-in-out; }
      .animate-eq-bar4 { animation: eq-bar4 1.2s infinite ease-in-out; }
    `}</style>
  </div>
));

Bars.displayName = 'Bars';

/**
 * NowPlaying component that displays the current Spotify track
 * with animated equalizer bars and scrolling text
 */
export default function NowPlaying() {
  // State management
  const [data, setData] = useState<NowPlayingData>({ isPlaying: false });
  const [localProgress, setLocalProgress] = useState<number>(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isScrollingLeft, setIsScrollingLeft] = useState(false);
  const [isScrollingRight, setIsScrollingRight] = useState(false);
  const [isMobileAnimating, setIsMobileAnimating] = useState(false);
  const [transitionDuration, setTransitionDuration] = useState(SCROLL_DURATION);
  const [scrollDistance, setScrollDistance] = useState(0);
  const [isIdle, setIsIdle] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Refs for DOM elements
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  /**
   * Detect if the user is on a mobile device
   */
  useEffect(() => {
    const checkMobile = () => {
      if (typeof window === 'undefined') return false;
      const ua = navigator.userAgent;
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    };
    setIsMobile(checkMobile());
  }, []);

  /**
   * Fetch and update Spotify data periodically
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/spotify');
        const data = await response.json();
        setData(data);
        if (data.progress) {
          setLocalProgress(data.progress);
        }
      } catch (error) {
        console.error('Error fetching now playing data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, SPOTIFY_UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  /**
   * Update local progress when track is playing
   */
  useEffect(() => {
    if (!data.isPlaying || !data.progress || !data.duration) return;

    const interval = setInterval(() => {
      setLocalProgress(prev => {
        const next = prev + PROGRESS_UPDATE_INTERVAL;
        return next >= data.duration! ? data.duration! : next;
      });
    }, PROGRESS_UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [data.isPlaying, data.progress, data.duration]);

  /**
   * Handle user inactivity detection
   */
  useEffect(() => {
    const handleActivity = () => {
      setLastActivity(Date.now());
      setIsIdle(false);
    };

    const checkInactivity = () => {
      const inactiveTime = Date.now() - lastActivity;
      if (inactiveTime > IDLE_TIMEOUT && !isIdle) {
        setIsIdle(true);
      }
    };

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    const interval = setInterval(checkInactivity, 1000);
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      clearInterval(interval);
    };
  }, [lastActivity, isIdle]);

  /**
   * Calculate the required scroll distance based on text and container width
   */
  const calculateScrollDistance = () => {
    if (containerRef.current && textRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const textWidth = textRef.current.scrollWidth;
      if (textWidth > containerWidth) {
        setScrollDistance(containerWidth - textWidth - 16); // -16 for padding
      } else {
        setScrollDistance(0);
      }
    }
  };

  /**
   * Start scrolling text to the left
   */
  const startScrollLeft = () => {
    calculateScrollDistance();
    setTransitionDuration(SCROLL_DURATION);
    setIsScrollingRight(false);
    setIsScrollingLeft(true);
  };

  /**
   * Reset text position by scrolling right
   */
  const startScrollRight = () => {
    setTransitionDuration(RESET_DURATION);
    setIsScrollingLeft(false);
    setIsScrollingRight(true);
  };

  /**
   * Handle mouse enter on desktop
   */
  const handleMouseEnter = () => {
    setIsHovering(true);
    if (!isMobile) startScrollLeft();
  };

  /**
   * Handle mouse leave on desktop
   */
  const handleMouseLeave = () => {
    setIsHovering(false);
    if (!isMobile && isScrollingLeft) {
      setTimeout(() => {
        startScrollRight();
      }, SCROLL_DELAY);
    }
  };

  /**
   * Handle click on mobile
   */
  const handleClick = () => {
    if (isMobile && !isScrollingLeft && !isScrollingRight && !isMobileAnimating) {
      setIsMobileAnimating(true);
      calculateScrollDistance();
      setTransitionDuration(SCROLL_DURATION);
      setIsScrollingRight(false);
      setIsScrollingLeft(true);
    }
  };

  /**
   * Handle transition end for scrolling animation
   */
  const handleTransitionEnd = () => {
    if (isScrollingLeft) {
      setTimeout(() => {
        startScrollRight();
      }, TRANSITION_DELAY);
    } else if (isScrollingRight) {
      setTimeout(() => {
        setIsScrollingRight(false);
        setIsMobileAnimating(false);
        // Only loop on desktop
        if (isHovering && !isMobile) {
          setTimeout(() => {
            startScrollLeft();
          }, SCROLL_DELAY);
        }
      }, SCROLL_DELAY);
    }
  };

  // Calculate transform based on scroll state
  let transform = 'translateX(0px)';
  if (isScrollingLeft) transform = `translateX(${scrollDistance}px)`;
  if (isScrollingRight) transform = 'translateX(0px)';

  // Calculate progress percentage
  const progressPercent =
    localProgress && data.duration
      ? Math.min(100, (localProgress / data.duration) * 100)
      : 0;

  return (
    <div
      className="flex items-center gap-4 px-4 py-3 rounded-md max-w-[95vw] sm:max-w-md"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        position: 'relative',
      }}
    >
      {/* Animated equalizer bars */}
      <Bars isPlaying={data.isPlaying} />
      
      {/* Track information container */}
      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="flex items-center gap-2 min-w-0">
          {/* Scrolling title container */}
          <div
            ref={containerRef}
            className="relative overflow-hidden max-w-[180px] min-w-0 cursor-pointer"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onTouchStart={handleClick}
          >
            <span
              ref={textRef}
              className="font-medium whitespace-nowrap inline-block"
              style={{
                color: 'var(--color-text)',
                fontSize: '0.875rem',
                transform,
                transition: `transform ${transitionDuration} ${isScrollingRight ? 'cubic-bezier(0.22, 1, 0.36, 1)' : 'linear'}`,
                willChange: 'transform',
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {data.isPlaying ? data.title : 'Not playing'}
            </span>
          </div>
          
          {/* Artist name */}
          {data.isPlaying && (
            <span className="text-xs font-medium truncate min-w-0" style={{ color: 'var(--color-text-muted)' }}>
              {data.artist}
            </span>
          )}
        </div>
        
        {/* Album name */}
        {data.isPlaying && (
          <div className="text-xs truncate min-w-0" style={{ color: 'var(--color-text-muted)' }}>
            {data.album}
          </div>
        )}
        
        {/* Progress bar */}
        {data.isPlaying && (
          <div className="w-full h-[2px] rounded mt-2" style={{ background: 'var(--color-border)' }}>
            <div
              className="h-full rounded transition-all duration-1000"
              style={{ width: `${progressPercent}%`, background: 'var(--color-accent)' }}
            />
          </div>
        )}
      </div>
      
      {/* Spotify icon with idle animation */}
      <span style={{ display: 'flex', alignItems: 'center' }}>
        <SpotifyIcon
          className="text-2xl ml-2"
          style={{ color: '#1DB954' }}
          aria-hidden="true"
        />
      </span>
    </div>
  );
} 