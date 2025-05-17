'use client';

import React, { useRef, useEffect, useState } from 'react';
import SpotifyTop from '@/components/SpotifyTop';
import SectionDots from '@/components/SectionDots';
import PersistentLogo from '@/components/PersistentLogo';
import { FaGithub, FaLinkedin, FaEnvelope, FaFileAlt } from 'react-icons/fa';
import { IconBaseProps } from 'react-icons';
import NodeMesh, { NodeMeshHandle } from '@/components/NodeMesh';
import FocusBubble from '@/components/FocusBubble';
import SkillTyper from '@/components/SkillTyper';

/**
 * Social media and contact links configuration
 */
const SOCIAL_LINKS = [
  {
    Icon: FaGithub as React.FC<IconBaseProps>,
    title: 'GitHub',
    url: 'https://github.com/nnayudu8',
    description: 'Check out my projects!'
  },
  {
    Icon: FaLinkedin as React.FC<IconBaseProps>,
    title: 'LinkedIn',
    url: 'https://linkedin.com/in/nidhilnayudu/',
    description: 'Connect with me!'
  },
  {
    Icon: FaEnvelope as React.FC<IconBaseProps>,
    title: 'Email',
    url: 'mailto:nnayudu@umich.edu',
    description: 'Let\'s chat!👋'
  },
  {
    Icon: FaFileAlt as React.FC<IconBaseProps>,
    title: 'Resume',
    url: '/Nidhil_Nayudu_resume.pdf',
    description: 'View experience'
  }
] as const;

/**
 * Constants for animations and styling
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
 * Props for the BouncingText component
 */
interface BouncingTextProps {
  text: string;
  className?: string;
}

/**
 * BouncingText component that creates a text animation where letters
 * bounce up when hovered or animated
 */
function BouncingText({ text, className = '' }: BouncingTextProps) {
  return (
    <div className={`group ${className}`}>
      <style>{`
        .bounce-letter {
          display: inline-block;
        }
      `}</style>
      {text.split('').map((letter, index) => (
        <span
          key={index}
          className="bounce-letter inline-block"
          style={{ 
            marginRight: letter === ' ' ? '0.25em' : '0'
          }}
        >
          {letter}
        </span>
      ))}
    </div>
  );
}

/**
 * Home page component that displays the main content of the website
 * including the hero section and music section
 */
export default function Home() {
  const homeRef = useRef<HTMLDivElement>(null!);
  const musicRef = useRef<HTMLDivElement>(null!);
  const nodeMeshRef = useRef<NodeMeshHandle>(null!);
  const [homeActive, setHomeActive] = useState(true);
  const [skillPosition, setSkillPosition] = useState<{ x: number; y: number } | undefined>(undefined);

  /**
   * Set up intersection observer to track when home section is in view
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
      <NodeMesh ref={nodeMeshRef} position={skillPosition} />
      <SkillTyper 
        active={homeActive} 
        nodeMeshRef={nodeMeshRef} 
        onPositionChange={(x, y) => setSkillPosition({ x, y })}
      />
      <FocusBubble />
      <div className="relative z-10">
        <SectionDots sectionRefs={[homeRef, musicRef]} />
        <PersistentLogo 
          onHomeClick={() => homeRef.current?.scrollIntoView({ behavior: 'smooth' })} 
        />

        {/* Home Section */}
        <section 
          ref={homeRef}
          id="home"
          className="min-h-screen sm:snap-start flex flex-col items-center justify-center px-4 text-center relative"
        >
          <BouncingText 
            text="Nidhil Nayudu"
            className="text-6xl sm:text-7xl md:text-8xl font-extrabold font-roboto drop-shadow-xl text-white"
          />
          <BouncingText 
            text="Software Engineer  |  Energy Shifter"
            className="text-xl sm:text-2xl mt-6 font-medium text-white/80"
          />
          <div className="mt-8 flex items-center gap-8">
            {SOCIAL_LINKS.map(({ Icon, title, url, description }) => (
              <a
                key={title}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative transition-all duration-300 text-white/60 hover:text-white hover:scale-110"
              >
                <div className="relative">
                  <Icon className="w-6 h-6" />
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
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 pointer-events-none">
                  <div className="text-white text-sm font-medium">{title}</div>
                  <div className="text-white/60 text-xs mt-1">{description}</div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Music Section */}
        <section
          ref={musicRef}
          id="music"
          className="min-h-screen sm:snap-start flex flex-col items-center px-4 text-center backdrop-blur-sm pb-24 sm:pb-16 bg-black/0"
        >
          <h2 className="text-2xl sm:text-4xl font-medium text-white flex items-center gap-2 mb-6 mt-10 sm:mt-32">
            <span className="text-2xl">🎧</span>
            <span className="italic text-white/80">What I&apos;ve been listening to</span>
          </h2>

          <div className="w-full max-w-4xl">
            <SpotifyTop />
          </div>
        </section>

        {/* Bottom spacer to ensure content isn't hidden behind floating player */}
        <div className="h-24" />
      </div>
    </main>
  );
}
