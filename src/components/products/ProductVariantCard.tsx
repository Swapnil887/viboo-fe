
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Package,
  Barcode,
  Weight,
  Warehouse,
} from "lucide-react";

interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  barcode?: string | null;
  weight?: string | null;
  isActive: boolean;

  options: {
    id: string;
    optionValue: {
      value: string;
      slug: string;
      option: {
        name: string;
        slug: string;
      };
    };
  }[];

  productPrices: {
    id: string;
    price: string;
    compareAtPrice?: string | null;
    currency: string;
    status: string;
  }[];

  productImages: {
    id: string;
    imageUrl: string;
    altText?: string | null;
    sortOrder: number;
    isPrimary: boolean;
  }[];

  inventories: {
    id: string;
    quantity: number;
    reservedQuantity: number;
    warehouse: {
      name: string;
    };
  }[];
}

interface Props {
  variant: ProductVariant;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function ProductVariantCard({ variant }: Props) {
  const {
    id,
    productId,
    sku,
    barcode,
    weight,
    isActive,
    options = [],
    productPrices = [],
    productImages = [],
    inventories = [],
  } = variant;

  // Active price
  const activePrice = productPrices.find(
    (item) => item.status === "ACTIVE"
  );

  const price = activePrice
    ? Number(activePrice.price)
    : null;

  const compareAtPrice = activePrice?.compareAtPrice
    ? Number(activePrice.compareAtPrice)
    : null;

  const discount =
    price !== null &&
    compareAtPrice !== null &&
    compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : 0;

  // Primary image
  const image =
    productImages.find((item) => item.isPrimary)?.imageUrl ||
    [...productImages].sort(
      (a, b) => a.sortOrder - b.sortOrder
    )[0]?.imageUrl ||
    null;

  const imageAlt =
    productImages.find((item) => item.isPrimary)?.altText || sku;

  // Inventory calculation
  const totalStock = inventories.reduce(
    (total, inventory) =>
      total + Number(inventory.quantity || 0),
    0
  );

  const reservedStock = inventories.reduce(
    (total, inventory) =>
      total + Number(inventory.reservedQuantity || 0),
    0
  );

  const availableStock = Math.max(0, totalStock - reservedStock);

  const inStock = availableStock > 0;

  return (
    <div className="group overflow-hidden rounded-xl border bg-white transition-all hover:shadow-lg">

      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">

        {image ? (
          <Image
            src={""}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package className="h-12 w-12 text-gray-300" />
          </div>
        )}

        {/* Active status */}
        <Badge
          className={`absolute left-3 top-3 ${
            isActive
              ? "bg-green-600 hover:bg-green-600"
              : "bg-gray-500 hover:bg-gray-500"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </Badge>

        {/* Discount */}
        {discount > 0 && (
          <Badge className="absolute right-3 top-3 bg-red-600 hover:bg-red-600">
            {discount}% OFF
          </Badge>
        )}
      </div>

      {/* Details */}
      <div className="space-y-4 p-4">

        {/* SKU */}
        <div>
          <p className="text-xs text-gray-500">SKU</p>
          <h3 className="font-semibold text-gray-900">
            {sku}
          </h3>
        </div>

        {/* Options */}
        {options.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium text-gray-500">
              Variant Options
            </p>

            <div className="flex flex-wrap gap-2">
              {options.map((item) => (
                <Badge
                  key={item.id}
                  variant="secondary"
                  className="font-medium"
                >
                  {item.optionValue.option.name}:{" "}
                  {item.optionValue.value}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Pricing */}
        <div className="border-t pt-3">
          <p className="mb-1 text-xs text-gray-500">Selling Price</p>

          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">
              {price !== null ? formatPrice(price) : "N/A"}
            </span>

            {compareAtPrice !== null &&
              compareAtPrice > (price ?? 0) && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(compareAtPrice)}
                </span>
              )}
          </div>
        </div>

        {/* Stock */}
        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              Available Stock
            </span>
          </div>

          <span
            className={`text-sm font-semibold ${
              inStock ? "text-green-600" : "text-red-600"
            }`}
          >
            {availableStock} Units
          </span>
        </div>

        {/* Additional Information */}
        <div className="space-y-2 text-sm text-gray-500">

          {barcode && (
            <div className="flex items-center gap-2">
              <Barcode className="h-4 w-4" />
              <span>{barcode}</span>
            </div>
          )}

          {weight && (
            <div className="flex items-center gap-2">
              <Weight className="h-4 w-4" />
              <span>{weight} g</span>
            </div>
          )}

          {inventories.length > 0 && (
            <div className="flex items-center gap-2">
              <Warehouse className="h-4 w-4" />
              <span>
                {inventories[0].warehouse.name}
              </span>
            </div>
          )}
        </div>

        {/* Action */}
        <Button  className="w-full" size="sm">
          <Link href={`/admin/products/${productId}/variants/${id}`}>
            <Eye className="mr-2 h-4 w-4" />
            View Variant
          </Link>
        </Button>

      </div>
    </div>
  );
}
