"use client";

import { useEffect, useMemo, useState } from "react";
import GLobalForm from "@/components/Global/GLobalForm";

// ==================================================
// API CONFIG
// ==================================================

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, "");

// ==================================================
// TYPES
// ==================================================

interface CategoryOption {
  value: string;
  label: string;
}

interface CategoryOptions {
  attributes: CategoryOption[];
  categories: CategoryOption[];
}

interface Attribute {
  id?: string | null;
  name?: string | null;
}

interface CategoryAttribute {
  attributeId?: string | null;
  attribute?: Attribute | null;
}

interface Category {
  id: string;
  name?: string | null;
  parentId?: string | null;
  isActive?: boolean;
}

interface CategoryResource {
  id?: string;
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  sortOrder?: number | null;
  parentId?: string | null;
  attributeIds?: string[] | null;
  attributes?: CategoryAttribute[] | null;
}

interface CategoryFormProps {
  id: string;
  resourceData?: CategoryResource | null;
}

interface FormFieldValue {
  name: string;
  answer: unknown;
}

interface ApiResult<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

// ==================================================
// COMMON HELPERS
// ==================================================

const isValidString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const getApiData = async <T,>(response: Response): Promise<ApiResult<T>> => {
  try {
    return await response.json();
  } catch {
    throw new Error("Invalid server response");
  }
};

const getErrorMessage = (error: unknown): string =>
  error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";

// ==================================================
// ATTRIBUTE HELPERS
// ==================================================

const getAttributeIds = (resourceData?: CategoryResource | null): string[] => {
  if (Array.isArray(resourceData?.attributeIds)) {
    return [...new Set(resourceData.attributeIds.filter(isValidString))];
  }

  if (!Array.isArray(resourceData?.attributes)) {
    return [];
  }

  return [
    ...new Set(
      resourceData.attributes
        .map((item) => item?.attributeId ?? item?.attribute?.id)
        .filter(isValidString),
    ),
  ];
};

// ==================================================
// CATEGORY HIERARCHY HELPERS
// ==================================================

const getDescendantIds = (
  categoryId: string,
  categories: Category[],
): Set<string> => {
  const childrenMap = new Map<string, string[]>();

  for (const category of categories) {
    if (
      !category ||
      !isValidString(category.id) ||
      !isValidString(category.parentId)
    ) {
      continue;
    }

    const children = childrenMap.get(category.parentId) ?? [];

    children.push(category.id);
    childrenMap.set(category.parentId, children);
  }

  const descendants = new Set<string>();
  const visited = new Set<string>([categoryId]);
  const stack = [categoryId];

  while (stack.length > 0) {
    const currentId = stack.pop();

    if (!currentId) continue;

    const children = childrenMap.get(currentId) ?? [];

    for (const childId of children) {
      if (visited.has(childId)) continue;

      visited.add(childId);
      descendants.add(childId);
      stack.push(childId);
    }
  }

  return descendants;
};

// ==================================================
// FETCH FORM OPTIONS
// ==================================================

const fetchOptions = async (
  signal: AbortSignal,
  categoryId: string,
  isCreate: boolean,
): Promise<CategoryOptions> => {
  if (!API_URL) {
    throw new Error("Backend URL is not configured");
  }

  const [attributeResponse, categoryResponse] = await Promise.all([
    fetch(`${API_URL}/api/attributes`, { signal }),
    fetch(`${API_URL}/api/category`, { signal }),
  ]);

  if (!attributeResponse.ok || !categoryResponse.ok) {
    throw new Error("Failed to fetch category options");
  }

  const [attributeResult, categoryResult] = await Promise.all([
    getApiData<Attribute[]>(attributeResponse),
    getApiData<Category[]>(categoryResponse),
  ]);

  const allAttributes = Array.isArray(attributeResult?.data)
    ? attributeResult.data
    : [];

  const allCategories = Array.isArray(categoryResult?.data)
    ? categoryResult.data
    : [];

  const attributes: CategoryOption[] = allAttributes
    .filter(
      (item) => item && isValidString(item.id) && isValidString(item.name),
    )
    .map((item) => ({
      value: item.id!,
      label: item.name!,
    }));

  const excludedIds = isCreate
    ? new Set<string>()
    : getDescendantIds(categoryId, allCategories);

  if (!isCreate) {
    excludedIds.add(categoryId);
  }

  const categories: CategoryOption[] = allCategories
    .filter(
      (item) =>
        item &&
        item.isActive === true &&
        isValidString(item.id) &&
        isValidString(item.name) &&
        !excludedIds.has(item.id),
    )
    .map((item) => ({
      value: item.id,
      label: item.name!,
    }));

  return { attributes, categories };
};

// ==================================================
// PREPARE SUBMISSION DATA
// ==================================================

