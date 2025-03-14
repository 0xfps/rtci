"use client";

import { Props } from "@/types/props";

export default function PageLayout({ children }: Props) {
  return (
    <div className="w-screen min-h-screen bg-body-bg p-2 sm:p-2 md:p-3 lg:p-4 xl:p-5 text-bright">
      <div className="sm:w-[95%] md:w-[80%] lg:w-[70%] xl:w-[60%] py-2 m-auto">
        {children}
      </div>
    </div>
  );
}
