import { TGameDatabase, TGameForPlayer, TPlayer, GamePhase } from '../../types';

const getPlayerFromSessionId = (
  game: TGameDatabase,
  sessionId: string
): TPlayer => {
  const sessionInGame = game._sessions.find(({ id }) => id === sessionId);
  return sessionInGame
    ? game.players.find(({ id }) => id === sessionInGame.playerId)
    : null;
};

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

export {
  getGameForPlayer,
  getPlayerFromSessionId,
  isPlayerRegistered,
  getNextPlayer,
  doAllPlayersHaveAPhraseToGuess,
  haveAllPlayersGuessedTheirPhrase,
};
