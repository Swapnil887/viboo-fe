"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { GlobalTable } from "../Global/GlobalTable";

// --------------------------------------------------
// Types
// --------------------------------------------------

type ResourceType = "category" | "brand" | "products" | "product-varient";

interface ResourceLandingProps {
  resources: ResourceType | string;
  resourceData?: Record<string, any>[] | null;
}

type TableColumn = {
  key: string;
  header: string;
  accessorKey?: string;
  accessorFn?: (row: any) => unknown;
  sortable?: boolean;
  searchable?: boolean;
  cell: (row: any) => React.ReactNode;
};

// --------------------------------------------------
// Helpers
// --------------------------------------------------

const safeFormatDate = (
  dateString?: string | Date | null,
  locale = "en-IN",
): string => {
  if (!dateString) return "—";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString(locale);
};

const getCategoryNames = (row: any): string => {
  if (!Array.isArray(row?.categories)) return "—";

  const names = row.categories
    .map((item: any) => item?.category?.name)
    .filter(
      (name: unknown): name is string =>
        typeof name === "string" && name.trim().length > 0,
    );

  return names.length ? names.join(", ") : "—";
};

const getCategoryBadges = (row: any) => {
  if (!Array.isArray(row?.categories) || row.categories.length === 0) {
    return <span>—</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {row.categories.map((item: any) => {
        const categoryId = item?.category?.id ?? item?.id;

        if (!categoryId) return null;

        return (
          <Badge key={categoryId} variant="outline">
            {item?.category?.name ?? "Unknown"}
            {item?.isPrimary ? " (Primary)" : ""}
          </Badge>
        );
      })}
    </div>
  );
};

// --------------------------------------------------
// Reusable Column Helpers
// --------------------------------------------------

const idColumn = (header = "ID"): TableColumn => ({
  key: "id",
  header,
  accessorKey: "id",
  sortable: true,
  searchable: true,
  cell: (row) => (
    <div className="flex flex-col">
      <span className="font-medium">{row?.id ?? "—"}</span>
      <span className="text-xs text-muted-foreground">{row?.slug ?? ""}</span>
    </div>
  ),
});

const statusColumn = (
  key: string,
  header: string,
  activeValue = true,
): TableColumn => ({
  key,
  header,
  accessorKey: key,
  sortable: true,
  cell: (row) => {
    const active = row?.[key] === activeValue;

    return (
      <Badge variant={active ? "default" : "secondary"}>
        {active ? "Active" : "Inactive"}
      </Badge>
    );
  },
});

const dateColumn = (key: string, header: string): TableColumn => ({
  key,
  header,
  accessorKey: key,
  sortable: true,
  cell: (row) => safeFormatDate(row?.[key]),
});

const textColumn = (
  key: string,
  header: string,
  options?: {
    sortable?: boolean;
    searchable?: boolean;
  },
): TableColumn => ({
  key,
  header,
  accessorKey: key,
  sortable: options?.sortable ?? false,
  searchable: options?.searchable ?? false,
  cell: (row) => row?.[key] ?? "—",
});

// --------------------------------------------------
// Resource Columns
// --------------------------------------------------

