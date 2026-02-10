'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { TableState, UseTableStateReturn } from '../types/table';
import { parseTableState, serializeTableState, getDefaultTableState } from '../utils/table-helpers';

/**
 * Custom hook for managing table state via URL query parameters
 * All state changes are synced to the URL for persistence and shareability
 * 
 * @param defaultState - Default table state values
 * @returns Table state and update functions
 */
export function useTableState(
    defaultState: Partial<TableState> = {}
): UseTableStateReturn {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Parse current state from URL
    const state = parseTableState(searchParams, {
        ...getDefaultTableState(),
        ...defaultState,
    });

    /**
     * Update URL with new state
     */
    const updateUrl = useCallback(
        (newState: TableState) => {
            const queryString = serializeTableState(newState);
            router.push(`${pathname}?${queryString}`, { scroll: false });
        },
        [pathname, router]
    );

    /**
     * Set current page
     */
    const setPage = useCallback(
        (page: number) => {
            updateUrl({ ...state, page });
        },
        [state, updateUrl]
    );

    /**
     * Set page size limit
     */
    const setLimit = useCallback(
        (limit: number) => {
            // Reset to page 1 when changing page size
            updateUrl({ ...state, limit, page: 1 });
        },
        [state, updateUrl]
    );

    /**
     * Set search query
     */
    const setSearch = useCallback(
        (search: string) => {
            // Reset to page 1 when searching
            updateUrl({ ...state, search, page: 1 });
        },
        [state, updateUrl]
    );

    /**
     * Set sorting
     */
    const setSorting = useCallback(
        (sortBy?: string, sortOrder?: 'asc' | 'desc') => {
            updateUrl({ ...state, sortBy, sortOrder });
        },
        [state, updateUrl]
    );

    /**
     * Set custom filters
     */
    const setFilters = useCallback(
        (filters: Record<string, string | string[]>) => {
            // Reset to page 1 when filtering
            updateUrl({ ...state, filters, page: 1 });
        },
        [state, updateUrl]
    );

    /**
     * Reset all filters and search
     */
    const resetFilters = useCallback(() => {
        updateUrl({
            ...state,
            search: '',
            filters: {},
            page: 1,
        });
    }, [state, updateUrl]);

    return {
        state,
        setPage,
        setLimit,
        setSearch,
        setSorting,
        setFilters,
        resetFilters,
    };
}
