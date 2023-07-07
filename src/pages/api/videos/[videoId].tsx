import type { NextApiRequest, NextApiResponse } from 'next';
import { getStream } from '~/services/videoService';
import { Quality } from '~/types';

const getVideoUrl = async (req: NextApiRequest, res: NextApiResponse) => {
  const qualityParam = req.query.quality;
  let quality = Quality.Maximum;

  if (typeof qualityParam === 'string' && !isNaN(parseInt(qualityParam)))
    quality = parseInt(qualityParam);

  return await getStream(req.query.videoId as string, quality)
    .then((m3u8) => {
      res.setHeader('Cache-Control', 's-maxage=300');
      res.setHeader('content-type', 'application/x-mpegURL');
      return res.status(200).send(m3u8);
    })
    .catch((e) => res.status(500).send(e ?? 'Unexpected Error'));
};

export default getVideoUrl;
