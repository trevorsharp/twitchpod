import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserData } from '../../../services/twitchService';

const getUserDataForUsername = async (req: NextApiRequest, res: NextApiResponse<string>) => {
  const { body, errorMessage, statusCode } = await getUserData(req.query.username as string);

  if (errorMessage || !body)
    return res.status(statusCode ?? 500).send(errorMessage ?? 'Unexpeded Error');

  res.status(200).json(JSON.stringify(body));
};

export default getUserDataForUsername;
