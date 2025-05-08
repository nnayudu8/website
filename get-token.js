const CLIENT_ID = '189ab8c6e46a4a38a7c2c05030898ab1';
const CLIENT_SECRET = '444807fb4b454d6989a1ddc629c516e7';
const CODE = 'AQAPiNe0rArnUQy6GZyKIgOZWScFKYQs2mrglVJ9VglKIWkZQs2VwjHrte2OLrRfZmfHAnO9athJ1vjgBpxGMZFgc8PkygBOF6MzcCwBFLLUBq6pSbQvT29PATIO-lO9P-bMW1ybQIvdrTpoFYZ6vyvQDmJMbXkzM8uQ9SzLjuAe0kS8ZA';

const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

fetch('https://accounts.spotify.com/api/token', {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${basic}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    code: CODE,
    redirect_uri: 'https://nidhil.dev'
  })
})
.then(response => response.json())
.then(data => console.log(data));