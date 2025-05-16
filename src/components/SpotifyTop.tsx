'use client';

import { useEffect, useState } from 'react';

/**
 * Interface for a Spotify track
 */
interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
  external_urls: { spotify: string };
}

/**
 * Constants for the component
 */
const COMPONENT_STYLES = {
  MAX_WIDTH: {
    CONTAINER: '4xl',
    CONTENT: '21rem',
    CONTENT_SM: 'md'
  },
  EMBED_HEIGHT: '80'
} as const;

/**
 * SpotifyTop component that displays the user's top tracks
 * using Spotify's embedded player
 */
export default function SpotifyTop() {
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch top tracks from the Spotify API
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/spotify/top');
        const data = await res.json();
        setTopTracks(data.topTracks || []);
      } catch (error) {
        console.error('Error fetching top tracks:', error);
        setTopTracks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={`w-full max-w-${COMPONENT_STYLES.MAX_WIDTH.CONTAINER} mx-auto flex justify-center`}>
      <div className="mb-8 md:mb-0 w-full max-w-[${COMPONENT_STYLES.MAX_WIDTH.CONTENT}] sm:max-w-${COMPONENT_STYLES.MAX_WIDTH.CONTENT_SM}">
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
                  height={COMPONENT_STYLES.EMBED_HEIGHT}
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded"
                  title={`Spotify track: ${track.name}`}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 