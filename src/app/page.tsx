'use client';

import React, { useRef } from 'react';
import SpotifyTop from '@/components/SpotifyTop';
import SectionDots from '@/components/SectionDots';
import PersistentLogo from '@/components/PersistentLogo';
import { FaGithub, FaLinkedin, FaEnvelope, FaFileAlt } from 'react-icons/fa';
import { IconBaseProps } from 'react-icons';

const GithubIcon = FaGithub as React.FC<IconBaseProps>;
const LinkedInIcon = FaLinkedin as React.FC<IconBaseProps>;
const EnvelopeIcon = FaEnvelope as React.FC<IconBaseProps>;
const FileIcon = FaFileAlt as React.FC<IconBaseProps>;

interface Link {
  Icon: React.FC<IconBaseProps>;
  title: string;
  url: string;
  description: string;
}

function BouncingText({ text, className }: { text: string, className: string }) {
  return (
    <div className={`group ${className}`}>
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-0.5em); }
        }
        .bounce-letter {
          display: inline-block;
          animation: none;
        }
        .group:hover .bounce-letter {
          animation: bounce 0.5s ease-in-out;
          animation-fill-mode: forwards;
        }
        .bounce-letter.animating {
          animation: bounce 0.5s ease-in-out;
          animation-fill-mode: forwards;
        }
      `}</style>
      {text.split('').map((letter, index) => (
        <span
          key={index}
          className="bounce-letter inline-block"
          style={{ 
            animationDelay: `${index * 0.05}s`,
            marginRight: letter === ' ' ? '0.25em' : '0'
          }}
          onAnimationStart={(e) => {
            e.currentTarget.classList.add('animating');
          }}
          onAnimationEnd={(e) => {
            e.currentTarget.classList.remove('animating');
          }}
        >
          {letter}
        </span>
      ))}
    </div>
  );
}

export default function Home() {
  const homeRef = useRef<HTMLDivElement>(null!);
  const musicRef = useRef<HTMLDivElement>(null!);

  const links: Link[] = [
    {
      Icon: GithubIcon,
      title: 'GitHub',
      url: 'https://github.com/nnayudu8',
      description: 'Check out my projects!'
    },
    {
      Icon: LinkedInIcon,
      title: 'LinkedIn',
      url: 'https://linkedin.com/in/nidhilnayudu/',
      description: 'Connect with me!'
    },
    {
      Icon: EnvelopeIcon,
      title: 'Email',
      url: 'mailto:nnayudu@berkeley.edu',
      description: 'Let\'s chat!👋'
    },
    {
      Icon: FileIcon,
      title: 'Resume',
      url: '/Nidhil_Nayudu_resume.pdf',
      description: 'View experience'
    }
  ];

  return (
    <main className="h-screen overflow-y-scroll sm:snap-y sm:snap-mandatory overflow-x-hidden text-white scroll-smooth">
      <SectionDots sectionRefs={[homeRef, musicRef]} />
      <PersistentLogo 
        onHomeClick={() => homeRef.current?.scrollIntoView({ behavior: 'smooth' })} 
      />
      
      {/* Home Page */}
      <section 
        ref={homeRef}
        id="home"
        className="min-h-screen sm:snap-start flex flex-col items-center justify-center px-4 text-center relative"
      >
        <BouncingText 
          text="Nidhil Nayudu"
          className="text-6xl sm:text-7xl md:text-8xl font-extrabold text-white font-roboto drop-shadow-xl"
        />
        <BouncingText 
          text="Software Engineer"
          className="text-xl sm:text-2xl text-white/80 mt-6 font-medium"
        />
        <div className="mt-8 flex items-center gap-8">
          {links.map(({ Icon, title, url }) => (
            <a
              key={title}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative text-white/60 hover:text-white transition-colors"
            >
              <div className="relative">
                <Icon className="w-6 h-6" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <style>{`
                    @keyframes pulse {
                      0% { 
                        transform: scale(1);
                        filter: drop-shadow(0 0 0 rgba(34, 197, 94, 0));
                      }
                      50% { 
                        transform: scale(1.1);
                        filter: drop-shadow(0 0 8px rgba(34, 197, 94, 0.5));
                      }
                      100% { 
                        transform: scale(1);
                        filter: drop-shadow(0 0 0 rgba(34, 197, 94, 0));
                      }
                    }
                    .pulse {
                      animation: pulse 2s ease-in-out infinite;
                    }
                  `}</style>
                  <div className="pulse absolute inset-0 text-emerald-400">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 pointer-events-none">
                <div className="text-emerald-400 text-sm font-medium">{title}</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Music Page */}
      <section
        ref={musicRef}
        id="music"
        className="min-h-screen sm:snap-start flex flex-col items-center px-4 text-center bg-black/0 backdrop-blur-sm pb-24 sm:pb-16"
      >
        <h2 className="text-2xl sm:text-4xl font-medium text-emerald-400 flex items-center gap-2 mb-6 mt-10 sm:mt-32">
          <span className="text-2xl">🎧</span>
          <span className="italic text-white/80">What I&apos;ve been listening to</span>
        </h2>

        <div className="w-full max-w-4xl">
          <SpotifyTop />
        </div>
      </section>

      {/* Bottom spacer to ensure content isn't hidden behind floating player */}
      <div className="h-24" />
    </main>
  );
}
