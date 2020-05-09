import { TPlayerForPlayer } from '../../../types';

const PlayersAndPhrases = ({
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
  </ul>
);

export default PlayersAndPhrases;
