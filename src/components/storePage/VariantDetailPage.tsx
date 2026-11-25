
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ProductDetails {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isFeatured: boolean;
  brand: {
    name: string;
    logoUrl: string | null;
  } | null;
  categories: {
    isPrimary: boolean;
    category: {
      name: string;
      parent: { name: string } | null;
    };
  }[];
  productAttributes: {
    attribute: { name: string };
    attributeValue: { value: string } | null;
    valueText: string | null;
    valueNumber: string | null;
    valueBoolean: boolean | null;
  }[];
  productImages: ProductImage[];
}

interface ProductImage {
  id: string;
  imageUrl: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
}

interface Variant {
  id: string;
  sku: string;
  barcode: string | null;
  weight: string | null;
  isActive: boolean;

  options: {
    optionValue: {
      value: string;
      option: {
        name: string;
        slug: string;
      };
    };
  }[];

  productPrices: {
    price: string;
    compareAtPrice: string | null;
    currency: string;
  }[];

  productImages: ProductImage[];

  inventories: {
    quantity: number;
    reservedQuantity: number;
    warehouse: {
      name: string;
      city: string | null;
    };
  }[];

  product: ProductDetails;
}

export default function VariantDetailsPage({variant}: {variant: Variant}) {

  const [selectedImage, setSelectedImage] = useState("");
 
  const [error, setError] = useState("");

 


  if (error || !variant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {error || "Product not found"}
      </div>
    );
  }

  const product = variant.product;

  // Combine variant and product-level images
  const images = [
    ...variant.productImages,
    ...product.productImages,
  ].sort((a, b) => a.sortOrder - b.sortOrder);

  const currentImage =
    selectedImage || images.find((img) => img.isPrimary)?.imageUrl
    || images[0]?.imageUrl;

  const price = variant.productPrices[0];

  const currentPrice = Number(price?.price || 0);
  const comparePrice = Number(price?.compareAtPrice || 0);

  const discount =
    comparePrice > currentPrice
      ? Math.round(
          ((comparePrice - currentPrice) / comparePrice) * 100
        )
      : 0;

  const availableStock = variant.inventories.reduce(
    (total, inventory) =>
      total + inventory.quantity - inventory.reservedQuantity,
    0
  );

  const primaryCategory = product.categories.find(
    (item) => item.isPrimary
  )?.category;

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-8">
          Home / {primaryCategory?.parent?.name || "Products"}
          {" / "}
          {primaryCategory?.name || "Product"}
          {" / "}
          {product.name}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Product Gallery */}
          <section>
            <div className="bg-gray-50 rounded-xl overflow-hidden aspect-[4/5] flex items-center justify-center">
              {currentImage ? (
                <img
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-gray-400">
                  No product image available
                </div>
              )}
            </div>

            {/* Thumbnail images */}
            {images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto">
                {images.map((image) => (
                  <button
                    key={image.id}
                    onClick={() =>
                      setSelectedImage(image.imageUrl)
                    }
                    className={`w-20 h-24 shrink-0 rounded-lg overflow-hidden border-2 ${
                      currentImage === image.imageUrl
                        ? "border-black"
                        : "border-gray-200"
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
            )}
          </section>

          {/* Product Information */}
          <section className="space-y-6">

            {/* Brand */}
            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              {product.brand?.name || "Viboo"}
            </div>

            {/* Product Name */}
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">
                {product.name}
              </h1>

              <p className="text-gray-500 mt-2">
                {product.description}
              </p>
            </div>

            {product.isFeatured && (
              <span className="inline-block bg-pink-100 text-pink-700 text-xs px-3 py-1 rounded-full">
                Featured Product
              </span>
            )}

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold">
                ₹{currentPrice.toLocaleString("en-IN")}
              </span>

              {comparePrice > currentPrice && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    ₹{comparePrice.toLocaleString("en-IN")}
                  </span>

                  <span className="text-green-600 font-semibold">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="text-sm text-gray-500">
              Inclusive of all taxes
            </p>

            <hr />

            {/* Selected Variant Options */}
            <div>
              <h3 className="font-semibold mb-3">
                Selected options
              </h3>

              <div className="flex flex-wrap gap-3">
                {variant.options.map((item, index) => (
                  <div
                    key={index}
                    className="border border-black rounded-lg px-5 py-3"
                  >
                    <p className="text-xs text-gray-500">
                      {item.optionValue.option.name}
                    </p>
                    <p className="font-medium">
                      {item.optionValue.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stock */}
            <div>
              {availableStock > 0 ? (
                <p className="text-green-600 font-medium">
                  In Stock ({availableStock} available)
                </p>
              ) : (
                <p className="text-red-600 font-medium">
                  Out of Stock
                </p>
              )}
            </div>

            {/* Variant information */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
              <p>
                <span className="text-gray-500">SKU:</span>{" "}
                {variant.sku}
              </p>

              <p>
                <span className="text-gray-500">Barcode:</span>{" "}
                {variant.barcode || "N/A"}
              </p>

              <p>
                <span className="text-gray-500">Weight:</span>{" "}
                {variant.weight || "N/A"}
              </p>
            </div>

            {/* Product Attributes */}
            <div>
              <h3 className="font-semibold text-lg mb-4">
                Product Details
              </h3>

              <div className="divide-y">
                {product.productAttributes.map((item, index) => {
                  const value =
                    item.attributeValue?.value ??
                    item.valueText ??
                    item.valueNumber ??
                    (item.valueBoolean !== null
                      ? String(item.valueBoolean)
                      : "N/A");

                  return (
                    <div
                      key={index}
                      className="flex justify-between py-3 text-sm"
                    >
                      <span className="text-gray-500">
                        {item.attribute.name}
                      </span>

                      <span className="font-medium">
                        {value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Category */}
            <div>
              <h3 className="font-semibold mb-2">
                Category
              </h3>

              <p className="text-sm text-gray-600">
                {product.categories
                  .map((item) => item.category.name)
                  .join(", ")}
              </p>
            </div>

            {/* Warehouse */}
            <div>
              <h3 className="font-semibold mb-3">
                Availability by warehouse
              </h3>

              {variant.inventories.map((inventory, index) => (
                <div
                  key={index}
                  className="flex justify-between text-sm py-2 border-b"
                >
                  <span>{inventory.warehouse.name}</span>
                  <span>
                    {inventory.quantity -
                      inventory.reservedQuantity}{" "}
                    units
                  </span>
                </div>
              ))}
            </div>

            {/* Cart integration pending */}
            <button
              disabled
              className="w-full bg-gray-900 text-white py-4 rounded-lg font-semibold opacity-60 cursor-not-allowed"
            >
              Add to Cart
            </button>

            <p className="text-xs text-gray-400">
              Cart functionality will be connected to your cart API.
            </p>

          </section>
        </div>
      </div>
    </main>
  );
}
