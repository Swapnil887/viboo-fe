import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function PromotionalBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="relative min-h-[350px] overflow-hidden rounded-2xl bg-[#EDE1D4] sm:min-h-[420px] lg:min-h-[460px]">
        {/* Background Image */}
        <Image
          src="/images/promo-kids-fashion.png"
          alt="Kids wearing the latest Viboo collection"
          fill
          sizes="(max-width: 768px) 100vw, 1200px"
          className="object-cover object-center"
        />

        {/* Image Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#292521]/80 via-[#292521]/45 to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex min-h-[350px] max-w-xl flex-col items-start justify-center px-6 py-12 text-white sm:min-h-[420px] sm:px-10 lg:min-h-[460px] lg:px-16">
          <span className="rounded-full bg-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] backdrop-blur-sm">
            Special Season Offer
          </span>

          <h2 className="mt-6 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Little Styles,
            <span className="block text-[#F2C8A8]">Big Savings.</span>
          </h2>

          <p className="mt-4 max-w-md text-sm leading-7 text-white/85 sm:text-base">
            Make every little moment special. Discover adorable styles for your
            little ones at prices you'll love.
          </p>

          <div className="mt-5">
            <p className="text-sm font-medium uppercase tracking-wider text-white/80">
              Up to
            </p>

            <p className="text-5xl font-bold tracking-tight sm:text-6xl">
              40% OFF
            </p>
          </div>

          <Button className="mt-7 h-12 rounded-full bg-white px-8 text-sm font-semibold text-[#292521] hover:bg-[#F5EDE4]">
            <Link href="/collections/sale">
              Shop Sale
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
