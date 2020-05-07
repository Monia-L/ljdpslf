import { callApi } from '.';
import { TGameForPlayer, GamePhase } from '../../types';

const createGame = async (): Promise<TGameForPlayer> => {
  return (await callApi('games', 'POST')).content;
};

export enum GET_GAME_DETAILS_ERROR_MESSAGE {
  YOU_MUST_FIRST_SET_YOUR_NAME = 'You must first set your name',
  YOU_HAVE_MISSED_GAME_START = 'Trop tard, la partie a commencé sans vous.',
}

const getGameDetails = async (id: string): Promise<TGameForPlayer> => {
  const response = await callApi(`games/${id}`, 'GET');
  if (response.status === 403) {
    throw new Error(response.content.message);
  } else {
    return response.content;
  }
};

const enterWritingPhase = async (id: string): Promise<TGameForPlayer> => {
  return (
    await callApi(`games/${id}`, 'PATCH', {
      phase: GamePhase.WRITING_PHRASE_TO_GUESS,
    })
  ).content;
};

const setPhraseToGuess = async (
  id: string,
  phraseToGuess: string
): Promise<void> => {
  return (await callApi(`games/${id}`, 'PATCH', { phraseToGuess })).content;
};

export { createGame, getGameDetails, enterWritingPhase, setPhraseToGuess };
