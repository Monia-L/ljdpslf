import { v4 as uuidv4 } from 'uuid';

import { getCollection } from './utils';
import {
  getPlayerFromSessionId,
  getPlayerToWritePhraseFor,
} from '../../../../lib/helpers/games';
import { GamePhase, TGameDatabase } from '../../../../types';

const createGame = async (ownerSessionId: string): Promise<TGameDatabase> => {
  const gamesCollection = await getCollection('games');
  const playerId = uuidv4();
  const response = await gamesCollection.insertOne({
    id: uuidv4(),
    players: [{ id: playerId, isOwner: true }],
    _sessions: [{ id: ownerSessionId, playerId }],
    phase: GamePhase.WAITING_FOR_PLAYERS,
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
): Promise<TGameDatabase> => {
  const gamesCollection = await getCollection('games');
  const game = await getGame(gameId);
  const existingPlayer = getPlayerFromSessionId(game, sessionId);
  if (existingPlayer) {
    const response = await gamesCollection.findOneAndUpdate(
      { id: gameId, 'players.id': existingPlayer.id },
      { $set: { 'players.$.name': name } },
      { returnOriginal: false }
    );
    return response.value;
  } else {
    const newPlayerId = uuidv4();
    const response = await gamesCollection.findOneAndUpdate(
      { id: gameId },
      {
        $push: {
          _sessions: { id: sessionId, playerId: newPlayerId },
          players: { id: newPlayerId, name },
        },
      },
      { returnOriginal: false }
    );
    return response.value;
  }
};

const updateGamePhase = async (
  id: string,
  phase: GamePhase
): Promise<TGameDatabase> => {
  const gamesCollection = await getCollection('games');
  const response = await gamesCollection.findOneAndUpdate(
    { id },
    { $set: { phase } },
    { returnOriginal: false }
  );
  return response.value;
};

const setPhraseToGuess = async (
  sessionId: string,
  gameId: string,
  phraseToGuess: string
): Promise<TGameDatabase> => {
  const gamesCollection = await getCollection('games');
  const game = await getGame(gameId);
  const playerWithPhraseToGuess = getPlayerToWritePhraseFor(
    game.players,
    getPlayerFromSessionId(game, sessionId).id
  );
  const response = await gamesCollection.findOneAndUpdate(
    { id: gameId, 'players.id': playerWithPhraseToGuess.id },
    { $set: { 'players.$.phraseToGuess': phraseToGuess } },
    { returnOriginal: false }
  );
  return response.value;
};

export {
  createGame,
  registerPlayer,
  getGame,
  updateGamePhase,
  setPhraseToGuess,
};
