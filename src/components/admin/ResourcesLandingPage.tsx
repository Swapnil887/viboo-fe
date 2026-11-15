"use client";

import { Badge } from "@/components/ui/badge";
import { GlobalTable } from "../Global/GlobalTable";
import { useRouter } from "next/navigation";

export default function ResourcesLandingPage({ resources, resourceData }: any) {
  const categories: any = resourceData;
  const router = useRouter();
  const columns =
    resources == "category"
      ? [
          {
            key: "name",
            header: "Category",
            sortable: true,
          },
          {
            key: "slug",
            header: "Slug",
            sortable: true,
          },
          {
            key: "description",
            header: "Description",
            sortable: false,
          },
          {
            key: "sortOrder",
            header: "Sort Order",
            sortable: false,
          },
          {
            key: "parentId",
            header: "Parent Category",
            sortable: false,
            cell: (row: any) => (
              <span>{row.parentId ? row.parentId : "Root Category"}</span>
            ),
          },
          {
            key: "isActive",
            header: "Status",
            cell: (row: any) => (
              <Badge variant={row.isActive ? "default" : "secondary"}>
                {row.isActive ? "Active" : "Inactive"}
              </Badge>
            ),
          },
          {
            key: "createdAt",
            header: "Created At",
            sortable: true,
            cell: (row: any) => new Date(row.createdAt).toLocaleDateString(),
          },
        ]
      : resources == "brand"
        ? [
            {
              key: "logoUrl",
              header: "Logo",
              sortable: false,
              searchable: false,
              cell: (row: any) =>
                row.logoUrl ? (
                  <img
                    src={row.logoUrl}
                    alt={row.name}
                    className="h-10 w-10 rounded-md border object-contain"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">N/A</span>
                  </div>
                ),
            },
            {
              key: "name",
              header: "Brand Name",
              sortable: true,
            },
            {
              key: "slug",
              header: "Slug",
              sortable: true,
            },
            {
              key: "isActive",
              header: "Status",
              cell: (row: any) => (
                <Badge variant={row.isActive ? "default" : "secondary"}>
                  {row.isActive ? "Active" : "Inactive"}
                </Badge>
              ),
            },
            {
              key: "createdAt",
              header: "Created At",
              sortable: true,
              cell: (row: any) =>
                new Date(row.createdAt).toLocaleDateString("en-IN"),
            },
          ]
        : resources == "products"
          ? [
              {
                key: "id",
                header: "ProductId",
                accessorKey: "id",
                sortable: true,
                searchable: true,
                cell: (row: any) => (
                  <div className="flex flex-col">
                    <span className="font-medium">{row.id}</span>
                    <span className="text-xs text-muted-foreground">
                      {row.slug}
                    </span>
                  </div>
                ),
              },
              {
                key: "name",
                header: "Product",
                accessorKey: "name",
                sortable: true,
                searchable: true,
                cell: (row: any) => (
                  <div className="flex flex-col">
                    <span className="font-medium">{row.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {row.slug}
                    </span>
                  </div>
                ),
              },
              {
                key: "brand",
                header: "Brand",
                accessorFn: (row: any) => row.brand?.name ?? "—",
                sortable: true,
                searchable: true,
                cell: (row: any) => row.brand?.name ?? "—",
              },
              {
                key: "category",
                header: "Category",
                accessorFn: (row: any) =>
                  row.categories
                    .map((item: any) => item.category.name)
                    .join(", "),
                searchable: true,
                cell: (row: any) => (
                  <div className="flex flex-wrap gap-1">
                    {row.categories.map((item: any) => (
                      <Badge key={item.id} variant="outline">
                        {item.category.name}
                        {item.isPrimary && " (Primary)"}
                      </Badge>
                    ))}
                  </div>
                ),
              },
              {
                key: "productType",
                header: "Type",
                accessorKey: "productType",
                sortable: true,
                cell: (row: any) => (
                  <Badge variant="secondary">{row.productType}</Badge>
                ),
              },
              {
                key: "status",
                header: "Status",
                accessorKey: "status",
                sortable: true,
                cell: (row: any) => (
                  <Badge
                    variant={row.status === "ACTIVE" ? "default" : "outline"}
                  >
                    {row.status}
                  </Badge>
                ),
              },
              {
                key: "isFeatured",
                header: "Featured",
                accessorKey: "isFeatured",
                sortable: true,
                cell: (row: any) => (
                  <Badge variant={row.isFeatured ? "default" : "outline"}>
                    {row.isFeatured ? "Featured" : "No"}
                  </Badge>
                ),
              },
              {
                key: "createdAt",
                header: "Created At",
                accessorKey: "createdAt",
                sortable: true,
                cell: (row: any) =>
                  new Date(row.createdAt).toLocaleDateString("en-IN"),
              },
            ]
          : resources == "product-varient"
            ? [
                {
                  key: "id",
                  header: "id",
                  accessorKey: "id",
                  sortable: true,
                  searchable: true,
                  cell: (row: any) => (
                    <div className="flex flex-col">
                      <span className="font-medium">{row.id}</span>
                      <span className="text-xs text-muted-foreground">
                        {row.slug}
                      </span>
                    </div>
                  ),
                },
                {
                  key: "productId",
                  header: "Product",
                  accessorKey: "productId",
                  sortable: true,
                  searchable: true,
                  cell: (row: any) => (
                    <div className="flex flex-col">
                      <span className="font-medium">{row.productId}</span>
                      <span className="text-xs text-muted-foreground">
                        {row.slug}
                      </span>
                    </div>
                  ),
                },
                {
                  key: "product",
                  header: "product",
                  accessorFn: (row: any) => row.product ?? "—",
                  sortable: true,
                  searchable: true,
                  cell: (row: any) => row.product.name ?? "—",
                },
                {
                  key: "sku",
                  header: "sku",
                  accessorFn: (row: any) => row.sku ?? "—",
                  sortable: true,
                  searchable: true,
                  cell: (row: any) => row.sku ?? "—",
                },

                {
                  key: "isActive",
                  header: "isActive",
                  accessorKey: "isActive",
                  sortable: true,
                  cell: (row: any) => (
                    <Badge variant="secondary">
                      {JSON.stringify(row.isActive)}
                    </Badge>
                  ),
                },
                {
                  key: "barcode",
                  header: "barcode",
                  accessorKey: "barcode",
                  sortable: true,
                  cell: (row: any) => (
                    <Badge variant="secondary">{row.barcode}</Badge>
                  ),
                },
                {
                  key: "weight",
                  header: "weight",
                  accessorKey: "weight",
                  sortable: true,
                  cell: (row: any) => (
                    <Badge variant="secondary">{row.weight}</Badge>
                  ),
                },
                {
                  key: "isActive",
                  header: "isActive",
                  accessorKey: "isActive",
                  sortable: true,
                  cell: (row: any) => (
                    <Badge variant="secondary">{row.isActive}</Badge>
                  ),
                },
                {
                  key: "createdAt",
                  header: "Created At",
                  accessorKey: "createdAt",
                  sortable: true,
                  cell: (row: any) =>
                    new Date(row.createdAt).toLocaleDateString("en-IN"),
                },
              ]
            : [];

  return (
    <div className="p-6 space-y-6">
      <GlobalTable
        data={categories}
        columns={columns}
        getRowId={(row: any) => row.id}
        title="Categories"
        description="Manage your product categories."
        searchable
        pagination
        pageSize={10}
        selectable
        addButton={{
          label: `Add ${resources}`,
          onClick: () => router.push(`/admin/${resources}/create`),
        }}
        onRowClick={(row: any) => router.push(`/admin/${resources}/${row.id}`)}
        onEdit={(row: any) => router.push(`/admin/${resources}/${row.id}/edit`)}
        onDelete={(row: any) => {
          console.log("Delete category:", row.id);
        }}
      />
    </div>
  );
}
