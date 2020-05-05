import { TGameDatabase, TGameForPlayer, TPlayer, GamePhase } from '../../types';

const getPlayer = (game: TGameDatabase, sessionId: string): TPlayer => {
  const sessionInGame = game._sessions.find(({ id }) => id === sessionId);
  if (sessionInGame) {
    return game.players.find(({ id }) => id === sessionInGame.playerId);
  }
  return null;
};

const getPlayerToWritePhraseFor = (
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
  const me = getPlayer(game, sessionId);
  return {
    id: game.id,
    me,
    otherPlayers: game.players.filter(({ id }) => id !== me.id),
    phase: game.phase,
    ...(game.phase === GamePhase.WRITING_PHRASE_TO_GUESS && {
      playerToWritePhraseFor: getPlayerToWritePhraseFor(game.players, me.id),
    }),
  };
};

const isPlayerRegistered = (
  game: TGameDatabase,
  sessionId: string
): boolean => {
  const player = getPlayer(game, sessionId);
  return player ? Boolean(player.name) : false;
};

export { getGameForPlayer, getPlayer, isPlayerRegistered };
