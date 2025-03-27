import Head from 'next/head';
import { nanoid } from 'nanoid';
const head = (props) => {
  return (
    <div>
      <Head>
        <title>{props.title}</title>
        <html lang="en"></html>
        <meta
          key={nanoid()}
          name="viewport"
          content="initial-scale=1.0"
          width="device-width"
        ></meta>
        <meta
          key={nanoid}
          name="Description"
          content="Tool for calculating if a driver will fit into a given ceiling void/downlight aperture"
        ></meta>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
          integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
          crossorigin="anonymous"
        />
        <script
          defer
          data-project="67e5a141b9698244376afc7d"
          src="https://cdn.jsdelivr.net/gh/litlyx/litlyx-js/browser/litlyx.js"
        ></script>
      </Head>
    </div>
  );
};

export default head;
