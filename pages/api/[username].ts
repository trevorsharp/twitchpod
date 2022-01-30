import type { NextApiRequest, NextApiResponse } from 'next';
import { getRssFeed } from '../../services/feedService';

const getRssFeedForUser = async (req: NextApiRequest, res: NextApiResponse<string>) => {
  const { body, errorMessage, statusCode } = await getRssFeed(
    req.query.username as string,
    req.headers.host
  );

  if (errorMessage || !body)
    return res.status(statusCode ?? 500).send(errorMessage ?? 'Unexpeded Error');

  res.status(200).json(body);
};

export default getRssFeedForUser;
