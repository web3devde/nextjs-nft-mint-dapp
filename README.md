# [Next.js](https://nextjs.org/) NFT Mint dApp

A simple, fast and modern dApp for minting NFTs.

Just set up some configurations and add your own **ABI**.

The actual dApp is here: [Skulls In Love](https://www.skullsin.love/)

## Usage

1. Clone this project:

```sh
git clone https://github.com/kjmczk/nextjs-nft-mint-dapp.git
```

2. Change into the directory:

```sh
cd nextjs-nft-mint-dapp
```

3. Install the dependencies:

```sh
npm install
```

4. Get Infura API key

https://infura.io/

5. Copy the `.env.local.example` file to `.env.local`:

```sh
cp .env.local.example .env.local
```

Then set your Infura KEY (PROJECT ID) to `INFURA_KEY` in `.env.local`.

6. Set up some configurations:

Set the values of environment variables in the `.env.development`, `.env.production`, and `.env` files to yours.

> This dApp is by default using **Rinkeby Testnet** for development and **Polygon Mainnet** for production. If you want to use other networks (**Ethereum Mainnet**, **Polygon Mumbai**, etc.), edit the `utils/constants.ts`, `.env.development` and `.env.production` files.

7. Add your **ABI**:

Copy your contract **ABI** from the [Remix](https://remix.ethereum.org/) and paste it into `contract/abi.json`.

See the [Remix documentation](https://remix-ide.readthedocs.io/en/latest/run.html) for how to generate an ABI.

8. Run the server:

```sh
npm run dev
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

> If you deploy to a hosting provider other than Vercel, I cannot guarantee that this dApp will work properly.

