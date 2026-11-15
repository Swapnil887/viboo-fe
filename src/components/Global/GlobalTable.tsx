"use client";

import React, { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  Pencil,
  Trash2,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ==========================================
// TYPES
// ==========================================

export interface GlobalTableColumn<T> {
  key: string;
  header: string;

  // Supports normal and nested properties
  accessorKey?: keyof T | string;

  // Custom accessor
  accessorFn?: (row: T) => unknown;

  // Custom cell renderer
  cell?: (row: T, value: unknown) => React.ReactNode;

  sortable?: boolean;
  searchable?: boolean;

  align?: "left" | "center" | "right";

  width?: string;
  className?: string;
  headerClassName?: string;
}

export interface GlobalTableProps<T> {
  data: T[];
  columns: GlobalTableColumn<T>[];

  getRowId?: (row: T) => string;

  loading?: boolean;
  loadingRows?: number;

  title?: string;
  description?: string;

  searchable?: boolean;
  searchPlaceholder?: string;

  pagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];

  emptyMessage?: string;
  emptyContent?: React.ReactNode;

  addButton?: {
    label: string;
    onClick: () => void;
  };

  toolbar?: React.ReactNode;

  selectable?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;

  onRowClick?: (row: T) => void;

  actions?: (row: T) => React.ReactNode;

  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;

  actionsHeader?: string;

  className?: string;
  tableClassName?: string;
}

// ==========================================
// HELPER
// ==========================================

// Get nested object properties.
// Example: getNestedValue(row, "brand.name")

function getNestedValue(obj: unknown, path: string): unknown {
  return path.split(".").reduce((current: any, key) => {
    return current?.[key];
  }, obj);
}

// ==========================================
// COMPONENT
// ==========================================