const preparePayload = (
  formData: FormFieldValue[],
  isCreate: boolean,
): Record<string, unknown> => {
  const data: Record<string, unknown> = {};

  for (const field of formData) {
    if (!field || !isValidString(field.name)) continue;

    const { name, answer } = field;

    if (!isCreate && name === "slug") continue;

    switch (name) {
      case "attributeIds": {
        const values = Array.isArray(answer)
          ? answer
          : typeof answer === "string"
            ? answer.split(",")
            : [];

        data[name] = [
          ...new Set(values.filter(isValidString).map((value) => value.trim())),
        ];
        break;
      }

      case "sortOrder": {
        if (answer === null || answer === undefined || answer === "") {
          throw new Error("Sort order is required");
        }

        const value = Number(answer);

        if (!Number.isFinite(value)) {
          throw new Error("Invalid sort order");
        }

        data[name] = value;
        break;
      }

      case "parentId":
        data[name] = isValidString(answer) ? answer.trim() : null;
        break;

      case "name":
      case "slug":
      case "description":
        data[name] = typeof answer === "string" ? answer.trim() : "";
        break;

      default:
        data[name] = answer;
    }
  }

  return data;
};

// ==================================================
// MAIN COMPONENT
// ==================================================

export default function CategorPageForm({
  id,
  resourceData,
}: CategoryFormProps) {
  const isCreate = id === "create";

  const [options, setOptions] = useState<CategoryOptions>({
    attributes: [],
    categories: [],
  });

  const [optionsError, setOptionsError] = useState("");
  const [submitError, setSubmitError] = useState("");

  // ----------------------------------------------
  // FETCH OPTIONS
  // ----------------------------------------------

  useEffect(() => {
    const controller = new AbortController();

    const loadOptions = async () => {
      try {
        setOptionsError("");

        const result = await fetchOptions(controller.signal, id, isCreate);

        if (!controller.signal.aborted) {
          setOptions(result);
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        if (!controller.signal.aborted) {
          console.error("Category options error:", error);
          setOptionsError(getErrorMessage(error));
        }
      }
    };

    loadOptions();

    return () => controller.abort();
  }, [id, isCreate]);

  // ----------------------------------------------
  // FORM CONFIGURATION
  // ----------------------------------------------

  const additionalData = useMemo(
    () => [
      {
        field_name: "name",
        field_label: "Category Name",
        input_type: "text",
        inputValue: resourceData?.name ?? "",
        required: true,
        placeholder: "Enter category name",
        error_message: "Category name is required",
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
        field_name: "description",
        field_label: "Description",
        input_type: "textarea",
        inputValue: resourceData?.description ?? "",
        required: false,
        placeholder: "Enter category description",
      },
      {
        field_name: "sortOrder",
        field_label: "Sort Order",
        input_type: "number",
        inputValue: resourceData?.sortOrder ?? 0,
        required: true,
        placeholder: "Enter sort order",
        error_message: "Sort order is required",
      },
      {
        field_name: "parentId",
        field_label: "Parent Category",
        input_type: "select",
        inputValue: resourceData?.parentId ?? "",
        required: false,
        placeholder: "Select parent category",
        options: options.categories,
      },
      {
        field_name: "attributeIds",
        field_label: "Select Attributes",
        input_type: "multi select",
        inputValue: getAttributeIds(resourceData),
        required: false,
        placeholder: "Select attributes",
        options: options.attributes,
      },
    ],
    [resourceData, isCreate, options],
  );

  // ----------------------------------------------
  // SUBMIT FORM
  // ----------------------------------------------

  const handleFormSubmit = async (
    formData: FormFieldValue[],
  ): Promise<boolean> => {
    try {
      setSubmitError("");

      if (!API_URL) {
        throw new Error("Backend URL is not configured");
      }

      if (!isCreate && !isValidString(id)) {
        throw new Error("Invalid category ID");
      }

      if (!Array.isArray(formData)) {
        throw new Error("Invalid form data");
      }

      const data = preparePayload(formData, isCreate);

      if (!isCreate && data.parentId === id) {
        throw new Error("A category cannot be its own parent");
      }

      const url = isCreate
        ? `${API_URL}/api/category`
        : `${API_URL}/api/category/${encodeURIComponent(id)}`;

      const response = await fetch(url, {
        method: isCreate ? "POST" : "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await getApiData<unknown>(response);

      if (!response.ok || result?.success === false) {
        throw new Error(result?.message || "Category submission failed");
      }

      console.log(
        isCreate ? "Category created:" : "Category updated:",
        result?.data ?? result,
      );

      return true;
    } catch (error: unknown) {
      console.error("Category submission error:", error);
      setSubmitError(getErrorMessage(error));

      return false;
    }
  };

  // ----------------------------------------------
  // RENDER
  // ----------------------------------------------

  return (
    <div className="mx-auto my-10 max-w-3xl rounded-lg bg-white p-6 shadow-md">
      {optionsError && (
        <p className="mb-4 text-sm text-red-600" role="alert">
          {optionsError}
        </p>
      )}

      <GLobalForm
        title={isCreate ? "Add New Category" : "Edit Category"}
        buttonText={isCreate ? "Create Category" : "Update Category"}
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
