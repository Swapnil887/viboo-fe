export interface CategoryParent {
  id: string;
  name: string;
  slug: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  parentId: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  parent: CategoryParent | null;
  attributes: unknown[];
}

export interface CategoryWithChildren extends Category {
  children: Category[];
}
