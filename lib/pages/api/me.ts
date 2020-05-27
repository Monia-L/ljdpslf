import { callApi } from '.';
import { TGameForPlayer } from '../../../types';

const registerInGame = async (
  gameId: string,
  name: string
): Promise<TGameForPlayer> => {
  return (await callApi('me', 'PATCH', { gameId, name })).content;
};

export { registerInGame };
