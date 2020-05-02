const getPlayerNames = (game: TGame): Array<TPlayer> => {
  const players = game.players || [];
  const playerNames = Object.keys(players).map(
    (sessionId) => game.players[sessionId].name
  );
  return playerNames;
};

const getPlayerNameInGame = (game: TGame, sessionId: string): string => {
  if (game.players && sessionId in game.players) {
    return game.players[sessionId].name;
  }
  return '';
};

export { getPlayerNames, getPlayerNameInGame };
