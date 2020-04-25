import { callApi } from '.';

const setMyName = async (name: string, gameId: string): Promise<void> =>
  callApi('me', 'PATCH', { name, gameId });

export { setMyName };
