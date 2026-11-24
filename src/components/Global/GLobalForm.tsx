"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormMessage,
  FormLabel,
  Form,
  FormItem,
} from "@/components/ui/form";
import { useForm, useWatch } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { X, ChevronDown } from "lucide-react";
import PhoneInput, { formatPhoneNumberIntl } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { toast } from "sonner";

// --------------------------------------------------
// CONSTANTS
// --------------------------------------------------

const FORM_FIELDS_TYPE = {
  EMAIL: "email",
  TEXT_AREA: "textarea",
  RADIO: "radio",
  SELECT: "select",
  CHECKBOX: "checkbox",
  DATE: "date",
  TIME: "time",
  NUMBER: "number",
  URL: "url",
  TEL: "tel",
  PHONE: "phone",
  PASSWORD: "password",
  USERNAME: "user name",
  FIRST_NAME: "first name",
  RADIO_BUTTON_BOX: "radio button box",
  MULTI_SELECT: "multi select",
};

const FORM_FIELDS_WARNING_MESSAGE = {
  email: "Please enter a valid email address",
  phone: "Please enter a valid phone number",
};

// --------------------------------------------------
// TYPES
// --------------------------------------------------

interface SelectOption {
  value: string;
  label: string;
  metadata?: Record<string, any>;
}

type DependencyValue = string | string[];

type FetchOptions = (parentValue: DependencyValue) => Promise<SelectOption[]>;

interface MultiSelectInputProps {
  field: {
    name: string;
    placeholder?: string;
    options: SelectOption[];
    disabled?: boolean;
    inputStyle?: string;
  };
  rhfField: {
    value: string[];
    onChange: (value: string[]) => void;
  };
  hasError: boolean;
}

// --------------------------------------------------
// MULTI SELECT COMPONENT
// --------------------------------------------------

