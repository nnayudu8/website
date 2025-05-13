'use client';

import { useState } from 'react';
import Letter3DContainer from './Letter3DContainer';

export default function PersistentLogo() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Small persistent logo */}
      <div 
        className="fixed top-2 left-2 z-50 w-24 h-24 cursor-pointer hover:scale-105 transition-transform duration-200"
        onClick={() => setIsExpanded(true)}
      >
        <Letter3DContainer size={3} className="w-full h-full" />
      </div>

      {/* Expanded overlay */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={() => setIsExpanded(false)}
        >
          <div 
            className="w-[70vw] h-[40vh] sm:w-[80vw] sm:h-[80vh] max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Letter3DContainer size={4} className="w-full h-full" />
          </div>
        </div>
      )}
    </>
  );
} 