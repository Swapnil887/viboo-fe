import { SlidersHorizontal } from "lucide-react";
import FilterSection from "./FilterSection";

const FilterSidebar = () => {
  return (
    <aside className="w-full max-w-[260px] bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} />

          <h2 className="text-lg font-semibold">Filters</h2>
        </div>

        <button className="text-sm text-gray-500 hover:text-black">
          Clear all
        </button>
      </div>

      {/* Sections */}
      <div>
        <FilterSection title="Category">
          <p className="text-sm text-gray-500">
            Category options will appear here.
          </p>
        </FilterSection>

        <FilterSection title="Price">
          <p className="text-sm text-gray-500">
            Price filter will appear here.
          </p>
        </FilterSection>

        <FilterSection title="Color" defaultOpen={false}>
          <p className="text-sm text-gray-500">
            Color options will appear here.
          </p>
        </FilterSection>

        <FilterSection title="Size" defaultOpen={false}>
          <p className="text-sm text-gray-500">
            Size options will appear here.
          </p>
        </FilterSection>
      </div>
    </aside>
  );
};

export default FilterSidebar;
