import { v4 as uuidv4 } from 'uuid';

import { getCollection, TGame } from '.';

const setPlayerNameInGame = async (
  sessionId: string,
  name: string,
  gameId: string
): Promise<void> => {
  const gamesCollection = await getCollection('games');
  await gamesCollection.updateOne(
    { id: gameId },
    { $set: { [`players.${sessionId}.name`]: name } }
  );
};

export { setPlayerNameInGame };
