"use client";

import ChainInfo from "@/components/chain-info";
import Header from "@/components/header";
import SearchAndToggle from "@/components/search-and-toggle";
import { ModeContext } from "@/context/ModeContext";
import { PaginationContext } from "@/context/PaginationContext";
import { SearchContext } from "@/context/SearchContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { LuLoaderCircle } from "react-icons/lu";
import { Chain } from "viem/chains";

export default function Home() {
  const { chains } = useContext(ModeContext);
  const { search } = useContext(SearchContext);
  const { page, setPage } = useContext(PaginationContext);
  const [maxPage, setMaxPage] = useState<number>(0);
  const [startIndex, setStartIndex] = useState<number>(0);
  const CHAINS_IN_A_PAGE = 50;
  const router = useRouter();

  useEffect(
    function () {
      if (chains) {
        const length = chains.length;
        const batchesOfChains = Number((length / CHAINS_IN_A_PAGE).toFixed(0));
        if (batchesOfChains > 0) setMaxPage(batchesOfChains - 1);
      }
    },
    [chains],
  );

  function setPrevPage() {
    if (page > 0) {
      const prevPage = page - 1;
      setPage(prevPage);
      setStartIndex(prevPage * CHAINS_IN_A_PAGE);
      router.push("#top");
    }
  }

  function setNextPage() {
    const nextPage = page + 1;
    const startIndexOfNextPage = nextPage * CHAINS_IN_A_PAGE;
    if (chains!.length > startIndexOfNextPage) {
      setPage(nextPage);
      setStartIndex(nextPage * CHAINS_IN_A_PAGE);
      router.push("#top");
    }
  }

  return (
    <>
      <Header />
      <SearchAndToggle />

      <div className="w-full px-1 py-2 mt-2 inline-flex flex-wrap gap-y-2 gap-x-1">
        {chains !== null ? (
          chains.length != 0 ? (
            chains
              .slice(startIndex, startIndex + CHAINS_IN_A_PAGE)
              .map(function (chain: Chain, key: number) {
                return <ChainInfo chain={chain} key={key} />;
              })
          ) : (
            <div className="w-full p-20 flex justify-center items-center">
              <b>No chains found{search ? ` for ${search}.` : "."}</b>
            </div>
          )
        ) : (
          <div className="w-full p-20 flex justify-center items-center">
            <LuLoaderCircle className="loader text-3xl" />
          </div>
        )}
      </div>

      <div className="mt-3 w-full flex justify-between items-center">
        <button
          className="py-5 w-[49%] tracking-wide bg-div-bg border-border border-1 rounded-lg text-center text-sm hover:bg-border"
          onClick={setPrevPage}
          disabled={page == 0}
          style={
            page == 0
              ? { opacity: "0.5", cursor: "not-allowed" }
              : { cursor: "pointer" }
          }
        >
          Previous
        </button>

        <button
          className="py-5 w-[49%] tracking-wide bg-div-bg border-border border-1 rounded-lg text-center text-sm hover:bg-border"
          onClick={setNextPage}
          disabled={page == maxPage}
          style={
            page == maxPage
              ? { opacity: "0.5", cursor: "not-allowed" }
              : { cursor: "pointer" }
          }
        >
          Next
        </button>
      </div>
    </>
  );
}
