import Head from 'next/head';

const Home = (): JSX.Element => (
  <div className="container">
    <Head>
      <title>Le jeu des post-it sur le front</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main>
      <button>Créer une nouvelle partie</button>
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
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
          Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
        background: linear-gradient(45deg, yellow, orange);
      }

      * {
        box-sizing: border-box;
      }
    `}</style>
  </div>
);

export default Home;
