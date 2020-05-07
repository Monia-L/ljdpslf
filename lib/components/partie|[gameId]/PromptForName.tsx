import propTypes from 'prop-types';

import { registerInGame } from '../../api/me';
import { useState, Dispatch } from 'react';
import Button from '../global/Button';

const useSetName = (
  gameId: string,
  onSubmitSuccess: Function
): [string, Dispatch<string>, Function, boolean] => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');

  const submitName = async (): Promise<void> => {
    setIsLoading(true);
    await registerInGame(name.trim(), gameId);
    setIsLoading(false);
    onSubmitSuccess();
  };

  return [name, setName, submitName, isLoading];
};

const PromptForName = ({ gameId, onSubmitSuccess }): JSX.Element => {
  const [name, setName, submitName, isLoading] = useSetName(
    gameId,
    onSubmitSuccess
  );

  return (
    <form
      onSubmit={(event): void => {
        event.preventDefault();
        submitName();
      }}
    >
      <label htmlFor="name">Votre nom :</label>
      <input
        className="input-field"
        id="name"
        name="name"
        type="text"
        required
        minLength={1}
        autoFocus
        value={name}
        onChange={({ target: { value } }): void => {
          setName(value);
        }}
      />
      <Button type="submit" isLoading={isLoading}>
        Valider
      </Button>
    </form>
  );
};

PromptForName.propTypes = {
  gameId: propTypes.string.isRequired,
  onSubmitSuccess: propTypes.func.isRequired,
};

export default PromptForName;
