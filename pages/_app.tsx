import Head from 'next/head';
import { setCookie, parseCookies } from 'nookies';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

import AppLogo from '../lib/components/_app/AppLogo';
import '../lib/styles.css';

const App = ({ Component, pageProps }): JSX.Element => {
  return (
    <>
      <Head>
        <title>Le Jeu du post-it</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content='Jouez avec vos amis au celèbre "jeu du post-it sur la tête", dans la même pièce ou aux quatre coins du monde.'
        />
        <meta property="og:image" content="/meta-og-image.png" />
      </Head>
      <div className="container">
        <header>
          <nav>
            <AppLogo />
          </nav>
        </header>
        <main>
          <div>
            <Component {...pageProps} />
          </div>
        </main>

        <style jsx>{`
          main {
            width: 280px;
            margin: 0 20px;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
        `}</style>
      </div>
    </>
  );
};

App.getInitialProps = ({ ctx }): object => {
  const isServer = Boolean(ctx.req);
  if (isServer) {
    const requestCookies = parseCookies(ctx);
    if (!requestCookies.sessionId) {
      setCookie(ctx, 'sessionId', uuidv4(), {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: true,
      });
    }
  }

  return {};
};

App.propTypes = {
  Component: PropTypes.func,
  pageProps: PropTypes.object,
};

export default App;
