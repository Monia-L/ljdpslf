import { sendData } from './utils';
import { TGameDatabase } from '../../../types';
import {
  getSessionIdFromPlayerId,
  getGameForPlayer,
  getGameSubscriptionChannelId,
} from '../../helpers/games';

const sendGameUpdateToPlayers = (game: TGameDatabase): Promise<void[]> =>
  Promise.all(
    game.players.map((player) => {
      const sessionId = getSessionIdFromPlayerId(game, player.id);
      const channelId = getGameSubscriptionChannelId(game.id, sessionId);
      return sendData(channelId, 'update', getGameForPlayer(game, sessionId));
    })
  );

export { sendGameUpdateToPlayers };
