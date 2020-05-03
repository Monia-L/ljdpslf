import { useRouter } from 'next/router';
import { useState } from 'react';

import { createGame as _createGame } from './_lib/api/games';
import Button from './_lib/components/Button';

const useCreateGame = (): [() => Promise<void>, boolean, string] => {
  const [isLoading, setIsLoading] = useState(false);
  const [createdGameId, setCreatedGameId] = useState(null);

  const createGame = async (): Promise<void> => {
    setIsLoading(true);
    const { id } = await _createGame();
    setCreatedGameId(id);
  };

  return [createGame, isLoading, createdGameId];
};

const Home = (): JSX.Element => {
  const [createGame, isLoading, createdGameId] = useCreateGame();
  const router = useRouter();

  if (createdGameId) {
    router.push('/partie/[gameId]', `/partie/${createdGameId}`, {
      shallow: true,
    });
  }

  return (
    <Button onClick={createGame} isLoading={isLoading}>
      Créer une nouvelle partie
    </Button>
  );
};

export default Home;
