import { callApi } from '.';

type Game = { id: string };

const createGame = async (): Promise<Game> => callApi('games', 'POST');

export { createGame };
