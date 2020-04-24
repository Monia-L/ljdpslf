import { useRouter } from 'next/router';

const Game = (): JSX.Element => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <form>
      <label htmlFor="name">Votre nom :</label>
      <input className="input-field" type="text" name="name" id="name" />
      <button type="submit">Valider</button>

      <style jsx>{``}</style>
    </form>
  );
};

export default Game;
