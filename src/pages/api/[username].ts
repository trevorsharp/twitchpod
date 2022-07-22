import type { NextApiRequest, NextApiResponse } from 'next';
import { getRssFeed } from '../../services/feedService';
import { Quality } from '../../services/feedService';

const getRssFeedForUser = async (req: NextApiRequest, res: NextApiResponse<string>) => {
  const qualityParam = req.query.quality;
  let quality = Quality.Maximum;

  if (typeof qualityParam === 'string' && !isNaN(parseInt(qualityParam)))
    quality = parseInt(qualityParam);

  getRssFeed(req.query.username as string, req.headers.host ?? '', quality)
    .then((rssFeed) => res.status(200).send(rssFeed))
    .catch((e) => res.status(500).send(e ?? 'Unexpected Error'));
};

export default getRssFeedForUser;
