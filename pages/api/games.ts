import { NowRequest, NowResponse } from '@now/node';
import { createGame } from './_database/games';

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  if (req.method === 'POST') {
    const game = await createGame();
    res.statusCode = 201;
    return res.end(JSON.stringify(game));
  }
  res.statusCode = 405;
  return res.end();
};
