# Sinohope Hardhat Plugin

This is a [Hardhat](https://hardhat.org/) plugin for integrating with [Sinohope](https://www.sinohope.com/).

This plugin will help you to seamlessly integrate Sinohope into your Hardhat development stack.

You can use it to deploy contracts and sign transactions and messages.

## Installation

```bash
npm install @sinohope/hardhat-sinohope
```

Import the plugin in your `hardhat.config.js`:

```js
require("@sinohope/hardhat-sinohope");
const { ApiBaseUrl, ChainSymbol } = require("@sinohope/sinohope-web3-provider");
```

Or if you are using TypeScript, in your `hardhat.config.ts`:

```ts
import "@sinohope/hardhat-sinohope";
import { ApiBaseUrl, ChainSymbol } from "@sinohope/sinohope-web3-provider";
```

## Configuration

This plugin extends the `HttpNetworkUserConfig` object with an optional
`sinohope` field.

This is an example of how to set it:

```js
module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: "https://rpc.sepolia.org",
      sinohope: {
        // apiBaseUrl: ApiBaseUrl.Sandbox, // If using a sandbox workspace
        chainSymbol: ChainSymbol.SEPOLIA,
        privateKey: process.env.SINOHOPE_API_PRIVATE_KEY!,
        publicKey: process.env.SINOHOPE_API_PUBLIC_KEY!,
        vaultWalletIds: process.env.SINOHOPE_VAULT_WALLET_IDS,
      }
    },
  },
};
```

## Usage
Now, you can use the network configured with the sinohope parameters normally.

```
import { ethers } from "hardhat";
const [account] = await ethers.getSigners();
console.log("Current Account Address:", account.address);
```
