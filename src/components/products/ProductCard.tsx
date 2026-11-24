import Link from "next/link";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";

interface Props {
  product: Product;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function ProductCard({ product }: any) {
  const {
    name,
    slug,
    brand,
    image,
    price,
    compareAtPrice,
    isFeatured,
    variants,
  } = product;

  const hasMultiplePrices = price && price.min !== price.max;

  const displayPrice = price
    ? hasMultiplePrices
      ? `${formatPrice(price.min)} - ${formatPrice(price.max)}`
      : formatPrice(price.min)
    : "Price unavailable";

  const originalPrice = compareAtPrice?.min ?? null;

  const discountPercentage =
    originalPrice && price?.min && originalPrice > price.min
      ? Math.round(((originalPrice - price.min) / originalPrice) * 100)
      : 0;

  const inStock = variants?.some((variant) => variant.inStock);

  return (
    <div className="group overflow-hidden rounded-lg border bg-white">
      {/* Product Image */}
      <Link
        href={`/products/${slug}`}
        className="relative block aspect-[3/4] overflow-hidden bg-gray-100"
      >
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            No image available
          </div>
        )}

        {/* Featured Badge */}
        {isFeatured && (
          <span className="absolute left-3 top-3 rounded bg-black px-2 py-1 text-xs text-white">
            Featured
          </span>
        )}

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <span className="absolute right-3 top-3 rounded bg-red-500 px-2 py-1 text-xs font-medium text-white">
            {discountPercentage}% OFF
          </span>
        )}
      </Link>

      {/* Product Details */}
      <div className="space-y-2 p-3">
        {brand && <p className="text-xs text-gray-500">{brand}</p>}

        <Link href={`/products/${slug}`}>
          <h3 className="line-clamp-2 text-sm font-medium text-gray-900 hover:text-gray-600">
            {name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-base font-semibold text-gray-900">
            {displayPrice}
          </span>

          {originalPrice && price?.min && originalPrice > price.min && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>

        {/* Variant Availability */}
        <p className={`text-xs ${inStock ? "text-green-600" : "text-red-500"}`}>
          {inStock ? "In Stock" : "Out of Stock"}
        </p>

        {/* View Product */}
        <Button asChild className="w-full" size="sm">
          <Link href={`/products/${slug}`}>View Product</Link>
        </Button>
      </div>
    </div>
  );
}
