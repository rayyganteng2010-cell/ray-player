const ytdl = require('ytdl-core');
export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "ID required" });
  try {
    const info = await ytdl.getInfo(id);
    const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio', filter: 'audioonly' });
    res.setHeader('Cache-Control', 's-maxage=3600');
    res.status(200).json({ url: format.url });
  } catch (err) { res.status(500).json({ error: "YouTube Blocked or Invalid" }); }
}
