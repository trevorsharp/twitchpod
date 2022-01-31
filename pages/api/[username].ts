import type { NextApiRequest, NextApiResponse } from 'next';
import { getRssFeed } from '../../services/feedService';
import { Quality } from '../../utilities/types';

const getRssFeedForUser = async (req: NextApiRequest, res: NextApiResponse<string>) => {
  const qualityParam = req.query.quality;
  let quality = Quality.Maximum;

  if (typeof qualityParam === 'string' && !isNaN(parseInt(qualityParam)))
    quality = parseInt(qualityParam);

  const { body, errorMessage, statusCode } = await getRssFeed(
    req.query.username as string,
    req.headers.host ?? '',
    quality
  );

  if (errorMessage || !body)
    return res.status(statusCode ?? 500).send(errorMessage ?? 'Unexpeded Error');

  res.status(200).json(body);
};

export default getRssFeedForUser;
