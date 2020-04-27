import { callApi } from '.';

type Game = { id: string };

const createGame = async (): Promise<Gamepad> => callApi('games', 'POST');

export { createGame };
