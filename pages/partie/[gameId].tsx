import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import {
  getGameDetails,
  GET_GAME_DETAILS_ERROR_MESSAGE,
} from '../../lib/api/games';
import LoadingIndicator from '../../lib/components/global/LoadingIndicator';
import { getPlayerNames } from '../../lib/helpers/games';
import PromptForName from '../../lib/components/partie|[gameId]/PromptForName';

const useGame = (
  gameId: string
): [boolean, boolean, () => Promise<void>, Array<string>] => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPromptingForName, setIsPromptingForName] = useState(false);
  const [playerNames, setPlayerNames] = useState([]);

  const fetchPlayerNames = async (): Promise<void> => {
    try {
      setIsPromptingForName(false);
      setIsLoading(true);
      setPlayerNames(getPlayerNames(await getGameDetails(gameId)));
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

  return [isLoading, isPromptingForName, fetchPlayerNames, playerNames];
};

const Game = (): JSX.Element => {
  const router = useRouter();
  const gameId = router.query.gameId as string;

  const [
    isLoading,
    isPromptingForName,
    fetchPlayerNames,
    playerNames,
  ] = useGame(gameId);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (isPromptingForName) {
    return <PromptForName gameId={gameId} onSubmitSuccess={fetchPlayerNames} />;
  }

  return (
    <>
      <p>Participants :</p>
      <ul>
        {playerNames.map((playerName) => (
          <li key={playerName}>{playerName}</li>
        ))}
      </ul>
    </>
  );
};

export default Game;
