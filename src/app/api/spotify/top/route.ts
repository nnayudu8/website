import { NextResponse } from 'next/server';

// Spotify API credentials from environment variables
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

// Create the Basic Auth header for Spotify API using client ID and secret
const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

// Spotify API endpoints for token and top tracks
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks?limit=5&time_range=short_term`;

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

    // Fetch top tracks
    const tracksRes = await fetch(TOP_TRACKS_ENDPOINT, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    // Parse the response data
    const tracksData = await tracksRes.json();

    // Return the top tracks as JSON
    return NextResponse.json({
      topTracks: tracksData.items,
    });
  } catch (error) {
    // Log and return empty array on error
    console.error('Error fetching Spotify top data:', error);
    return NextResponse.json({ topTracks: [] });
  }
} 