"use client";
import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden pb-[500px] pt-[200px]">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
              Unleash the power of <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none text-emerald-700">
                Verifiable Claims
              </span>
            </h1>
          </>
        }
      >
        <img
          src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=3111&auto=format&fit=crop"
          alt="hero"
          className="mx-auto rounded-2xl object-cover h-full object-center w-full"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}
