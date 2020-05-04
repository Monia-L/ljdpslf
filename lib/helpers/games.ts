const getGamePublicFieldsOnly = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _sessions,
  ...gameWithoutSessions
}: TGame): TGame => gameWithoutSessions;

const getPlayer = (game: TGame, sessionId: string): TPlayer => {
  const sessionInGame = game._sessions.find(({ id }) => id === sessionId);
  if (sessionInGame) {
    return game.players.find(({ id }) => id === sessionInGame.playerId);
  }
  return null;
};

const getPlayerName = (game: TGame, sessionId: string): string => {
  const player = getPlayer(game, sessionId);
  return player ? player.name : '';
};

const getPlayerNames = (game: TGame): Array<string> =>
  game.players.map(({ name }) => name);

export { getGamePublicFieldsOnly, getPlayer, getPlayerName, getPlayerNames };
