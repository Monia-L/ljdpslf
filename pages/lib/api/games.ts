import { CreateGameAPIResponse, callApi } from '.';

const createGame = async (): Promise<CreateGameAPIResponse> =>
  callApi('games', 'POST');

export { createGame };
