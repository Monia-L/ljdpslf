import { callApi } from '.';

const registerInGame = async (name: string, gameId: string): Promise<void> =>
  callApi('me', 'PATCH', { name, gameId });

export { registerInGame };
