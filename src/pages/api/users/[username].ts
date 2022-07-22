import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserData } from '../../../services/twitchService';
import type { User } from '../../../types';

const getUserDataForUsername = async (req: NextApiRequest, res: NextApiResponse<User>) =>
  getUserData(req.query.username as string)
    .then((userData) => res.json(userData))
    .catch((e) => res.status(500).send(e ?? 'Unexpected Error'));

export default getUserDataForUsername;
