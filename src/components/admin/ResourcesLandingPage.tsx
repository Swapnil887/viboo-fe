"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { GlobalTable, GlobalTableColumn } from "../Global/GlobalTable";

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  status: string;
  category: string;
}

const products: Product[] = [
  {
    id: "1",
    name: "Boys Cotton T-Shirt",
    sku: "VB-TS-001",
    price: 499,
    stock: 120,
    status: "ACTIVE",
    category: "T-Shirts",
  },
  {
    id: "2",
    name: "Girls Floral Dress",
    sku: "VB-DR-002",
    price: 899,
    stock: 45,
    status: "ACTIVE",
    category: "Dresses",
  },
  {
    id: "3",
    name: "Kids Denim Jeans",
    sku: "VB-JN-003",
    price: 799,
    stock: 0,
    status: "DRAFT",
    category: "Jeans",
  },
];

export default function ResourcesLandingPage({ resourceData }: any) {
  const columns: GlobalTableColumn<Product>[] = [
    {
      key: "name",
      header: "Product",
      accessorKey: "name",
    },
    {
      key: "sku",
      header: "SKU",
      accessorKey: "sku",
    },
    {
      key: "category",
      header: "Category",
      accessorKey: "category",
    },
    {
      key: "price",
      header: "Price",
      accessorKey: "price",
      cell: (_, value) => (
        <span className="font-medium">₹{value.toLocaleString("en-IN")}</span>
      ),
    },
    {
      key: "stock",
      header: "Stock",
      accessorKey: "stock",
      cell: (_, value) => (
        <span className={value === 0 ? "text-red-500" : ""}>{value} units</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      accessorKey: "status",
      cell: (_, value) => (
        <Badge variant={value === "ACTIVE" ? "default" : "secondary"}>
          {value}
        </Badge>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {resourceData?.map((ele: any, index: number) => (
        <div key={index}>
          {Object.entries(ele).map(([key, value]) => (
            <p key={key}>
              {key}: {JSON.stringify(value)}
            </p>
          ))}
        </div>
      ))}
      {/* <GlobalTable
        title="Products"
        description="Manage your store products and inventory."
        columns={columns}
        data={products}
        searchable
        pagination
        pageSize={10}
        searchPlaceholder="Search products..."
        getRowId={(row) => row.id}
        toolbar={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        }
        actions={(row) => (
          <>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => console.log("Edit", row.id)}
            >
              <Pencil className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="text-red-500"
              onClick={() => console.log("Delete", row.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      /> */}
    </div>
  );
}
