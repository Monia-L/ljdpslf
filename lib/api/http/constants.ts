import { GET_GAME_DETAILS_ERROR_MESSAGE } from '../../pages/api/games';

export const ERRORS_TO_CATCH = [
  {
    message: GET_GAME_DETAILS_ERROR_MESSAGE.YOU_MUST_FIRST_SET_YOUR_NAME,
    status: 403,
  },
  {
    message: GET_GAME_DETAILS_ERROR_MESSAGE.YOU_HAVE_MISSED_GAME_START,
    status: 403,
  },
];
