import { NowResponse } from '@now/node';
import { ERRORS_TO_CATCH } from './constants';

const sendResponse = async (
  res: NowResponse,
  action: () => unknown
): Promise<NowResponse> => {
  try {
    return res.status(200).json(await action());
  } catch (error) {
    const errorToCatch = ERRORS_TO_CATCH.find(
      (err) => err.message === error.message
    );
    if (errorToCatch) {
      return res
        .status(errorToCatch.status)
        .json({ message: errorToCatch.message });
    }
    return res.status(500);
  }
};

export { sendResponse };
