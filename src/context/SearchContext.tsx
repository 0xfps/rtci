"use client";

import { Props } from "@/types/props";
import { SearchContextType } from "@/types/search-context-types";
import { createContext, useState } from "react";

export const SearchContext = createContext<SearchContextType>({
  search: "",
  setSearch: () => { },
});

export default function SearchContextProvider({ children }: Props) {
  const [search, setSearch] = useState("");

  return (
    <SearchContext.Provider value={{ search, setSearch }}>
      {children}
    </SearchContext.Provider>
  );
}
