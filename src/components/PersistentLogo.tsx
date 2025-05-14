'use client';

import Letter3DContainer from './Letter3DContainer';

interface PersistentLogoProps {
  onHomeClick?: () => void;
}

export default function PersistentLogo({ onHomeClick }: PersistentLogoProps) {
  return (
    <div 
      className="fixed top-2 left-2 z-50 w-24 h-24 cursor-pointer transition-transform duration-200"
      onClick={onHomeClick}
    >
      <div className="w-full h-full">
        <Letter3DContainer size={3} className="w-full h-full" />
      </div>
    </div>
  );
} 