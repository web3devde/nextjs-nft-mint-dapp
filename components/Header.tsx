import Image from 'next/image';
import { useMoralis } from 'react-moralis';
import { ConnectButton, Icon } from 'web3uikit';

import Container from './Container';
import NextLink from './NextLink';
import Logo from '../public/assets/pfp.jpeg';
import OS from "../public/assets/opensea.svg"
import ES from "../public/assets/etherscan.png"
import contractConfig from '../config/contract-config.json';
import { parseChainId, getContractAddress } from '../utils/chain';

export default function Header() {
  const { nftName, openSeaURL, twitterURL, etherscanURL } = contractConfig;
  const { chainId: chainIdHex } = useMoralis();
  const contractAddress = getContractAddress(chainIdHex);

  return (
    <div className="sticky top-0 z-50">
      <header className="bg-blue-900 border-b py-4">
        <Container>
          <div className="flex justify-between items-center">
            <NextLink href="/" className="text-2xl font-bold text-white">
              <span className="flex items-center">
                <Image
                  src={Logo}
                  alt={nftName}
                  width={35}
                  height={35}
                  className="rounded-full"
                />
                <span className="hidden md:block ml-2">{nftName}</span>
              </span>
            </NextLink>

            <div className="flex items-center space-x-2 ml-2 sm:ml-0">
              <div className="hidden lg:flex space-x-2">
                <a
                  href={openSeaURL}
                  aria-label={`${nftName} on OpenSea`}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="rounded-full p-2"
                >
                  <Image src={OS} height={25} width={25} />
                </a> 
                <a
                  
                  href={twitterURL}
                  aria-label={`${nftName} on Twitter`}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="rounded-full p-3 items-center"
                >
                   <Icon fill="#fff" svg="twitter" />
                </a>
                <a
                  href={etherscanURL}
                  aria-label={`Contract of ${nftName}`}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="rounded-full p-2"
                >
                  <Image src={ES} height={25} width={25} />
                </a>
              </div>

              <ConnectButton moralisAuth={false} />
            </div>
          </div>
        </Container>
      </header>
    </div>
  );
}
