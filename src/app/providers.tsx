"use client";

import ModeContextProvider from "@/context/ModeContext";
import PaginationContextProvider from "@/context/PaginationContext";
import SearchContextProvider from "@/context/SearchContext";
import { Props } from "@/types/props";

export default function Providers({ children }: Props) {
  return (
    <PaginationContextProvider>
      <SearchContextProvider>
        <ModeContextProvider>{children}</ModeContextProvider>
      </SearchContextProvider>
    </PaginationContextProvider>
  );
}
