"use client";

import React, { useEffect, useState } from "react";
import GLobalForm from "@/components/Global/GLobalForm";

export default function ProductForm() {
  const [product, setProduct] = useState<any[]>([
    {
      field_name: "name",
      field_label: "Product Name",
      input_type: "text",
      required: true,
      placeholder: "Enter product name",
      error_message: "Product name is required",
    },
    {
      field_name: "slug",
      field_label: "Slug",
      input_type: "text",
      required: true,
      placeholder: "Enter product slug",
      error_message: "Product slug is required",
    },
    {
      field_name: "description",
      field_label: "Description",
      input_type: "textarea",
      required: false,
      placeholder: "Enter product description",
    },
    {
      field_name: "productType",
      field_label: "Product Type",
      input_type: "select",
      required: true,
      placeholder: "Select product type",
      options: [
        { value: "PHYSICAL", label: "Physical" },
        { value: "DIGITAL", label: "Digital" },
      ],
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
      field_name: "isFeatured",
      field_label: "Featured Product",
      input_type: "select",
      required: true,
      placeholder: "Select featured status",
      options: [
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ],
    },
    {
      field_name: "country",
      field_label: "Country",
      input_type: "select",
      options: [
        { value: "in", label: "India" },
        { value: "us", label: "United States" },
      ],
    },
    {
      field_name: "state",
      field_label: "State / Province",
      input_type: "select",
      dependsOn: "country",
      // Async function called whenever country changes
      fetchOptions: async (countryValue: any) => {
        // const response = await fetch(`/api/states?country=${countryValue}`);
        const data =
          countryValue == "India"
            ? [{ id: "idr", name: "indore" }]
            : [{ id: "la", name: "lasvegas" }];
        return data.map((s: any) => ({ value: s.id, label: s.name }));
      },
    },
  ]);

  // Fetch brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/brand`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch brands");
        }

        const result = await response.json();

        const brandOptions = result.data.map((ele: any) => ({
          value: ele.id,
          label: ele.name,
        }));

        setProduct((prev) => {
          const filteredFields = prev.filter(
            (field) => field.field_name !== "brandId",
          );

          return [
            ...filteredFields,
            {
              field_name: "brandId",
              field_label: "Brand",
              input_type: "select",
              required: false,
              placeholder: "Select brand",
              options: brandOptions,
            },
          ];
        });
      } catch (error) {
        console.error("Brand fetch error:", error);
      }
    };

    fetchBrands();
  }, []);

  // Submit product
  const handleFormSubmit = async (formData: any) => {
    try {
      const data: any = {};

      formData.forEach((ele: any) => {
        data[ele.name] = ele.answer;
      });

      // Convert string values into correct data types
      data.isFeatured = data.isFeatured === "true";

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/product`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        console.error("Product creation failed:", result);
        return false;
      }

      console.log("Product created successfully:", result);

      return true;
    } catch (error) {
      console.error("Product submission error:", error);
      return false;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg my-10">
      <GLobalForm
        title="Add New Product"
        buttonText="Submit"
        additionalData={product}
        handleFormSubmit={handleFormSubmit}
        gridClassName="grid grid-cols-1 md:grid-cols-2 gap-6"
      />
    </div>
  );
}
