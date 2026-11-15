import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";

const products = [
  {
    id: 1,
    name: "Classic Cotton T-Shirt",
    brand: "Viboo Essentials",
    price: 499,
    originalPrice: 699,
    image: "/images/products/product-1.png",
    badge: "New",
    slug: "classic-cotton-tshirt",
  },
  {
    id: 2,
    name: "Floral Summer Dress",
    brand: "Little Bloom",
    price: 899,
    originalPrice: 1199,
    image: "/images/products/product-2.png",
    badge: "Sale",
    slug: "floral-summer-dress",
  },
  {
    id: 3,
    name: "Casual Kids Co-ord Set",
    brand: "Viboo Essentials",
    price: 1099,
    originalPrice: null,
    image: "/images/products/product-3.png",
    badge: "New",
    slug: "casual-kids-coord-set",
  },
  {
    id: 4,
    name: "Everyday Denim Outfit",
    brand: "Tiny Trends",
    price: 1299,
    originalPrice: 1599,
    image: "/images/products/product-4.png",
    badge: "Popular",
    slug: "everyday-denim-outfit",
  },
];

export default function ProductSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      {/* Section Heading */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#B77950]">
            Fresh from Viboo
          </p>

          <h2 className="text-2xl font-bold tracking-tight text-[#292521] sm:text-3xl">
            New Arrivals
          </h2>

          <p className="mt-2 text-sm text-[#756B63]">
            The latest little looks they will love.
          </p>
        </div>

        <Link
          href="/collections/new-arrivals"
          className="hidden items-center gap-2 text-sm font-semibold text-[#55483F] transition hover:text-[#B77950] sm:flex"
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
        {products.map((product) => (
          <div key={product.id} className="group min-w-0">
            {/* Product Image */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[#F5EDE4] sm:rounded-2xl">
              <Link href={`/products/${product.slug}`}>
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </Link>

              {/* Product Badge */}
              {product.badge && (
                <span className="absolute left-2 top-2 rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#A66B49] sm:left-3 sm:top-3 sm:text-xs">
                  {product.badge}
                </span>
              )}

              {/* Wishlist */}
              <Link
                href="/wishlist"
                aria-label={`Add ${product.name} to wishlist`}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#55483F] transition hover:bg-[#B77950] hover:text-white sm:right-3 sm:top-3 sm:h-9 sm:w-9"
              >
                <Heart className="h-4 w-4" />
              </Link>
            </div>

            {/* Product Details */}
            <div className="pt-3">
              <p className="text-[10px] font-medium uppercase tracking-wider text-[#A18F81] sm:text-xs">
                {product.brand}
              </p>

              <Link href={`/products/${product.slug}`}>
                <h3 className="mt-1 truncate text-sm font-semibold text-[#292521] transition hover:text-[#B77950] sm:text-base">
                  {product.name}
                </h3>
              </Link>

              {/* Price */}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-[#292521] sm:text-base">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>

                {product.originalPrice && (
                  <span className="text-xs text-[#A18F81] line-through">
                    ₹{product.originalPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              {/* View Product */}
              <Button
                variant="outline"
                className="mt-4 h-9 w-full rounded-full border-[#DCCABD] text-xs font-semibold text-[#55483F] hover:border-[#B77950] hover:bg-[#B77950] hover:text-white sm:h-10 sm:text-sm"
              >
                <Link href={`/products/${product.slug}`}>
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  View Product
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile View All */}
      <Link
        href="/collections/new-arrivals"
        className="mt-8 flex items-center justify-center gap-2 text-sm font-semibold text-[#55483F] sm:hidden"
      >
        View All Products
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}
