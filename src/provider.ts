import { ProviderWrapperWithChainId } from "hardhat/internal/core/providers/chainId";
import { EIP1193Provider, RequestArguments } from "hardhat/types";
import { SinohopeWeb3Provider, SIGNER_METHODS, SinohopeProviderConfig } from "@sinohope/sinohope-web3-provider";

export class SinohopeSigner extends ProviderWrapperWithChainId {
  private _sinohopeWeb3Provider: SinohopeWeb3Provider | undefined;

  constructor(provider: EIP1193Provider, sinohopeConfig: SinohopeProviderConfig) {
    super(provider);
    this._sinohopeWeb3Provider = new SinohopeWeb3Provider(sinohopeConfig);
  }

  public async request(args: RequestArguments): Promise<unknown> {
    if (SIGNER_METHODS.includes(args.method)) {
      return this._sinohopeWeb3Provider!.request(args);
    }

    return this._wrappedProvider.request(args);
  }
}
