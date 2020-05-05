import { callApi } from '.';
import { TGamePublic, GameStage } from '../../types';

const createGame = async (): Promise<TGamePublic> => {
  return (await callApi('games', 'POST')).content;
};

export enum GET_GAME_DETAILS_ERROR_MESSAGE {
  YOU_MUST_FIRST_SET_YOUR_NAME = 'You must first set your name',
  YOU_HAVE_MISSED_GAME_START = 'Trop tard, la partie a commencé sans vous.',
}

const getGameDetails = async (id: string): Promise<TGamePublic> => {
  const response = await callApi(`games/${id}`, 'GET');
  if (response.status === 403) {
    throw new Error(response.content.message);
  } else {
    return response.content;
  }
};

const enterWritingPhase = async (id: string): Promise<TGamePublic> => {
  return (await callApi(`games/${id}`, 'PATCH', { stage: GameStage.WRITING }))
    .content;
};

export { createGame, getGameDetails, enterWritingPhase };
