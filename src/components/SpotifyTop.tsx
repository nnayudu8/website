'use client';

import { useEffect, useState } from 'react';

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
  external_urls: { spotify: string };
}

interface Artist {
  id: string;
  name: string;
  images: { url: string }[];
  external_urls: { spotify: string };
}

export default function SpotifyTop() {
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetch('/api/spotify/top');
      const data = await res.json();
      setTopTracks(data.topTracks || []);
      setTopArtists(data.topArtists || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  console.log(topTracks, topArtists);

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
      {/*
      <div>
        <h3 className="text-xl font-bold mb-4 text-emerald-300">Top Artists</h3>
        {loading ? (
          <div className="text-gray-400">Loading...</div>
        ) : (
          <ul className="flex flex-col gap-4">
            {topArtists.map((artist, idx) => (
              <li key={artist.id} className="flex items-center gap-4 bg-white/5 rounded-lg p-2">
                <img
                  src={artist.images[0]?.url}
                  alt={artist.name}
                  className="w-12 h-12 rounded-full shadow"
                />
                <div className="flex-1 min-w-0">
                  <a
                    href={artist.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-white truncate hover:underline"
                  >
                    {idx + 1}. {artist.name}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      */}
    </div>
  );
} 