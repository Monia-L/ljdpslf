import { v4 as uuidv4 } from 'uuid';

import { TGame, getCollection } from '.';

const createGame = async (): Promise<TGame> => {
  const gamesCollection = await getCollection('games');
  const response = await gamesCollection.insertOne({ id: uuidv4() });
  return response.ops[0];
};

export { createGame };
