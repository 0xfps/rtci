import { Dispatch, SetStateAction } from "react";
import { Chain } from "viem";
import { ChainImageAndShortName } from "./chain-img-name";

export type ChainMode = "all" | "mainnet";

export interface ModeContextInterface {
  mode: ChainMode;
  setMode: Dispatch<SetStateAction<ChainMode>>;
  chainData: ChainImageAndShortName;
  chains: Chain[] | null;
}
