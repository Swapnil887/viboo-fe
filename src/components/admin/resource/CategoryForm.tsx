"use client";

import React, { useEffect, useState } from "react";
import GLobalForm from "@/components/Global/GLobalForm";

export default function CategoryForm() {
  const [category, setCategory] = useState<any[]>([
    {
      field_name: "name",
      field_label: "Category Name",
      input_type: "text",
      required: true,
      placeholder: "Enter category name",
      error_message: "Category name is required",
    },
    {
      field_name: "slug",
      field_label: "Slug",
      input_type: "text",
      required: true,
      placeholder: "Enter slug name",
      error_message: "Slug name is required",
    },
  ]);

  // Fetch parent categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/category`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const result = await response.json();

        const responseData = result.data.map((ele: any) => ({
          value: ele.id,
          label: ele.name,
        }));

        setCategory((prev) => {
          const filteredFields = prev.filter(
            (field) => field.field_name !== "parentId",
          );

          return [
            ...filteredFields,
            {
              field_name: "parentId",
              field_label: "Parent Category",
              input_type: "select",
              required: false,
              placeholder: "Select parent category",
              options: responseData,
            },
          ];
        });
      } catch (error) {
        console.error("Category fetch error:", error);
      }
    };

    fetchCategories();
  }, []);

  // Submit category
  const handleFormSubmit = async (formData: any) => {
    try {
      const data: any = {};

      formData.forEach((ele: any) => {
        data[ele.name] = ele.answer;
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/category`,
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
        console.error("Category creation failed:", result);
        return false;
      }

      console.log("Category created successfully:", result);

      return true;
    } catch (error) {
      console.error("Category submission error:", error);
      return false;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg my-10">
      <GLobalForm
        title="Add New Category"
        buttonText="Submit"
        additionalData={category}
        handleFormSubmit={handleFormSubmit}
        gridClassName="grid grid-cols-1 md:grid-cols-2 gap-6"
      />
    </div>
  );
}
