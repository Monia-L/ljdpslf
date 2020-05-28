import { NowRequest, NowResponse } from '@now/node';

import {
  updateGamePhase,
  setPhraseToGuess,
  passTurnToGuess,
  setPhraseAsGuessedForCurrentPlayer,
} from '../../../lib/api/database/games';
import { getGameForPlayer, getGame } from '../../../lib/helpers/games';
import { PATCH_GAME_ACTION } from '../../../lib/pages/api/games';
import { sendResponse } from '../../../lib/api/http/utils';

export default async (
  req: NowRequest,
  res: NowResponse
): Promise<NowResponse> => {
  const id = req.query.id as string;
  const { sessionId } = req.cookies;
  if (req.method === 'GET') {
    return sendResponse(res, () => getGame(id, sessionId));
  }
  if (req.method === 'PATCH') {
    const action = req.query.action as string;
    if (action) {
      if (action === PATCH_GAME_ACTION.PASS_TURN_TO_GUESS) {
        return sendResponse(res, async () =>
          getGameForPlayer(await passTurnToGuess(sessionId, id), sessionId)
        );
      }
      if (action === PATCH_GAME_ACTION.SET_PHRASE_AS_GUESSED) {
        return res
          .status(200)
          .json(
            getGameForPlayer(
              await setPhraseAsGuessedForCurrentPlayer(sessionId, id),
              sessionId
            )
          );
      }
    }
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