function MultiSelectInput({
  field,
  rhfField,
  hasError,
}: MultiSelectInputProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedValues = Array.isArray(rhfField.value) ? rhfField.value : [];

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleOption = (optionValue: string) => {
    const newValues = selectedValues.includes(optionValue)
      ? selectedValues.filter((value) => value !== optionValue)
      : [...selectedValues, optionValue];

    rhfField.onChange(newValues);
  };

  const removeOption = (optionValue: string) => {
    rhfField.onChange(selectedValues.filter((value) => value !== optionValue));
  };

  const selectedOptions = field.options.filter((option) =>
    selectedValues.includes(option.value),
  );

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
        type="button"
        onClick={() => !field.disabled && setIsOpen(!isOpen)}
        disabled={field.disabled}
        className={`w-full border-2 py-1 px-3 bg-BackgroundDefault border-input rounded-sm flex items-center justify-between min-h-[44px] ${
          hasError ? "border-red_secondary" : ""
        } ${
          field.disabled ? "opacity-50 cursor-not-allowed" : ""
        } ${field.inputStyle || ""}`}
      >
        <div className="flex gap-2 flex-1 overflow-x-auto overflow-y-hidden scrollbar-hide">
          {selectedValues.length === 0 ? (
            <span className="text-muted-foreground whitespace-nowrap">
              {field.placeholder || "Select"}
            </span>
          ) : (
            selectedOptions.map((option) => (
              <span
                key={option.value}
                className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded flex-shrink-0"
              >
                <span className="truncate max-w-[120px]">{option.label}</span>

                <X
                  className="h-3 w-3 cursor-pointer hover:text-blue-600 flex-shrink-0"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeOption(option.value);
                  }}
                />
              </span>
            ))
          )}
        </div>

        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {field.options.map((option) => (
            <div
              key={option.value}
              onClick={() => toggleOption(option.value)}
              className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                selectedValues.includes(option.value) ? "bg-blue-50" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={selectedValues.includes(option.value)}
                readOnly
                className="h-4 w-4 accent-blue-600 pointer-events-none"
              />

              <span className="text-sm">{option.label}</span>
            </div>
          ))}

          {field.options.length === 0 && (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              No options available
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// --------------------------------------------------
// GLOBAL FORM
// --------------------------------------------------

function GLobalForm({
  title = "",
  buttonText = "",
  buttonData,
  additionalData = [],
  handleFormSubmit = () => {},
  variant = "",
  gridClassName = "grid grid-cols-1 md:grid-cols-2 gap-4",
}: {
  title?: string;
  buttonText?: string;
  buttonData?: {
    text: string;
    disabled?: boolean;
    classname?: string;
  };
  additionalData?: any[];
  handleFormSubmit?: any;
  variant?: string;
  gridClassName?: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic dropdown options
  const [dynamicOptions, setDynamicOptions] = useState<
    Record<string, SelectOption[]>
  >({});

  // Dynamic dropdown loading state
  const [loadingOptions, setLoadingOptions] = useState<Record<string, boolean>>(
    {},
  );

  // Previous dependency values
  const previousDependencyValues = useRef<Record<string, string>>({});

  // --------------------------------------------------
  // MAP CONFIGURATION TO FORM FIELDS
  // --------------------------------------------------

  const baseFields = useMemo(
    () =>
      additionalData.map((field: any) => ({
        name: field.field_name,
        label: field.field_label,
        type: field.input_type,
        required: field.required,
        options: field.options || [],
        placeholder: field.placeholder,
        min: field.min,
        max: field.max,
        error_message: field.error_message,
        min_error_message: field.min_error_message,
        max_error_message: field.max_error_message,

        dependsOn: field.dependsOn,
        dynamicMaxMap: field.dynamicMaxMap,
        fetchOptions: field.fetchOptions as FetchOptions | undefined,

        fullWidth: field.fullWidth || field.noGrid || false,
        disabled: field.disabled || false,
        inputValue: field.inputValue,
        inputStyle: field.inputStyle || "",
        rows: field.rows || undefined,
      })),
    [additionalData],
  );

  // --------------------------------------------------
  // DEFAULT VALUES
  // --------------------------------------------------

  const defaultValues = useMemo(
    () =>
      Object.fromEntries(
        baseFields.map((field: any) => {
          if (field.inputValue !== undefined && field.inputValue !== null) {
            return [field.name, field.inputValue];
          }

          const isArrayField =
            field.type === FORM_FIELDS_TYPE.MULTI_SELECT ||
            field.type === FORM_FIELDS_TYPE.CHECKBOX;

          return [field.name, isArrayField ? [] : ""];
        }),
      ),
    [baseFields],
  );

  const form = useForm<Record<string, any>>({
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  // Watch all form values
  const watchedValues = useWatch({
    control: form.control,
  });

  // --------------------------------------------------
  // DEPENDENT DROPDOWN LOGIC
  // --------------------------------------------------

  const getDependencyValue = (value: any): DependencyValue => {
    if (Array.isArray(value)) {
      return value;
    }

    return value ?? "";
  };

  const dependencySignature = JSON.stringify(
    baseFields
      .filter(
        (field: any) =>
          field.dependsOn && typeof field.fetchOptions === "function",
      )
      .map((field: any) => ({
        name: field.name,
        parentValue: getDependencyValue(watchedValues?.[field.dependsOn]),
      })),
  );

  useEffect(() => {
    let cancelled = false;

    const fetchDependentOptions = async () => {
      const dependentFields: any = baseFields.filter(
        (field: any) =>
          field.dependsOn && typeof field.fetchOptions === "function",
      );

      for (const field of dependentFields) {
        if (cancelled) return;

        const parentValue = getDependencyValue(form.getValues(field.dependsOn));

        const hasParentValue = Array.isArray(parentValue)
          ? parentValue.length > 0
          : Boolean(parentValue);

        const currentSignature = JSON.stringify(parentValue);

        const previousValue = previousDependencyValues.current[field.name];

        const hasPreviousValue = Object.prototype.hasOwnProperty.call(
          previousDependencyValues.current,
          field.name,
        );

        // Clear child value when parent changes
        if (hasPreviousValue && previousValue !== currentSignature) {
          const isArrayField =
            field.type === FORM_FIELDS_TYPE.MULTI_SELECT ||
            field.type === FORM_FIELDS_TYPE.CHECKBOX;

          form.setValue(field.name, isArrayField ? [] : "", {
            shouldDirty: true,
            shouldValidate: false,
          });

          form.clearErrors(field.name);
        }

        previousDependencyValues.current[field.name] = currentSignature;

        // Clear options when parent is empty
        if (!hasParentValue) {
          setDynamicOptions((prev) => ({
            ...prev,
            [field.name]: [],
          }));

          setLoadingOptions((prev) => ({
            ...prev,
            [field.name]: false,
          }));

          continue;
        }

        setLoadingOptions((prev) => ({
          ...prev,
          [field.name]: true,
        }));

        setDynamicOptions((prev) => ({
          ...prev,
          [field.name]: [],
        }));

        try {
          const options = await field.fetchOptions(parentValue);

          if (cancelled) return;

          setDynamicOptions((prev) => ({
            ...prev,
            [field.name]: Array.isArray(options) ? options : [],
          }));
        } catch (error) {
          if (cancelled) return;

          console.error(`Failed to fetch options for ${field.name}:`, error);

          setDynamicOptions((prev) => ({
            ...prev,
            [field.name]: [],
          }));
        } finally {
          if (!cancelled) {
            setLoadingOptions((prev) => ({
              ...prev,
              [field.name]: false,
            }));
          }
        }
      }
    };

    fetchDependentOptions();

    return () => {
      cancelled = true;
    };
  }, [dependencySignature, baseFields, form]);

  // --------------------------------------------------
  // COMBINE STATIC AND DYNAMIC OPTIONS
  // --------------------------------------------------

  const fields = useMemo(
    () =>
      baseFields.map((field: any) => ({
        ...field,
        options:
          typeof field.fetchOptions === "function"
            ? dynamicOptions[field.name] || []
            : field.options,
      })),
    [baseFields, dynamicOptions],
  );

  // --------------------------------------------------
  // GET SELECTED OPTION METADATA
  // --------------------------------------------------

  const getSelectedOptionMetadata = (field: any, answer: any) => {
    const options: SelectOption[] = field.options || [];

    const isMultiple =
      field.type === FORM_FIELDS_TYPE.MULTI_SELECT ||
      field.type === FORM_FIELDS_TYPE.CHECKBOX;

    // MULTI SELECT / CHECKBOX
    if (isMultiple) {
      const selectedValues = Array.isArray(answer) ? answer : [];

      return options
        .filter((option) => selectedValues.includes(option.value))
        .map((option) => ({
          value: option.value,
          label: option.label,
          metadata: option.metadata || {},
        }));
    }

    // SINGLE SELECT / RADIO
    const selectedOption = options.find((option) => option.value === answer);

    return selectedOption?.metadata || {};
  };

  // --------------------------------------------------
  // PHONE FORMATTING
  // --------------------------------------------------

  const formatPhoneForSubmission = (value: string) => {
    if (!value) return "";

    const formatted = formatPhoneNumberIntl(value);

    if (formatted) {
      return formatted.replace(/^\+/, "").replace(/\s+/, " ").trim();
    }

    const sanitized = value.startsWith("+") ? value.slice(1) : value;

    const match = sanitized.match(/^(\d{1,4})(.*)$/);

    if (match) {
      const [, code, rest] = match;
      const number = rest?.replace(/\s+/g, "");

      return number ? `${code} ${number}` : code;
    }

    return sanitized;
  };

  // --------------------------------------------------
  // FORM SUBMISSION
  // --------------------------------------------------

  const handleSubmit = async (data: Record<string, any>) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const filteredAdditionalData = fields.map((field: any) => {
        const answer = data[field.name] ?? "";

        let formattedAnswer = answer;

        // CHECKBOX / MULTI SELECT
        if (
          field.type === FORM_FIELDS_TYPE.CHECKBOX ||
          field.type === FORM_FIELDS_TYPE.MULTI_SELECT
        ) {
          formattedAnswer = Array.isArray(answer) ? answer.join(",") : "";
        }

        // PHONE
        else if (
          field.type === FORM_FIELDS_TYPE.PHONE ||
          field.type === FORM_FIELDS_TYPE.TEL
        ) {
          formattedAnswer = formatPhoneForSubmission(answer);
        }

        // GET SELECTED OPTION METADATA
        const metadata = getSelectedOptionMetadata(field, answer);

        return {
          question: field.label,
          name: field.name || "",
          answer: formattedAnswer,
          metadata,
        };
      });

      console.log("Final Form Submission:", filteredAdditionalData);

      const response = await handleFormSubmit(filteredAdditionalData);

      if (response) {
        form.reset(defaultValues);
        return true;
      }

      return false;
    } catch (error) {
      console.error(error);

      toast.error("Something went wrong. Please try again or contact Support!");

      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className="flex flex-col p-1">
      {title && (
        <div className="flex bg-border_active rounded-t-xl px-3 py-3">
          <div
            className={`items-center flex w-full ${
              variant === "ucas" ? "justify-start" : "justify-center"
            }`}
          >
            <p className="text-xl text-center font-semibold">{title}</p>
          </div>
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          noValidate
          className="flex flex-col gap-6"
        >
          <div
            className={`${gridClassName} ${
              Object.keys(form.formState.errors).length > 0
                ? "items-start"
                : "items-end"
            }`}
          >
            {fields.map((field: any) => {
              const isLoading = loadingOptions[field.name];

              const isDependentField = typeof field.fetchOptions === "function";

              const parentValue = isDependentField
                ? watchedValues?.[field.dependsOn]
                : undefined;

              const hasParentValue = Array.isArray(parentValue)
                ? parentValue.length > 0
                : Boolean(parentValue);

              const isDisabled =
                field.disabled ||
                (isDependentField && (!hasParentValue || isLoading));

              return (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name}
                  rules={{
                    required: field.required
                      ? field.error_message || "This field is required"
                      : false,

                    ...(field.type === FORM_FIELDS_TYPE.EMAIL
                      ? {
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: FORM_FIELDS_WARNING_MESSAGE.email,
                          },
                        }
                      : field.type === FORM_FIELDS_TYPE.PHONE ||
                          field.type === FORM_FIELDS_TYPE.TEL
                        ? {
                            validate: (value: any) => {
                              if (
                                value === undefined ||
                                value === null ||
                                value === ""
                              ) {
                                return field.required
                                  ? field.error_message ||
                                      "This field is required"
                                  : true;
                              }

                              const phoneRegex = /^\+?[1-9]\d{1,14}$/;

                              return phoneRegex.test(value.replace(/\s/g, ""))
                                ? true
                                : field.error_message ||
                                    FORM_FIELDS_WARNING_MESSAGE.phone;
                            },
                          }
                        : field.type === FORM_FIELDS_TYPE.NUMBER
                          ? {
                              validate: (value: any) => {
                                if (
                                  value === undefined ||
                                  value === null ||
                                  value === ""
                                ) {
                                  return true;
                                }

                                const numericValue = Number(value);

                                if (Number.isNaN(numericValue)) {
                                  return (
                                    field.error_message ||
                                    "Please enter a valid number"
                                  );
                                }

                                if (
                                  field.min !== undefined &&
                                  field.min !== null &&
                                  field.min !== "" &&
                                  numericValue < Number(field.min)
                                ) {
                                  return (
                                    field.min_error_message ||
                                    field.error_message ||
                                    `Minimum is ${field.min}`
                                  );
                                }

                                let effectiveMax = field.max;

                                if (field.dependsOn && field.dynamicMaxMap) {
                                  const dependentValue =
                                    watchedValues?.[field.dependsOn];

                                  const dynamicMax =
                                    field.dynamicMaxMap[dependentValue];

                                  if (
                                    dynamicMax !== undefined &&
                                    dynamicMax !== null &&
                                    dynamicMax !== ""
                                  ) {
                                    effectiveMax = dynamicMax;
                                  }
                                }

                                if (
                                  effectiveMax !== undefined &&
                                  effectiveMax !== null &&
                                  effectiveMax !== "" &&
                                  numericValue > Number(effectiveMax)
                                ) {
                                  return (
                                    field.max_error_message ||
                                    field.error_message ||
                                    `Maximum is ${effectiveMax}`
                                  );
                                }

                                return true;
                              },
                            }
                          : {}),
                  }}
                  render={({ field: rhfField }) => (
                    <FormItem
                      className={field.fullWidth ? "col-span-full" : ""}
                    >
                      {field.type !== FORM_FIELDS_TYPE.RADIO_BUTTON_BOX && (
                        <FormLabel
                          className={`${
                            form.formState.errors[field.name]
                              ? "text-red_secondary"
                              : ""
                          } text-base`}
                        >
                          {field.label}

                          {field.required && field.label && (
                            <span className="text-red_secondary">*</span>
                          )}
                        </FormLabel>
                      )}

                      <FormControl>
                        {/* SELECT */}
                        {field.type === FORM_FIELDS_TYPE.SELECT ? (
                          <Select
                            value={rhfField.value || ""}
                            onValueChange={rhfField.onChange}
                            name={field.name}
                            disabled={isDisabled}
                          >
                            <SelectTrigger
                              className={`w-full border-2 py-5 ${
                                variant !== "ibToUCASTariff"
                                  ? "bg-BackgroundDefault"
                                  : "bg-white"
                              } border-input rounded-sm ${
                                form.formState.errors[field.name]
                                  ? "border-red_secondary"
                                  : ""
                              } [&>svg]:text-Action [&>svg]:opacity-100 ${
                                field.inputStyle || ""
                              }`}
                            >
                              <SelectValue
                                placeholder={
                                  isLoading
                                    ? "Loading options..."
                                    : field.placeholder || "Select"
                                }
                              >
                                {field.options.find(
                                  (option: SelectOption) =>
                                    option.value === rhfField.value,
                                )?.label || ""}
                              </SelectValue>
                            </SelectTrigger>

                            <SelectContent>
                              {field.options.map((option: SelectOption) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}

                              {field.options.length === 0 && !isLoading && (
                                <div className="px-3 py-2 text-sm text-muted-foreground">
                                  {isDependentField
                                    ? "No options available"
                                    : "No options"}
                                </div>
                              )}
                            </SelectContent>
                          </Select>
                        ) : field.type === FORM_FIELDS_TYPE.TEXT_AREA ? (
                          <textarea
                            {...rhfField}
                            placeholder={field.placeholder}
                            required={field.required}
                            disabled={isDisabled}
                            rows={field.rows}
                            className={`w-full border-2 rounded-md p-2 min-h-[80px] ${
                              form.formState.errors[field.name]
                                ? "border-red_secondary"
                                : ""
                            } ${
                              isDisabled ? "opacity-50 cursor-not-allowed" : ""
                            } ${field.inputStyle || ""}`}
                          />
                        ) : field.type === FORM_FIELDS_TYPE.TEL ||
                          field.type === FORM_FIELDS_TYPE.PHONE ? (
                          <div
                            className={`w-full border-2 rounded-sm flex items-center ${
                              form.formState.errors[field.name]
                                ? "border-red_secondary focus-within:border-red_secondary"
                                : "border-gray-300 focus-within:border-Action"
                            } transition-colors ${
                              isDisabled ? "opacity-50 cursor-not-allowed" : ""
                            } ${field.inputStyle || ""}`}
                          >
                            <PhoneInput
                              international
                              defaultCountry="GB"
                              placeholder={
                                field.placeholder || "Enter phone number"
                              }
                              value={rhfField.value || ""}
                              onChange={(value) =>
                                rhfField.onChange(value || "")
                              }
                              disabled={isDisabled}
                              className="w-full [&>*]:border-0 [&>*]:outline-0 [&>*]:ring-0 [&>*]:focus:ring-0 [&>*]:focus:outline-none [&>*]:px-2 [&>*]:py-1 text-sm sm:text-base [&>*]:bg-transparent [&_select]:pr-1 [&_input]:pl-1 h-11"
                            />
                          </div>
                        ) : field.type === FORM_FIELDS_TYPE.RADIO_BUTTON_BOX ? (
                          <div className="flex flex-col gap-4">
                            {field.options.map((option: any) => (
                              <div
                                key={option.value ?? option}
                                className={`border-2 rounded-md p-2 h-16 flex flex-col justify-center ${
                                  form.formState.errors[field.name]
                                    ? "border-red_secondary"
                                    : ""
                                } ${
                                  isDisabled
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                } ${field.inputStyle || ""}`}
                              >
                                <label className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name={field.name}
                                    value={option.value ?? option}
                                    checked={
                                      rhfField.value ===
                                      (option.value ?? option)
                                    }
                                    onChange={() =>
                                      rhfField.onChange(option.value ?? option)
                                    }
                                    disabled={isDisabled}
                                    className="accent-blue-600"
                                  />

                                  <span>{option.label ?? option}</span>
                                </label>
                              </div>
                            ))}
                          </div>
                        ) : field.type === FORM_FIELDS_TYPE.MULTI_SELECT ? (
                          <MultiSelectInput
                            field={{
                              ...field,
                              disabled: isDisabled,
                            }}
                            rhfField={rhfField}
                            hasError={!!form.formState.errors[field.name]}
                          />
                        ) : field.type === FORM_FIELDS_TYPE.CHECKBOX ? (
                          <div className="flex flex-col gap-2">
                            {field.options.map((option: any) => {
                              const selectedValues = Array.isArray(
                                rhfField.value,
                              )
                                ? rhfField.value
                                : [];

                              return (
                                <div
                                  key={option.value}
                                  className="flex items-center gap-2"
                                >
                                  <input
                                    id={`${field.name}-${option.value}`}
                                    name={field.name}
                                    type="checkbox"
                                    value={option.value}
                                    checked={selectedValues.includes(
                                      option.value,
                                    )}
                                    onChange={(event) => {
                                      const newValues = event.target.checked
                                        ? [...selectedValues, option.value]
                                        : selectedValues.filter(
                                            (value: string) =>
                                              value !== option.value,
                                          );

                                      rhfField.onChange(newValues);
                                    }}
                                    disabled={isDisabled}
                                    className={`${
                                      isDisabled
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                    } ${field.inputStyle || ""}`}
                                  />

                                  <label
                                    htmlFor={`${field.name}-${option.value}`}
                                  >
                                    {option.label}
                                  </label>
                                </div>
                              );
                            })}
                          </div>
                        ) : field.type === FORM_FIELDS_TYPE.RADIO ? (
                          <div className="flex flex-wrap gap-2">
                            {field.options.map((option: SelectOption) => (
                              <label
                                key={option.value}
                                className={`flex items-center gap-3 transition-colors ${
                                  isDisabled
                                    ? "opacity-50 cursor-not-allowed"
                                    : "cursor-pointer"
                                } ${
                                  form.formState.errors[field.name]
                                    ? "border-red_secondary"
                                    : rhfField.value === option.value
                                      ? "border-Action"
                                      : ""
                                } ${
                                  !isDisabled ? "hover:border-Action" : ""
                                } ${field.inputStyle || ""}`}
                              >
                                <input
                                  type="radio"
                                  name={field.name}
                                  value={option.value}
                                  checked={rhfField.value === option.value}
                                  onChange={() =>
                                    rhfField.onChange(option.value)
                                  }
                                  disabled={isDisabled}
                                  className="w-4 h-4 accent-Action cursor-pointer"
                                />

                                <span className="flex-1 text-base">
                                  {option.label}
                                </span>
                              </label>
                            ))}
                          </div>
                        ) : (
                          <Input
                            {...rhfField}
                            type={field.type}
                            placeholder={field.placeholder}
                            required={field.required}
                            disabled={isDisabled}
                            className={`w-full h-12 bg-BackgroundDefault rounded-sm ${
                              form.formState.errors[field.name]
                                ? "border-red_secondary focus:border-red_secondary"
                                : "focus:border-Action"
                            } ${
                              isDisabled ? "opacity-50 cursor-not-allowed" : ""
                            } ${field.inputStyle || ""}`}
                          />
                        )}
                      </FormControl>

                      {field.type !== FORM_FIELDS_TYPE.RADIO_BUTTON_BOX && (
                        <FormMessage />
                      )}
                    </FormItem>
                  )}
                />
              );
            })}
          </div>

          {/* SUBMIT BUTTON */}
          <div
            className={
              buttonData?.classname || "w-full m-auto flex justify-center"
            }
          >
            <Button
              type="submit"
              className="w-full md:w-auto items-center"
              disabled={buttonData?.disabled || isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Submitting...</span>
                </div>
              ) : (
                buttonData?.text || buttonText || "Send Message"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default GLobalForm;
