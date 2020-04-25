import { IncomingMessage, ServerResponse } from 'http';
import { setPlayerNameInGame } from '../../api/database/players';

interface Req extends IncomingMessage {
  body: {
    name: string;
    gameId: string;
  };
}

export default async (req: Req, res: ServerResponse): Promise<void> => {
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
