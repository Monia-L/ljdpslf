import { IncomingMessage, ServerResponse } from 'http';
import { createGame } from '../../api/database/games';

export default async (
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> => {
  if (req.method === 'POST') {
    const game = await createGame();
    res.statusCode = 201;
    return res.end(JSON.stringify(game));
  }
  res.statusCode = 405;
  return res.end();
};
