import propTypes from 'prop-types';

import { setPhraseToGuess } from '../../api/games';
import { useState, Dispatch } from 'react';
import Button from '../global/Button';

const useSetPhrase = (
  gameId: string,
  onSubmitSuccess: Function
): [string, Dispatch<string>, Function, boolean] => {
  const [isLoading, setIsLoading] = useState(false);
  const [phrase, setPhrase] = useState('');

  const submitPhrase = async (): Promise<void> => {
    setIsLoading(true);
    await setPhraseToGuess(gameId, phrase.trim());
    setIsLoading(false);
    onSubmitSuccess();
  };

  return [phrase, setPhrase, submitPhrase, isLoading];
};

const PromptForPhraseToGuess = ({
  gameId,
  playerNameToWritePhraseFor,
  onSubmitSuccess,
}): JSX.Element => {
  const [phrase, setPhrase, submitPhrase, isLoading] = useSetPhrase(
    gameId,
    onSubmitSuccess
  );

  return (
    <form
      onSubmit={(event): void => {
        event.preventDefault();
        submitPhrase();
      }}
    >
      <label htmlFor="phrase-for-next-player-to-guess">
        Écrivez le post-it de {playerNameToWritePhraseFor} :
      </label>
      <input
        className="input-field"
        id="phrase-for-next-player-to-guess"
        name="phrase-for-next-player-to-guess"
        type="text"
        required
        minLength={1}
        autoFocus
        value={phrase}
        onChange={({ target: { value } }): void => {
          setPhrase(value);
        }}
      />
      <Button type="submit" isLoading={isLoading}>
        Valider
      </Button>
    </form>
  );
};

PromptForPhraseToGuess.propTypes = {
  gameId: propTypes.string.isRequired,
  playerNameToWritePhraseFor: propTypes.string.isRequired,
  onSubmitSuccess: propTypes.func.isRequired,
};

export default PromptForPhraseToGuess;
