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
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ----------------------------------
// Types
// ----------------------------------

export interface GlobalTableColumn<T> {
  key: string;
  header: string;

  // Object property used to retrieve the value
  accessorKey?: keyof T;

  // Custom value accessor
  accessorFn?: (row: T) => any;

  // Custom cell rendering
  cell?: (row: T, value: any) => React.ReactNode;

  sortable?: boolean;
  searchable?: boolean;

  className?: string;
  headerClassName?: string;

  align?: "left" | "center" | "right";
}

export interface GlobalTableProps<T> {
  columns: GlobalTableColumn<T>[];
  data: T[];

  loading?: boolean;

  title?: string;
  description?: string;

  searchable?: boolean;
  searchPlaceholder?: string;

  pagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];

  emptyMessage?: string;

  // Custom toolbar content
  toolbar?: React.ReactNode;

  // Custom content when no records exist
  emptyContent?: React.ReactNode;

  // Row actions
  actions?: (row: T) => React.ReactNode;
  actionsHeader?: string;

  // Row click
  onRowClick?: (row: T) => void;

  // Unique row identifier
  getRowId?: (row: T, index: number) => string;

  // Optional styling
  className?: string;
  tableClassName?: string;

  // Loading rows
  loadingRows?: number;
}

// ----------------------------------
// Global Table
// ----------------------------------

export function GlobalTable<T>({
  columns,
  data,
  loading = false,

  title,
  description,

  searchable = true,
  searchPlaceholder = "Search...",

  pagination = true,
  pageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],

  emptyMessage = "No records found.",

  toolbar,
  emptyContent,

  actions,
  actionsHeader = "Actions",

  onRowClick,
  getRowId,

  className = "",
  tableClassName = "",
  loadingRows = 5,
}: GlobalTableProps<T>) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  // ----------------------------------
  // Get cell value
  // ----------------------------------

  const getValue = (row: T, column: GlobalTableColumn<T>) => {
    if (column.accessorFn) {
      return column.accessorFn(row);
    }

    if (column.accessorKey) {
      return row[column.accessorKey];
    }

    return undefined;
  };

  // ----------------------------------
  // Search
  // ----------------------------------

  const filteredData = useMemo(() => {
    if (!search.trim()) return data;

    const query = search.toLowerCase();

    return data.filter((row) =>
      columns.some((column) => {
        if (column.searchable === false) return false;

        const value = getValue(row, column);

        if (value === null || value === undefined) return false;

        if (typeof value === "object") {
          return JSON.stringify(value).toLowerCase().includes(query);
        }

        return String(value).toLowerCase().includes(query);
      }),
    );
  }, [data, columns, search]);

  // ----------------------------------
  // Sorting
  // ----------------------------------

  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    const column = columns.find((col) => col.key === sortConfig.key);

    if (!column) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = getValue(a, column);
      const bValue = getValue(b, column);

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

  // ----------------------------------
  // Pagination
  // ----------------------------------

  const totalRecords = sortedData.length;

  const totalPages = Math.ceil(totalRecords / currentPageSize);

  const safePage = Math.min(currentPage, Math.max(totalPages, 1));

  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;

    const startIndex = (safePage - 1) * currentPageSize;

    return sortedData.slice(startIndex, startIndex + currentPageSize);
  }, [sortedData, pagination, safePage, currentPageSize]);

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

  const startRecord =
    totalRecords === 0
      ? 0
      : pagination
        ? (safePage - 1) * currentPageSize + 1
        : 1;

  const endRecord = pagination
    ? Math.min(safePage * currentPageSize, totalRecords)
    : totalRecords;

  // ----------------------------------
  // Render
  // ----------------------------------

  return (
    <div className={`w-full space-y-4 ${className}`}>
      {/* Header */}
      {(title || description) && (
        <div className="space-y-1">
          {title && <h2 className="text-xl font-semibold">{title}</h2>}

          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      {/* Toolbar */}
      {(searchable || toolbar) && (
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

          {toolbar && (
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {toolbar}
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="w-full overflow-x-auto rounded-md border">
        <Table className={tableClassName}>
          {/* Table Header */}
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={`${column.headerClassName || ""} ${
                    column.align === "center"
                      ? "text-center"
                      : column.align === "right"
                        ? "text-right"
                        : ""
                  }`}
                >
                  <button
                    type="button"
                    disabled={column.sortable === false}
                    onClick={() => handleSort(column)}
                    className={`inline-flex items-center gap-2 ${
                      column.sortable === false
                        ? "cursor-default"
                        : "cursor-pointer"
                    }`}
                  >
                    {column.header}

                    {column.sortable !== false && getSortIcon(column)}
                  </button>
                </TableHead>
              ))}

              {actions && (
                <TableHead className="text-right">{actionsHeader}</TableHead>
              )}
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody>
            {/* Loading */}
            {loading ? (
              Array.from({ length: loadingRows }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      <Skeleton className="h-5 w-full max-w-[150px]" />
                    </TableCell>
                  ))}

                  {actions && (
                    <TableCell>
                      <Skeleton className="h-5 w-16 ml-auto" />
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <TableRow
                  key={getRowId ? getRowId(row, index) : index}
                  onClick={() => onRowClick?.(row)}
                  className={
                    onRowClick ? "cursor-pointer hover:bg-muted/50" : ""
                  }
                >
                  {columns.map((column) => {
                    const value = getValue(row, column);

                    return (
                      <TableCell
                        key={column.key}
                        className={`${column.className || ""} ${
                          column.align === "center"
                            ? "text-center"
                            : column.align === "right"
                              ? "text-right"
                              : ""
                        }`}
                      >
                        {column.cell
                          ? column.cell(row, value)
                          : value == null
                            ? "-"
                            : String(value)}
                      </TableCell>
                    );
                  })}

                  {actions && (
                    <TableCell
                      className="text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-end items-center gap-2">
                        {actions(row)}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              /* Empty State */
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions ? 1 : 0)}
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

      {/* Pagination */}
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
