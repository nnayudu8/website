import { NextResponse } from 'next/server';

/**
 * Spotify API configuration
 */
const SPOTIFY_CONFIG = {
  ENDPOINTS: {
    TOKEN: 'https://accounts.spotify.com/api/token',
    TOP_TRACKS: 'https://api.spotify.com/v1/me/top/tracks?limit=5&time_range=short_term'
  }
} as const;

/**
 * Spotify API credentials from environment variables
 */
const CREDENTIALS = {
  CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
  CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
  REFRESH_TOKEN: process.env.SPOTIFY_REFRESH_TOKEN
} as const;

/**
 * Create the Basic Auth header for Spotify API using client ID and secret
 */
const basic = Buffer.from(`${CREDENTIALS.CLIENT_ID}:${CREDENTIALS.CLIENT_SECRET}`).toString('base64');

/**
 * Interface for the Spotify access token response
 */
interface AccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

/**
 * Interface for a Spotify track
 */
interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
  external_urls: {
    spotify: string;
  };
}

/**
 * Interface for the top tracks response
 */
interface TopTracksResponse {
  items: SpotifyTrack[];
}

/**
 * Gets a fresh access token using the refresh token
 */
async function getAccessToken(): Promise<AccessTokenResponse> {
  const response = await fetch(SPOTIFY_CONFIG.ENDPOINTS.TOKEN, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: CREDENTIALS.REFRESH_TOKEN!,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get access token: ${response.status}`);
  }

  return response.json();
}

/**
 * Main API route handler for GET requests
 * Returns the user's top tracks from Spotify
 */
export async function GET() {
  try {
    const { access_token } = await getAccessToken();

    const tracksRes = await fetch(SPOTIFY_CONFIG.ENDPOINTS.TOP_TRACKS, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!tracksRes.ok) {
      throw new Error(`Failed to fetch top tracks: ${tracksRes.status}`);
    }

    const tracksData = await tracksRes.json() as TopTracksResponse;

    return NextResponse.json({
      topTracks: tracksData.items,
    });
  } catch (error) {
    console.error('Error fetching Spotify top data:', error);
    return NextResponse.json({ topTracks: [] });
  }
} 