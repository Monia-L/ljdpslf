import { useRouter } from 'next/router';
import { useState, Dispatch } from 'react';

import { setMyName as _setMyName } from '../../pages-lib/api/me';

const useNameForm = (
  gameId: string
): [string, Dispatch<string>, () => void] => {
  const [name, setName] = useState('');

  const submitForm = async (): Promise<void> => {
    await _setMyName(name, gameId);
  };

  return [name, setName, submitForm];
};

const Game = (): JSX.Element => {
  const router = useRouter();
  const { gameId } = router.query;

  const [name, setName, submitForm] = useNameForm(gameId as string);

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
};

export default Game;
