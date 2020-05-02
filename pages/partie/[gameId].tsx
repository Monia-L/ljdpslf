import { useRouter } from 'next/router';
import { useState, Dispatch, useEffect } from 'react';

import {
  getGameDetails,
  GET_GAME_DETAILS_ERROR_MESSAGE,
} from '../_lib/api/games';
import { setMyName } from '../_lib/api/me';
import { getPlayerNames } from '../_lib/helpers/games';

const useGame = (
  gameId: string
): [boolean, boolean, string, Dispatch<string>, () => void, Array<string>] => {
  const [loading, setLoading] = useState(true);
  const [promptForName, setPromptForName] = useState(false);
  const [name, setName] = useState('');
  const [playerNames, setPlayerNames] = useState([]);

  const fetchPlayerNames = async (): Promise<void> => {
    try {
      setPlayerNames(getPlayerNames(await getGameDetails(gameId)));
      setPromptForName(false);
      setLoading(false);
    } catch (error) {
      if (
        error.message ===
        GET_GAME_DETAILS_ERROR_MESSAGE.YOU_MUST_FIRST_SET_YOUR_NAME
      ) {
        setPromptForName(true);
        setLoading(false);
      } else {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchPlayerNames();
  }, []);

  const submitForm = async (): Promise<void> => {
    await setMyName(name, gameId);
    fetchPlayerNames();
  };

  return [loading, promptForName, name, setName, submitForm, playerNames];
};

const Game = (): JSX.Element => {
  const router = useRouter();
  const { gameId } = router.query;

  const [
    loading,
    promptForName,
    name,
    setName,
    submitForm,
    playerNames,
  ] = useGame(gameId as string);

  if (loading) {
    return <p>Chargement…</p>;
  }

  if (promptForName) {
    return (
      <form
        onSubmit={(event): void => {
          event.preventDefault();
          submitForm();
        }}
      >
        <label htmlFor="name">Votre nom :</label>
        <input
          className="input-field"
          type="text"
          minLength={2}
          name="name"
          id="name"
          value={name}
          onChange={({ target: { value } }): void => {
            setName(value);
          }}
        />
        <button type="submit">Valider</button>
      </form>
    );
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
