
"use client";

import { useMemo, useState } from "react";
import {
  ShoppingBag,
  Truck,
  ShieldCheck,
  Minus,
  Plus,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useCartStore } from "@/stores/cart.store";

interface ProductDetailsProps {
  product: any;
}

export default function ProductDetails({
  product,
}: ProductDetailsProps) {
  const addToCart = useCartStore((state) => state.addToCart);

  const variants = product.productVariants.filter(
    (variant: any) => variant.isActive
  );

  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(() => {
    const firstVariant = variants[0];

    return Object.fromEntries(
      (firstVariant?.options ?? []).map((item: any) => [
        item.optionValue.option.id,
        item.optionValue.id,
      ])
    );
  });

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  // Dynamic option groups
  const optionGroups = useMemo(() => {
    const map = new Map<string, any>();

    variants.forEach((variant: any) => {
      variant.options.forEach((item: any) => {
        const option = item.optionValue.option;
        const value = item.optionValue;

        if (!map.has(option.id)) {
          map.set(option.id, {
            id: option.id,
            name: option.name,
            values: [],
          });
        }

        const group = map.get(option.id);

        if (!group.values.some((v: any) => v.id === value.id)) {
          group.values.push({
            id: value.id,
            value: value.value,
          });
        }
      });
    });

    return Array.from(map.values());
  }, [variants]);

  // Find matching variant
  const selectedVariant = useMemo(() => {
    if (!optionGroups.length) {
      return variants.length === 1 ? variants[0] : null;
    }

    if (
      !optionGroups.every(
        (group: any) => selectedOptions[group.id]
      )
    ) {
      return null;
    }

    return variants.find((variant: any) =>
      optionGroups.every((group: any) =>
        variant.options.some(
          (item: any) =>
            item.optionValue.option.id === group.id &&
            item.optionValue.id === selectedOptions[group.id]
        )
      )
    );
  }, [variants, optionGroups, selectedOptions]);

  // Current active price
  const price = useMemo(() => {
    if (!selectedVariant) return null;

    const now = Date.now();

    return selectedVariant.productPrices.find((item: any) => {
      return (
        item.status === "ACTIVE" &&
        new Date(item.startsAt).getTime() <= now &&
        (!item.endsAt || new Date(item.endsAt).getTime() > now)
      );
    });
  }, [selectedVariant]);

  // Available stock
  const stock = selectedVariant
    ? selectedVariant.inventories.reduce(
        (total: number, item: any) =>
          total +
          Math.max(0, item.quantity - item.reservedQuantity),
        0
      )
    : 0;

  // Variant-specific images
  const images = useMemo(() => {
    if (!selectedVariant) return [];

    const variantImages = product.productImages
      .filter(
        (image: any) => image.variantId === selectedVariant.id
      )
      .sort((a: any, b: any) => a.sortOrder - b.sortOrder);

    const productImages = product.productImages
      .filter((image: any) => !image.variantId)
      .sort((a: any, b: any) => a.sortOrder - b.sortOrder);

    return variantImages.length ? variantImages : productImages;
  }, [product.productImages, selectedVariant]);

  const currentImage = images[activeImage] ?? images[0];

  const currentPrice = Number(price?.price ?? 0);
  const comparePrice = Number(price?.compareAtPrice ?? 0);

  const discount =
    comparePrice > currentPrice && currentPrice > 0
      ? Math.round(
          ((comparePrice - currentPrice) / comparePrice) * 100
        )
      : 0;

  const currency = price?.currency ?? "INR";

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);

  const handleOptionChange = (
    optionId: string,
    valueId: string
  ) => {
    setSelectedOptions((previous) => ({
      ...previous,
      [optionId]: valueId,
    }));

    setQuantity(1);
    setActiveImage(0);
  };

  const handleAddToCart = () => {
    if (!selectedVariant || !price || stock < quantity) return;

    const optionLabels = selectedVariant.options
      .map(
        (item: any) =>
          `${item.optionValue.option.name}: ${item.optionValue.value}`
      )
      .join(", ");

    addToCart({
      variantId: selectedVariant.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: currentImage?.imageUrl ?? "",
      sku: selectedVariant.sku,
      price: currentPrice,
      quantity,
      options: optionLabels,
    });
  };

  const isAvailable = Boolean(selectedVariant && price && stock > 0);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-8">
          Home / Clothing / T-Shirts /{" "}
          <span className="text-gray-900">
            {product.name}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">

          {/* LEFT: IMAGE GALLERY */}
          <div className="space-y-4">

            <div className="relative aspect-[4/5] bg-[#f8f6f5] rounded-2xl overflow-hidden">

              {currentImage ? (
                <img
                  key={currentImage.id}
                  src={currentImage.imageUrl}
                  alt={currentImage.altText || product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No product image available
                </div>
              )}

              {product.isFeatured && (
                <span className="absolute top-4 left-4 bg-white px-3 py-1.5 rounded-full text-xs font-semibold">
                  FEATURED
                </span>
              )}

              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveImage(
                        (activeImage - 1 + images.length) %
                          images.length
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    onClick={() =>
                      setActiveImage(
                        (activeImage + 1) % images.length
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow"
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((image: any, index: number) => (
                <button
                  key={image.id}
                  onClick={() => setActiveImage(index)}
                  className={`w-20 h-24 shrink-0 rounded-xl overflow-hidden border-2 ${
                    activeImage === index
                      ? "border-gray-900"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={image.imageUrl}
                    alt={image.altText || product.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: PRODUCT DETAILS */}
          <div className="lg:sticky lg:top-8 lg:self-start space-y-6">

            {/* Brand and product name */}
            <div>
              <p className="text-sm uppercase tracking-[0.15em] font-semibold text-gray-500 mb-3">
                {product.brand?.name}
              </p>

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                {product.name}
              </h1>

              <p className="mt-3 text-gray-500 leading-7">
                {product.description}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-center flex-wrap gap-3">
              {price ? (
                <>
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(currentPrice)}
                  </span>

                  {discount > 0 && (
                    <>
                      <span className="text-lg text-gray-400 line-through">
                        {formatPrice(comparePrice)}
                      </span>

                      <span className="text-sm font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full">
                        {discount}% OFF
                      </span>
                    </>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-500">
                  Price unavailable for this selection
                </p>
              )}
            </div>

            <div className="border-t border-gray-100" />

            {/* Dynamic variant options */}
            <div className="space-y-6">
              {optionGroups.map((group: any) => (
                <div key={group.id}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">
                      Select {group.name}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {group.values.map((value: any) => {
                      const selected =
                        selectedOptions[group.id] === value.id;

                      return (
                        <button
                          key={value.id}
                          onClick={() =>
                            handleOptionChange(
                              group.id,
                              value.id
                            )
                          }
                          className={`min-w-20 px-5 py-3 rounded-xl border text-sm font-medium transition-all ${
                            selected
                              ? "border-gray-900 bg-gray-900 text-white"
                              : "border-gray-200 text-gray-700 hover:border-gray-900"
                          }`}
                        >
                          {value.value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Selected variant details */}
            {selectedVariant && (
              <div className="rounded-xl bg-gray-50 p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">SKU</span>
                  <span className="font-medium">
                    {selectedVariant.sku}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Availability
                  </span>

                  <span
                    className={
                      stock > 0
                        ? "text-green-700 font-medium"
                        : "text-red-600 font-medium"
                    }
                  >
                    {stock > 0
                      ? `${stock} available`
                      : "Out of stock"}
                  </span>
                </div>
              </div>
            )}

            {/* Quantity selector */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Quantity
              </h3>

              <div className="inline-flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() =>
                    setQuantity((q) => Math.max(1, q - 1))
                  }
                  disabled={quantity <= 1}
                  className="p-3 hover:bg-gray-50 disabled:opacity-40"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>

                <span className="w-12 text-center font-semibold">
                  {quantity}
                </span>

                <button
                  onClick={() =>
                    setQuantity((q) =>
                      Math.min(stock, q + 1)
                    )
                  }
                  disabled={!isAvailable || quantity >= stock}
                  className="p-3 hover:bg-gray-50 disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              disabled={!isAvailable || quantity > stock}
              className="w-full flex items-center justify-center gap-3 bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={19} />

              {!selectedVariant
                ? "Select Options"
                : !price
                  ? "Price Unavailable"
                  : stock === 0
                    ? "Out of Stock"
                    : "Add to Cart"}
            </button>

            {/* Delivery information */}
            <div className="space-y-4 border-t border-gray-100 pt-6">
              <div className="flex gap-3">
                <Truck className="text-gray-500 shrink-0" size={21} />

                <div>
                  <p className="text-sm font-semibold">
                    Delivery Information
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Delivery availability will be confirmed at checkout.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <ShieldCheck
                  className="text-gray-500 shrink-0"
                  size={21}
                />

                <div>
                  <p className="text-sm font-semibold">
                    Secure Shopping
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Secure payment and protected checkout.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Check
                  className="text-gray-500 shrink-0"
                  size={21}
                />

                <div>
                  <p className="text-sm font-semibold">
                    Quality Products
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Carefully selected products for kids.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* PRODUCT DESCRIPTION SECTION */}
        <div className="mt-16 border-t border-gray-100 pt-10">
          <h2 className="text-2xl font-bold mb-4">
            Product Description
          </h2>

          <p className="text-gray-600 leading-8 max-w-3xl">
            {product.description}
          </p>

          {selectedVariant && (
            <div className="mt-8 max-w-2xl">
              <h3 className="font-semibold text-lg mb-4">
                Product Specifications
              </h3>

              <div className="divide-y border-y">
                {selectedVariant.options.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex justify-between py-4 text-sm"
                  >
                    <span className="text-gray-500">
                      {item.optionValue.option.name}
                    </span>

                    <span className="font-medium">
                      {item.optionValue.value}
                    </span>
                  </div>
                ))}

                <div className="flex justify-between py-4 text-sm">
                  <span className="text-gray-500">SKU</span>
                  <span className="font-medium">
                    {selectedVariant.sku}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
