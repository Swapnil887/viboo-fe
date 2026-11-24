"use client";

import { useState } from "react";
import { Product, ProductFilter } from "@/types/product";
import ProductCard from "./ProductCard";
import ProductFilters, { AppliedFilters } from "./ProductFilters";
import ProductSorting from "./ProductSorting";

interface Props {
  products: Product[];
  filters: ProductFilter[];
  onApplyFilters: (filters: AppliedFilters) => void;
  onSortChange?: (sort: string) => void;
  title?: string;
}

export default function ProductListing({
  products,
  filters,
  onApplyFilters = (a: any) => null,
  onSortChange = (a: any) => null,
  title = "All Products",
}: Props) {
  const [sort, setSort] = useState("newest");

  const handleSort = (value: string) => {
    setSort(value);
    onSortChange?.(value);
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-500">
          <a href="/">Home</a>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{title}</span>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">{title}</h1>

          <p className="mt-2 text-sm text-gray-500">
            Discover our collection of products.
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar */}
          <div className="w-full shrink-0 lg:w-64">
            {/* {JSON.stringify(filters)} */}

            <ProductFilters filters={filters} onApply={onApplyFilters} />
          </div>

          {/* Products */}
          <div className="min-w-0 flex-1">
            {/* Toolbar */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-900">
                  {products.length}
                </span>{" "}
                Products
              </p>

              <div className="flex items-center gap-2">
                <span className="hidden text-sm text-gray-500 sm:block">
                  Sort by:
                </span>

                <ProductSorting value={sort} onChange={handleSort} />
              </div>
            </div>

            {/* Product Grid */}
            {products.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex min-h-80 flex-col items-center justify-center text-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  No products found
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Try changing your filters or explore other products.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
