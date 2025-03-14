"use client";

import Image from "next/image";
import { icon } from "../../public";
import { FaGithubAlt, FaXTwitter } from "react-icons/fa6";

export default function Header() {
  return (
    <div
      id="top"
      className="w-full h-fit p-6 border-border bg-div-bg border-1 flex flex-wrap items-center rounded-[20px]"
    >
      <div className="w-3/12 md:w-2/12 lg:w-1/12 flex justify-center h-fit shrink-0">
        <Image
          src={icon}
          alt="Icon"
          width={50}
          height={50}
          className="p-2 border-dim border-1 rounded-full cursor-pointer"
        />
      </div>
      <div className="w-9/12 md:w-7/12 lg:w-8/12 h-fit">
        <b className="text-2xl">RTCI</b>
        <p className="text-dim text-sm">Real Time Chain Information</p>
      </div>
      <div className="w-12/12 md:w-3/12 lg:w-3/12 flex justify-end items-center mt-3 lg:mt-0 gap-2">
        <a
          href="https://twitter.com/0xfps"
          target="_blank"
          className="bg-[#0090FF] px-7 py-2 w-full lg:w-fit rounded-sm tracking-wide text-sm flex items-center gap-1 justify-center"
        >
          <FaXTwitter /> Twitter
        </a>

        <a
          href="https://github.com/0xfps"
          target="_blank"
          className="bg-body-bg border-border border-1 px-7 py-2 w-full lg:w-fit rounded-sm tracking-wide text-sm gap-1 flex items-center justify-center"
        >
          <FaGithubAlt /> GitHub
        </a>
      </div>
    </div>
  );
}
