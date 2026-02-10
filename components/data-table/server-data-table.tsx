'use client';

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { DataTablePagination } from './data-table-pagination';
import { DataTableToolbar } from './data-table-toolbar';
import { useTableState } from '@/lib/hooks/use-table-state';
import { useServerQuery } from '@/lib/hooks/use-server-query';
import { ServerDataTableProps } from '@/lib/types/table';
import { Loader2, AlertCircle } from 'lucide-react';

/**
 * Generic Server-Driven Data Table Component
 * 
 * Features:
 * - URL-driven state (pagination, sorting, search, filters)
 * - Server-side operations
 * - Flexible API integration via adapter pattern
 * - Custom filter support
 * - Column visibility controls
 * - Loading and error states
 * - Manual refresh
 * 
 * @example
 * ```tsx
 * <ServerDataTable
 *   columns={userColumns}
 *   fetchFunction={fetchUsers}
 *   dataAdapter={(response) => ({
 *     data: response.items,
 *     total: response.count,
 *     page: response.currentPage,
 *     limit: response.perPage,
 *     totalPages: response.pages,
 *   })}
 *   filterComponent={UserFilters}
 * />
 * ```
 */
export function ServerDataTable<TData>({
    columns,
    fetchFunction,
    dataAdapter,
    filterComponent,
    searchPlaceholder = 'Search...',
    enableSearch = true,
    enableColumnVisibility = true,
    defaultPageSize = 10,
    pageSizeOptions = [10, 20, 50, 100],
}: ServerDataTableProps<TData>) {
    // URL-driven state management
    const {
        state,
        setPage,
        setLimit,
        setSearch,
        setSorting,
        setFilters,
        resetFilters,
    } = useTableState({ limit: defaultPageSize });

    // Column visibility state (local, not URL-synced)
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

    // Sorting state for TanStack Table
    const [sorting, setSortingState] = useState<SortingState>(() => {
        if (state.sortBy) {
            return [{ id: state.sortBy, desc: state.sortOrder === 'desc' }];
        }
        return [];
    });

    // Fetch data using TanStack Query
    const {
        data: response,
        isLoading,
        isFetching,
        isError,
        error,
        refetch,
    } = useServerQuery('server-table', state, fetchFunction, dataAdapter);

    // Handle sort changes
    const handleSort = (columnId: string, direction: 'asc' | 'desc' | undefined) => {
        setSorting(columnId, direction);
    };

    // Initialize table
    const table = useReactTable({
        data: response?.data ?? [],
        columns,
        pageCount: response?.totalPages ?? 0,
        state: {
            sorting,
            columnVisibility,
        },
        onSortingChange: setSortingState,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
        meta: {
            onSort: handleSort,
        },
    });

    // Loading state
    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Loading data...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (isError) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-center">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                    <p className="text-sm font-medium">Failed to load data</p>
                    <p className="text-sm text-muted-foreground">
                        {error?.message || 'An error occurred while fetching data'}
                    </p>
                    <button
                        onClick={() => refetch()}
                        className="mt-2 text-sm text-primary hover:underline"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Toolbar with search and filters */}
            {enableSearch && (
                <DataTableToolbar
                    table={table}
                    searchValue={state.search}
                    onSearchChange={setSearch}
                    onRefresh={() => refetch()}
                    onResetFilters={resetFilters}
                    searchPlaceholder={searchPlaceholder}
                    filterComponent={filterComponent}
                    state={state}
                    onFilterChange={setFilters}
                    isRefreshing={isFetching}
                    enableColumnVisibility={enableColumnVisibility}
                />
            )}

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isFetching && !isLoading && (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                            Updating...
                                        </span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                        {!isFetching && table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            !isFetching && (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        <div className="flex flex-col items-center gap-1">
                                            <p className="text-sm font-medium">No results found</p>
                                            <p className="text-sm text-muted-foreground">
                                                Try adjusting your search or filters
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <DataTablePagination
                table={table}
                totalRecords={response?.total ?? 0}
                currentPage={state.page}
                pageSize={state.limit}
                onPageChange={setPage}
                onPageSizeChange={setLimit}
                pageSizeOptions={pageSizeOptions}
            />
        </div>
    );
}
