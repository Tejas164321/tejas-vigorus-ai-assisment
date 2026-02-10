'use client';

import { X, Search, RefreshCw } from 'lucide-react';
import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TableState } from '@/lib/types/table';
import { useState, useEffect } from 'react';
import { debounce } from '@/lib/utils/table-helpers';
import { DataTableViewOptions } from './data-table-view-options';

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    searchValue: string;
    onSearchChange: (value: string) => void;
    onRefresh?: () => void;
    onResetFilters?: () => void;
    searchPlaceholder?: string;
    filterComponent?: React.ComponentType<{
        state: TableState;
        onFilterChange: (filters: Record<string, string | string[]>) => void;
    }>;
    state: TableState;
    onFilterChange: (filters: Record<string, string | string[]>) => void;
    isRefreshing?: boolean;
    enableColumnVisibility?: boolean;
}

export function DataTableToolbar<TData>({
    table,
    searchValue,
    onSearchChange,
    onRefresh,
    onResetFilters,
    searchPlaceholder = 'Search...',
    filterComponent: FilterComponent,
    state,
    onFilterChange,
    isRefreshing = false,
    enableColumnVisibility = true,
}: DataTableToolbarProps<TData>) {
    const [localSearch, setLocalSearch] = useState(searchValue);
    const isFiltered = searchValue !== '' || Object.keys(state.filters || {}).length > 0;

    // Create debounced search function
    useEffect(() => {
        const debouncedSearch = debounce((value: string) => {
            onSearchChange(value);
        }, 500);

        if (localSearch !== searchValue) {
            debouncedSearch(localSearch);
        }
    }, [localSearch, searchValue, onSearchChange]);

    // Sync external search value changes
    useEffect(() => {
        setLocalSearch(searchValue);
    }, [searchValue]);

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2 overflow-x-auto">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder={searchPlaceholder}
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        className="pl-8 h-10"
                    />
                </div>
                {FilterComponent && (
                    <FilterComponent state={state} onFilterChange={onFilterChange} />
                )}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={onResetFilters}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <div className="flex items-center space-x-2">
                {enableColumnVisibility && <DataTableViewOptions table={table} />}
                {onRefresh && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onRefresh}
                        disabled={isRefreshing}
                        className="h-8"
                    >
                        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        <span className="ml-2 hidden sm:inline">Refresh</span>
                    </Button>
                )}
            </div>
        </div>
    );
}
