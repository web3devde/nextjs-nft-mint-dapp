import Head from 'next/head';
import { useRouter } from 'next/router';

import contractConfig from '../config/contract-config.json';

type Props = {
  pageTitle?: string;
};

export default function Meta({ pageTitle }: Props) {
  const { nftName } = contractConfig;
  const router = useRouter();
  const ogUrl = process.env.NEXT_PUBLIC_SITE_URL + router.asPath;
  const ogType = router.pathname === '/' ? 'website' : 'article';
  const ogTitle = pageTitle
    ? pageTitle
    : 'The citizens of Ensville are living in peace and harmony.';
  const ogImage = `${process.env.NEXT_PUBLIC_SITE_URL}/assets/logo.png`;
  const description = `REAKING NEWS!

  A Mysterious storm is approaching the city! The citizens have to flee to their shelters.
  
  In other news, a new virus/infection is detected in neighboring city Eelcove.
  
  The citizens, afraid of whats coming, are glued to their radio and tv's, to listen to the last news.
  
  The new virus/infection seems to be airborne. Everyone needs to close their windows and ventilation shafts.
  
  Scientist say there is some little information about the virus/infection. People who got infected are starting to get cannibal behaviors.
  For now there is no medication nor vaccine to fight this virus/infection.`;

  return (
    <Head>
      <title>{`${pageTitle} | ${nftName}`}</title>

      <link rel="shortcut icon" href="/assets/logo.png" />
      <meta name="msapplication-TileColor" content="#ffc40d" />
      <meta name="msapplication-config" content="/favicon/browserconfig.xml" />
      <meta name="theme-color" content="#ffffff" />
      <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      <meta name="description" content={description} key="description" />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={nftName} />
      <meta property="og:title" content={ogTitle} />
      <meta
        property="og:description"
        content={description}
        key="ogDescription"
      />
      <meta property="og:image" content={ogImage} key="ogImage" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:site"
        content={process.env.NEXT_PUBLIC_TWITTER_USERNAME}
      />
    </Head>
  );
}
