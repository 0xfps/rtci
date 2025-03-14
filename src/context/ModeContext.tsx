"use client";

import { ChainMode, ModeContextInterface } from "@/types/mode-context-type";
import { Props } from "@/types/props";
import { MAINNET_CHAINS } from "@/utils/mainnet-chains";
import { TESTNET_CHAINS } from "@/utils/testnet-chains";
import { createContext, useContext, useEffect, useState } from "react";
import { Chain } from "viem";
import { SearchContext } from "./SearchContext";
import { PaginationContext } from "./PaginationContext";
import { ChainImageAndShortName } from "@/types/chain-img-name";
import { parseMultipleChainData } from "@/utils/chain-parser";
import Loading from "@/app/loading";

const initialContext: ModeContextInterface = {
  mode: "all",
  chains: [],
  chainData: {},
  setMode: () => {},
};

export const ModeContext = createContext<ModeContextInterface>(initialContext);

export default function ModeContextProvider({ children }: Props) {
  const [mode, setMode] = useState<ChainMode>("mainnet");
  const [chainData, setChainData] = useState<ChainImageAndShortName>({});
  const [chains, setChains] = useState<Chain[] | null>(null);
  const [ready, setReady] = useState<boolean>(false);
  const [allChains, setAllChains] = useState<Chain[]>([]);
  const { search } = useContext(SearchContext);
  const { setPage } = useContext(PaginationContext);

  useEffect(function () {
    const chainMode = localStorage.getItem("mode") as ChainMode;
    if (chainMode && chainMode == "all") {
      setMode(chainMode);
    }
  }, []);

  useEffect(function () {
    parse();
  }, []);

  async function parse() {
    const storedData = localStorage.getItem("imgs");

    if (storedData) {
      setChainData(JSON.parse(storedData));
    } else {
      const data = await parseMultipleChainData([
        ...MAINNET_CHAINS,
        ...TESTNET_CHAINS,
      ]);

      localStorage.setItem("imgs", JSON.stringify(data));
      setChainData(data);
    }
    setReady(true);
  }

  // A certain bug for `chains` not populating when mode is switched and page refreshed
  // is fixed by this `useEffect`.
  useEffect(
    function () {
      setChains(allChains);
    },
    [allChains],
  );

  useEffect(
    function () {
      if (mode == "all") {
        const sortedAllChains = sortChains([
          ...MAINNET_CHAINS,
          ...TESTNET_CHAINS,
        ]);

        if (!search) {
          setAllChains(sortedAllChains);
          setChains(sortedAllChains);
        } else {
          const filteredChains = searchFor(search, sortedAllChains);
          setPage(0);
          setChains(filteredChains);
        }
      } else {
        const sortedMainnetChains = sortChains(MAINNET_CHAINS);

        if (!search) {
          setAllChains(sortedMainnetChains);
          setChains(sortedMainnetChains);
        } else {
          const filteredChains = searchFor(search, sortedMainnetChains);
          setPage(0);
          setChains(filteredChains);
        }
      }
    },
    [mode],
  );

  useEffect(
    function () {
      if (!search) {
        setChains(allChains);
        return;
      }

      if (chains) {
        const filteredChains = searchFor(search, allChains);
        setPage(0);
        setChains(filteredChains);
      }
    },
    [search],
  );

  function searchFor(search: string, chains: Chain[]): Chain[] {
    const searchTerm = search.toLowerCase();
    const filteredChains = chains.filter(function (chain) {
      return (
        chain.name.toLowerCase().includes(searchTerm) ||
        chain.id.toString().includes(searchTerm)
      );
    });
    return filteredChains;
  }

  function sortChains(chains: Chain[]): Chain[] {
    const sortedChains = chains.sort(function (chain1: Chain, chain2: Chain) {
      return chain1.id - chain2.id;
    });

    return sortedChains;
  }

  return ready ? (
    <ModeContext.Provider value={{ mode, chains, setMode, chainData }}>
      {children}
    </ModeContext.Provider>
  ) : (
    <div className="w-screen h-screen bg-body-bg">
      <Loading />
    </div>
  );
}
