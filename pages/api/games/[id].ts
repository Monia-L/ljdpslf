import { NowRequest, NowResponse } from '@now/node';

import {
  getGame,
  updateGamePhase,
  setPhraseToGuess,
} from '../_lib/database/games';
import {
  isPlayerRegistered,
  getGameForPlayer,
} from '../../../lib/helpers/games';
import { GET_GAME_DETAILS_ERROR_MESSAGE } from '../../../lib/api/games';
import { GamePhase } from '../../../types';

export default async (
  req: NowRequest,
  res: NowResponse
): Promise<NowResponse> => {
  const id = req.query.id as string;
  const { sessionId } = req.cookies;
  if (req.method === 'GET') {
    const game = await getGame(id);
    if (!isPlayerRegistered(game, sessionId)) {
      if (game.phase === GamePhase.WAITING_FOR_PLAYERS) {
        return res.status(403).json({
          message: GET_GAME_DETAILS_ERROR_MESSAGE.YOU_MUST_FIRST_SET_YOUR_NAME,
        });
      }
      return res.status(403).json({
        message: GET_GAME_DETAILS_ERROR_MESSAGE.YOU_HAVE_MISSED_GAME_START,
      });
    }
    return res.status(200).json(getGameForPlayer(game, sessionId));
  }
  if (req.method === 'PATCH') {
    const { phase, phraseToGuess } = req.body;
    if (phase) {
      const game = await updateGamePhase(id, phase);
      return res.status(200).json(getGameForPlayer(game, sessionId));
    }
    if (phraseToGuess) {
      const game = await setPhraseToGuess(sessionId, id, phraseToGuess);
      return res.status(200).json(getGameForPlayer(game, sessionId));
    }
    return res.status(400).send(null);
  }
  return res.status(405).send(null);
};
