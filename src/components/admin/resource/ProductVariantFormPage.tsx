"use client";

import React, { useEffect, useState } from "react";
import GLobalForm from "@/components/Global/GLobalForm";

export default function ProductVariantFormPage({ id }: { id: any }) {
  type SelectOption = {
    value: string;
    label: string;
  };

  const [product, setProduct] = useState<any>([
    {
      field_name: "product",
      field_label: "Product",
      input_type: "select",
      required: true,
      placeholder: "Select Product",
      options: [],
    },
    {
      field_name: "sku",
      field_label: "SKU",
      input_type: "text",
      required: true,
      placeholder: "Enter product sku",
      error_message: "Product sku is required",
    },
    {
      field_name: "barcode",
      field_label: "Barcode",
      input_type: "text",
      required: false,
      placeholder: "Enter product barcode",
    },
    {
      field_name: "weight",
      field_label: "weight",
      input_type: "text",
      required: true,
      placeholder: "Enter product weight",
    },
    {
      field_name: "status",
      field_label: "Status",
      input_type: "select",
      required: true,
      placeholder: "Select product status",
      options: [
        { value: "DRAFT", label: "Draft" },
        { value: "ACTIVE", label: "Active" },
        { value: "ARCHIVED", label: "Archived" },
      ],
    },
    {
      field_name: "currency",
      field_label: "currency",
      input_type: "select",
      required: true,
      placeholder: "Select featured status",
      options: [{ value: "INR", label: "INR" }],
    },
    {
      field_name: "price",
      field_label: "price",
      input_type: "text",
      required: true,
      placeholder: "Enter Price",
    },
    {
      field_name: "compareAtPrice",
      field_label: "Compare At Price",
      input_type: "text",
      required: true,
      placeholder: "Enter Price",
    },
    {
      field_name: "warehouseId",
      field_label: "Warehouse",
      input_type: "select",
      required: true,
      placeholder: "Select Warehouse",
      options: [],
    },
    {
      field_name: "quantity",
      field_label: "Quantity",
      input_type: "text",
      required: true,
      placeholder: "Enter Quantity",
    },
    {
      field_name: "options",
      field_label: "Sclect options",
      input_type: "multi select",
      dependsOn: "product",
      required: false,
      placeholder: "Select Product Category",
      options: [],
      fetchOptions: async (countryValues: any) => {
        console.log(countryValues);
        const fetchCategoryAttributeData = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/options/${countryValues}`,
        );

        const CategoryAttributeData = await fetchCategoryAttributeData.json();

        console.log(CategoryAttributeData);

        const data = CategoryAttributeData.data.flatMap((ele: any) => {
          return ele.values.map((attributeValue: any) => ({
            value: attributeValue.id,
            label: `${ele.name}-${attributeValue.value}`,
            metadata: attributeValue,
          }));
        });

        return data;
      },
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [response, fetchWhereHouse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/warehouses`),
        ]);

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        if (!fetchWhereHouse.ok) {
          throw new Error("Failed to fetch wherehouse");
        }

        const fetchResponse = await response.json();
        const fetchWherHouseResponse = await fetchWhereHouse.json();

        const brands = fetchResponse.data || [];
        const wherehouse = fetchWherHouseResponse.data || [];

        const brandOptions: SelectOption[] = brands.map((brand: any) => ({
          value: brand.id,
          label: brand.name,
        }));

        const wherehouseOption: SelectOption[] = wherehouse.map(
          (brand: any) => ({
            value: brand.id,
            label: `${brand.code}-${brand.name}`,
          }),
        );

        setProduct((prev: any) =>
          prev.map((field: any) => {
            if (field.field_name === "product") {
              return {
                ...field,
                options: brandOptions,
              };
            }

            return field;
          }),
        );

        setProduct((prev: any) =>
          prev.map((field: any) => {
            if (field.field_name === "warehouseId") {
              return {
                ...field,
                options: wherehouseOption,
              };
            }

            return field;
          }),
        );
      } catch (error) {
        console.error("Fetch Brand/Category Error:", error);
      }
    };

    fetchData();
  }, []);
  // Submit product
  const handleFormSubmit = async (formData: any) => {
    try {
      const data: any = {};

      console.log(formData);

      formData.forEach((ele: any) => {
        if (ele.name === "options") {
          data.optionValueIds = ele.answer.split(",");
        } else if (ele.name === "attributes") {
          console.log("**", ele.metadata);
          data[ele.name] = ele.metadata.map((attribute: any) => {
            return {
              attributeId: attribute.metadata.attributeId,
              attributeValueId: attribute.metadata.id,
            };
          });
        } else {
          data[ele.name] = ele.answer;
        }
      });

      // Convert string values into correct data types
      data.isFeatured = data.isFeatured === "true";

      data.images = [
        {
          imageUrl: "https://your-cdn.com/kids-hat-blue-front.jpg",
          altText: "Kids blue cotton hat front view",
          sortOrder: 0,
          isPrimary: true,
        },
        {
          imageUrl: "https://your-cdn.com/kids-hat-blue-side.jpg",
          altText: "Kids blue cotton hat side view",
          sortOrder: 1,
          isPrimary: false,
        },
      ];
      const updatedData = {
        variants: [
          {
            sku: data.sku,
            barcode: data.barcode,
            weight: data.weight,
            isActive: data.status === "ACTIVE",

            optionValueIds: data.optionValueIds,

            price: {
              price: data.price,
              compareAtPrice: data.compareAtPrice,
              currency: data.currency,
            },

            inventory: [
              {
                warehouseId: data.warehouseId,
                quantity: Number(data.quantity),
              },
            ],

            images: data.images,
          },
        ],
      };

      console.log(updatedData, data.product);
      //   return;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/${data.product}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        console.error("Product creation failed:", result);
        return false;
      }

      console.log("Product created successfully:", result);
      alert("Product created successfully:");

      return true;
    } catch (error) {
      console.error("Product submission error:", error);
      return false;
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg my-10">
        <GLobalForm
          title="Add New Product Variant"
          buttonText="Submit"
          additionalData={product}
          handleFormSubmit={handleFormSubmit}
          gridClassName="grid grid-cols-1 md:grid-cols-2 gap-6"
        />
      </div>
    </>
  );
}
