import * as allChains from "viem/chains";

const chains = [];

for (const chain in allChains) {
  // @ts-ignore
  const currentChain = allChains[chain];

  if (!currentChain.testnet) {
    chains.push(currentChain);
  }
}

export const MAINNET_CHAINS: allChains.Chain[] = chains;
