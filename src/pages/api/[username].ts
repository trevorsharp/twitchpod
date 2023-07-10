import { getRssFeed } from '~/services/feedService';
import { Quality } from '~/types';
import type { NextApiRequest, NextApiResponse } from 'next';

const getRssFeedForUser = async (req: NextApiRequest, res: NextApiResponse<string>) => {
  const qualityParam = req.query.quality;
  let quality = Quality.Maximum;

  if (typeof qualityParam === 'string' && !isNaN(parseInt(qualityParam)))
    quality = parseInt(qualityParam);

  return await getRssFeed(req.query.username as string, req.headers.host ?? '', quality)
    .then((rssFeed) => {
      res.setHeader('Cache-Control', 's-maxage=600');
      return res.status(200).send(rssFeed);
    })
    .catch((errorMessage: string) => res.status(500).send(errorMessage ?? 'Unexpected Error'));
};

export default getRssFeedForUser;
