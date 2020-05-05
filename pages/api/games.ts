import { NowRequest, NowResponse } from '@now/node';
import { createGame } from './_lib/database/games';

export default async (
  req: NowRequest,
  res: NowResponse
): Promise<NowResponse> => {
  if (req.method === 'POST') {
    const { id } = await createGame(req.cookies.sessionId);
    return res.status(201).json({ id });
  }
  return res.status(405).send(null);
};
