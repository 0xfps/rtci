import * as allChains from "viem/chains";

const chains = [];

for (const chain in allChains) {
  // @ts-ignore
  const currentChain = allChains[chain];

  if (currentChain.testnet) {
    chains.push(currentChain);
  }
}

export const TESTNET_CHAINS: allChains.Chain[] = chains;
