'use client';

import React, { useRef, useState, useEffect } from 'react';
import PersistentLogo from '@/components/PersistentLogo';
import { motion } from 'framer-motion';

// Wave component
const Wave = ({ size = 20, delay = 0, color = "blue" }) => {
  const [randomX, setRandomX] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setRandomX(Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000));
  }, []);

  // Don't render until client-side to prevent hydration mismatch
  if (!isClient) {
    return null;
  }

  return (
    <motion.div
      className={`text-${color}-400 text-3xl absolute`}
      style={{ 
        left: randomX,
        fontSize: `${size}px`
      }}
      initial={{
        y: '100vh',
        opacity: 0,
        scale: 0.5,
      }}
      animate={{
        y: -100,
        opacity: [0, 1, 0],
        scale: [0.5, 1.2, 0.8],
      }}
      transition={{
        duration: Math.random() * 3 + 4,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut"
      }}
    >
      🌊
    </motion.div>
  );
};

export default function Flow() {
  const flowRef = useRef<HTMLDivElement>(null!);
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <main className="relative min-h-screen overflow-y-scroll overflow-x-hidden text-white scroll-smooth bg-gradient-to-b from-slate-900 via-blue-950/50 to-slate-900">
      {/* Ocean background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Base ocean gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-blue-950/30 to-slate-900" />
        
        {/* Flowing water effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-blue-950/10 to-transparent animate-pulse" style={{ animationDuration: '6s' }} />
        
        {/* Deep ocean overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900 opacity-70" />
        
        {/* Gentle wave effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-800/5 via-blue-700/10 to-transparent animate-pulse" style={{ animationDuration: '4s' }} />
      </div>

      {/* Floating waves with different colors - only render on client */}
      {isClient && (
        <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <Wave 
              key={i} 
              size={Math.random() * 20 + 15} 
              delay={Math.random() * 2}
              color={Math.random() > 0.7 ? "cyan" : "blue"} 
            />
          ))}
        </div>
      )}

      {/* Persistent logo with home navigation */}
      <PersistentLogo 
        onHomeClick={() => window.location.href = '/'}
        color="text-blue-400" 
      />

      <section 
        ref={flowRef}
        id="flow"
        className="min-h-screen flex flex-col items-center justify-start px-4 pt-24 relative z-10"
      >
        <div className="max-w-4xl w-full">
          <motion.h1 
            className="text-5xl sm:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 mb-4 text-center drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            The Flow State
          </motion.h1>
          
          <motion.p 
            className="text-xl sm:text-2xl text-center text-blue-300/80 mb-12 font-light tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Code. Court. Commentary.
          </motion.p>
          
          <div className="space-y-8">
            {/* Example flow entry with enhanced styling */}
            <motion.article 
              className="group relative bg-gradient-to-r from-slate-800/95 to-slate-900/95 backdrop-blur-sm rounded-lg p-8 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-300 border border-blue-900/30"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              onHoverStart={() => setIsHovered('flow1')}
              onHoverEnd={() => setIsHovered(null)}
            >
              {/* Wave decoration */}
              <div className="absolute -top-4 -right-4 w-8 h-8 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-2xl">
                🌊
              </div>

              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 rounded-full bg-blue-900/30 text-green-300 text-sm font-medium">Stocks</span>
                <span className="text-gray-400 text-sm">July 31, 2025</span>
              </div>

              <h2 className="text-2xl font-semibold text-gray-200 mb-3 group-hover:text-blue-400 transition-colors duration-300">
                Figma IPO
              </h2>

                              <p className="text-gray-300 leading-relaxed">
                  Just utterly shocked by the Figma IPO. 40x oversubscribed, stock up over 250% on opening day, taking over the stock exchange. It&apos;s wild they had a bunch of free stuff and events going on at Wall Street, aka a few blocks from where I work... If only I didn&apos;t have to evacuate from flooding, I would&apos;ve been there. They lowkey got screwed by the investment bank, or maybe not idk. Probably a pump and dump vibe.
                </p>

              {/* Interactive wave effect on hover */}
              {isHovered === 'flow1' && (
                <motion.div 
                  className="absolute inset-0 rounded-lg pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-cyan-800/20 animate-pulse" />
                </motion.div>
              )}
            </motion.article>

            {/* Add more flow entries here with the same structure */}
          </div>
        </div>
      </section>
    </main>
  );
} 