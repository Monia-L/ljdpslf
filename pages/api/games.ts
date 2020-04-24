import { IncomingMessage, ServerResponse } from 'http';

export default (req: IncomingMessage, res: ServerResponse): void => {
  if (req.method === 'POST') {
    res.statusCode = 201;
    return res.end(JSON.stringify({ id: 1 }));
  }
  res.statusCode = 405;
  return res.end();
};
