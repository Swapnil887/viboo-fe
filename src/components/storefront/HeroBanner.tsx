import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function HeroBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
      <div className="relative grid min-h-[440px] overflow-hidden rounded-2xl bg-[#F5EDE4] md:grid-cols-2 lg:min-h-[540px]">
        {/* Left Content */}
        <div className="relative z-10 flex flex-col items-start justify-center px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
          <span className="mb-5 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#A66B49]">
            Little styles, big smiles
          </span>

          <h1 className="max-w-lg text-4xl font-bold leading-tight tracking-tight text-[#292521] sm:text-5xl lg:text-6xl">
            Childhood Looks
            <span className="block text-[#B77950]">Better in Color.</span>
          </h1>

          <p className="mt-5 max-w-md text-sm leading-7 text-[#756B63] sm:text-base">
            Discover adorable styles made for little adventures. Comfortable
            fabrics, playful designs, and everyday essentials your little ones
            will love.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button className="h-12 rounded-full bg-[#B77950] px-7 text-sm font-semibold text-white hover:bg-[#96613F]">
              <Link href="/collections">
                Shop Collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Link
              href="/new-arrivals"
              className="text-sm font-semibold text-[#55483F] underline underline-offset-4 transition hover:text-[#B77950]"
            >
              Explore New Arrivals
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="h-8 w-8 rounded-full border-2 border-[#F5EDE4] bg-[#D8B59C]" />
              <div className="h-8 w-8 rounded-full border-2 border-[#F5EDE4] bg-[#B9C5A6]" />
              <div className="h-8 w-8 rounded-full border-2 border-[#F5EDE4] bg-[#E8C9A7]" />
            </div>

            <p className="text-xs text-[#756B63]">
              Made for little moments of joy
            </p>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative min-h-[300px] md:min-h-full">
          <Image
            src="/images/hero-kids-fashion.png"
            alt="Children wearing stylish and comfortable outfits"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent md:bg-gradient-to-r md:from-[#F5EDE4]/10 md:to-transparent" />
        </div>
      </div>
    </section>
  );
}
