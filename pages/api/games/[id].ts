import { NowRequest, NowResponse } from '@now/node';

import {
  updateGamePhase,
  setPhraseToGuess,
  passTurnToGuess,
  setPhraseAsGuessedForCurrentPlayer,
} from '../../../lib/api/database/games';
import {
  isPlayerRegistered,
  getGameForPlayer,
  getGame,
} from '../../../lib/helpers/games';
import {
  GET_GAME_DETAILS_ERROR_MESSAGE,
  PATCH_GAME_ACTION,
} from '../../../lib/pages/api/games';
import { GamePhase } from '../../../types';

export default async (
  req: NowRequest,
  res: NowResponse
): Promise<NowResponse> => {
  const id = req.query.id as string;
  const { sessionId } = req.cookies;
  if (req.method === 'GET') {
    try {
      return res.status(200).json(await getGame(id, sessionId));
    } catch (error) {
      if (
        error.message ===
          GET_GAME_DETAILS_ERROR_MESSAGE.YOU_MUST_FIRST_SET_YOUR_NAME ||
        error.message ===
          GET_GAME_DETAILS_ERROR_MESSAGE.YOU_HAVE_MISSED_GAME_START
      ) {
        return res.status(403).json({
          message: error.message,
        });
      }
      return res.status(500);
    }
  }
  if (req.method === 'PATCH') {
    const action = req.query.action as string;
    if (action) {
      if (action === PATCH_GAME_ACTION.PASS_TURN_TO_GUESS) {
        res
          .status(200)
          .json(
            getGameForPlayer(await passTurnToGuess(sessionId, id), sessionId)
          );
      }
      if (action === PATCH_GAME_ACTION.SET_PHRASE_AS_GUESSED) {
        res
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
