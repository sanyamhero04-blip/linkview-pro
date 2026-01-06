const { exec } = require('child_process');

export default function handler(req, res) {
  const { url } = req.body;

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Use npx so Vercel pulls yt-dlp on the fly
  const cmd = `npx yt-dlp --no-warnings --get-title --get-url --user-agent "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1" --referer "https://www.google.com/" "${url}"`;

  exec(cmd, (error, stdout) => {
    if (error) {
      return res.status(500).json({ success: false, message: "Host blocked connection" });
    }

    const lines = stdout.trim().split('\n');
    res.status(200).json({
      success: true,
      title: lines[0],
      directLink: lines[1]
    });
  });
}
