import type { NextApiRequest, NextApiResponse } from 'next';
import { getStream } from '../../../services/videoService';
import { Quality } from '../../../utilities/types';

const getVideoUrl = async (req: NextApiRequest, res: NextApiResponse) => {
  const qualityParam = req.query.quality;
  let quality = Quality.Maximum;

  if (typeof qualityParam === 'string' && !isNaN(parseInt(qualityParam)))
    quality = parseInt(qualityParam);

  const { body, errorMessage, statusCode } = await getStream(req.query.videoId as string, quality);

  if (errorMessage || !body)
    return res.status(statusCode ?? 500).send(errorMessage ?? 'Unexpected Error');

  res.setHeader('content-type', 'application/x-mpegURL');
  res.status(200).send(body);
};

export default getVideoUrl;
