import Image from "next/image";
import type { LucideIcon } from "lucide-react";

// Page title banner with the Dubai skyline fading in on the right.
export function PageHeader({ icon: Icon, title, subtitle }: { icon: LucideIcon; title: string; subtitle: string }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#ECEFEA] bg-gradient-to-r from-white via-white to-[#FBF3EA]">
      <div className="absolute inset-y-0 right-0 w-1/2 opacity-60 pointer-events-none">
        <Image
          src="/ui/01_header_skyline_banner.jpg"
          alt=""
          fill
          className="object-cover object-right-bottom [mask-image:linear-gradient(to_right,transparent,black_60%)]"
        />
      </div>
      <div className="relative flex items-center gap-4 p-6 sm:p-8">
        <div className="w-14 h-14 rounded-2xl bg-[#EBF5EF] text-[#153D32] flex items-center justify-center shrink-0">
          <Icon className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#153D32] tracking-tight">{title}</h1>
          <p className="text-xs sm:text-sm text-[#5C6661] mt-1 max-w-md">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
