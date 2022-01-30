import type { NextApiRequest, NextApiResponse } from 'next';
import { getStreamUrl } from '../../../services/videoService';

const getVideoUrl = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body, errorMessage, statusCode } = await getStreamUrl(req.query.videoId as string);

  if (errorMessage || !body)
    return res.status(statusCode ?? 500).send(errorMessage ?? 'Unexpected Error');

  res.redirect(302, body);
};

export default getVideoUrl;
