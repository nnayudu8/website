'use client';

import { useEffect, useRef, useState } from 'react';
import { FaSpotify } from 'react-icons/fa';

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

export default function NowPlaying() {
  const [data, setData] = useState<NowPlayingData>({ isPlaying: false });
  const [isMobile, setIsMobile] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isScrollingLeft, setIsScrollingLeft] = useState(false);
  const [isScrollingRight, setIsScrollingRight] = useState(false);
  const [isMobileAnimating, setIsMobileAnimating] = useState(false);
  const [transitionDuration, setTransitionDuration] = useState('4s');
  const [scrollDistance, setScrollDistance] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      if (typeof window === 'undefined') return false;
      const ua = navigator.userAgent;
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    };
    setIsMobile(checkMobile());
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/spotify');
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error('Error fetching now playing data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Calculate scroll distance on scroll start
  const calculateScrollDistance = () => {
    if (containerRef.current && textRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const textWidth = textRef.current.scrollWidth;
      if (textWidth > containerWidth) {
        setScrollDistance(containerWidth - textWidth - 16); // -16 for a little padding
      } else {
        setScrollDistance(0);
      }
    }
  };

  // Start left scroll
  const startScrollLeft = () => {
    calculateScrollDistance();
    setTransitionDuration('4s');
    setIsScrollingRight(false);
    setIsScrollingLeft(true);
  };

  // Start right scroll (reset)
  const startScrollRight = () => {
    setTransitionDuration('0.6s');
    setIsScrollingLeft(false);
    setIsScrollingRight(true);
  };

  // Desktop: on hover
  const handleMouseEnter = () => {
    setIsHovering(true);
    if (!isMobile) startScrollLeft();
  };

  // Desktop: on mouse leave
  const handleMouseLeave = () => {
    setIsHovering(false);
    if (!isMobile && isScrollingLeft) {
      setTimeout(() => {
        startScrollRight();
      }, 120);
    }
  };

  // Mobile: on tap
  const handleClick = () => {
    if (isMobile && !isScrollingLeft && !isScrollingRight && !isMobileAnimating) {
      setIsMobileAnimating(true);
      startScrollLeft();
    }
  };

  // On transition end
  const handleTransitionEnd = () => {
    if (isScrollingLeft) {
      setTimeout(() => {
        startScrollRight();
      }, 350);
    } else if (isScrollingRight) {
      setTimeout(() => {
        setIsScrollingRight(false);
        setIsMobileAnimating(false);
        // Only loop on desktop
        if (isHovering && !isMobile) {
          setTimeout(() => {
            startScrollLeft();
          }, 120);
        }
      }, 120);
    }
  };

  // Calculate transform
  let transform = 'translateX(0px)';
  if (isScrollingLeft) transform = `translateX(${scrollDistance}px)`;
  if (isScrollingRight) transform = 'translateX(0px)';

  // Negative space equalizer bars (white bars on transparent background)
  const Bars = () => (
    <div className="flex items-end gap-[3px] h-6 w-8 mr-4">
      {[1, 2, 3, 4].map((bar) => (
        <div
          key={bar}
          className={`w-1.5 rounded bg-white/80 animate-eq-bar${bar}`}
          style={{ animationPlayState: data.isPlaying ? 'running' : 'paused' }}
        />
      ))}
      <style jsx>{`
        @keyframes eq-bar1 { 0%, 100% { height: 30%; } 50% { height: 100%; } }
        @keyframes eq-bar2 { 0%, 100% { height: 60%; } 50% { height: 80%; } }
        @keyframes eq-bar3 { 0%, 100% { height: 80%; } 50% { height: 40%; } }
        @keyframes eq-bar4 { 0%, 100% { height: 50%; } 50% { height: 90%; } }
        .animate-eq-bar1 { animation: eq-bar1 1s infinite; }
        .animate-eq-bar2 { animation: eq-bar2 1.2s infinite; }
        .animate-eq-bar3 { animation: eq-bar3 0.9s infinite; }
        .animate-eq-bar4 { animation: eq-bar4 1.1s infinite; }
      `}</style>
    </div>
  );

  const progressPercent =
    data.progress && data.duration
      ? Math.min(100, (data.progress / data.duration) * 100)
      : 0;

  return (
    <div
      className="flex items-center gap-4 px-4 py-3 rounded-full max-w-[95vw] sm:max-w-md"
      style={{
        background: 'rgba(0,0,0,0.25)',
        boxShadow: '0 4px 24px 0 rgba(0,0,0,0.12)',
        backdropFilter: 'blur(8px)',
        position: 'relative',
      }}
    >
      <Bars />
      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="flex items-center gap-2 min-w-0">
          <div
            ref={containerRef}
            className="relative overflow-hidden max-w-[180px] min-w-0"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
          >
            <span
              ref={textRef}
              className="font-bold text-white whitespace-nowrap inline-block"
              style={{
                transform,
                transition: `transform ${transitionDuration} ${isScrollingRight ? 'cubic-bezier(0.22, 1, 0.36, 1)' : 'linear'}`,
                willChange: 'transform',
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {data.isPlaying ? data.title : 'Not playing'}
            </span>
          </div>
          {data.isPlaying && (
            <span className="text-emerald-100 text-xs font-medium truncate min-w-0">{data.artist}</span>
          )}
        </div>
        {data.isPlaying && (
          <div className="text-xs text-gray-200 truncate min-w-0">{data.album}</div>
        )}
        {data.isPlaying && (
          <div className="w-full h-1 bg-white/20 rounded mt-2">
            <div
              className="h-1 bg-white rounded"
              style={{ width: `${progressPercent}%`, transition: 'width 0.5s' }}
            />
          </div>
        )}
      </div>
      <FaSpotify className="text-white/80 text-2xl ml-2 drop-shadow" />
    </div>
  );
} 