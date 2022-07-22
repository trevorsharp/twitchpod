import type { NextApiRequest, NextApiResponse } from 'next';
import { getStream } from '../../../services/videoService';
import { Quality } from '../../../types';

const getVideoUrl = async (req: NextApiRequest, res: NextApiResponse) => {
  const qualityParam = req.query.quality;
  let quality = Quality.Maximum;

  if (typeof qualityParam === 'string' && !isNaN(parseInt(qualityParam)))
    quality = parseInt(qualityParam);

  getStream(req.query.videoId as string, quality)
    .then((streamUrl) => {
      res.setHeader('content-type', 'application/x-mpegURL');
      res.status(200).send(streamUrl);
    })
    .catch((e) => res.status(500).send(e ?? 'Unexpected Error'));
};

export default getVideoUrl;
