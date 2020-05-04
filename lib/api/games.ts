import { callApi } from '.';

const createGame = async (): Promise<TGamePublic> => {
  return (await callApi('games', 'POST')).content;
};

export enum GET_GAME_DETAILS_ERROR_MESSAGE {
  YOU_MUST_FIRST_SET_YOUR_NAME = 'YOU_MUST_FIRST_SET_YOUR_NAME',
}

const getGameDetails = async (id: string): Promise<TGamePublic> => {
  const response = await callApi(`games/${id}`, 'GET');
  if (
    response.status === 403 &&
    response.content.message ===
      GET_GAME_DETAILS_ERROR_MESSAGE.YOU_MUST_FIRST_SET_YOUR_NAME
  ) {
    throw new Error(response.content.message);
  } else {
    return response.content;
  }
};

export { createGame, getGameDetails };
