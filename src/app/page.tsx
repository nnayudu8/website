'use client';

import { useRef } from 'react';

export default function Home() {
  const homeRef = useRef<HTMLDivElement>(null);
  const musicRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref : React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="h-screen overflow-scroll snap-y snap-mandatory overflow-x-hidden text-white scroll-smooth">
      {/* Home Page */}
      <section 
        ref={homeRef}
        className="h-screen snap-start flex flex-col items-center justify-center px-4 text-center relative"
      >
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold text-white font-roboto drop-shadow-xl">
          Nidhil Nayudu
        </h1>
        <p className="text-xl sm:text-2xl mt-4 text-gray-300 italic">Coming Soon...</p>

        {/* Scroll-down button */}
        <button
          onClick={() => scrollTo(musicRef)}
          className="absolute bottom-10 text-white/60 hover:text-white transition text-3xl animate-bounce"
          aria-label="Scroll to Spotify Section"
        >
          ↓
        </button>
      </section>

      {/* Music Page */}
      <section
        ref={musicRef}
        className="h-screen snap-start flex flex-col items-center justify-center px-4 text-center bg-black/0 backdrop-blur-sm"
      >
        
        {/* Scroll-up button */}
        <button
          onClick={() => scrollTo(homeRef)}
          className="absolute top-10 text-white/60 hover:text-white transition text-3xl animate-bounce"
          aria-label="Scroll to Home Section"
        >
          ↑
        </button>

        <h2 className="text-2xl sm:text-4xl font-medium text-emerald-400 flex items-center gap-2 mb-6">
          <span className="text-2xl">🎧</span>
          <span className="italic text-white/80">What I’ve been listening to</span>
        </h2>

        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg flex flex-col gap-4">
          {[
            'https://open.spotify.com/embed/track/6YG4gGjVGf2IzNmxZUOLsV?utm_source=generator',
            'https://open.spotify.com/embed/track/38rCgMdqt97TcHeSaYsydV?utm_source=generator',
            'https://open.spotify.com/embed/track/2uaGdbU9Z3UaaC1DIzrUJO?utm_source=generator&theme=0',
            
          ].map((url, idx) => (
            <iframe
              key={idx}
              src={url}
              width="100%"
              height="81"
              allow="encrypted-media"
              className="rounded-xl shadow-lg border border-white/10"
            ></iframe>
          ))}
        </div>
      </section>
    </main>
  );
}
