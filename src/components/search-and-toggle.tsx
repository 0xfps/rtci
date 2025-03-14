"use client";

import { ModeContext } from "@/context/ModeContext";
import { SearchContext } from "@/context/SearchContext";
import { ChainMode } from "@/types/mode-context-type";
import { ChangeEvent, useContext } from "react";
import { FaToggleOff, FaToggleOn } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";

export default function SearchAndToggle() {
  const { mode, setMode } = useContext(ModeContext);
  const { search, setSearch } = useContext(SearchContext);

  function toggle() {
    if (mode == "all") {
      setMode("mainnet");
      updateLocalStorage("mainnet");
    }

    if (mode == "mainnet") {
      setMode("all");
      updateLocalStorage("all");
    }
  }

  function updateLocalStorage(newMode: ChainMode) {
    if (localStorage) {
      localStorage.setItem("mode", newMode);
    }
  }

  return (
    <div className="flex flex-wrap mt-2">
      <div
        className="w-12/12 md:w-3/12 2xl:w-2/12 flex items-center p-1 cursor-pointer"
        onClick={toggle}
      >
        {mode == "all" ? (
          <FaToggleOn className="text-2xl text-amber-500" />
        ) : (
          <FaToggleOff className="text-2xl text-green-500" />
        )}
        <span className="ml-2 text-sm"> Include Testnet</span>
      </div>

      <div className="w-12/12 md:w-9/12 2xl:w-10/12 p-1 relative mt-1 md:mt-0 flex items-center">
        <FiSearch className="absolute m-auto ml-2" />
        <input
          type="text"
          placeholder="Search by name or chain ID"
          className="h-[30px] w-full text-md md:text-sm border-1 border-border bg-div-bg tracking-wide rounded-lg py-5 pl-8 outline-none text-bright"
          value={search}
          onChange={function (e: ChangeEvent<HTMLInputElement>) {
            setSearch(e.target.value);
          }}
        />
      </div>
    </div>
  );
}
