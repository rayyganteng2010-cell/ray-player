const yts = require('yt-search');

/**
 * GET /api/search?q=...
 * Returns: [{ id, title, thumb, author, duration }]
 */
module.exports = async function handler(req, res) {
  const q = (req.query && req.query.q ? String(req.query.q) : '').trim();
  if (!q) return res.status(400).json({ error: 'Query required' });

  try {
    const r = await yts(q);
    const results = (r.videos || []).slice(0, 18).map((v) => ({
      id: v.videoId,
      title: v.title,
      thumb: v.thumbnail,
      author: (v.author && v.author.name) ? v.author.name : 'YouTube',
      duration: v.timestamp || '',
    }));

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(results);
  } catch (err) {
    console.error('search error:', err);
    return res.status(500).json({ error: 'Search gagal' });
  }
};
