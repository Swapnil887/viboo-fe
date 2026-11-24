"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const FilterSection = ({
  title,
  children,
  defaultOpen = true,
}: FilterSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 py-5">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between"
      >
        <h3 className="font-medium text-gray-900">{title}</h3>

        {isOpen ? (
          <ChevronUp size={17} className="text-gray-500" />
        ) : (
          <ChevronDown size={17} className="text-gray-500" />
        )}
      </button>

      {/* Content */}
      {isOpen && <div className="mt-4">{children}</div>}
    </div>
  );
};

export default FilterSection;
