import { v4 as uuidv4 } from 'uuid';

import { getCollection } from './utils';
import { getPlayer } from '../../../../lib/helpers/games';

const createGame = async (ownerSessionId: string): Promise<TGameDatabase> => {
  const gamesCollection = await getCollection('games');
  const playerId = uuidv4();
  const response = await gamesCollection.insertOne({
    id: uuidv4(),
    players: [{ id: playerId, isOwner: true }],
    _sessions: [{ id: ownerSessionId, playerId }],
  });
  return response.ops[0];
};

const getGame = async (id: string): Promise<TGameDatabase> => {
  const gamesCollection = await getCollection('games');
  return gamesCollection.findOne({ id });
};

const registerPlayer = async (
  sessionId: string,
  name: string,
  gameId: string
): Promise<void> => {
  const gamesCollection = await getCollection('games');
  const game = await getGame(gameId);
  const existingPlayer = getPlayer(game, sessionId);
  if (existingPlayer) {
    gamesCollection.updateOne(
      { id: gameId, 'players.id': existingPlayer.id },
      { $set: { 'players.$.name': name } }
    );
  } else {
    const newPlayerId = uuidv4();
    gamesCollection.updateOne(
      { id: gameId },
      {
        $push: {
          _sessions: { id: sessionId, playerId: newPlayerId },
          players: { id: newPlayerId, name },
        },
      }
    );
  }
};

export { createGame, registerPlayer, getGame };
