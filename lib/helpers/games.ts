import { TGameDatabase, TGameForPlayer, TPlayer, GamePhase } from '../../types';

const getPlayer = (game: TGameDatabase, sessionId: string): TPlayer => {
  const sessionInGame = game._sessions.find(({ id }) => id === sessionId);
  if (sessionInGame) {
    const player = game.players.find(({ id }) => id === sessionInGame.playerId);
    return {
      id: player.id,
      name: player.name,
      isOwner: player.isOwner,
    };
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
  const currentPlayer = getPlayer(game, sessionId);
  return {
    id: game.id,
    me: currentPlayer,
    otherPlayers: game.players.filter(({ id }) => id !== currentPlayer.id),
    phase: game.phase,
    ...(game.phase === GamePhase.WRITING_PHRASE_TO_GUESS && {
      playerToWritePhraseFor: getPlayerToWritePhraseFor(
        game.players,
        currentPlayer.id
      ),
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

export {
  getGameForPlayer,
  getPlayer,
  isPlayerRegistered,
  getPlayerToWritePhraseFor,
};
