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

const getNextPlayer = (
  players: Array<TPlayer>,
  currentPlayerId: string
): TPlayer => {
  const currentPlayerIndex = players.findIndex(
    ({ id }) => id === currentPlayerId
  );
  const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
  return players[nextPlayerIndex];
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
        ? { isMe: true, phraseToGuess: undefined }
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

const doAllPlayersHaveAPhraseToGuess = (game: TGameDatabase): boolean => {
  return game.players.reduce(
    (doAllPlayersSoFarHaveAPhraseToGuess: boolean, player) =>
      Boolean(doAllPlayersSoFarHaveAPhraseToGuess && player.phraseToGuess),
    true
  );
};

export {
  getGameForPlayer,
  getPlayerFromSessionId,
  isPlayerRegistered,
  getNextPlayer,
  doAllPlayersHaveAPhraseToGuess,
};
