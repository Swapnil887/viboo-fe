"use client";

import React, { useEffect, useState } from "react";
import GLobalForm from "@/components/Global/GLobalForm";

export default function ProductFormPage({
  id,
  resourceData,
}: {
  id: any;
  resourceData: any;
}) {
  type SelectOption = {
    value: string;
    label: string;
  };

  const [product, setProduct] = useState<any>([
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
      field_name: "brandId",
      field_label: "Brand",
      input_type: "select",
      required: false,
      placeholder: "Select brand",
      options: [],
    },
    {
      field_name: "categoryIds",
      field_label: "Category",
      input_type: "multi select",
      required: false,
      placeholder: "Select category",
      options: [],
    },
    {
      field_name: "attributes",
      field_label: "Sclect product Attribute",
      input_type: "multi select",
      dependsOn: "categoryIds",
      required: false,
      placeholder: "Select Product Category",
      options: [],
      fetchOptions: async (countryValues: any) => {
        const fetchCategoryAttributeData = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories?categoryIds=${countryValues.join(",")}`,
        );

        const CategoryAttributeData = await fetchCategoryAttributeData.json();

        console.log("CategoryAttributeData", CategoryAttributeData);

        const data = CategoryAttributeData.data.flatMap((ele: any) => {
          return ele.attribute.values.map((attributeValue: any) => ({
            value: attributeValue.id,
            label: attributeValue.value,
            metadata: attributeValue,
          }));
        });

        return data;
      },
    },
    {
      field_name: "options",
      field_label: "options",
      input_type: "textarea",
      required: false,
      placeholder: "Select brand",
      options: [],
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [response, categoryResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/brand`),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/category`),
        ]);

        if (!response.ok) {
          throw new Error("Failed to fetch brands");
        }

        if (!categoryResponse.ok) {
          throw new Error("Failed to fetch categories");
        }

        const fetchResponse = await response.json();
        const fetchCategoryResponse = await categoryResponse.json();

        const brands = fetchResponse.data || [];
        const categories = fetchCategoryResponse.data || [];

        const brandOptions: SelectOption[] = brands
          .filter((brand: any) => brand.isActive)
          .map((brand: any) => ({
            value: brand.id,
            label: brand.name,
          }));

        const categoryOptions: SelectOption[] = categories
          .filter((category: any) => category.isActive)
          .map((category: any) => ({
            value: category.id,
            label: category.name,
          }));

        setProduct((prev: any) =>
          prev.map((field: any) => {
            if (field.field_name === "brandId") {
              return {
                ...field,
                options: brandOptions,
              };
            }

            if (field.field_name === "categoryIds") {
              return {
                ...field,
                options: categoryOptions,
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
        if (ele.name === "categoryIds") {
          data[ele.name] = ele.answer.split(",");
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

      data.options = JSON.parse(data.options);
      console.log("data", data);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`,
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
          title="Add New Product"
          buttonText="Submit"
          additionalData={product}
          handleFormSubmit={handleFormSubmit}
          gridClassName="grid grid-cols-1 md:grid-cols-2 gap-6"
        />
      </div>
    </>
  );
}
