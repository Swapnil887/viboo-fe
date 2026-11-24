"use client";
import GLobalForm from "@/components/Global/GLobalForm";
import React from "react"; // Update path as per your directory structure
import { brandFormFields } from "../constants";

export default function BrandForm({
  id,
  resourceData,
}: {
  id: any;
  resourceData: any;
}) {
  // Define mock handler for form submission
  const handleFormSubmit = async (formData: any) => {
    console.log(
      "Submitted Form Data:",
      formData,
      process.env.NEXT_PUBLIC_BACKEND_URL,
    );

    // Simulate API request delay

    let data: any = {};

    formData.map((ele: any) => {
      data[ele.name] = ele.answer;
    });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/brand`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );

    // Return true to trigger form.reset() inside GlobalForm
    return true;
  };

  // Configuration for all supported form fields
  const formFields = brandFormFields;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg my-10">
      <GLobalForm
        title="Add new Brand"
        buttonText="Submit"
        additionalData={formFields}
        handleFormSubmit={handleFormSubmit}
        gridClassName="grid grid-cols-1 md:grid-cols-2 gap-6"
      />
    </div>
  );
}
