type TGameDatabase = {
  id: string;
  _sessions: Array<TSession>;
  players: Array<TPlayer>;
  owner: string;
};

type TSession = {
  id: string;
  playerId: string;
};

type TPlayer = {
  id: string;
  name: string;
  isOwner: string;
};

type TGamePublic = {
  id: string;
  me: TPlayer;
  otherPlayers: Array<TPlayer>;
};
