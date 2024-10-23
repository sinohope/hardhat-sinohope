import "hardhat/types/config";
import { SinohopeProviderConfig } from "@sinohope/sinohope-web3-provider";

declare module "hardhat/types/config" {
  interface HttpNetworkUserConfig {
    sinohope?: SinohopeProviderConfig;
  }

  interface HttpNetworkConfig {
    sinohope?: SinohopeProviderConfig;
  }
}
