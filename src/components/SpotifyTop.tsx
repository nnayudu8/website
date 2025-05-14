'use client';

import { useEffect, useState } from 'react';

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
  external_urls: { spotify: string };
}

export default function SpotifyTop() {
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetch('/api/spotify/top');
      const data = await res.json();
      setTopTracks(data.topTracks || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto flex justify-center">
      <div className="mb-8 md:mb-0 w-full max-w-[21rem] sm:max-w-md">
        <h3 className="text-xl font-bold mb-4 text-emerald-300">Top Songs</h3>
        {loading ? (
          <div className="text-gray-400">Loading...</div>
        ) : (
          <ul className="flex flex-col gap-2">
            {topTracks.map((track) => (
              <li key={track.id}>
                <iframe
                  src={`https://open.spotify.com/embed/track/${track.id}`}
                  width="100%"
                  height="80"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded"
                ></iframe>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 