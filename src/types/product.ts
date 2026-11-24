export interface ProductImage {
  id: string;
  imageUrl: string;
  altText?: string | null;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductPrice {
  id: string;
  price: string;
  compareAtPrice?: string | null;
  currency: string;
  status: string;
  startsAt?: string;
  endsAt?: string | null;
}

export interface ProductOptionValue {
  id: string;
  value: string;
  slug: string;
}

export interface ProductVariantOption {
  id: string;
  optionValue: ProductOptionValue & {
    option: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

export interface ProductVariant {
  id: string;
  sku: string;
  isActive: boolean;
  options: ProductVariantOption[];
  productPrices: ProductPrice[];
  productImages: ProductImage[];
  inventories?: {
    quantity: number;
    reservedQuantity: number;
  }[];
}

export interface ProductAttribute {
  id: string;
  attribute: {
    id: string;
    name: string;
    slug: string;
    dataType: string;
    isFilterable: boolean;
  };
  attributeValue?: {
    id: string;
    value: string;
    slug: string;
  } | null;
  valueText?: string | null;
  valueNumber?: number | null;
  valueBoolean?: boolean | null;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  productType: string;
  status: string;
  isFeatured: boolean;

  brand: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
  } | null;

  categories: {
    id: string;
    isPrimary: boolean;
    category: {
      id: string;
      name: string;
      slug: string;
    };
  }[];

  productAttributes: ProductAttribute[];

  productOptions: {
    id: string;
    name: string;
    slug: string;
    values: ProductOptionValue[];
  }[];

  productVariants: ProductVariant[];

  productImages: ProductImage[];
}

export interface FilterValue {
  id: string;
  value: string;
  slug: string;
  sortOrder: number;
}

export interface ProductFilter {
  id: string;
  name: string;
  slug: string;
  dataType: string;
  isFilterable: boolean;
  values: FilterValue[];
}
