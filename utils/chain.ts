import contractConfig from '../config/contract-config.json';

type ContractAddresses = {
  [key: string]: string[];
};

const { contractAddresses, chainIDConfig } = contractConfig;

export function parseChainId(chainIdHex: string | null) {
  return parseInt(chainIdHex ?? '').toString();
}

export function getContractAddress(chainIdHex: string | null) {
  const chainId = parseChainId(chainIdHex);
  return (contractAddresses as ContractAddresses)[chainId]?.at(-1);
}

export function checkChainIdIncluded(chainIdHex: string | null) {
  const chainId = parseChainId(chainIdHex);
  return chainIDConfig === chainId;
}
