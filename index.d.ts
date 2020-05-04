type TGame = {
  id: string;
  _sessions?: Array<TSession>;
  players: Array<TPlayer>;
};

type TSession = {
  id: string;
  playerId: string;
};

type TPlayer = {
  id: string;
  name: string;
};
