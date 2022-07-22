import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserData, User } from '../../../services/twitchService';

const getUserDataForUsername = async (req: NextApiRequest, res: NextApiResponse<User>) =>
  getUserData(req.query.username as string)
    .then((userData) => res.json(userData))
    .catch((e) => res.status(500).send(e ?? 'Unexpected Error'));

export default getUserDataForUsername;
