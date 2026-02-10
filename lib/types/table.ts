/**
 * Type definitions for the Server-Driven Table Component
 */

/**
 * Table state that is synced with URL query parameters
 */
export interface TableState {
    page: number;
    limit: number;
    search: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    filters?: Record<string, string | string[]>;
}

/**
 * Generic paginated response format
 * This is the expected format after data transformation
 */
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

/**
 * Data adapter function type
 * Transforms any API response into the expected PaginatedResponse format
 * This allows the table to work with ANY external API structure
 * 
 * @param response - Raw API response
 * @returns Transformed response in PaginatedResponse format
 */
export type DataAdapter<TData, TResponse = any> = (
    response: TResponse
) => PaginatedResponse<TData>;

/**
 * Fetch function type
 * Handles the actual API call with table state parameters
 * 
 * @param state - Current table state (pagination, sorting, search, filters)
 * @returns Promise resolving to the raw API response
 */
export type FetchFunction<TResponse = any> = (
    state: TableState
) => Promise<TResponse>;

/**
 * Props for the ServerDataTable component
 */
export interface ServerDataTableProps<TData> {
    /**
     * Column definitions from @tanstack/react-table
     */
    columns: any[]; // ColumnDef<TData>[] - using any to avoid circular deps

    /**
     * Function to fetch data from the API
     */
    fetchFunction: FetchFunction;

    /**
     * Function to transform API response to expected format
     * If not provided, assumes response is already in correct format
     */
    dataAdapter?: DataAdapter<TData>;

    /**
     * Custom filter UI component
     */
    filterComponent?: React.ComponentType<{
        state: TableState;
        onFilterChange: (filters: Record<string, string | string[]>) => void;
    }>;

    /**
     * Searchable field name (for placeholder text)
     * @default "Search..."
     */
    searchPlaceholder?: string;

    /**
     * Enable search functionality
     * @default true
     */
    enableSearch?: boolean;

    /**
     * Enable column visibility controls
     * @default true
     */
    enableColumnVisibility?: boolean;

    /**
     * Default page size
     * @default 10
     */
    defaultPageSize?: number;

    /**
     * Available page size options
     * @default [10, 20, 50, 100]
     */
    pageSizeOptions?: number[];
}

/**
 * Return type for useTableState hook
 */
export interface UseTableStateReturn {
    state: TableState;
    setPage: (page: number) => void;
    setLimit: (limit: number) => void;
    setSearch: (search: string) => void;
    setSorting: (sortBy?: string, sortOrder?: 'asc' | 'desc') => void;
    setFilters: (filters: Record<string, string | string[]>) => void;
    resetFilters: () => void;
}
