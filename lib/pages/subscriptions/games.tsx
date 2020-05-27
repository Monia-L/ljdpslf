import Pusher from 'pusher-js';

import { getGameSubscriptionChannelId } from '../../helpers/games';
import { getSessionIdFromCookies } from '../utils/browser';

const subscribeToGameUpdates = (
  gameId: string,
  callback: (object) => void
): void => {
  const client = new Pusher(process.env.pusherAppKey, {
    cluster: process.env.pusherCluster,
  });
  const sessionId = getSessionIdFromCookies();
  const channelId = getGameSubscriptionChannelId(gameId, sessionId);
  const channel = client.subscribe(channelId);
  channel.bind('update', (game) => {
    callback(game);
  });
};

export { subscribeToGameUpdates };
