import { NowRequest, NowResponse } from '@now/node';

import { getGame, updateGameStage } from '../_lib/database/games';
import {
  doesPlayerHaveAName,
  getGamePublicDetails,
} from '../../../lib/helpers/games';
import { GET_GAME_DETAILS_ERROR_MESSAGE } from '../../../lib/api/games';
import { GameStage } from '../../../types';

export default async (
  req: NowRequest,
  res: NowResponse
): Promise<NowResponse> => {
  if (req.method === 'GET') {
    const {
      query: { id },
    } = req;
    const { sessionId } = req.cookies;
    const game = await getGame(id as string);
    if (!doesPlayerHaveAName(game, sessionId)) {
      if (game.stage === GameStage.WAITING_FOR_PLAYERS) {
        return res.status(403).json({
          message: GET_GAME_DETAILS_ERROR_MESSAGE.YOU_MUST_FIRST_SET_YOUR_NAME,
        });
      }
      return res.status(403).json({
        message: GET_GAME_DETAILS_ERROR_MESSAGE.YOU_HAVE_MISSED_GAME_START,
      });
    }
    return res.status(200).json(getGamePublicDetails(game, sessionId));
  }
  if (req.method === 'PATCH') {
    const {
      query: { id },
    } = req;
    const { stage } = req.body;
    if (Object.values(GameStage).includes(stage)) {
      const game = await updateGameStage(id as string, stage);
      return res.status(200).json(game);
    }
    return res.status(400);
  }
  return res.status(405);
};
