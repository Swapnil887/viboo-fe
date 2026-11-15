import Link from "next/link";
import { ArrowRight } from "lucide-react";

import ProductCard, { StoreProduct } from "./ProductCard";

const featuredProducts: StoreProduct[] = [
  {
    id: "1",
    name: "Premium Cotton T-Shirt",
    brand: "Viboo Essentials",
    price: 599,
    originalPrice: 799,
    image: "/images/products/product-1.jpg",
    badge: "Bestseller",
    slug: "premium-cotton-tshirt",
    rating: 4.8,
    reviews: 124,
  },
  {
    id: "2",
    name: "Floral Party Dress",
    brand: "Little Bloom",
    price: 999,
    originalPrice: 1299,
    image: "/images/products/product-2.jpg",
    badge: "Popular",
    slug: "floral-party-dress",
    rating: 4.7,
    reviews: 86,
  },
  {
    id: "3",
    name: "Kids Casual Co-ord Set",
    brand: "Viboo Essentials",
    price: 1199,
    image: "/images/products/product-3.jpg",
    badge: "Bestseller",
    slug: "kids-casual-coord-set",
    rating: 4.9,
    reviews: 210,
  },
  {
    id: "4",
    name: "Classic Denim Outfit",
    brand: "Tiny Trends",
    price: 1399,
    originalPrice: 1699,
    image: "/images/products/product-4.jpg",
    badge: "Trending",
    slug: "classic-denim-outfit",
    rating: 4.6,
    reviews: 72,
  },
];

export default function FeaturedProducts() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      {/* Heading */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#B77950]">
            Loved by little ones
          </p>

          <h2 className="text-2xl font-bold tracking-tight text-[#292521] sm:text-3xl">
            Our Best Sellers
          </h2>

          <p className="mt-2 text-sm text-[#756B63]">
            The little favourites everyone is loving.
          </p>
        </div>

        <Link
          href="/collections/best-sellers"
          className="hidden items-center gap-2 text-sm font-semibold text-[#55483F] transition hover:text-[#B77950] sm:flex"
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Products */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Mobile View All */}
      <Link
        href="/collections/best-sellers"
        className="mt-8 flex items-center justify-center gap-2 text-sm font-semibold text-[#55483F] sm:hidden"
      >
        View All Products
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}
