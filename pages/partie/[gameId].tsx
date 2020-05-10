import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import { GamePhase, TGameForPlayer } from '../../types';
import {
  getGameDetails,
  GET_GAME_DETAILS_ERROR_MESSAGE,
  enterWritingPhase as _enterWritingPhase,
  setPhraseToGuess as _setPhraseToGuess,
  passTurnToGuess as _passTurnToGuess,
  setPhraseAsGuessed as _setPhraseAsGuessed,
} from '../../lib/api/games';
import { registerInGame as _registerInGame } from '../../lib/api/me';
import LoadingIndicator from '../../lib/components/global/LoadingIndicator';
import Button from '../../lib/components/global/Button';
import PromptForText from '../../lib/components/partie|[gameId]/PromptForText';
import PlayersWithPhrases from '../../lib/components/partie|[gameId]/PlayersWithPhrases';
import { subscribeToGameUpdates } from '../../lib/subscriptions/games';

const useGame = (
  gameId: string
): [
  boolean,
  string,
  boolean,
  TGameForPlayer,
  (name: string) => Promise<void>,
  () => Promise<void>,
  (phrase: string) => Promise<void>,
  () => Promise<void>,
  () => Promise<void>,
  boolean
] => {
  const [isLoading, setIsLoading] = useState(true);
  const [mainMessage, setMainMessage] = useState('');
  const [isPromptingForName, setIsPromptingForName] = useState(false);
  const [gameDetails, setGameDetails] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchGameDetails = async (): Promise<void> => {
    try {
      setIsLoading(true);
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

  useEffect(() => {
    subscribeToGameUpdates(gameId, setGameDetails);
  }, [gameId]);

  const registerInGame = async (name: string): Promise<void> => {
    setGameDetails(await _registerInGame(gameId, name));
    setIsPromptingForName(false);
  };

  const enterWritingPhase = async (): Promise<void> => {
    setIsLoading(true);
    setGameDetails(await _enterWritingPhase(gameId));
    setIsLoading(false);
  };

  const setPhraseToGuess = async (phrase: string): Promise<void> => {
    setGameDetails(await _setPhraseToGuess(gameId, phrase));
  };

  const passTurnToGuess = async (): Promise<void> => {
    setIsActionLoading(true);
    setGameDetails(await _passTurnToGuess(gameId));
    setIsActionLoading(false);
  };

  const setPhraseAsGuessed = async (): Promise<void> => {
    setIsActionLoading(true);
    setGameDetails(await _setPhraseAsGuessed(gameId));
    setIsActionLoading(false);
  };

  return [
    isLoading,
    mainMessage,
    isPromptingForName,
    gameDetails,
    registerInGame,
    enterWritingPhase,
    setPhraseToGuess,
    passTurnToGuess,
    setPhraseAsGuessed,
    isActionLoading,
  ];
};

const Game = (): JSX.Element => {
  const router = useRouter();
  const gameId = router.query.gameId as string;

  const [
    isLoading,
    mainMessage,
    isPromptingForName,
    gameDetails,
    registerInGame,
    enterWritingPhase,
    setPhraseToGuess,
    passTurnToGuess,
    setPhraseAsGuessed,
    isActionLoading,
  ] = useGame(gameId);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (mainMessage) {
    return <p>{mainMessage}</p>;
  }

  if (isPromptingForName) {
    return (
      <PromptForText
        fieldId="input-player-name"
        label="Votre nom :"
        onSubmit={registerInGame}
      />
    );
  }

  if (gameDetails) {
    const { players, phase, playerToWritePhraseFor } = gameDetails;
    const amIOwner = Boolean(
      players.find(({ isOwner, isMe }) => isOwner && isMe)
    );

    if (phase === GamePhase.GUESSING || phase === GamePhase.COMPLETED) {
      return (
        <PlayersWithPhrases
          players={players}
          isActionLoading={isActionLoading}
          passTurnToGuess={passTurnToGuess}
          setPhraseAsGuessed={setPhraseAsGuessed}
        />
      );
    }
    if (phase === GamePhase.WRITING_PHRASE_TO_GUESS) {
      if (playerToWritePhraseFor.phraseToGuess) {
        return <PlayersWithPhrases players={players} />;
      }
      return (
        <PromptForText
          fieldId="input-phrase-for-next-player-to-guess"
          label={`Écrivez le post-it de ${playerToWritePhraseFor.name} :`}
          onSubmit={setPhraseToGuess}
        />
      );
    }

    return (
      <>
        <p>
          <i>Partagez l’URL à vos amis pour qu’ils vous rejoignent.</i>
        </p>
        <div className="players">
          <h2>Participants :</h2>
          <ul>
            {players.map((player) => (
              <li key={player.id}>
                {`${player.name}${player.isMe ? ' (vous)' : ''}`}
              </li>
            ))}
          </ul>
        </div>
        {amIOwner ? (
          <Button onClick={enterWritingPhase} disabled={players.length < 2}>
            Lancer la partie
          </Button>
        ) : (
          <p>
            En attente du lancement de la partie par l’hôte (
            {players.find(({ isOwner }) => isOwner).name}).
          </p>
        )}

        <style jsx>{`
          .players {
            padding: 12px;
            background: #feff9c;
            text-align: left;
            margin-bottom: 20px;
          }

          h2 {
            margin: 0;
          }

          ul {
            margin: 12px 0 0;
            list-style: none;
          }
        `}</style>
      </>
    );
  }
};

export default Game;
