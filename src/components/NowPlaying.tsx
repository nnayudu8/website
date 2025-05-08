'use client';

import { useEffect, useState } from 'react';
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
      className="flex items-center gap-4 px-6 py-3 rounded-full"
      style={{
        minWidth: 320,
        maxWidth: 480,
        width: '100%',
        background: 'rgba(0,0,0,0.25)',
        boxShadow: '0 4px 24px 0 rgba(0,0,0,0.12)',
        backdropFilter: 'blur(8px)',
        position: 'relative',
      }}
    >
      <Bars />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white truncate">{data.isPlaying ? data.title : 'Not playing'}</span>
          {data.isPlaying && (
            <span className="text-emerald-100 text-xs font-medium truncate">{data.artist}</span>
          )}
        </div>
        {data.isPlaying && (
          <div className="text-xs text-gray-200 truncate">{data.album}</div>
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