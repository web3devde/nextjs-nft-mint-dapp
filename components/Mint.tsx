import { useCallback, useEffect, useState } from 'react';
import { utils, BigNumber, ContractTransaction } from 'ethers';
import { useMoralis, useWeb3ExecuteFunction } from 'react-moralis';
import { useNotification, Icon, Loading } from 'web3uikit';
import type { TIconType } from 'web3uikit/dist/components/Icon/collection';

import { IconContext } from 'react-icons';
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa';

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

  const [mintAmount, setMintAmount] = useState(1);
  
  const proof = getProof(account);
  const contractAddress = getContractAddress(chainIdHex);
  const isChainIdIncluded = checkChainIdIncluded(chainIdHex);

  const [saleState, setSaleState] = useState(0);
  const [wlMintPrice, setWlMintPrice] = useState(BigNumber.from(0));
  const [mintPrice, setMintPrice] = useState(BigNumber.from(0));
  const [publicMintLimit, setPublicMintLimit] = useState(0);
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
    functionName: 'allowMint',
    params: {
      numberOfTokens:mintAmount, 
      proof: proof,
    },
    msgValue: utils
      .parseEther(saleType.allowlistSale.mintPrice)
      .mul(mintAmount)
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
    functionName: 'publicMint',
    params: {
      numberOfTokens:mintAmount,
    },
    msgValue: utils
      .parseEther(saleType.publicSale.mintPrice)
      .mul(mintAmount)
      .toString(),
  });

  const { fetch: getMintingState } = useWeb3ExecuteFunction({
    abi: ABI,
    contractAddress: contractAddress,
    functionName: 'getMintingState',
  });

  const { fetch: getPublicPrice } = useWeb3ExecuteFunction({
    abi: ABI,
    contractAddress: contractAddress,
    functionName: 'getPublicPrice',
  });

  const { fetch: getWlPrice } = useWeb3ExecuteFunction({
    abi: ABI,
    contractAddress: contractAddress,
    functionName: 'getWlPrice',
  });

  const { fetch: getTotalSupply } = useWeb3ExecuteFunction({
    abi: ABI,
    contractAddress: contractAddress,
    functionName: 'totalSupply',
  });

  const { fetch: getPublicMintLimit } = useWeb3ExecuteFunction({
    abi: ABI,
    contractAddress: contractAddress,
    functionName: 'getPublicMintLimit',
  });

  const updateUiValues = useCallback(async () => {
    const saleStateFromCall = (await getMintingState()) as number;
    //const wlMintPriceFromCall = (await getWlPrice()) as BigNumber;
    const MintPriceFromCall = (await getPublicPrice()) as BigNumber;
    const totalSupplyFromCall = (await getTotalSupply()) as BigNumber;
    const publicMintLimitFromCall = (await getPublicMintLimit()) as number;
     
    setSaleState(saleStateFromCall);
    //setWlMintPrice(wlMintPriceFromCall);
    setMintPrice(MintPriceFromCall);
    setTotalSupply(totalSupplyFromCall.toNumber());
    setPublicMintLimit(publicMintLimitFromCall);
  }, [getPublicPrice, getWlPrice, getMintingState, getTotalSupply, getPublicMintLimit]);

  useEffect(() => {
    if (isWeb3Enabled && isChainIdIncluded) {
      updateUiValues();
      //setSaleState(2);
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

  function decrementMintAmount() {
    if (mintAmount > 1) {
      setMintAmount(mintAmount - 1);
    }
  }

  function incrementMintAmount() {
    if (mintAmount < publicMintLimit) {
      setMintAmount(mintAmount + 1);
    }
  }

  return (
    <>

      <div className="border border-t-red-300 border-r-blue-300 border-b-green-300 border-l-yellow-300 rounded p-20
      bg-gradient-to-r from-slate-500 to-black">
        <div className="flex justify-around border-b border-gray-700 pb-8">
          <div className="space-y-1">
            <div className="text-[#fdba74] text-center">Minted</div>
            <div className="text-lg sm:text-2xl">
              <span className="text-green-500 text-center">{totalSupply}</span> / {maxSupply}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[#fdba74] text-center ">Sale Status</div>
            <div className="text-lg text-center sm:text-2xl">
              {saleState === 0 && 'Closed'}
              {saleState === 1 && 'Allowlist Only'}
              {saleState === 2 && 'Public Open'}
              {totalSupply === maxSupply && 'SOLD OUT'}
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
              <span className="text-cyan-200">Price:</span>{' '}
              {0.0099} {gasToken}
              </div>
              ) : (
                <div className="text-center text-lg">
                <span className="text-cyan-400">Price:</span>{' '}
              {0.0099} {gasToken}
              </div>
              )}
            
            {saleState === 2 ? (
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
                  mintAmount === 2 ? 'text-gray-500 cursor-default' : ''
                }
                onClick={incrementMintAmount}
                disabled={false}
              >
                <FaPlusCircle />
              </button>
            </IconContext.Provider>
          </div>
            ) : (<div className="flex justify-center items-center space-x-4"> </div>)}
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
            Sales is not live.
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
