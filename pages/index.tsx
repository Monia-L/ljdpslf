import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { createGame as _createGame } from './lib/api/games';

const useCreateGame = (): [boolean, () => Promise<void>] => {
  const [createdGameId, setCreatedGameId] = useState(null);

  const createGame = async (): Promise<void> => {
    const { id } = await _createGame();
    setCreatedGameId(id);
  };

  return [createdGameId, createGame];
};

const Home = (): JSX.Element => {
  const [createdGameId, createGame] = useCreateGame();
  const router = useRouter();

  if (createdGameId) {
    router.push(`/games/${createdGameId}`);
  }

  return (
    <div className="container">
      <Head>
        <title>Le jeu des post-it sur le front</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <button onClick={createGame}>Créer une nouvelle partie</button>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        button {
          font-size: 18px;
          color: black;
          padding: 8px;
          border: 4px solid black;
          background: #fff;
          font-weight: bold;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
          background: linear-gradient(45deg, yellow, orange);
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

export default Home;
