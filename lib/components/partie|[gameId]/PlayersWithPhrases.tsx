import { TPlayerForPlayer } from '../../../types';

const PlayersWithPhrases = ({
  players,
}: {
  players: Array<TPlayerForPlayer>;
}): JSX.Element => (
  <ul>
    {players.map(({ isMe, id, name, phraseToGuess }) => (
      <li key={id}>
        {isMe ? (
          <>
            Vous êtes <b>???</b>
          </>
        ) : (
          <>
            {name} est <b>{phraseToGuess || '…'}</b>
          </>
        )}
      </li>
    ))}

    <style jsx>{`
      ul {
        list-style: none;
        display: grid;
        grid-gap: 14px;
      }

      li {
        border: 3px solid lightgray;
        padding: 8px 10px;
        background: #ffff99;
      }
    `}</style>
  </ul>
);

export default PlayersWithPhrases;
