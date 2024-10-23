import { extendConfig, extendEnvironment } from "hardhat/config";
import { BackwardsCompatibilityProviderAdapter } from "hardhat/internal/core/providers/backwards-compatibility";
import {
  AutomaticGasPriceProvider,
  AutomaticGasProvider,
  FixedGasPriceProvider,
} from "hardhat/internal/core/providers/gas-providers";
import { HttpProvider } from "hardhat/internal/core/providers/http";
import {
  EIP1193Provider,
  HardhatConfig,
  HardhatUserConfig,
  HttpNetworkUserConfig,
} from "hardhat/types";
import { Dispatcher, ProxyAgent, setGlobalDispatcher } from "undici";

import { SinohopeSigner } from "./provider";
import "./type-extensions";

extendConfig(
  (config: HardhatConfig, userConfig: Readonly<HardhatUserConfig>) => {
    const userNetworks = userConfig.networks;
    if (userNetworks === undefined) {
      return;
    }
    for (const networkName in userNetworks) {
      const network = userNetworks[networkName]! as HttpNetworkUserConfig;
      if (network.sinohope) {
        if (
          networkName === "hardhat" ||
          (network.url || "").includes("localhost") ||
          (network.url || "").includes("127.0.0.1")
        ) {
          throw new Error("Sinohope is only supported for public networks.");
        }
        (config.networks[networkName] as HttpNetworkUserConfig).sinohope = {
          note: "Created by Sinohope Hardhat Plugin",
          logTransactionStatusChanges: true,
          ...network.sinohope,
          rpcUrl: network.url,
        };
      }
    }
  }
);

extendEnvironment((hre) => {
  if ((hre.network.config as HttpNetworkUserConfig).sinohope) {
    const httpNetConfig = hre.network.config as HttpNetworkUserConfig;
    const sinohopeW3PConfig = (hre.network.config as HttpNetworkUserConfig)
      .sinohope!;
    let dispatcher: Dispatcher | undefined = undefined;
    if (sinohopeW3PConfig.proxyPath) {
      dispatcher = new ProxyAgent({
        uri: sinohopeW3PConfig.proxyPath!,
        connect: { timeout: 60000 },
      });
      setGlobalDispatcher(dispatcher);
    }
    const eip1193Provider = new HttpProvider(
      httpNetConfig.url!,
      hre.network.name,
      httpNetConfig.httpHeaders,
      httpNetConfig.timeout,
      dispatcher
    );
    let wrappedProvider: EIP1193Provider;
    wrappedProvider = new SinohopeSigner(
      eip1193Provider,
      sinohopeW3PConfig
    );
    wrappedProvider = new AutomaticGasProvider(
      wrappedProvider,
      hre.network.config.gasMultiplier
    );
    if (hre.network.config.gasPrice === undefined || hre.network.config.gasPrice === "auto") {
      wrappedProvider = new AutomaticGasPriceProvider(wrappedProvider);
    } else {
      wrappedProvider = new FixedGasPriceProvider(wrappedProvider, hre.network.config.gasPrice);
    }
    hre.network.provider = new BackwardsCompatibilityProviderAdapter(
      wrappedProvider
    );
  }
});
