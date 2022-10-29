import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render(): React.ReactElement {
    return (
      <Html>
        <Head />
        <body className="h-full text-blue-300 
        bg-[url('../public/background.png')] 
        bg-no-repeat 
        bg-cover bg-center">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
