const ENDPOINT_RINKEBY = `https://rinkeby.infura.io/v3/${process.env.infuraKey}`;
const ENDPOINT_POLYGON = 'https://polygon-rpc.com';
export const RPC_URL =
  process.env.NODE_ENV === 'production' ? ENDPOINT_POLYGON : ENDPOINT_RINKEBY;
