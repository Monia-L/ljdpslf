import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import {
  getGameDetails,
  GET_GAME_DETAILS_ERROR_MESSAGE,
} from '../../lib/api/games';
import LoadingIndicator from '../../lib/components/global/LoadingIndicator';
import PromptForName from '../../lib/components/partie|[gameId]/PromptForName';

const useGame = (
  gameId: string
): [boolean, boolean, () => Promise<void>, TGamePublic] => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPromptingForName, setIsPromptingForName] = useState(false);
  const [gameDetails, setGameDetails] = useState({
    id: '',
    me: null,
    otherPlayers: [],
  });

  const fetchPlayerNames = async (): Promise<void> => {
    try {
      setIsPromptingForName(false);
      setIsLoading(true);
      setGameDetails(await getGameDetails(gameId));
      setIsLoading(false);
    } catch (error) {
      if (
        error.message ===
        GET_GAME_DETAILS_ERROR_MESSAGE.YOU_MUST_FIRST_SET_YOUR_NAME
      ) {
        setIsPromptingForName(true);
        setIsLoading(false);
      } else {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchPlayerNames();
  }, []);

  return [isLoading, isPromptingForName, fetchPlayerNames, gameDetails];
};

const Game = (): JSX.Element => {
  const router = useRouter();
  const gameId = router.query.gameId as string;

  const [
    isLoading,
    isPromptingForName,
    fetchPlayerNames,
    { me, otherPlayers },
  ] = useGame(gameId);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (isPromptingForName) {
    return <PromptForName gameId={gameId} onSubmitSuccess={fetchPlayerNames} />;
  }

  return (
    <>
      <h2>Participants :</h2>
      <ul>
        <li key={me.id}>{me.name} (vous)</li>
        {otherPlayers.map((player) => (
          <li key={player.id}>{player.name}</li>
        ))}
      </ul>
    </>
  );
};

export default Game;
