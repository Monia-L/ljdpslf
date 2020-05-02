import { useRouter } from 'next/router';
import { useState } from 'react';
import { createGame as _createGame } from './_lib/api/games';

const useCreateGame = (): [boolean, () => Promise<void>] => {
  const [createdGameId, setCreatedGameId] = useState(null);

  const createGame = async (): Promise<void> => {
    const { id } = await _createGame();
    setCreatedGameId(id);
  };

  return [createdGameId, createGame];
};

const Home = (): JSX.Element => {
  const [createdGameId, createGame] = useCreateGame();
  const router = useRouter();

  if (createdGameId) {
    router.push('/partie/[gameId]', `/partie/${createdGameId}`, {
      shallow: true,
    });
  }

  return <button onClick={createGame}>Créer une nouvelle partie</button>;
};

export default Home;
