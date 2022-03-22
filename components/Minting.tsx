import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { IconContext } from 'react-icons';
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa';

import { useEthereumProvider } from '../hooks/useEthereumProvider';
import ABI from '../contract/abi.json';

export default function Minting() {
  const { account, active, chainId } = useWeb3React();
  const { ethereumProvider } = useEthereumProvider();

  const [message, setMessage] = useState('');
  const [connErrMsg, setConnErrMsg] = useState('');
  const [totalSupply, setTotalSupply] = useState('?');
  const [isPending, setIsPending] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [mintAmount, setMintAmount] = useState(1);

  async function claimNFTs() {
    if (account && ethereumProvider) {
      const cost = process.env.NEXT_PUBLIC_WEI_COST;
      const gasLimit = process.env.NEXT_PUBLIC_GAS_LIMIT;
      const totalCostWei = (Number(cost) * mintAmount).toString();
      const totalGasLimit = (Number(gasLimit) * mintAmount).toString();
      setMessage('');
      setIsPending(true);
      try {
        const web3Provider = new ethers.providers.Web3Provider(
          ethereumProvider
        );
        const signer = web3Provider.getSigner();
        const contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
          ABI,
          signer
        );
        const transaction = await contract.mint(mintAmount, {
          value: totalCostWei,
          gasLimit: totalGasLimit.toString(),
        });
        setIsPending(false);
        setIsMinting(true);
        await transaction.wait();
        setIsMinting(false);
        setMessage(
          `Yay! ${mintAmount} ${
            process.env.NEXT_PUBLIC_NFT_SYMBOL
          } successfully sent to ${account.substring(
            0,
            6
          )}...${account.substring(account.length - 4)}`
        );
      } catch (error) {
        setIsPending(false);
      }
    }
  }

  function decrementMintAmount() {
    if (mintAmount > 1) {
      setMintAmount(mintAmount - 1);
    }
  }

  function incrementMintAmount() {
    if (mintAmount < 10) {
      setMintAmount(mintAmount + 1);
    }
  }

  useEffect(() => {
    if (!active) {
      setConnErrMsg('Not connected to your wallet.');
    } else {
      if (chainId?.toString() !== process.env.NEXT_PUBLIC_NETWORK_ID) {
        setConnErrMsg(
          `Change the network to ${
            process.env.NODE_ENV === 'production'
              ? `${process.env.NEXT_PUBLIC_NETWORK_NAME} Mainnet`
              : `${process.env.NEXT_PUBLIC_NETWORK_NAME} Testnet`
          }.`
        );
      } else {
        setConnErrMsg('');
      }
    }
  }, [active, chainId]);

  useEffect(() => {
    async function fetchTotalSupply() {
      const web3Provider = new ethers.providers.Web3Provider(ethereumProvider!);
      const signer = web3Provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
        ABI,
        signer
      );
      setTotalSupply((await contract.totalSupply()).toString());
    }

    if (
      ethereumProvider &&
      chainId?.toString() === process.env.NEXT_PUBLIC_NETWORK_ID
    ) {
      fetchTotalSupply();

      // cleanup
      return () => setTotalSupply('?');
    }
  }, [chainId, ethereumProvider]);

  return (
    <>
      <h2 className="text-4xl mb-4">Minting</h2>

      <div className="space-y-4 mb-4">
        <div className="bg-gray-800 border border-t-red-300 border-r-blue-300 border-b-green-300 border-l-yellow-300 rounded p-8 space-y-4">
          <div className="text-3xl font-bold text-center">
            {totalSupply} / {process.env.NEXT_PUBLIC_MAX_SUPPLY}
          </div>
          <div className="text-center">
            <p className="text-xl">{`${process.env.NEXT_PUBLIC_DISPLAY_COST} ${process.env.NEXT_PUBLIC_CHAIN} per 1 NFT`}</p>
            <p>(excluding gas fees)</p>
          </div>
          <div className="flex justify-center items-center space-x-4">
            <IconContext.Provider value={{ size: '1.5em' }}>
              <button
                type="button"
                className={
                  mintAmount === 1 ? 'text-gray-500 cursor-default' : ''
                }
                onClick={decrementMintAmount}
                disabled={false}
              >
                <FaMinusCircle />
              </button>
              <span className="text-xl">{mintAmount}</span>
              <button
                type="button"
                className={
                  mintAmount === 10 ? 'text-gray-500 cursor-default' : ''
                }
                onClick={incrementMintAmount}
                disabled={false}
              >
                <FaPlusCircle />
              </button>
            </IconContext.Provider>
          </div>

          <div className="flex justify-center">
            {active && !connErrMsg ? (
              <>
                {isPending || isMinting ? (
                  <button
                    type="button"
                    className="flex justify-center items-center rounded px-4 py-2 bg-red-700 font-bold w-40 cursor-not-allowed"
                    disabled
                  >
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {isPending && 'Pending'}
                    {isMinting && 'Minting'}
                    {!isPending && !isMinting && 'Processing'}
                  </button>
                ) : (
                  <button
                    type="button"
                    className={`rounded px-4 py-2 bg-blue-700 hover:bg-blue-600 font-bold w-40`}
                    onClick={claimNFTs}
                  >
                    Mint
                  </button>
                )}
              </>
            ) : (
              <button
                type="button"
                className={`rounded px-4 py-2 bg-gray-700 font-bold w-40 cursor-not-allowed`}
                disabled={true}
                onClick={claimNFTs}
              >
                Mint
              </button>
            )}
          </div>

          {message && (
            <div className="text-green-500 text-center">{message}</div>
          )}
          {connErrMsg && (
            <div className="text-red-500 text-center">{connErrMsg}</div>
          )}
        </div>

        <div className="space-y-4">
          <p>
            Please make sure you are connected to the correct address and the
            correct network (Polygon Mainnet) before purchasing. The operation
            cannot be undone after purchase.
          </p>
          <p>
            We have set the gas limit to 285000 to successfully mint your NFT.
            We recommend that you do not lower the gas limit.
          </p>
        </div>
      </div>
    </>
  );
}
