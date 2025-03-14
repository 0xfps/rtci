import { PaginationContextType } from "@/types/pagination-context-type";
import { Props } from "@/types/props";
import { createContext, useState } from "react";

const initialContext: PaginationContextType = {
  page: 0,
  setPage: () => {},
};

export const PaginationContext =
  createContext<PaginationContextType>(initialContext);

export default function PaginationContextProvider({ children }: Props) {
  const [page, setPage] = useState<number>(0);

  return (
    <PaginationContext.Provider value={{ page, setPage }}>
      {children}
    </PaginationContext.Provider>
  );
}
