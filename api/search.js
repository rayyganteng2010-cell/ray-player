const yts = require('yt-search');
export default async function handler(req, res) {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Query required" });
  try {
    const r = await yts(q);
    const results = r.videos.slice(0, 15).map(v => ({
      id: v.videoId,
      title: v.title,
      thumb: v.thumbnail,
      author: v.author.name,
      duration: v.timestamp
    }));
    res.status(200).json(results);
  } catch (err) { res.status(500).json({ error: err.message }); }
}
