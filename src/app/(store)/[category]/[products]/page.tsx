import ProductListing from "@/components/products/ProductListing";
import { Product, ProductFilter } from "@/types/product";

async function getProducts(): Promise<Product[]> {
  const filter = {
    category: ["clothing"],
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/filter?filter=${encodeURIComponent(
      JSON.stringify(filter),
    )}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await response.json();

  return Array.isArray(data) ? data : data.products;
}

async function getFilters(): Promise<ProductFilter[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/category`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch filters");
  }

  const data = await response.json();

  return Array.isArray(data) ? data : data.data;
}

export default async function ProductsPage() {
  const [products, filters] = await Promise.all([getProducts(), getFilters()]);

  console.log({ products });

  return (
    <ProductListing
      products={products}
      filters={filters}
      // onApplyFilters={(filters) => {
      //   console.log("Selected filters:", filters);
      // }}
      // onSortChange={(sort) => {
      //   console.log("Selected sorting:", sort);
      // }}
    />
  );
}
