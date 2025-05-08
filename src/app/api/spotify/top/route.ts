import { NextResponse } from 'next/server';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks?limit=5&time_range=short_term`;
const TOP_ARTISTS_ENDPOINT = `https://api.spotify.com/v1/me/top/artists?limit=5&time_range=short_term`;

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
  return response.json();
}

export async function GET() {
  try {
    const { access_token } = await getAccessToken();

    const [tracksRes, artistsRes] = await Promise.all([
      fetch(TOP_TRACKS_ENDPOINT, {
        headers: { Authorization: `Bearer ${access_token}` },
      }),
      fetch(TOP_ARTISTS_ENDPOINT, {
        headers: { Authorization: `Bearer ${access_token}` },
      }),
    ]);

    const tracksData = await tracksRes.json();
    const artistsData = await artistsRes.json();

    return NextResponse.json({
      topTracks: tracksData.items,
      topArtists: artistsData.items,
    });
  } catch (error) {
    console.error('Error fetching Spotify top data:', error);
    return NextResponse.json({ topTracks: [], topArtists: [] });
  }
} 