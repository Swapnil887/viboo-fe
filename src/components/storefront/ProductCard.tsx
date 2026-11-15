import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";

import { Button } from "@/components/ui/button";

export interface StoreProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  badge?: string;
  slug: string;
  rating?: number;
  reviews?: number;
}

interface ProductCardProps {
  product: StoreProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group min-w-0">
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

        {product.badge && (
          <span className="absolute left-2 top-2 rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#A66B49] sm:left-3 sm:top-3 sm:text-xs">
            {product.badge}
          </span>
        )}

        <button
          type="button"
          aria-label={`Add ${product.name} to wishlist`}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#55483F] transition hover:bg-[#B77950] hover:text-white sm:right-3 sm:top-3 sm:h-9 sm:w-9"
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>

      {/* Product Details */}
      <div className="pt-3">
        <p className="text-[10px] font-medium uppercase tracking-wider text-[#A18F81] sm:text-xs">
          {product.brand}
        </p>

        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-1 truncate text-sm font-semibold text-[#292521] hover:text-[#B77950] sm:text-base">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.rating !== undefined && (
          <div className="mt-2 flex items-center gap-1 text-xs text-[#756B63]">
            <Star className="h-3.5 w-3.5 fill-[#D6A15D] text-[#D6A15D]" />
            <span>{product.rating}</span>
            {product.reviews !== undefined && (
              <span>({product.reviews} reviews)</span>
            )}
          </div>
        )}

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

        <Button
          variant="outline"
          className="mt-4 h-9 w-full rounded-full border-[#DCCABD] text-xs font-semibold text-[#55483F] hover:border-[#B77950] hover:bg-[#B77950] hover:text-white sm:h-10 sm:text-sm"
        >
          <Link href={`/products/${product.slug}`}>View Product</Link>
        </Button>
      </div>
    </div>
  );
}
