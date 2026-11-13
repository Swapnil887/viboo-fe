"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState, useMemo } from "react";
import {
  FormControl,
  FormField,
  FormMessage,
  FormLabel,
  Form,
  FormItem,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { X, ChevronDown, Loader2 } from "lucide-react";
import PhoneInput, { formatPhoneNumberIntl } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { toast } from "sonner";

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

interface MultiSelectInputProps {
  field: {
    name: string;
    placeholder: string;
    options: Array<{ value: string; label: string }>;
    disabled?: boolean;
    inputStyle?: string;
  };
  rhfField: {
    value: string[];
    onChange: (value: string[]) => void;
  };
  hasError: boolean;
}

function MultiSelectInput({
  field,
  rhfField,
  hasError,
}: MultiSelectInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>(
    Array.isArray(rhfField.value) ? rhfField.value : [],
  );
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (Array.isArray(rhfField.value)) {
      setSelectedValues(rhfField.value);
    }
  }, [rhfField.value]);

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
      ? selectedValues.filter((v) => v !== optionValue)
      : [...selectedValues, optionValue];

    setSelectedValues(newValues);
    rhfField.onChange(newValues);
  };

  const removeOption = (optionValue: string) => {
    const newValues = selectedValues.filter((v) => v !== optionValue);
    setSelectedValues(newValues);
    rhfField.onChange(newValues);
  };

  const getSelectedLabels = () => {
    return field.options
      .filter((opt) => selectedValues.includes(opt.value))
      .map((opt) => opt.label);
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
        type="button"
        onClick={() => !field.disabled && setIsOpen(!isOpen)}
        disabled={field.disabled}
        className={`w-full border-2 py-1 px-3 bg-BackgroundDefault border-input rounded-sm flex items-center justify-between min-h-[44px] ${
          hasError ? "border-red_secondary" : ""
        } ${field.disabled ? "opacity-50 cursor-not-allowed" : ""} ${field.inputStyle || ""}`}
      >
        <div className="flex gap-2 flex-1 overflow-x-auto overflow-y-hidden scrollbar-hide">
          {selectedValues.length === 0 ? (
            <span className="text-muted-foreground whitespace-nowrap">
              {field.placeholder || "Select"}
            </span>
          ) : (
            getSelectedLabels().map((label, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded flex-shrink-0"
              >
                <p className="truncate max-w-[120px]">{label}</p>
                <X
                  className="h-3 w-3 cursor-pointer hover:text-blue-600 flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    const option = field.options.find(
                      (opt) => opt.label === label,
                    );
                    if (option) removeOption(option.value);
                  }}
                />
              </span>
            ))
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? "transform rotate-180" : ""}`}
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
                id={`multiselect-${field.name}-${option.value}`}
                name={`${field.name}[]`}
                type="checkbox"
                checked={selectedValues.includes(option.value)}
                onChange={() => {}}
                className="h-4 w-4 accent-blue-600 pointer-events-none"
              />
              <span className="text-sm">{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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
  buttonData?: { text: string; disabled?: boolean; classname?: string };
  additionalData: any;
  handleFormSubmit: any;
  variant?: string;
  gridClassName?: string;
}) {
  const fields = useMemo(() => {
    return additionalData.map((f: any) => ({
      name: f.field_name,
      label: f.field_label,
      type: f.input_type,
      required: f.required,
      options: f.options || [],
      placeholder: f.placeholder,
      min: f.min,
      max: f.max,
      error_message: f.error_message,
      min_error_message: (f as any).min_error_message,
      max_error_message: (f as any).max_error_message,
      dependsOn: f.dependsOn,
      fetchOptions: f.fetchOptions || null,
      dynamicMaxMap: f.dynamicMaxMap,
      fullWidth: f.fullWidth || f.noGrid || false,
      disabled: f.disabled || false,
      inputValue: f.inputValue,
      inputStyle: f.inputStyle || "",
      rows: f.rows || undefined,
    }));
  }, [additionalData]);

  const defaultValues = useMemo(() => {
    return Object.fromEntries(
      fields.map((f: any) => {
        if (f.inputValue !== undefined && f.inputValue !== null) {
          return [f?.name, f.inputValue];
        }
        return [
          f?.name,
          f?.type === FORM_FIELDS_TYPE.MULTI_SELECT ||
          f?.type === FORM_FIELDS_TYPE.CHECKBOX
            ? []
            : "",
        ];
      }),
    );
  }, [fields]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dependentOptions, setDependentOptions] = useState<
    Record<string, Array<{ value: string; label: string }>>
  >({});
  const [loadingFields, setLoadingFields] = useState<Record<string, boolean>>(
    {},
  );

  const form = useForm({
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const watchedValues = form.watch();

  // Watch parent changes and trigger API fetch safely with reference protection
  useEffect(() => {
    fields.forEach((field: any) => {
      if (field.dependsOn && field.fetchOptions) {
        const parentVal = watchedValues[field.dependsOn];
        const currentChildVal = form.getValues(field.name);

        if (!parentVal) {
          setDependentOptions((prev) => {
            if (prev[field.name]?.length === 0) return prev;
            return { ...prev, [field.name]: [] };
          });
          if (currentChildVal) {
            form.setValue(
              field.name,
              field.type === FORM_FIELDS_TYPE.MULTI_SELECT ? [] : "",
              { shouldValidate: true },
            );
          }
        } else {
          setLoadingFields((prev) => ({ ...prev, [field.name]: true }));
          field
            .fetchOptions(parentVal)
            .then((newOptions: Array<{ value: string; label: string }>) => {
              setDependentOptions((prev) => {
                const existing = prev[field.name] || [];
                if (JSON.stringify(existing) === JSON.stringify(newOptions)) {
                  return prev;
                }
                return { ...prev, [field.name]: newOptions || [] };
              });

              const isValid = Array.isArray(currentChildVal)
                ? currentChildVal.every((v) =>
                    newOptions.some((o: any) => o.value === v),
                  )
                : newOptions.some((o: any) => o.value === currentChildVal);

              if (!isValid && currentChildVal) {
                form.setValue(
                  field.name,
                  field.type === FORM_FIELDS_TYPE.MULTI_SELECT ? [] : "",
                  { shouldValidate: true },
                );
              }
            })
            .catch((err: any) => {
              console.error(`Failed to fetch options for ${field.name}:`, err);
              setDependentOptions((prev) => ({ ...prev, [field.name]: [] }));
            })
            .finally(() => {
              setLoadingFields((prev) => ({ ...prev, [field.name]: false }));
            });
        }
      }
    });
  }, [watchedValues, fields, form]);

  const getFieldOptions = (field: any) => {
    if (field.dependsOn) {
      return dependentOptions[field.name] || [];
    }
    return field.options;
  };

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

  const handleSubmit = async (data: Record<string, string>) => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      const updatedAdditionalData = additionalData?.map((ele: any) => ({
        ...ele,
        answer: data[ele?.field_name] ?? "",
        min: ele?.min ?? "",
        max: ele?.max ?? "",
        error_message: ele?.error_message ?? "",
      }));

      const filteredAdditionalData = updatedAdditionalData?.map((ele: any) => {
        let answer = ele?.answer;
        if (
          ele?.input_type === FORM_FIELDS_TYPE?.CHECKBOX ||
          ele?.input_type === FORM_FIELDS_TYPE?.MULTI_SELECT
        ) {
          answer = Array.isArray(ele?.answer) ? ele?.answer?.join(",") : "";
        } else if (
          ele?.input_type === FORM_FIELDS_TYPE?.PHONE ||
          ele?.input_type === FORM_FIELDS_TYPE?.TEL
        ) {
          answer = formatPhoneForSubmission(ele?.answer);
        }

        return {
          question: ele?.field_label,
          name: ele?.field_name || "",
          answer,
        };
      });

      const formSubmitResponse = await handleFormSubmit(filteredAdditionalData);
      if (formSubmitResponse) {
        form.reset();
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error, "error");
      toast.error("Something went wrong. Please try again or contact Support!");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col p-1 ">
      {title ? (
        <div className="flex bg-border_active rounded-t-xl px-3 py-3 ">
          <div
            className={` items-center flex  w-full ${
              variant === "ucas" ? "justify-start" : "justify-center"
            }`}
          >
            <p className={`text-xl text-center font-semibold `}>{title}</p>
          </div>
        </div>
      ) : null}

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
              const isParentUnselected =
                field.dependsOn && !watchedValues[field.dependsOn];
              const isLoading = loadingFields[field.name] || false;
              const isDisabled =
                field.disabled || isParentUnselected || isLoading;
              const dynamicOptions = getFieldOptions(field);

              return (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name as any}
                  rules={{
                    required:
                      field.type === FORM_FIELDS_TYPE.RADIO_BUTTON_BOX
                        ? false
                        : field.required
                          ? field.error_message || "This field is required"
                          : false,
                  }}
                  render={({ field: rhfField }) => (
                    <FormItem
                      className={field.fullWidth ? "col-span-full" : ""}
                    >
                      {field.type !== FORM_FIELDS_TYPE.RADIO_BUTTON_BOX ? (
                        <FormLabel
                          className={`${
                            form.formState.errors[field.name as string]
                              ? "text-red_secondary"
                              : ""
                          } text-base`}
                        >
                          {field.label}
                          {field.required && field.label && (
                            <span className="text-red_secondary">*</span>
                          )}
                        </FormLabel>
                      ) : null}
                      <FormControl>
                        {field.type === FORM_FIELDS_TYPE.SELECT ? (
                          <Select
                            value={rhfField.value}
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
                                form.formState.errors[field.name as string]
                                  ? "border-red_secondary"
                                  : ""
                              } [&>svg]:text-Action [&>svg]:opacity-100 ${field.inputStyle || ""}`}
                              disabled={isDisabled}
                            >
                              <div className="flex items-center gap-2 truncate">
                                {isLoading && (
                                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                )}
                                <SelectValue
                                  placeholder={
                                    isParentUnselected
                                      ? `Please select ${field.dependsOn} first`
                                      : isLoading
                                        ? "Loading options..."
                                        : field.placeholder || "Select"
                                  }
                                />
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              {dynamicOptions.map(
                                (option: { value: string; label: string }) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ),
                              )}
                            </SelectContent>
                          </Select>
                        ) : field.type === FORM_FIELDS_TYPE.MULTI_SELECT ? (
                          <div className="relative">
                            {isLoading && (
                              <div className="absolute right-8 top-3 z-10">
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                              </div>
                            )}
                            <MultiSelectInput
                              field={{
                                ...field,
                                options: dynamicOptions,
                                disabled: isDisabled,
                              }}
                              rhfField={rhfField}
                              hasError={
                                !!form.formState.errors[field.name as string]
                              }
                            />
                          </div>
                        ) : (
                          <Input
                            {...rhfField}
                            type={field.type}
                            placeholder={field.placeholder}
                            required={field.required}
                            disabled={isDisabled}
                            className={`w-full h-12 bg-BackgroundDefault rounded-sm ${
                              isDisabled ? "opacity-50 cursor-not-allowed" : ""
                            }`}
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

          <div
            className={
              buttonData?.classname || "w-full m-auto flex justify-center"
            }
          >
            <Button
              type="submit"
              className="w-full md:w-auto items-center"
              disabled={buttonData?.disabled || false}
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
