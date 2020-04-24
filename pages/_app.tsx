import PropTypes from 'prop-types';
import Head from 'next/head';

import '../styles/global.css';

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

App.propTypes = {
  Component: PropTypes.func,
  pageProps: PropTypes.object,
};

export default App;
