import express from 'express';
import rssService from './services/rssService';
import videoService from './services/videoService';

const app = express();
const port = process.env.NODE_ENV === 'development' ? 3000 : 80;

app.get('/video/:videoId', async (req, res) => {
  const result = await videoService.getStreamUrl(req.params.videoId);

  if (result.error || !result.url) {
    return res.status(500).send(`Error: ${result.error}`);
  }

  res.redirect(302, result.url);
});

app.get('/:id', async (req, res) => {
  try {
    const username = req.params.id?.trim()?.toLowerCase();

    if (!username) return res.status(400).send('Missing usename');

    const rss = await rssService.getRssFeed(username, req.get('host'));

    if (rss === '') {
      res.status(404).send(`Could not find user with name ${username}`);
      return;
    }

    res.setHeader('content-type', 'application/rss+xml');
    res.send(rss);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/', (_, res) => {
  try {
    res.send('Twitch Podcast Feeds Is Up and Running');
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('*', (_, res) => res.redirect('/'));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
