import {
  TGameDatabase,
  TGameForPlayer,
  TPlayer,
  GamePhase,
  TPlayerForPlayer,
} from '../../types';
import { GET_GAME_DETAILS_ERROR_MESSAGE } from '../../lib/pages/api/games';
import { getGame as getGameFromDatabase } from '../api/database/games';

const getPlayerFromSessionId = (
  game: TGameDatabase,
  sessionId: string
): TPlayer => {
  const sessionInGame = game._sessions.find(({ id }) => id === sessionId);
  return sessionInGame
    ? game.players.find(({ id }) => id === sessionInGame.playerId)
    : null;
};

const getSessionIdFromPlayerId = (
  game: TGameDatabase,
  playerId: string
): string => game._sessions.find((session) => session.playerId === playerId).id;

const getIndexOfFirstPlayerWithPhraseNotGuessed = (
  players: Array<TPlayer>,
  index: number
): number => {
  if (!players[index].isPhraseGuessed) {
    return index;
  }
  return getIndexOfFirstPlayerWithPhraseNotGuessed(
    players,
    (index + 1) % players.length
  );
};

const getNextPlayer = (
  players: Array<TPlayer>,
  currentPlayerId: string
): TPlayer => {
  const currentPlayerIndex = players.findIndex(
    ({ id }) => id === currentPlayerId
  );
  const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
  const indexOfFirstPlayerWithPhraseNotGuessed = getIndexOfFirstPlayerWithPhraseNotGuessed(
    players,
    nextPlayerIndex
  );
  return players[indexOfFirstPlayerWithPhraseNotGuessed];
};

const getGameForPlayer = (
  game: TGameDatabase,
  sessionId: string
): TGameForPlayer => {
  const currentPlayer = getPlayerFromSessionId(game, sessionId);
  return {
    id: game.id,
    players: game.players.map((player) => ({
      ...player,
      ...(player.id === currentPlayer.id
        ? {
            isMe: true,
            phraseToGuess: player.isPhraseGuessed
              ? player.phraseToGuess
              : undefined,
          }
        : { isMe: false }),
    })),
    phase: game.phase,
    ...(game.phase === GamePhase.WRITING_PHRASE_TO_GUESS && {
      playerToWritePhraseFor: getNextPlayer(game.players, currentPlayer.id),
    }),
  };
};

const isPlayerRegistered = (
  game: TGameDatabase,
  sessionId: string
): boolean => {
  const player = getPlayerFromSessionId(game, sessionId);
  return Boolean(player && player.name);
};

const doAllPlayersHaveATruthyValueForKey = (
  players: Array<TPlayer>,
  key: 'phraseToGuess' | 'isPhraseGuessed'
): boolean =>
  players.reduce(
    (allTrueSoFar: boolean, player) => Boolean(allTrueSoFar && player[key]),
    true
  );

const doAllPlayersHaveAPhraseToGuess = (players: Array<TPlayer>): boolean =>
  doAllPlayersHaveATruthyValueForKey(players, 'phraseToGuess');

const haveAllPlayersGuessedTheirPhrase = (players: Array<TPlayer>): boolean =>
  doAllPlayersHaveATruthyValueForKey(players, 'isPhraseGuessed');

const areThereAtLeastTwoPlayersWhoHaveNotGuessedTheirPhrase = (
  players: Array<TPlayerForPlayer>
): boolean => players.filter((player) => !player.isPhraseGuessed).length >= 2;

const getGameSubscriptionChannelId = (
  gameId: string,
  sessionId: string
): string => `gameId=${gameId},sessionId=${sessionId}`;

const getGame = async (gameId, sessionId): Promise<TGameForPlayer> => {
  const game = await getGameFromDatabase(gameId);
  if (!isPlayerRegistered(game, sessionId)) {
    if (game.phase === GamePhase.WAITING_FOR_PLAYERS) {
      throw Error(GET_GAME_DETAILS_ERROR_MESSAGE.YOU_MUST_FIRST_SET_YOUR_NAME);
    }
    throw Error(GET_GAME_DETAILS_ERROR_MESSAGE.YOU_HAVE_MISSED_GAME_START);
  }
  return getGameForPlayer(game, sessionId);
};

export {
  getGameForPlayer,
  getPlayerFromSessionId,
  getSessionIdFromPlayerId,
  isPlayerRegistered,
  getNextPlayer,
  doAllPlayersHaveAPhraseToGuess,
  haveAllPlayersGuessedTheirPhrase,
  areThereAtLeastTwoPlayersWhoHaveNotGuessedTheirPhrase,
  getGameSubscriptionChannelId,
  getGame,
};
