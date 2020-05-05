import { v4 as uuidv4 } from 'uuid';

import { getCollection } from './utils';
import { getPlayer } from '../../../../lib/helpers/games';
import { GameStage, TGameDatabase } from '../../../../types';

const createGame = async (ownerSessionId: string): Promise<TGameDatabase> => {
  const gamesCollection = await getCollection('games');
  const playerId = uuidv4();
  const response = await gamesCollection.insertOne({
    id: uuidv4(),
    players: [{ id: playerId, isOwner: true }],
    _sessions: [{ id: ownerSessionId, playerId }],
    stage: GameStage.WAITING_FOR_PLAYERS,
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

const updateGameStage = async (
  id: string,
  stage: GameStage
): Promise<TGameDatabase> => {
  const gamesCollection = await getCollection('games');
  const response = await gamesCollection.findOneAndUpdate(
    { id },
    { $set: { stage } },
    { returnOriginal: false }
  );
  return response.value;
};

export { createGame, registerPlayer, getGame, updateGameStage };
