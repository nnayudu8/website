'use client';

import { useRef } from 'react';
import SpotifyTop from '@/components/SpotifyTop';
import SectionDots from '@/components/SectionDots';
import PersistentLogo from '@/components/PersistentLogo';
import Letter3DContainer from '@/components/Letter3DContainer';

export default function Home() {
  const homeRef = useRef<HTMLDivElement>(null);
  const musicRef = useRef<HTMLDivElement>(null);
  const nRef = useRef<HTMLDivElement>(null);

  return (
    <main className="h-screen overflow-y-scroll sm:snap-y sm:snap-mandatory overflow-x-hidden text-white scroll-smooth">
      <SectionDots sectionRefs={[homeRef, musicRef, nRef]} />
      <PersistentLogo />
      
      {/* Home Page */}
      <section 
        ref={homeRef}
        id="home"
        className="min-h-screen sm:snap-start flex flex-col items-center justify-center px-4 text-center relative"
      >
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold text-white font-roboto drop-shadow-xl">
          Nidhil Nayudu
        </h1>
        <p className="text-xl sm:text-2xl mt-4 text-gray-300 italic">Coming Soon...</p>
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

      {/* Experiment Section: Just the 3D N */}
      <section ref={nRef} id="n3d" className="min-h-screen sm:snap-start flex flex-col items-center justify-center">
        <div className="w-full h-[60vh] flex items-center justify-center">
          <div className="w-full max-w-7xl flex gap-8 px-4 h-full">
            {/* Left box with 3D N */}
            <div className="flex-1 flex items-center justify-center h-full">
              <Letter3DContainer className="w-full h-full" />
            </div>
            {/* Right box - placeholder for future content */}
            <div className="flex-1 flex items-center justify-center bg-white/5 rounded-lg backdrop-blur-sm h-full">
              <p className="text-gray-400">Content coming soon...</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
