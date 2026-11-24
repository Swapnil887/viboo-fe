export { cn } from "cn";

import { Category, CategoryWithChildren } from "@/types/category";

export function buildCategoryTree(
  categories: Category[],
): CategoryWithChildren[] {
  const categoryMap = new Map<string, CategoryWithChildren>();

  // Create map of all categories
  categories.forEach((category) => {
    categoryMap.set(category.id, {
      ...category,
      children: [],
    });
  });

  const rootCategories: CategoryWithChildren[] = [];

  // Build parent-child relationship
  categoryMap.forEach((category) => {
    if (category.parentId) {
      const parent = categoryMap.get(category.parentId);

      if (parent) {
        parent.children.push(category);
      }
    } else {
      rootCategories.push(category);
    }
  });

  // Sort categories
  const sortCategories = (items: CategoryWithChildren[]) => {
    items.sort((a, b) => a.sortOrder - b.sortOrder);

    items.forEach((item) => {
      sortCategories(item.children as CategoryWithChildren[]);
    });
  };

  sortCategories(rootCategories);

  return rootCategories;
}
