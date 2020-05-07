import { NowRequest, NowResponse } from '@now/node';

import { registerPlayer } from './_lib/database/games';
import { getGameForPlayer } from '../../lib/helpers/games';

export default async (
  req: NowRequest,
  res: NowResponse
): Promise<NowResponse> => {
  if (req.method === 'PATCH') {
    const { name, gameId } = req.body;
    const sessionId = req.cookies.sessionId;
    return res
      .status(200)
      .json(
        getGameForPlayer(
          await registerPlayer(sessionId, name, gameId),
          sessionId
        )
      );
  }
  return res.status(405).send(null);
};
