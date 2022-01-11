import express from 'express';
import rssService from './services/rssService';
import videoService from './services/videoService';
import config from './utilities/config';

const app = express();
const port = process.env.NODE_ENV === 'development' ? 3000 : 80;

app.use('/covers', express.static(`${config.workingDirectory}/`));

app.get('/video/:videoId', async (req, res) => {
  const result = await videoService.getStreamUrl(req.params.videoId);

  if (result.error || !result.url) {
    return res.status(500).send(`Error: ${result.error}`);
  }

  res.redirect(302, result.url);
});

app.get('/:id', async (req, res) => {
  try {
    const rss = await rssService.getRssFeed(req.params.id, req.query.title?.toString());

    if (rss === '') {
      res.status(404).send(`Could not find user with name ${req.params.id}`);
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
