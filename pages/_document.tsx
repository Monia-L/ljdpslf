import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentInitialProps,
} from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render(): JSX.Element {
    return (
      <Html lang="fr">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>

        <style jsx global>{`
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 0;
            background-color: lightyellow;
            font-size: 20px;
            font-family: -apple-system, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
              'Cantarell', 'Fira Sans', 'Droid Sans', 'Inter', 'Helvetica Neue',
              sans-serif;
          }

          ul {
            padding-inline-start: 0;
          }

          form {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: baseline;
          }

          form *:not(:last-child) {
            margin-bottom: 14px;
          }

          .input-field {
            width: 280px;
            height: 42px;
            border: 3px solid black;
            border-radius: 0;
            padding: 8px;
            font-size: 18px;
            font-weight: bold;
          }
        `}</style>
      </Html>
    );
  }
}

export default MyDocument;
