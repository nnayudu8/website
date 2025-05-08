'use client';

import { useRef } from 'react';
import SpotifyTop from '@/components/SpotifyTop';
import SectionDots from '@/components/SectionDots';

export default function Home() {
  const homeRef = useRef<HTMLDivElement>(null);
  const musicRef = useRef<HTMLDivElement>(null);

  return (
    <main className="h-screen overflow-y-scroll snap-y snap-mandatory overflow-x-hidden text-white scroll-smooth">
      <SectionDots />
      
      {/* Home Page */}
      <section 
        ref={homeRef}
        id="home"
        className="min-h-screen snap-start flex flex-col items-center justify-center px-4 text-center relative"
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
        className="min-h-screen snap-start flex flex-col items-center px-4 text-center bg-black/0 backdrop-blur-sm pb-24 sm:pb-16"
      >
        <h2 className="text-2xl sm:text-4xl font-medium text-emerald-400 flex items-center gap-2 mb-6 mt-10 sm:mt-32">
          <span className="text-2xl">🎧</span>
          <span className="italic text-white/80">What I&apos;ve been listening to</span>
        </h2>

        <div className="w-full max-w-4xl">
          {/* <TopArtists /> */}
          <SpotifyTop />
        </div>
      </section>

      {/* Bottom spacer to ensure content isn't hidden behind floating player */}
      <div className="h-24" />
    </main>
  );
}
