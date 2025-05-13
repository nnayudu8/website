import { NextResponse } from 'next/server';

// Spotify API credentials from environment variables
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

// Create the Basic Auth header for Spotify API using client ID and secret
const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

// Spotify API endpoints for token and top tracks/artists
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks?limit=5&time_range=short_term`;
const TOP_ARTISTS_ENDPOINT = `https://api.spotify.com/v1/me/top/artists?limit=5&time_range=short_term`;

// Function to get a fresh access token using the refresh token
async function getAccessToken() {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: REFRESH_TOKEN!,
    }),
  });
  // Return the access token JSON
  return response.json();
}

// Main API route handler for GET requests
export async function GET() {
  try {
    // Get a fresh access token
    const { access_token } = await getAccessToken();

    // Fetch top tracks and top artists in parallel
    const [tracksRes, artistsRes] = await Promise.all([
      fetch(TOP_TRACKS_ENDPOINT, {
        headers: { Authorization: `Bearer ${access_token}` },
      }),
      fetch(TOP_ARTISTS_ENDPOINT, {
        headers: { Authorization: `Bearer ${access_token}` },
      }),
    ]);

    // Parse the response data
    const tracksData = await tracksRes.json();
    const artistsData = await artistsRes.json();

    // Return the top tracks and artists as JSON
    return NextResponse.json({
      topTracks: tracksData.items,
      topArtists: artistsData.items,
    });
  } catch (error) {
    // Log and return empty arrays on error
    console.error('Error fetching Spotify top data:', error);
    return NextResponse.json({ topTracks: [], topArtists: [] });
  }
} 