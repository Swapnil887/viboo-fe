"use client";

import { useState } from "react";
import { ProductFilter } from "@/types/product";

export type AppliedFilters = {
  attributes: Record<string, string[]>;
  minPrice: string;
  maxPrice: string;
};

interface Props {
  filters?: ProductFilter[] | null;
  onApply: (filters: AppliedFilters) => void;
}

export default function ProductFilters({ filters, onApply }: Props) {
  const [selectedValues, setSelectedValues] = useState<
    Record<string, string[]>
  >({});

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  console.log(filters);

  // Safely prepare filter data
  const availableFilters = (filters ?? []).filter(
    (filter) =>
      filter &&
      filter.isFilterable === true &&
      filter.dataType === "SELECT" &&
      Array.isArray(filter.values) &&
      filter.values.some(
        (value) => value && value.id && value.slug && value.value,
      ),
  );

  console.log(availableFilters, "availabllefilters");

  const handleCheckbox = (attributeSlug: string, valueSlug: string) => {
    setSelectedValues((previous) => {
      const current = previous[attributeSlug] ?? [];

      const updated = current.includes(valueSlug)
        ? current.filter((value) => value !== valueSlug)
        : [...current, valueSlug];

      return {
        ...previous,
        [attributeSlug]: updated,
      };
    });
  };

  const clearFilters = () => {
    setSelectedValues({});
    setMinPrice("");
    setMaxPrice("");

    onApply({
      attributes: {},
      minPrice: "",
      maxPrice: "",
    });
  };

  const applyFilters = () => {
    // Remove empty attribute selections
    const attributes = Object.fromEntries(
      Object.entries(selectedValues).filter(([, values]) => values.length > 0),
    );

    onApply({
      attributes,
      minPrice,
      maxPrice,
    });
  };

  return (
    <aside className="w-full">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>

        <button
          type="button"
          onClick={clearFilters}
          className="text-xs font-medium text-gray-500 hover:text-black"
        >
          Clear all
        </button>
      </div>

      {/* Price Filter */}
      <section className="border-b border-gray-200 py-5">
        <h3 className="mb-4 text-sm font-semibold text-gray-900">
          Price Range
        </h3>

        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-500"
          />

          <span className="text-gray-400">-</span>

          <input
            type="number"
            min="0"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-500"
          />
        </div>
      </section>

      {/* Dynamic Attribute Filters */}
      {availableFilters.map((filter) => {
        const values = (filter.values ?? [])
          .filter((value) => value && value.id && value.slug && value.value)
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

        if (values.length === 0) return null;

        return (
          <section key={filter.id} className="border-b border-gray-200 py-5">
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              {filter.name || "Other"}
            </h3>

            <div className="max-h-56 space-y-3 overflow-y-auto">
              {values.map((value) => (
                <label
                  key={value.id}
                  className="flex cursor-pointer items-center gap-3 text-sm text-gray-600"
                >
                  <input
                    type="checkbox"
                    checked={(selectedValues[filter.slug] ?? []).includes(
                      value.slug,
                    )}
                    onChange={() => handleCheckbox(filter.slug, value.slug)}
                    className="h-4 w-4 rounded border-gray-300 accent-black"
                  />

                  <span>{value.value}</span>
                </label>
              ))}
            </div>
          </section>
        );
      })}

      {/* Apply Button */}
      <button
        type="button"
        onClick={applyFilters}
        className="mt-6 w-full rounded-lg bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
      >
        Apply Filters
      </button>
    </aside>
  );
}
