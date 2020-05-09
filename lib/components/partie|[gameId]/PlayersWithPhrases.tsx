import { TPlayerForPlayer } from '../../../types';
import Button from '../global/Button';

const PlayersWithPhrases = ({
  players,
}: {
  players: Array<TPlayerForPlayer>;
}): JSX.Element => (
  <ul>
    {players.map(({ isMe, id, name, phraseToGuess, isTheirTurnToGuess }) => (
      <li key={id}>
        {isTheirTurnToGuess && (
          <i className="label-turn-to-guess">{`À ${
            isMe ? 'vous' : name
          } de deviner…`}</i>
        )}
        <div className="name-and-phrase">
          {isMe ? (
            <>
              Vous êtes <b>???</b>
            </>
          ) : (
            <>
              {name} est <b>{phraseToGuess || '…'}</b>
            </>
          )}
          {isTheirTurnToGuess && isMe && (
            <div className="actions">
              <Button>J’ai fini mon tour</Button>
              <Button>J’ai deviné</Button>
            </div>
          )}
        </div>
      </li>
    ))}

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

export default PlayersWithPhrases;
