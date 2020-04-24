import { v4 as uuidv4 } from 'uuid';

import { getCollection } from '.';

type Game = {
  id: string;
};

const createGame = async (): Promise<Game> => {
  const gamesCollection = await getCollection('games');
  const response = await gamesCollection.insertOne({ id: uuidv4() });
  return response.ops[0];
};

export { createGame };
