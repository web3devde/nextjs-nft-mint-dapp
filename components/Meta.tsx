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
    : 'A NFT collection of 444 mysterious eggs';
  const ogImage = `${process.env.NEXT_PUBLIC_SITE_URL}/assets/logo.png`;
  const description = `𝘛𝘩𝘦 𝘣𝘭𝘶𝘦 𝘴𝘶𝘯 𝘩𝘢𝘴 𝘳𝘪𝘴𝘦𝘯 ...
                    a 𝘔𝘺𝘴𝘵𝘦𝘳𝘪𝘰𝘶𝘴 𝘌𝘨𝘨 𝘢𝘱𝘱𝘦𝘢𝘳𝘴 𝘪𝘯 𝘧𝘳𝘰𝘯𝘵 𝘰𝘧 𝘺𝘰𝘶.`;

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
