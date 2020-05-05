import { TGameDatabase, TGamePublic, TPlayer } from '../../types';

const getPlayer = (game: TGameDatabase, sessionId: string): TPlayer => {
  const sessionInGame = game._sessions.find(({ id }) => id === sessionId);
  if (sessionInGame) {
    return game.players.find(({ id }) => id === sessionInGame.playerId);
  }
  return null;
};

const getGamePublicDetails = (
  game: TGameDatabase,
  sessionId: string
): TGamePublic => {
  const me = getPlayer(game, sessionId);
  return {
    id: game.id,
    me,
    otherPlayers: game.players.filter(({ id }) => id !== me.id),
    stage: game.stage,
  };
};

const doesPlayerHaveAName = (
  game: TGameDatabase,
  sessionId: string
): boolean => {
  const player = getPlayer(game, sessionId);
  return player ? Boolean(player.name) : false;
};

export { getGamePublicDetails, getPlayer, doesPlayerHaveAName };
