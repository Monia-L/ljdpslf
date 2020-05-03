import propTypes from 'prop-types';

import { setMyName } from '../_lib/api/me';
import { useState, Dispatch } from 'react';
import Button from '../_lib/components/Button';

const useSetName = (
  gameId: string,
  onSubmitSuccess: Function
): [string, Dispatch<string>, Function, boolean] => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');

  const submitName = async (): Promise<void> => {
    setIsLoading(true);
    await setMyName(name, gameId);
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
        type="text"
        required
        minLength={2}
        name="name"
        id="name"
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
