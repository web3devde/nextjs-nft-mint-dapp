import Head from 'next/head';
import type { NextPage } from 'next';

import Layout from '../components/Layout';
import Prose from '../components/Prose';
import Mint from '../components/Mint';
import Faq from '../components/Faq';


import contractConfig from '../config/contract-config.json';

const Home: NextPage = () => {
  const { nftName } = contractConfig;

  return (
    <Layout>
      <Head>
        <title>{nftName}</title>
      </Head>
      
      <div className="py-16">
       
        <Prose>
        
          <Mint />
          <Faq />
        </Prose>
      </div>
      
    </Layout>
  );
};

export default Home;
