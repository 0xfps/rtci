"use client";

import { ModeContext } from "@/context/ModeContext";
import { ChainInfoProps } from "@/types/chain-info-props";
import commaNumber from "comma-number";
import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";
import { FaCheck, FaCopy, FaGasPump } from "react-icons/fa6";
import { IoMdGlobe } from "react-icons/io";
import { MdOutlineArrowOutward } from "react-icons/md";
import { SiPointy } from "react-icons/si";
import { TbBlocks } from "react-icons/tb";

type GREEN = "#00C950";
type RED = "#FB2C36";
type Colour = GREEN | RED;

export default function ChainInfo({ chain }: ChainInfoProps) {
  const INTERVAL = 5_000;
  const TIMEOUT = 2_000;
  // https://min-api.cryptocompare.com/data/price?fsym=UNI&tsyms=USD
  const BASE_URL = "https://min-api.cryptocompare.com/data/price?fsym=";
  const END_URL = "&tsyms=USD";

  const [provider, setProvider] = useState<ethers.JsonRpcProvider | null>(null);
  const [gasPrice, setGasPrice] = useState<number>(0);
  const [blockNumber, setBlockNumber] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [colour, setColour] = useState<Colour>("#00C950");
  const [copied, setCopied] = useState<string>("");

  const { chainData } = useContext(ModeContext);

  const { id, name } = chain;
  const website = chain.blockExplorers?.default.url;
  const [rpc] = chain.rpcUrls.default.http;
  const symbol = chain.nativeCurrency.symbol;

  useEffect(function () {
    setupProvider();
  }, []);

  useEffect(
    function () {
      if (provider) {
        fetchGasPrice();
        getBlockNumber();
        getPrice();
      }
    },
    [provider],
  );

  function setupProvider() {
    const provider = new ethers.JsonRpcProvider(rpc);
    setProvider(provider);
  }

  async function fetchGasPrice() {
    if (provider) {
      try {
        const feeData = await provider.getFeeData();
        const gasPrice = Number(feeData.gasPrice) / 1e9;
        setGasPrice(Number(gasPrice.toFixed(2)));
      } catch {
        setGasPrice(0);
      }
    }
  }

  async function getBlockNumber() {
    if (provider) {
      const blockNumber = await provider.getBlockNumber();
      setBlockNumber(blockNumber);
    }
  }

  async function getPrice() {
    const URL = `${BASE_URL}${symbol}${END_URL}`;
    const oldPrice = getOldPrice();

    try {
      const req = await fetch(URL);
      const res = await req.json();
      if (res && res.USD) {
        setPrice(Number(res.USD.toFixed(5)));
      } else {
        setPrice(oldPrice);
      }
    } catch {
      setPrice(oldPrice);
    }
  }

  useEffect(
    function () {
      const oldPrice = getOldPrice();
      const colour: Colour = price > oldPrice ? "#00C950" : "#FB2C36";
      setColour(colour);

      const storage = getStorage();
      const newStorage = JSON.stringify({
        ...storage,
        [id]: price.toString(),
      });
      localStorage.setItem(`prices`, newStorage);
    },
    [price],
  );

  function getOldPrice(): number {
    const oldPriceCache = getStorage()[id];
    let oldPrice;

    if (!oldPriceCache) oldPrice = 0;
    else if (isNaN(parseFloat(oldPriceCache!))) oldPrice = 0;
    else oldPrice = parseFloat(oldPriceCache!);

    return oldPrice;
  }

  function getStorage() {
    const storage = localStorage.getItem("prices");
    if (!storage) return {};
    else return JSON.parse(storage);
  }

  useEffect(function () {
    const interval = setInterval(async function () {
      fetchGasPrice();
      getBlockNumber();
      getPrice();
    }, INTERVAL);

    return function () {
      clearInterval(interval);
    };
  }, []);

  async function copyRPC() {
    await navigator.clipboard.writeText(rpc);
    setCopied("copied");
  }

  useEffect(
    function () {
      if (!copied) return;

      const t = setTimeout(function () {
        setCopied("");
      }, TIMEOUT);

      return function () {
        clearTimeout(t);
      };
    },
    [copied],
  );

  return (
    <div className="w-[100%] md:w-[49.5%] lg:w-[32.9%] 2xl:w-[24.5%] h-fit py-2 bg-div-bg border-1 border-border rounded-lg">
      <div className="border-b-border border-b-1 h-[80px]">
        <div className="w-full h-full px-4 pt-2 pb-4 flex">
          <div className="border-border border-1 rounded-lg p-2 w-[50px] h-[50px] bg-border flex justify-center items-center shrink-0">
            <img src={chainData[id].img} alt={""} width={25} height={25} />
          </div>
          <div className="ml-3 tracking-wide">
            <div className="flex items-center">
              <b style={name.length >= 20 ? { fontSize: "12px" } : {}}>
                {name}
              </b>
            </div>
            <div className="flex items-center">
              <p className="text-dim text-sm">{id}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-4 px-2 flex justify-between">
        <div className="w-[49.5%] h-fit border-border border-1 rounded-lg">
          <div className="text-xs flex items-center p-2">
            <FaGasPump />
            <span className="ml-2">{commaNumber(gasPrice)} G</span>
          </div>
          <div className="text-xs flex items-center p-2">
            <TbBlocks />
            <span className="ml-2">{commaNumber(blockNumber)}</span>
          </div>
          <div className="text-xs flex items-center p-2">
            <SiPointy />
            <div
              className="ml-2 w-fit cursor-pointer py-1 px-2 tracking-wide bg-div-bg border-border border-1 rounded-md hover:bg-border"
              onClick={copyRPC}
            >
              {copied ? (
                <FaCheck />
              ) : (
                <span className="flex items-center">
                  <FaCopy /> <span className="ml-1">RPC</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="w-[49.5%] border-border border-1 rounded-lg flex flex-col justify-center items-center relative">
          <span className="absolute top-1 left-1 text-[10px] py-0.5 px-2 tracking-wide bg-div-bg border-border border-1 rounded-md">
            Token Price
          </span>
          <b className="text-[1.2rem] font-bold" style={{ color: `${colour}` }}>
            ${commaNumber(price)}
          </b>
          <span className="absolute bottom-1 text-xs py-1 px-2 tracking-wider bg-div-bg border-border border-1 rounded-md">
            ${symbol}
          </span>
        </div>
      </div>

      <div className="px-2 pt-2 border-t-border border-t-1">
        <a
          href={website}
          target="_blank"
          className="text-xs p-1.5 tracking-wide bg-div-bg border-border border-1 rounded-lg flex w-fit items-center hover:bg-border"
        >
          <IoMdGlobe />
          <span className="ml-1">Explorer</span>
          <MdOutlineArrowOutward className="ml-1" />
        </a>
      </div>
    </div>
  );
}
