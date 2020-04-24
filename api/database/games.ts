import { getCollection } from '.';

type Game = {
  id: string;
};

const createGame = async (): Promise<Game> => {
  const gamesCollection = await getCollection('games');
  const response = await gamesCollection.insertOne({});
  return response.ops[0];
};

export { createGame };
