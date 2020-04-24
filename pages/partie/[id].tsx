import { useRouter } from 'next/router';

const Game = (): JSX.Element => {
  const router = useRouter();
  const { id } = router.query;

  return <p>Game: {id}</p>;
};

export default Game;
