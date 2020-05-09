import { TPlayerForPlayer } from '../../../types';

const PlayersWithPhrases = ({
  players,
}: {
  players: Array<TPlayerForPlayer>;
}): JSX.Element => (
  <ul>
    {players.map(({ isMe, id, name, phraseToGuess, isTheirTurnToGuess }) => (
      <li key={id}>
        {isTheirTurnToGuess && (
          <span className="label-turn-to-guess">{`À ${
            isMe ? 'vous' : name
          } de deviner`}</span>
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
        background-color: lightgray;
        display: inline-block;
        padding: 6px 10px;
        font-size: 18px;
        font-variant: all-small-caps;
        font-style: italic;
      }

      .name-and-phrase {
        border: 3px solid lightgray;
        padding: 8px 10px;
        background: #ffff99;
      }
    `}</style>
  </ul>
);

export default PlayersWithPhrases;
