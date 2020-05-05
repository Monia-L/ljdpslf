export type TGameDatabase = {
  id: string;
  _sessions: Array<TSession>;
  players: Array<TPlayer>;
  owner: string;
  stage: GameStage;
};

export type TSession = {
  id: string;
  playerId: string;
};

export type TPlayer = {
  id: string;
  name: string;
  isOwner: string;
};

export type TGamePublic = {
  id: string;
  me: TPlayer;
  otherPlayers: Array<TPlayer>;
  stage: GameStage;
};

export enum GameStage {
  WAITING_FOR_PLAYERS = 'WAITING_FOR_PLAYERS',
  WRITING = 'WRITING',
  GUESSING = 'GUESSING',
  COMPLETED = 'COMPLETED',
}
