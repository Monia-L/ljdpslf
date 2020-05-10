import { sendData } from './utils';
import { TGameDatabase } from '../../../../types';
import {
  getSessionIdFromPlayerId,
  getGameForPlayer,
  getGameSubscriptionChannelId,
} from '../../../../lib/helpers/games';

const sendGameUpdateToPlayers = (game: TGameDatabase): void => {
  game.players.forEach((player) => {
    const sessionId = getSessionIdFromPlayerId(game, player.id);
    const channelId = getGameSubscriptionChannelId(game.id, sessionId);
    sendData(channelId, 'update', getGameForPlayer(game, sessionId));
  });
};

export { sendGameUpdateToPlayers };
