
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { PaginationControls } from "./PaginationControls";
import { usePagination } from "@/hooks/usePagination";

interface PaginatedTableProps<T> {
  data: T[];
  columns: {
    header: React.ReactNode;
    accessorKey?: keyof T;
    cell?: (item: T) => React.ReactNode;
  }[];
  loading: boolean;
  searchQuery?: string;
  caption?: string;
  noDataMessage?: string;
  initialItemsPerPage?: number;
}

export function PaginatedTable<T>({
  data,
  columns,
  loading,
  searchQuery,
  caption = "A list of items",
  noDataMessage = "No items found",
  initialItemsPerPage = 10,
}: PaginatedTableProps<T>) {
  const {
    currentItems,
    currentPage,
    totalPages,
    itemsPerPage,
    setItemsPerPage,
    goToPage,
  } = usePagination({
    items: data,
    initialItemsPerPage,
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            {caption && <TableCaption>{caption}</TableCaption>}
            <TableHeader>
              <TableRow>
                {columns.map((column, idx) => (
                  <TableHead key={idx}>{column.header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center py-6 text-muted-foreground"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : currentItems.length > 0 ? (
                currentItems.map((item, itemIdx) => (
                  <TableRow key={itemIdx}>
                    {columns.map((column, colIdx) => (
                      <TableCell key={colIdx}>
                        {column.cell
                          ? column.cell(item)
                          : column.accessorKey
                          ? (item[column.accessorKey] as React.ReactNode)
                          : null}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center py-6 text-muted-foreground"
                  >
                    {searchQuery
                      ? "No matching items found."
                      : noDataMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        onPageChange={goToPage}
        onItemsPerPageChange={setItemsPerPage}
      />
    </div>
  );
}
