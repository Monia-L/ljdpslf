import propTypes from 'prop-types';

import { setMyName } from '../_lib/api/me';
import { useState, Dispatch } from 'react';

const useNameForm = (
  gameId: string,
  onSubmitSuccess: Function
): [string, Dispatch<string>, Function] => {
  const [name, setName] = useState('');

  const submitForm = async (): Promise<void> => {
    await setMyName(name, gameId);
    onSubmitSuccess();
  };

  return [name, setName, submitForm];
};

const PromptForName = ({ gameId, onSubmitSuccess }): JSX.Element => {
  const [name, setName, submitForm] = useNameForm(gameId, onSubmitSuccess);

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
};

PromptForName.propTypes = {
  gameId: propTypes.string.isRequired,
  onSubmitSuccess: propTypes.func.isRequired,
};

export default PromptForName;
