import { ChainData, ChainImageAndShortName } from "@/types/chain-img-name";
import { Chain } from "viem";

export async function parseChainData(id: number): Promise<ChainData> {
  const defaultData: ChainData = {
    img: "/chain.svg",
    shortName: "",
  };

  const chainIcon = await getChainIcon(id);

  if (!chainIcon) {
    return defaultData;
  }

  const url = await getChainLogoIPFSLink(chainIcon);

  if (!url) {
    return defaultData;
  }

  return {
    img: url,
    shortName: "",
  };
}

export async function parseMultipleChainData(
  chains: Chain[],
): Promise<ChainImageAndShortName> {
  const parsedData: ChainImageAndShortName = {};
  const promises = chains.map(async function (chain: Chain) {
    parsedData[chain.id] = await parseChainData(chain.id);
  });
  await Promise.all(promises);
  return parsedData;
}

async function getChainIcon(id: number): Promise<string> {
  const chainJsonURL = `https://raw.githubusercontent.com/ethereum-lists/chains/refs/heads/master/_data/chains/eip155-${id}.json`;

  try {
    const chainJsonReq = await fetch(chainJsonURL);
    const chainJsonRes = await chainJsonReq.json();

    const chainIcon = chainJsonRes.icon;
    return chainIcon;
  } catch {
    return "";
  }
}

async function getChainLogoIPFSLink(icon: string): Promise<string> {
  const chainIconURL = `https://raw.githubusercontent.com/ethereum-lists/chains/refs/heads/master/_data/icons/${icon}.json`;

  try {
    const chainIconReq = await fetch(chainIconURL);
    const chainIconRes = await chainIconReq.json();
    if (chainIconRes.length == 0) return "";
    const [{ url }] = chainIconRes;
    if (!url) return "";
    return `https://ipfs.io/ipfs/${url.slice(7, url.length)}`;
  } catch {
    return "";
  }
}