export function GlobalTable<T extends object>({
  data,
  columns,

  getRowId,

  loading = false,
  loadingRows = 5,

  title,
  description,

  searchable = true,
  searchPlaceholder = "Search...",

  pagination = true,
  pageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],

  emptyMessage = "No records found.",
  emptyContent,

  addButton,
  toolbar,

  selectable = false,
  onSelectionChange,

  onRowClick,

  actions,
  onEdit,
  onDelete,

  actionsHeader = "Actions",

  className = "",
  tableClassName = "",
}: GlobalTableProps<T>) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  // ========================================
  // ROW ID
  // ========================================

  const getId = (row: T, index: number) => {
    if (getRowId) return getRowId(row);

    const id = (row as Record<string, unknown>).id;

    return id != null ? String(id) : String(index);
  };

  // ========================================
  // GET COLUMN VALUE
  // ========================================

  const getValue = (row: T, column: GlobalTableColumn<T>) => {
    if (column.accessorFn) {
      return column.accessorFn(row);
    }

    const key = column.accessorKey ?? column.key;

    return getNestedValue(row, String(key));
  };

  // ========================================
  // SEARCH
  // ========================================

  const filteredData = useMemo(() => {
    if (!search.trim()) return data;

    const query = search.toLowerCase();

    return data.filter((row) =>
      columns.some((column) => {
        if (column.searchable === false) return false;

        const value = getValue(row, column);

        if (value == null) return false;

        const searchableValue =
          typeof value === "object" ? JSON.stringify(value) : String(value);

        return searchableValue.toLowerCase().includes(query);
      }),
    );
  }, [data, columns, search]);

  // ========================================
  // SORTING
  // ========================================

  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    const column = columns.find((col) => col.key === sortConfig.key);

    if (!column) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = getValue(a, column);
      const bValue = getValue(b, column);

      // Keep null values at the bottom
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      let comparison = 0;

      if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue), undefined, {
          numeric: true,
          sensitivity: "base",
        });
      }

      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [filteredData, sortConfig, columns]);

  // ========================================
  // PAGINATION
  // ========================================

  const totalRecords = sortedData.length;

  const totalPages = Math.ceil(totalRecords / currentPageSize);

  const safePage = Math.min(currentPage, Math.max(totalPages, 1));

  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;

    const startIndex = (safePage - 1) * currentPageSize;

    return sortedData.slice(startIndex, startIndex + currentPageSize);
  }, [sortedData, pagination, safePage, currentPageSize]);

  // ========================================
  // SORT HANDLER
  // ========================================

  const handleSort = (column: GlobalTableColumn<T>) => {
    if (column.sortable === false) return;

    setCurrentPage(1);

    setSortConfig((previous) => {
      if (previous?.key === column.key) {
        return {
          key: column.key,
          direction: previous.direction === "asc" ? "desc" : "asc",
        };
      }

      return {
        key: column.key,
        direction: "asc",
      };
    });
  };

  // ========================================
  // SELECTION
  // ========================================

  const toggleRow = (row: T, index: number, checked: boolean) => {
    const id = getId(row, index);

    setSelectedIds((previous) => {
      const next = checked
        ? [...new Set([...previous, id])]
        : previous.filter((item) => item !== id);

      const selectedRows = data.filter((item, i) =>
        next.includes(getId(item, i)),
      );

      onSelectionChange?.(selectedRows);

      return next;
    });
  };

  const visibleIds = paginatedData.map((row) => getId(row, data.indexOf(row)));

  const allSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));

  const toggleAll = (checked: boolean) => {
    const next = checked
      ? [...new Set([...selectedIds, ...visibleIds])]
      : selectedIds.filter((id) => !visibleIds.includes(id));

    setSelectedIds(next);

    onSelectionChange?.(
      data.filter((row, index) => next.includes(getId(row, index))),
    );
  };

  // ========================================
  // SORT ICON
  // ========================================

  const getSortIcon = (column: GlobalTableColumn<T>) => {
    if (sortConfig?.key !== column.key) {
      return <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />;
    }

    return sortConfig.direction === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5" />
    );
  };

  // ========================================
  // RECORD COUNTS
  // ========================================

  const startRecord =
    totalRecords === 0
      ? 0
      : pagination
        ? (safePage - 1) * currentPageSize + 1
        : 1;

  const endRecord = pagination
    ? Math.min(safePage * currentPageSize, totalRecords)
    : totalRecords;

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className={`w-full space-y-4 ${className}`}>
      {/* HEADER */}

      {(title || description) && (
        <div className="space-y-1">
          {title && <h2 className="text-xl font-semibold">{title}</h2>}

          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      {/* TOOLBAR */}

      {(searchable || toolbar || addButton) && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {searchable && (
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

              <Input
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {toolbar}

            {addButton && (
              <Button onClick={addButton.onClick}>
                <Plus className="mr-2 h-4 w-4" />
                {addButton.label}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* TABLE */}

      <div className="w-full overflow-x-auto rounded-md border">
        <Table className={tableClassName}>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-10">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={(checked) => toggleAll(checked === true)}
                  />
                </TableHead>
              )}

              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  style={{ width: column.width }}
                  className={`
                    ${column.headerClassName || ""}
                    ${column.align === "center" ? "text-center" : ""}
                    ${column.align === "right" ? "text-right" : ""}
                  `}
                >
                  <button
                    type="button"
                    disabled={column.sortable === false}
                    onClick={() => handleSort(column)}
                    className={`inline-flex items-center gap-2 ${
                      column.align === "right"
                        ? "w-full justify-end"
                        : column.align === "center"
                          ? "w-full justify-center"
                          : ""
                    }`}
                  >
                    {column.header}

                    {column.sortable !== false && getSortIcon(column)}
                  </button>
                </TableHead>
              ))}

              {(actions || onEdit || onDelete) && (
                <TableHead className="text-right">{actionsHeader}</TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* LOADING */}

            {loading ? (
              Array.from({ length: loadingRows }).map((_, index) => (
                <TableRow key={index}>
                  {selectable && (
                    <TableCell>
                      <Skeleton className="h-4 w-4" />
                    </TableCell>
                  )}

                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      <Skeleton className="h-5 w-full max-w-[150px]" />
                    </TableCell>
                  ))}

                  {(actions || onEdit || onDelete) && (
                    <TableCell>
                      <Skeleton className="h-5 w-16 ml-auto" />
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : paginatedData.length > 0 ? (
              paginatedData.map((row) => {
                const originalIndex = data.indexOf(row);
                const rowId = getId(row, originalIndex);

                return (
                  <TableRow
                    key={rowId}
                    onClick={() => onRowClick?.(row)}
                    className={
                      onRowClick ? "cursor-pointer hover:bg-muted/50" : ""
                    }
                  >
                    {selectable && (
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedIds.includes(rowId)}
                          onCheckedChange={(checked) =>
                            toggleRow(row, originalIndex, checked === true)
                          }
                        />
                      </TableCell>
                    )}

                    {columns.map((column) => {
                      const value = getValue(row, column);

                      return (
                        <TableCell
                          key={column.key}
                          className={`
                            ${column.className || ""}
                            ${column.align === "center" ? "text-center" : ""}
                            ${column.align === "right" ? "text-right" : ""}
                          `}
                        >
                          {column.cell
                            ? column.cell(row, value)
                            : value == null
                              ? "-"
                              : String(value)}
                        </TableCell>
                      );
                    })}

                    {(actions || onEdit || onDelete) && (
                      <TableCell
                        className="text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-end items-center gap-2">
                          {actions?.(row)}

                          {onEdit && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onEdit(row)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          )}

                          {onDelete && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onDelete(row)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length +
                    (selectable ? 1 : 0) +
                    (actions || onEdit || onDelete ? 1 : 0)
                  }
                  className="h-32 text-center"
                >
                  {emptyContent || (
                    <div className="flex flex-col items-center gap-1">
                      <p className="font-medium">{emptyMessage}</p>
                      <p className="text-sm text-muted-foreground">
                        Try changing your search or filters.
                      </p>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}

      {pagination && !loading && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>
              Showing {startRecord} to {endRecord} of {totalRecords}
            </span>

            <select
              value={currentPageSize}
              onChange={(e) => {
                setCurrentPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="h-9 rounded-md border bg-background px-2 text-sm"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size} / page
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              disabled={safePage <= 1 || totalRecords === 0}
              onClick={() => setCurrentPage(1)}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              disabled={safePage <= 1 || totalRecords === 0}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="px-3 text-sm whitespace-nowrap">
              Page {totalRecords === 0 ? 0 : safePage} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="icon"
              disabled={safePage >= totalPages || totalRecords === 0}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              disabled={safePage >= totalPages || totalRecords === 0}
              onClick={() => setCurrentPage(totalPages)}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
