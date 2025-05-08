const CLIENT_ID = '189ab8c6e46a4a38a7c2c05030898ab1';
const CLIENT_SECRET = '444807fb4b454d6989a1ddc629c516e7';
const CODE = 'AQBgDbX-3pVihk3YWHxyAGIzp2QdGUyAyXaosenU0BsA8mW2GoJnHFmmWGh34UGKb1Q4TggRI-BoluL8hJ6lNjjYUHquLBQGlwtK4d8fgptHwK9nIJ8I6sgLEDPbh2QhG0kCVGXfTtgxHJw7DkbLoodU-JqJ-Zl7XLSeYBMUhau0zrFHY0tXn-YpjLL1yEuEp7oZTsDZpY-SNR0XFDbuytojvzfDUtwAXQj_nW8';

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