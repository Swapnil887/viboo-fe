import CategoryListing from "@/components/storePage/CategoryListing";
import { Category } from "@/types/category";

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

export default async function CategoriesPage() {
  const categories = await getCategories();

  return <CategoryListing categories={categories} />;
}
