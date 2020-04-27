import { NowRequest, NowResponse } from '@now/node';

import { setPlayerNameInGame } from '../../api/database/games';

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  if (req.method === 'PATCH') {
    const { name, gameId } = req.body;
    const sessionId = 'abcdef';
    await setPlayerNameInGame(sessionId, name, gameId);
    res.statusCode = 200;
    return res.end();
  }
  res.statusCode = 405;
  return res.end();
};
