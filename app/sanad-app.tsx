"use client";

import dynamic from "next/dynamic";

const DynamicApp = dynamic(
  () => import("../src/App").then((mod) => mod.App),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#2d6a4f]/20 border-t-[#2d6a4f] rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-[#2e3230]">Loading SANAD...</span>
        </div>
      </div>
    ),
  }
);

export default function SanadApp() {
  return <DynamicApp />;
}
