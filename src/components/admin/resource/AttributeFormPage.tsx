"use client";

import { useMemo, useState } from "react";
import GLobalForm from "@/components/Global/GLobalForm";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");

interface AttributeFormProps {
  id: string;
  resourceData?: {
    name?: string | null;
    slug?: string | null;
    dataType?: string | null;
    isFilterable?: boolean | null;
    isSearchable?: boolean | null;
    attributeValue?: string[] | string | null;
  } | null;
}

interface FormFieldData {
  name?: string;
  answer?: unknown;
}

interface ApiResponse {
  message?: string;
  success?: boolean;
  [key: string]: unknown;
}

// Convert an optional value into a safe string.
const toStringValue = (value: unknown): string => {
  if (value === null || value === undefined) return "";
  return String(value);
};

// Convert comma-separated values into a clean array.
const parseAttributeValues = (value: unknown): string[] => {
  const values = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : [];

  return values
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
};

// Convert select values into actual booleans.
const parseBoolean = (value: unknown): boolean | undefined => {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;

  return undefined;
};

export default function AttributeFormPage({
  id,
  resourceData,
}: AttributeFormProps) {
  const isCreate = id === "create";

  const [submitError, setSubmitError] = useState("");

  const additionalData = useMemo(
    () => [
      {
        field_name: "name",
        field_label: "Attribute Name",
        input_type: "text",
        inputValue: resourceData?.name ?? "",
        required: true,
        placeholder: "Enter attribute name",
        error_message: "Attribute name is required",
      },
      {
        field_name: "slug",
        field_label: "Slug",
        input_type: "text",
        inputValue: resourceData?.slug ?? "",
        disabled: !isCreate,
        required: true,
        placeholder: "Enter slug name",
        error_message: "Slug name is required",
      },
      {
        field_name: "dataType",
        field_label: "Data Type",
        input_type: "select",
        inputValue: resourceData?.dataType ?? "",
        required: false,
        placeholder: "Select data type",
        options: [
          { value: "TEXT", label: "TEXT" },
          { value: "NUMBER", label: "NUMBER" },
          { value: "BOOLEAN", label: "BOOLEAN" },
          { value: "SELECT", label: "SELECT" },
        ],
      },
      {
        field_name: "isFilterable",
        field_label: "Is Filterable",
        input_type: "select",
        inputValue: toStringValue(resourceData?.isFilterable),
        required: false,
        placeholder: "Select filterable status",
        options: [
          { value: "true", label: "True" },
          { value: "false", label: "False" },
        ],
      },
      {
        field_name: "isSearchable",
        field_label: "Is Searchable",
        input_type: "select",
        inputValue: toStringValue(resourceData?.isSearchable),
        required: false,
        placeholder: "Select searchable status",
        options: [
          { value: "true", label: "True" },
          { value: "false", label: "False" },
        ],
      },
      {
        field_name: "attributeValue",
        field_label: "Attribute Values",
        input_type: "text",
        inputValue: Array.isArray(resourceData?.attributeValue)
          ? resourceData.attributeValue.join(", ")
          : (resourceData?.attributeValue ?? ""),
        required: false,
        placeholder: "Enter values separated by commas",
      },
    ],
    [resourceData, isCreate],
  );

  const handleFormSubmit = async (formData: FormFieldData[]) => {
    try {
      setSubmitError("");

      if (!API_URL) {
        throw new Error("Backend URL is not configured");
      }

      if (!Array.isArray(formData)) {
        throw new Error("Invalid form data");
      }

      const data: Record<string, unknown> = {};

      formData.forEach((field) => {
        if (!field || typeof field.name !== "string") return;

        const { name, answer } = field;

        // Slug can only be updated during creation.
        if (!isCreate && name === "slug") return;

        switch (name) {
          case "name":
          case "slug":
            data[name] = toStringValue(answer).trim();
            break;

          case "dataType":
            if (answer !== null && answer !== undefined) {
              data[name] = toStringValue(answer);
            }
            break;

          case "isFilterable":
          case "isSearchable": {
            const value = parseBoolean(answer);

            if (value !== undefined) {
              data[name] = value;
            }
            break;
          }

          case "attributeValue":
            data[name] = parseAttributeValues(answer);
            break;

          default:
            break;
        }
      });

      // Basic required-field validation.
      if (!data.name) {
        setSubmitError("Attribute name is required");
        return false;
      }

      if (isCreate && !data.slug) {
        setSubmitError("Slug is required");
        return false;
      }

      const url = isCreate
        ? `${API_URL}/api/attributes`
        : `${API_URL}/api/attributes/${encodeURIComponent(id)}`;

      const response = await fetch(url, {
        method: isCreate ? "POST" : "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      let result: ApiResponse = {};

      try {
        result = await response.json();
      } catch {
        // Handles empty or non-JSON responses.
      }

      if (!response.ok || result.success === false) {
        throw new Error(
          typeof result.message === "string"
            ? result.message
            : "Attribute submission failed",
        );
      }

      console.log(
        isCreate ? "Attribute created:" : "Attribute updated:",
        result,
      );

      return true;
    } catch (error) {
      console.error("Attribute submission error:", error);

      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );

      return false;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg my-10">
      <GLobalForm
        title={isCreate ? "Add New Attribute" : "Edit Attribute"}
        buttonText={isCreate ? "Create Attribute" : "Update Attribute"}
        additionalData={additionalData}
        handleFormSubmit={handleFormSubmit}
        gridClassName="grid grid-cols-1 md:grid-cols-2 gap-6"
      />

      {submitError && (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {submitError}
        </p>
      )}
    </div>
  );
}
