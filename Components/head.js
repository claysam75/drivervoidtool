import Head from 'next/head';
const head = (props) => {
  return (
    <div>
      <Head>
        <title>{props.title}</title>
        <meta
          name="viewport"
          content="initial-scale=1.0"
          width="device-width"
        ></meta>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
          integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
          crossorigin="anonymous"
        />
      </Head>
    </div>
  );
};

export default head;
