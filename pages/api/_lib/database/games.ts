import { v4 as uuidv4 } from 'uuid';

import { getCollection } from './utils';
import {
  getPlayerFromSessionId,
  getNextPlayer,
  doAllPlayersHaveAPhraseToGuess,
  haveAllPlayersGuessedTheirPhrase,
} from '../../../../lib/helpers/games';
import { GamePhase, TGameDatabase } from '../../../../types';
import { sendGameUpdateToPlayers } from '../client-subscriptions/games';

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
    const updatedGame = (
      await gamesCollection.findOneAndUpdate(
        { id: gameId, 'players.id': existingPlayer.id },
        { $set: { 'players.$.name': name } },
        { returnOriginal: false }
      )
    ).value;
    sendGameUpdateToPlayers(updatedGame);
    return updatedGame;
  } else {
    const newPlayerId = uuidv4();
    const updatedGame = (
      await gamesCollection.findOneAndUpdate(
        { id: gameId },
        {
          $push: {
            _sessions: { id: sessionId, playerId: newPlayerId },
            players: { id: newPlayerId, name },
          },
        },
        { returnOriginal: false }
      )
    ).value;
    sendGameUpdateToPlayers(updatedGame);
    return updatedGame;
  }
};

const setTurnToGuessToFalseForAllPlayers = async (
  gameId: string
): Promise<TGameDatabase> => {
  const gamesCollection = await getCollection('games');
  return (
    await gamesCollection.findOneAndUpdate(
      { id: gameId },
      {
        $set: {
          'players.$[].isTheirTurnToGuess': false,
        },
      },
      { returnOriginal: false }
    )
  ).value;
};

const setTurnToGuessToNextPlayer = async (
  game: TGameDatabase
): Promise<TGameDatabase> => {
  const players = game.players;
  const playerDoneGuessing = players.find(
    ({ isTheirTurnToGuess }) => isTheirTurnToGuess
  );
  const nextPlayerId = playerDoneGuessing
    ? getNextPlayer(players, playerDoneGuessing.id).id
    : players[0].id;
  const gamesCollection = await getCollection('games');
  await setTurnToGuessToFalseForAllPlayers(game.id);
  const updatedGame = (
    await gamesCollection.findOneAndUpdate(
      { id: game.id, 'players.id': nextPlayerId },
      {
        $set: {
          'players.$.isTheirTurnToGuess': true,
        },
      },
      { returnOriginal: false }
    )
  ).value;
  sendGameUpdateToPlayers(updatedGame);
  return updatedGame;
};

const updateGamePhase = async (
  id: string,
  phase: GamePhase
): Promise<TGameDatabase> => {
  const gamesCollection = await getCollection('games');
  const updatedGame: TGameDatabase = (
    await gamesCollection.findOneAndUpdate(
      { id },
      { $set: { phase } },
      { returnOriginal: false }
    )
  ).value;
  sendGameUpdateToPlayers(updatedGame);
  return updatedGame.phase === GamePhase.GUESSING
    ? setTurnToGuessToNextPlayer(updatedGame)
    : updatedGame;
};

const setPhraseToGuess = async (
  sessionId: string,
  gameId: string,
  phraseToGuess: string
): Promise<TGameDatabase> => {
  const gamesCollection = await getCollection('games');
  const game = await getGame(gameId);
  const playerWithPhraseToGuess = getNextPlayer(
    game.players,
    getPlayerFromSessionId(game, sessionId).id
  );
  const updatedGame: TGameDatabase = (
    await gamesCollection.findOneAndUpdate(
      { id: gameId, 'players.id': playerWithPhraseToGuess.id },
      { $set: { 'players.$.phraseToGuess': phraseToGuess } },
      { returnOriginal: false }
    )
  ).value;
  sendGameUpdateToPlayers(updatedGame);
  return doAllPlayersHaveAPhraseToGuess(updatedGame.players)
    ? updateGamePhase(updatedGame.id, GamePhase.GUESSING)
    : updatedGame;
};

const passTurnToGuess = async (
  sessionId: string,
  gameId: string
): Promise<TGameDatabase> => {
  const game = await getGame(gameId);
  const currentPlayer = getPlayerFromSessionId(game, sessionId);
  const playerWithTurnToGuess = game.players.find(
    (player) => player.isTheirTurnToGuess
  );
  if (currentPlayer === playerWithTurnToGuess) {
    const updatedGame = await setTurnToGuessToNextPlayer(game);
    sendGameUpdateToPlayers(updatedGame);
    return haveAllPlayersGuessedTheirPhrase(updatedGame.players)
      ? updateGamePhase(updatedGame.id, GamePhase.COMPLETED)
      : updatedGame;
  }
};

const setPhraseAsGuessedForPlayer = async (
  gameId: string,
  playerId: string
): Promise<TGameDatabase> => {
  const gamesCollection = await getCollection('games');
  const updatedGame = (
    await gamesCollection.findOneAndUpdate(
      { id: gameId, 'players.id': playerId },
      { $set: { 'players.$.isPhraseGuessed': true } },
      { returnOriginal: false }
    )
  ).value;
  sendGameUpdateToPlayers(updatedGame);
  return updatedGame;
};

const setPhraseAsGuessedForCurrentPlayer = async (
  sessionId: string,
  gameId: string
): Promise<TGameDatabase> => {
  const game = await getGame(gameId);
  const currentPlayer = getPlayerFromSessionId(game, sessionId);
  const playerWithTurnToGuess = game.players.find(
    (player) => player.isTheirTurnToGuess
  );
  if (currentPlayer === playerWithTurnToGuess) {
    await setPhraseAsGuessedForPlayer(gameId, currentPlayer.id);
    return setTurnToGuessToNextPlayer(game);
  }
};

export {
  createGame,
  registerPlayer,
  getGame,
  updateGamePhase,
  setPhraseToGuess,
  passTurnToGuess,
  setPhraseAsGuessedForCurrentPlayer,
};
