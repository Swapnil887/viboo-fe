import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Boys",
    subtitle: "Cool styles for little explorers",
    image: "/images/categories/boys.png",
    href: "/collections/boys",
  },
  {
    id: 2,
    name: "Girls",
    subtitle: "Beautiful styles for every moment",
    image: "/images/categories/girls.png",
    href: "/collections/girls",
  },
  {
    id: 3,
    name: "Clothing",
    subtitle: "Everyday comfort, endless style",
    image: "/images/categories/clothing.png",
    href: "/collections/clothing",
  },
  {
    id: 4,
    name: "Accessories",
    subtitle: "Little details, big personality",
    image: "/images/categories/accessories.png",
    href: "/collections/accessories",
  },
];

export default function CategorySection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      {/* Section Heading */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#B77950]">
            Find their style
          </p>

          <h2 className="text-2xl font-bold tracking-tight text-[#292521] sm:text-3xl">
            Shop by Category
          </h2>

          <p className="mt-2 text-sm text-[#756B63]">
            Discover something special for every little one.
          </p>
        </div>

        <Link
          href="/collections"
          className="hidden items-center gap-2 text-sm font-semibold text-[#55483F] transition hover:text-[#B77950] sm:flex"
        >
          View All
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={category.href}
            className="group relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#F5EDE4] sm:rounded-2xl">
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-3 text-white sm:p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold sm:text-xl">
                    {category.name}
                  </h3>

                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#292521] transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>

                <p className="mt-1 text-xs text-white/85 sm:text-sm">
                  {category.subtitle}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Link
        href="/collections"
        className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-[#55483F] sm:hidden"
      >
        View All Categories
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </section>
  );
}
