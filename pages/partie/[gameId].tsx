import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import { GamePhase, TGamePublic } from '../../types';
import {
  getGameDetails,
  GET_GAME_DETAILS_ERROR_MESSAGE,
  enterWritingPhase as _enterWritingPhase,
} from '../../lib/api/games';
import LoadingIndicator from '../../lib/components/global/LoadingIndicator';
import PromptForName from '../../lib/components/partie|[gameId]/PromptForName';
import Button from '../../lib/components/global/Button';

const useGame = (
  gameId: string
): [
  boolean,
  string,
  boolean,
  () => Promise<void>,
  TGamePublic,
  () => Promise<void>
] => {
  const [isLoading, setIsLoading] = useState(true);
  const [mainMessage, setMainMessage] = useState('');
  const [isPromptingForName, setIsPromptingForName] = useState(false);
  const [gameDetails, setGameDetails] = useState(null);

  const fetchGameDetails = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setIsPromptingForName(false);
      setGameDetails(await getGameDetails(gameId));
      setIsLoading(false);
    } catch (error) {
      switch (error.message) {
        case GET_GAME_DETAILS_ERROR_MESSAGE.YOU_MUST_FIRST_SET_YOUR_NAME:
          setIsPromptingForName(true);
          setIsLoading(false);
          break;
        case GET_GAME_DETAILS_ERROR_MESSAGE.YOU_HAVE_MISSED_GAME_START:
          setMainMessage(error.message);
          setIsLoading(false);
          break;
        default:
          console.error(error);
          break;
      }
    }
  };

  useEffect(() => {
    fetchGameDetails();
  }, []);

  const enterWritingPhase = async (): Promise<void> => {
    setGameDetails(await _enterWritingPhase(gameId));
  };

  return [
    isLoading,
    mainMessage,
    isPromptingForName,
    fetchGameDetails,
    gameDetails,
    enterWritingPhase,
  ];
};

const Game = (): JSX.Element => {
  const router = useRouter();
  const gameId = router.query.gameId as string;

  const [
    isLoading,
    mainMessage,
    isPromptingForName,
    fetchGameDetails,
    gameDetails,
    enterWritingPhase,
  ] = useGame(gameId);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (mainMessage) {
    return <p>{mainMessage}</p>;
  }

  if (isPromptingForName) {
    return <PromptForName gameId={gameId} onSubmitSuccess={fetchGameDetails} />;
  }

  if (gameDetails) {
    const { me, otherPlayers, phase } = gameDetails;

    if (phase === GamePhase.WRITING_PHRASE_TO_GUESS) {
      return <h2>WRITING_PHRASE_TO_GUESS</h2>;
    }

    return (
      <>
        <h2>Participants :</h2>
        <ul>
          <li key={gameDetails.me.id}>{me.name} (vous)</li>
          {otherPlayers.map((player) => (
            <li key={player.id}>{player.name}</li>
          ))}
        </ul>
        {me.isOwner && (
          <Button onClick={enterWritingPhase}>Lancer la partie</Button>
        )}
      </>
    );
  }
};

export default Game;
