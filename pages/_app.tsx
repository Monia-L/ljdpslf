import Head from 'next/head';
import { setCookie, parseCookies } from 'nookies';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

import '../lib/styles.css';

const App = ({ Component, pageProps }): JSX.Element => {
  return (
    <>
      <Head>
        <title>Le jeu des post-it sur le front</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container">
        <Component {...pageProps} />
      </main>
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
        httpOnly: true,
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
