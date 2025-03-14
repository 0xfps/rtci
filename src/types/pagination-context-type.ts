import { Dispatch, SetStateAction } from "react";

export type PaginationContextType = {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
};
