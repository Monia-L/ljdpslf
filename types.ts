export type TGameDatabase = {
  id: string;
  _sessions: Array<TSession>;
  players: Array<TPlayer>;
  owner: string;
  phase: GamePhase;
};

export type TSession = {
  id: string;
  playerId: string;
};

export type TPlayer = {
  id: string;
  isOwner: boolean;
  name: string;
  phraseToGuess?: string;
};

export type TGameForPlayer = {
  id: string;
  players: Array<TPlayer & { isMe: boolean }>;
  phase: GamePhase;
  playerToWritePhraseFor?: TPlayer;
};

export enum GamePhase {
  WAITING_FOR_PLAYERS = 'WAITING_FOR_PLAYERS',
  WRITING_PHRASE_TO_GUESS = 'WRITING_PHRASE_TO_GUESS',
  GUESSING = 'GUESSING',
  COMPLETED = 'COMPLETED',
}
