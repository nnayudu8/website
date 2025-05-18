import { NextResponse } from 'next/server';

/**
 * Spotify API configuration
 */
const SPOTIFY_CONFIG = {
  ENDPOINTS: {
    TOKEN: 'https://accounts.spotify.com/api/token',
    NOW_PLAYING: 'https://api.spotify.com/v1/me/player/currently-playing'
  },
  RETRY: {
    MAX_ATTEMPTS: 3,
    BACKOFF_BASE: 1000 // Base delay in milliseconds
  }
} as const;

/**
 * Create the Basic Auth header for Spotify API using client ID and secret
 */
const basic = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');

/**
 * Interface for the Spotify access token response
 */
interface AccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

/**
 * Gets a fresh access token using the refresh token
 * Implements exponential backoff retry logic
 */
async function getAccessToken(): Promise<AccessTokenResponse> {
  const { MAX_ATTEMPTS, BACKOFF_BASE } = SPOTIFY_CONFIG.RETRY;
  let retryCount = 0;

  while (retryCount < MAX_ATTEMPTS) {
    try {
      const response = await fetch(SPOTIFY_CONFIG.ENDPOINTS.TOKEN, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${basic}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: process.env.SPOTIFY_REFRESH_TOKEN!,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      retryCount++;
      if (retryCount === MAX_ATTEMPTS) {
        console.error('Failed to get access token after retries:', error);
        throw error;
      }
      // Exponential backoff: 2^retryCount * baseDelay
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * BACKOFF_BASE));
    }
  }
  throw new Error('Failed to get access token');
}

/**
 * Helper function to fetch data with retry logic and exponential backoff
 */
async function fetchWithRetry(url: string, options: RequestInit): Promise<Response> {
  const { MAX_ATTEMPTS, BACKOFF_BASE } = SPOTIFY_CONFIG.RETRY;
  let retryCount = 0;
  
  while (retryCount < MAX_ATTEMPTS) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response;
    } catch (error) {
      retryCount++;
      if (retryCount === MAX_ATTEMPTS) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * BACKOFF_BASE));
    }
  }
  throw new Error('Failed to fetch data');
}

/**
 * Interface for the Spotify track data
 */
interface SpotifyTrack {
  is_playing: boolean;
  item: {
    name: string;
    artists: Array<{ name: string }>;
    album: {
      name: string;
      images: Array<{ url: string }>;
    };
    external_urls: {
      spotify: string;
    };
    duration_ms: number;
  };
  progress_ms: number;
}

/**
 * Main API route handler for GET requests
 * Returns the currently playing song data from Spotify
 */
export async function GET() {
  try {
    const { access_token } = await getAccessToken();

    const response = await fetchWithRetry(SPOTIFY_CONFIG.ENDPOINTS.NOW_PLAYING, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: 'no-store',
    });

    if (!response || response.status === 204 || response.status > 400) {
      return NextResponse.json({ isPlaying: false });
    }

    const song = await response.json() as SpotifyTrack;
    const {
      is_playing: isPlaying,
      item: {
        name: title,
        artists,
        album: { name: album, images },
        external_urls: { spotify: songUrl },
        duration_ms: duration
      },
      progress_ms: progress
    } = song;

    return NextResponse.json({
      album,
      albumArtUrl: images[0].url,
      artist: artists.map(artist => artist.name).join(', '),
      isPlaying,
      songUrl,
      title,
      progress,
      duration,
    });
  } catch (error) {
    console.error('Error fetching Spotify data:', error);
    return NextResponse.json({ isPlaying: false });
  }
} 