import { useCallback, useEffect, useState } from 'react';
import { utils, BigNumber, ContractTransaction } from 'ethers';
import { useMoralis, useWeb3ExecuteFunction } from 'react-moralis';
import { useNotification, Icon, Loading } from 'web3uikit';
import type { TIconType } from 'web3uikit/dist/components/Icon/collection';
import Image from 'next/image';

import BS from "../public/assets/logo.png";

import type {
  IPosition,
  notifyType,
} from 'web3uikit/dist/components/Notification/types';

import ABI from '../config/abi.json';
import contractConfig from '../config/contract-config.json';
import { getContractAddress, checkChainIdIncluded } from '../utils/chain';
import { getProof, checkAllowlisted } from '../utils/allowlist';

type CustomErrors = {
  [key: string]: string;
};

export default function Mint() {
  const { maxSupply, saleType, gasToken, customErrors, chainName } = contractConfig;

  const { isWeb3Enabled, account: account, chainId: chainIdHex } = useMoralis();

  const isAllowlisted = checkAllowlisted(account);
  
  const proof = getProof(account);
  const contractAddress = getContractAddress(chainIdHex);
  const isChainIdIncluded = checkChainIdIncluded(chainIdHex);

  const [saleState, setSaleState] = useState(0);
  const [wlMintPrice, setWlMintPrice] = useState(BigNumber.from(0));
  const [mintPrice, setMintPrice] = useState(BigNumber.from(0));

  const [totalSupply, setTotalSupply] = useState(0);
 
  const dispatch = useNotification();

  // allowlistMint() function
  const {
    fetch: allowlistMint,
    isFetching: isFetchingAM,
    isLoading: isLoadingAM,
  } = useWeb3ExecuteFunction({
    abi: ABI,
    contractAddress: contractAddress,
    functionName: 'hatchAllowedEgg',
    params: {
      proof: proof,
    },
    msgValue: utils
      .parseEther(saleType.allowlistSale.mintPrice)
      .toString(),
  });

  // publicMint() function
  const {
    fetch: publicMint,
    isFetching: isFetchingPM,
    isLoading: isLoadingPM,
  } = useWeb3ExecuteFunction({
    abi: ABI,
    contractAddress: contractAddress,
    functionName: 'hatchPublicEgg',
    params: {
    },
    msgValue: utils
      .parseEther(saleType.publicSale.mintPrice)
      .toString(),
  });

  const { fetch: getSaleState } = useWeb3ExecuteFunction({
    abi: ABI,
    contractAddress: contractAddress,
    functionName: 'getSaleState',
  });

  const { fetch: getPublicPrice } = useWeb3ExecuteFunction({
    abi: ABI,
    contractAddress: contractAddress,
    functionName: 'getPublicPrice',
  });

  const { fetch: getWlMintPrice } = useWeb3ExecuteFunction({
    abi: ABI,
    contractAddress: contractAddress,
    functionName: 'getWlMintPrice',
  });

  const { fetch: getTotalSupply } = useWeb3ExecuteFunction({
    abi: ABI,
    contractAddress: contractAddress,
    functionName: 'totalSupply',
  });

  const updateUiValues = useCallback(async () => {
    //const saleStateFromCall = (await getSaleState()) as number;
    const wlMintPriceFromCall = (await getWlMintPrice()) as BigNumber;
    const MintPriceFromCall = (await getPublicPrice()) as BigNumber;
    const totalSupplyFromCall = (await getTotalSupply()) as BigNumber;
    //setSaleState(saleStateFromCall);
    setWlMintPrice(wlMintPriceFromCall);
    setMintPrice(MintPriceFromCall);
    setTotalSupply(totalSupplyFromCall.toNumber());
  }, [getPublicPrice, getWlMintPrice, getSaleState, getTotalSupply]);

  useEffect(() => {
    if (isWeb3Enabled && isChainIdIncluded) {
      updateUiValues();
      setSaleState(0);
      
      // cleanup
      return () => {
        setSaleState(0);
        setMintPrice(BigNumber.from(0));
        setTotalSupply(0);
      };
    }
  }, [isChainIdIncluded, isWeb3Enabled, updateUiValues]);

  function handleNotification(
    type: notifyType,
    message?: string,
    title?: string,
    icon?: TIconType,
    position?: IPosition
  ) {
    dispatch({
      type,
      message,
      title,
      icon,
      position: position || 'bottomR',
    });
  }

  async function handleOnSuccess(tx: ContractTransaction) {
    await tx.wait(1);
    updateUiValues();
    handleNotification(
      'success',
      'Successfully minted!',
      'Transaction Notification',
      'checkmark'
    );
  }

  function handleErrorMessage(error: Error) {
    const errNames = Object.keys(customErrors);
    const filtered = errNames.filter((errName) =>
      error.message.includes(errName)
    );
    return filtered[0] in customErrors
      ? (customErrors as CustomErrors)[filtered[0]]
      : error.message;
  }

  function handleOnError(error: Error) {
    handleNotification(
      'error',
      handleErrorMessage(error),
      'Transaction Notification',
      'xCircle'
    );
  }

  async function mint() {
    if (saleState === 0) return;
    if (saleState === 1) {
      await allowlistMint({
        onSuccess: async (tx) =>
          await handleOnSuccess(tx as ContractTransaction),
        onError: (error) => handleOnError(error),
      });
    }
    if (saleState === 2) {
      await publicMint({
        onSuccess: async (tx) =>
          await handleOnSuccess(tx as ContractTransaction),
        onError: (error) => handleOnError(error),
      });
    }
  }

  return (
    <>

      <div className="border border-t-red-300 border-r-blue-300 border-b-green-300 border-l-yellow-300 rounded p-8">
        <div className="flex justify-around border-b border-gray-700 pb-8">
          <div className="space-y-1">
            <div className="text-gray-400 text-center">Minted</div>
            <div className="text-lg sm:text-2xl">
              <span className="text-red-500 text-center">{totalSupply}</span> / {maxSupply}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-gray-400 text-center ">Sale Status</div>
            <div className="text-lg text-center sm:text-2xl">
              {saleState === 0 && 'Closed'}
              {saleState === 1 && 'Allowlist Only'}
              {saleState === 2 && 'Public Open'}
            </div>
          </div>
          
        </div>

      
        {saleState === 0 || (saleState === 1 && !isAllowlisted) ? (
          <div className="mt-3">
            <Icon fill="#fff" size={64} svg="lockClosed" />
          </div>
        ) : (
          <div className="pt-8 space-y-4">  

            
              {saleState === 1 ? (
                <div className="text-center text-lg">
              <span className="text-gray-400">Price:</span>{' '}
              {utils.formatEther(wlMintPrice)} {gasToken}
              </div>
              ) : (
                <div className="text-center text-lg">
                <span className="text-gray-400">Price:</span>{' '}
              {utils.formatEther(mintPrice)} {gasToken}
              </div>
              )}
            

            <div>
              {isFetchingAM || isLoadingAM || isFetchingPM || isLoadingPM ? (
                <button
                  type="button"
                  className="flex justify-center rounded px-4 py-2 w-full bg-blue-800 cursor-not-allowed"
                  disabled
                >
                  <Loading size={24} spinnerColor="#fff" />
                </button>
              ) : (
                <button
                  type="button"
                  className={`rounded px-4 py-2 font-bold w-full ${
                    !isWeb3Enabled || !isChainIdIncluded
                      ? 'bg-gray-700 cursor-not-allowed'
                      : 'bg-blue-700 hover:bg-blue-600'
                  }`}
                  disabled={!isWeb3Enabled || !isChainIdIncluded}
                  onClick={mint}
                >
                  Mint
                </button>
              )}
            </div>
          </div>
        )}
        {!isWeb3Enabled && (
          <div className="text-red-500 text-center mt-4">
            Not connected to your wallet!
          </div>
        )}
        {isWeb3Enabled && !isChainIdIncluded && (
          <div className="text-red-500 text-center mt-4">
            Switch to {chainName}
          </div>
        )}
        {isWeb3Enabled && isChainIdIncluded && saleState === 0 && (
          <div className="text-red-500 text-center mt-4">
            Sales are closed now.
          </div>
        )}

        {isWeb3Enabled &&
          isChainIdIncluded &&
          (saleState === 0 || saleState === 1) &&
          !isAllowlisted && (
            <div className="text-red-500 text-center mt-4">
              Address is not whitelisted.
            </div>
          )}

          {isWeb3Enabled &&
          isChainIdIncluded &&
          saleState === 0 &&
          isAllowlisted && (
            <div className="text-green-500 text-center mt-4">
              Address is whitelisted.
            </div>
          )}
      </div>
    </>
  );
}
