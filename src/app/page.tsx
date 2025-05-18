/**
 * Main page component for the personal website
 * Implements a responsive layout with interactive elements and animations
 */
'use client';

import React, { useRef, useEffect, useState } from 'react';
import SectionDots from '@/components/SectionDots';
import PersistentLogo from '@/components/PersistentLogo';
import { FiGithub, FiLinkedin, FiMail, FiFileText } from 'react-icons/fi';
import { IconBaseProps } from 'react-icons';
import NodeMesh, { NodeMeshHandle } from '@/components/NodeMesh';
import SkillTyper from '@/components/SkillTyper';

/**
 * Configuration for social media and contact links
 * Each link has an icon, title, URL, and hover description
 */
const SOCIAL_LINKS = [
  {
    Icon: FiGithub as React.FC<IconBaseProps>,
    title: 'GitHub',
    url: 'https://github.com/nnayudu8',
    description: 'Check out my projects!'
  },
  {
    Icon: FiLinkedin as React.FC<IconBaseProps>,
    title: 'LinkedIn',
    url: 'https://linkedin.com/in/nidhilnayudu/',
    description: 'Connect with me!'
  },
  {
    Icon: FiMail as React.FC<IconBaseProps>,
    title: 'Email',
    url: 'mailto:nnayudu@umich.edu',
    description: 'Let\'s chat!👋'
  },
  {
    Icon: FiFileText as React.FC<IconBaseProps>,
    title: 'Resume',
    url: '/Nidhil_Nayudu_resume.pdf',
    description: 'View experience'
  }
] as const;

/**
 * Constants for animation and styling configurations
 * Defines timing, scaling, and visual effects for interactive elements
 */
const ANIMATION_STYLES = {
  PULSE: {
    DURATION: '2s',
    SCALE: {
      MIN: 1,
      MAX: 1.1
    },
    SHADOW: {
      MIN: '0 0 0 rgba(255, 255, 255, 0)',
      MAX: '0 0 8px rgba(255, 255, 255, 0.5)'
    }
  }
} as const;

/**
 * Home page component that serves as the main entry point of the website
 * Implements a responsive layout with interactive elements and animations
 * Features:
 * - Interactive skill typing effect
 * - Neural network visualization
 * - Social media links with hover effects
 * - Smooth scrolling sections
 */
export default function Home() {
  // Refs for DOM elements and components
  const homeRef = useRef<HTMLDivElement>(null!);
  const musicRef = useRef<HTMLDivElement>(null!);
  const nodeMeshRef = useRef<NodeMeshHandle>(null!);
  
  // State for tracking active sections and skill positions
  const [homeActive, setHomeActive] = useState(true);
  const [skillPosition, setSkillPosition] = useState<{ x: number; y: number } | undefined>(undefined);

  /**
   * Sets up an intersection observer to track when the home section is in view
   * Updates the homeActive state based on visibility
   */
  useEffect(() => {
    if (!homeRef.current) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => setHomeActive(entry.isIntersecting),
      { threshold: 0.4 }
    );
    observer.observe(homeRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <main className="relative h-screen overflow-y-scroll sm:snap-y sm:snap-mandatory overflow-x-hidden text-white scroll-smooth bg-gradient-to-b from-gray-900 to-black">
      {/* Neural network visualization component */}
      <NodeMesh ref={nodeMeshRef} position={skillPosition} />
      
      {/* Interactive skill typing effect component */}
      <SkillTyper 
        active={homeActive} 
        nodeMeshRef={nodeMeshRef} 
        onPositionChange={(x, y) => setSkillPosition({ x, y })}
      />
      
      <div className="relative z-10">
        {/* Navigation dots for section scrolling */}
        <SectionDots sectionRefs={[homeRef, musicRef]} />
        
        {/* Persistent logo with home navigation */}
        <PersistentLogo 
          onHomeClick={() => homeRef.current?.scrollIntoView({ behavior: 'smooth' })} 
        />

        {/* Home Section - Main landing area */}
        <section 
          ref={homeRef}
          id="home"
          className="min-h-screen sm:snap-start flex flex-col items-center justify-center px-4 text-center relative"
        >
          {/* Main name with responsive font size */}
          <div className="main-name text-[clamp(1.25rem,min(10vw,7rem),min(10vw,7rem))] font-bold text-gray-200 whitespace-nowrap">
            Nidhil Nayudu
          </div>
          
          {/* Title with responsive font size */}
          <div className="main-title text-[clamp(0.625rem,min(3vw,1.75rem),min(3vw,1.75rem))] font-semibold text-gray-300 whitespace-nowrap -mt-2">
            Software Engineer  |  Energy Shifter
          </div>
          
          {/* Social media links with hover effects */}
          <div className="mt-3 flex items-center gap-8">
            {SOCIAL_LINKS.map(({ Icon, title, url, description }) => (
              <a
                key={title}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative transition-all duration-300 text-white/60 hover:text-white hover:scale-110"
              >
                <div className="relative">
                  <Icon className="w-6 h-6 text-white drop-shadow" />
                  {/* Hover animation effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <style>{`
                      @keyframes pulse {
                        0% { 
                          transform: scale(${ANIMATION_STYLES.PULSE.SCALE.MIN});
                          filter: drop-shadow(${ANIMATION_STYLES.PULSE.SHADOW.MIN});
                        }
                        50% { 
                          transform: scale(${ANIMATION_STYLES.PULSE.SCALE.MAX});
                          filter: drop-shadow(${ANIMATION_STYLES.PULSE.SHADOW.MAX});
                        }
                        100% { 
                          transform: scale(${ANIMATION_STYLES.PULSE.SCALE.MIN});
                          filter: drop-shadow(${ANIMATION_STYLES.PULSE.SHADOW.MIN});
                        }
                      }
                      .pulse {
                        animation: pulse ${ANIMATION_STYLES.PULSE.DURATION} ease-in-out infinite;
                      }
                    `}</style>
                    <div className="pulse absolute inset-0 text-white">
                      <Icon className="w-6 h-6 text-white drop-shadow" />
                    </div>
                  </div>
                </div>
                {/* Hover tooltip with title and description */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 pointer-events-none">
                  <div className="text-white text-sm font-medium">{title}</div>
                  <div className="text-white/60 text-xs mt-1">{description}</div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Music Section - Placeholder for future content */}
        <section
          ref={musicRef}
          id="music"
          className="min-h-screen sm:snap-start flex flex-col items-center justify-center px-4 text-center backdrop-blur-sm"
        >
          <div className="relative">
            <div className="absolute bottom-0 left-0 w-full h-[1.25px] bg-emerald-400/70 animate-underline -z-10" />
            <h2 className="text-4xl sm:text-6xl font-medium text-white/80 relative">
              Coming Soon
            </h2>
            <style>{`
              @keyframes underline {
                0%, 100% { transform: scaleX(0); }
                50% { transform: scaleX(1); }
              }
              .animate-underline {
                animation: underline 2.5s ease-in-out infinite;
                transform-origin: center;
              }
            `}</style>
          </div>
        </section>

        {/* Bottom spacer to prevent content from being hidden behind floating elements */}
        <div className="h-24" />
      </div>
    </main>
  );
}
