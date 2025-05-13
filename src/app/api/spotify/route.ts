import { NextResponse } from 'next/server';

// Spotify API endpoints
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing';

// Create the Basic Auth header for Spotify API using client ID and secret
const basic = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');

// Function to get a fresh access token using the refresh token
async function getAccessToken() {
  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      // Request a new access token from Spotify
      const response = await fetch(TOKEN_ENDPOINT, {
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

      // Throw error if response is not OK
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Return the access token JSON
      return response.json();
    } catch (error) {
      retryCount++;
      // If max retries reached, log and throw error
      if (retryCount === maxRetries) {
        console.error('Failed to get access token after retries:', error);
        throw error;
      }
      // Exponential backoff before retrying
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
    }
  }
}

// Helper function to fetch data with retry logic
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3) {
  let retryCount = 0;
  
  while (retryCount < maxRetries) {
    try {
      // Attempt to fetch the resource
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response;
    } catch (error) {
      retryCount++;
      // If max retries reached, throw error
      if (retryCount === maxRetries) {
        throw error;
      }
      // Exponential backoff before retrying
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
    }
  }
}

// Main API route handler for GET requests
export async function GET() {
  try {
    // Get a fresh access token
    const { access_token } = await getAccessToken();

    // Fetch the currently playing song from Spotify
    const response = await fetchWithRetry(NOW_PLAYING_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: 'no-store',
    });

    // If no response, or no song is playing, or error status, return isPlaying: false
    if (!response || response.status === 204 || response.status > 400) {
      return NextResponse.json({ isPlaying: false });
    }

    // Parse the song data from the response
    const song = await response.json();
    const isPlaying = song.is_playing;
    const title = song.item.name;
    const artist = song.item.artists.map((_artist: { name: string }) => _artist.name).join(', ');
    const album = song.item.album.name;
    const albumArtUrl = song.item.album.images[0].url;
    const songUrl = song.item.external_urls.spotify;

    // Return the song data as JSON
    return NextResponse.json({
      album,
      albumArtUrl,
      artist,
      isPlaying,
      songUrl,
      title,
    });
  } catch (error) {
    // Log and return isPlaying: false on error
    console.error('Error fetching Spotify data:', error);
    return NextResponse.json({ isPlaying: false });
  }
} 