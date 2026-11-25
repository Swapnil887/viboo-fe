import CategoryListing from "@/components/storePage/CategoryListing";
import { Category } from "@/types/category";

import ProductListing from "@/components/products/ProductListing";
import { Product, ProductFilter } from "@/types/product";

async function getProducts({category}:any): Promise<Product[]> {
  const filter = {
    category: [category],
  };

  console.log( `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/filter?filter=${encodeURIComponent(
      JSON.stringify(filter),)}`)

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

async function getCategories(): Promise<Category[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/category`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  const data = await response.json();

  return data.data;
}
type Props = {
  params: Promise<{
    category: string;
  }>;
};

export default async function CategoriesPage({ params }: Props) {
  const { category } = await params;
  let products, filters;
  let categories;

  if(category == "category"){
    categories = await getCategories()
  }else{
    [products, filters]= await Promise.all([getProducts({category}), getFilters()]);
  }
  

  console.log("category:", category);

  return category == "category" ? (
    <CategoryListing categories={categories} />
  ) : (
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