const getColumns = (resource: string): TableColumn[] => {
  switch (resource) {
    // ----------------------------------------------
    // CATEGORY
    // ----------------------------------------------

    case "category":
      return [
        textColumn("name", "Category", { sortable: true }),
        textColumn("slug", "Slug", { sortable: true }),
        textColumn("description", "Description"),
        {
          key: "sortOrder",
          header: "Sort Order",
          accessorKey: "sortOrder",
          cell: (row) => row?.sortOrder ?? "—",
        },
        {
          key: "parentId",
          header: "Parent Category",
          cell: (row) => row?.parent?.name ?? "Root Category",
        },
        statusColumn("isActive", "Status"),
        dateColumn("createdAt", "Created At"),
      ];

    // ----------------------------------------------
    // BRAND
    // ----------------------------------------------

    case "brand":
      return [
        {
          key: "logoUrl",
          header: "Logo",
          searchable: false,
          cell: (row) =>
            row?.logoUrl ? (
              <img
                src={row.logoUrl}
                alt={row?.name ?? "Brand logo"}
                className="h-10 w-10 rounded-md border object-contain"
                loading="lazy"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                <span className="text-xs text-muted-foreground">N/A</span>
              </div>
            ),
        },
        textColumn("name", "Brand Name", { sortable: true }),
        textColumn("slug", "Slug", { sortable: true }),
        statusColumn("isActive", "Status"),
        dateColumn("createdAt", "Created At"),
      ];

    // ----------------------------------------------
    // PRODUCTS
    // ----------------------------------------------

    case "products":
      return [
        idColumn("Product ID"),
        {
          key: "name",
          header: "Product",
          accessorKey: "name",
          sortable: true,
          searchable: true,
          cell: (row) => (
            <div className="flex flex-col">
              <span className="font-medium">{row?.name ?? "—"}</span>
              <span className="text-xs text-muted-foreground">
                {row?.slug ?? ""}
              </span>
            </div>
          ),
        },
        {
          key: "brand",
          header: "Brand",
          accessorFn: (row) => row?.brand?.name ?? "—",
          sortable: true,
          searchable: true,
          cell: (row) => row?.brand?.name ?? "—",
        },
        {
          key: "category",
          header: "Category",
          accessorFn: getCategoryNames,
          searchable: true,
          cell: getCategoryBadges,
        },
        {
          key: "productType",
          header: "Type",
          accessorKey: "productType",
          sortable: true,
          cell: (row) => (
            <Badge variant="secondary">{row?.productType ?? "N/A"}</Badge>
          ),
        },
        {
          key: "status",
          header: "Status",
          accessorKey: "status",
          sortable: true,
          cell: (row) => (
            <Badge variant={row?.status === "ACTIVE" ? "default" : "outline"}>
              {row?.status ?? "UNKNOWN"}
            </Badge>
          ),
        },
        {
          key: "isFeatured",
          header: "Featured",
          accessorKey: "isFeatured",
          sortable: true,
          cell: (row) => (
            <Badge variant={row?.isFeatured ? "default" : "outline"}>
              {row?.isFeatured ? "Featured" : "No"}
            </Badge>
          ),
        },
        dateColumn("createdAt", "Created At"),
      ];

    // ----------------------------------------------
    // PRODUCT VARIANTS
    // ----------------------------------------------

    case "product-variant":
      return [
        idColumn(),
        {
          key: "productId",
          header: "Product ID",
          accessorKey: "productId",
          sortable: true,
          searchable: true,
          cell: (row) => row?.productId ?? "—",
        },
        {
          key: "product",
          header: "Product",
          accessorFn: (row) => row?.product?.name ?? "—",
          sortable: true,
          searchable: true,
          cell: (row) => row?.product?.name ?? "—",
        },
        textColumn("sku", "SKU", {
          sortable: true,
          searchable: true,
        }),
        {
          key: "barcode",
          header: "Barcode",
          accessorKey: "barcode",
          sortable: true,
          cell: (row) => (
            <Badge variant="secondary">{row?.barcode ?? "N/A"}</Badge>
          ),
        },
        {
          key: "weight",
          header: "Weight",
          accessorKey: "weight",
          sortable: true,
          cell: (row) => (
            <Badge variant="secondary">{row?.weight ?? "0"}</Badge>
          ),
        },
        statusColumn("isActive", "Status"),
        dateColumn("createdAt", "Created At"),
      ];

    // ----------------------------------------------
    // DEFAULT / ATTRIBUTES
    // ----------------------------------------------

    default:
      return [
        idColumn(),
        textColumn("name", "Name", {
          sortable: true,
          searchable: true,
        }),
        textColumn("dataType", "Data Type", {
          sortable: true,
          searchable: true,
        }),
        {
          key: "isFilterable",
          header: "Filterable",
          accessorKey: "isFilterable",
          sortable: true,
          cell: (row) => String(row?.isFilterable ?? false),
        },
        {
          key: "isSearchable",
          header: "Searchable",
          accessorKey: "isSearchable",
          sortable: true,
          cell: (row) => String(row?.isSearchable ?? false),
        },
        {
          key: "isActive",
          header: "Active",
          accessorKey: "isActive",
          sortable: true,
          cell: (row) => String(row?.isActive ?? false),
        },
        dateColumn("createdAt", "Created At"),
        dateColumn("updatedAt", "Updated At"),
      ];
  }
};

// --------------------------------------------------
// Main Component
// --------------------------------------------------

export default function ResourcesLandingPage({
  resources,
  resourceData,
}: ResourceLandingProps) {
  const router = useRouter();

  const data = useMemo(
    () => (Array.isArray(resourceData) ? resourceData : []),
    [resourceData],
  );

  const columns = useMemo(() => getColumns(resources), [resources]);

  const title = resources
    ? resources.charAt(0).toUpperCase() + resources.slice(1)
    : "Resources";

  const handleNavigate = (row: any) => {
    if (!row?.id || !resources) return;

    router.push(`/admin/${resources}/${row.id}`);
  };

  return (
    <div className="space-y-6 p-6">
      <GlobalTable
        data={data}
        columns={columns}
        getRowId={(row: any) => row?.id}
        title={title}
        description={`Manage your ${resources || "items"}.`}
        searchable
        pagination
        pageSize={10}
        selectable
        addButton={
          resources
            ? {
                label: `Add ${resources}`,
                onClick: () => router.push(`/admin/${resources}/create`),
              }
            : undefined
        }
        onRowClick={handleNavigate}
        onEdit={handleNavigate}
        onDelete={(row: any) => {
          if (!row?.id) return;
          console.log(`Delete ${resources}:`, row.id);
        }}
      />
    </div>
  );
}
