import { TPlayerForPlayer } from '../../../types';
import Button from '../global/Button';
import LoadingIndicator from '../global/LoadingIndicator';
import { useState } from 'react';

const PlayersWithPhrases = ({
  players,
  passTurnToGuess,
  setPhraseAsGuessed,
}: {
  players: Array<TPlayerForPlayer>;
  passTurnToGuess?: () => void;
  setPhraseAsGuessed?: () => void;
}): JSX.Element => {
  const [isActionLoading, setIsActionLoading] = useState(false);

  const callAction = (action: () => void) => (): void => {
    setIsActionLoading(true);
    action();
  };

  return (
    <ul>
      {players.map(
        ({
          isMe,
          id,
          name,
          phraseToGuess,
          isTheirTurnToGuess,
          isPhraseGuessed,
        }) => (
          <li key={id}>
            {isTheirTurnToGuess && !isPhraseGuessed && (
              <i className="label-turn-to-guess">{`À ${
                isMe ? 'vous' : name
              } de deviner…`}</i>
            )}
            <div className="name-and-phrase">
              {isMe ? (
                <>
                  Vous êtes <b>{phraseToGuess || '???'}</b>
                </>
              ) : (
                <>
                  {name} est <b>{phraseToGuess || '…'}</b>
                </>
              )}
              {isMe && isTheirTurnToGuess && !isPhraseGuessed && (
                <div className="actions">
                  {isActionLoading ? (
                    <LoadingIndicator />
                  ) : (
                    <>
                      <Button onClick={callAction(passTurnToGuess)}>
                        J’ai fini mon tour
                      </Button>
                      <Button onClick={callAction(setPhraseAsGuessed)}>
                        J’ai deviné
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          </li>
        )
      )}

      <style jsx>{`
        ul {
          list-style: none;
          display: grid;
          grid-gap: 14px;
          text-align: left;
        }

        .label-turn-to-guess {
          background-color: #f4f4e4;
          display: inline-block;
          padding: 8px 12px;
          font-size: 18px;
          font-variant: all-small-caps;
        }

        .name-and-phrase {
          padding: 12px;
          background: #feff9c;
        }

        .actions {
          margin-top: 12px;
          display: grid;
          grid-gap: 12px;
          text-align: center;
        }
      `}</style>
    </ul>
  );
};

export default PlayersWithPhrases;
