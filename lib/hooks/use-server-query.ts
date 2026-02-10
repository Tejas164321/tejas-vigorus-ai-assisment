'use client';

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import {
    TableState,
    PaginatedResponse,
    FetchFunction,
    DataAdapter,
} from '../types/table';
import { generateQueryKey } from '../utils/table-helpers';

/**
 * Custom hook for fetching server data with TanStack Query
 * Handles caching, loading states, and automatic refetching
 * 
 * @param queryKey - Base query key (e.g., 'users-table')
 * @param state - Current table state
 * @param fetchFunction - Function to fetch data from API
 * @param dataAdapter - Optional function to transform API response
 * @returns Query result with data, loading, and error states
 */
export function useServerQuery<TData, TResponse = any>(
    queryKey: string,
    state: TableState,
    fetchFunction: FetchFunction<TResponse>,
    dataAdapter?: DataAdapter<TData, TResponse>
): UseQueryResult<PaginatedResponse<TData>, Error> {
    return useQuery({
        queryKey: generateQueryKey(queryKey, state),
        queryFn: async () => {
            // Fetch data from API
            const response = await fetchFunction(state);

            // Transform if adapter provided
            if (dataAdapter) {
                return dataAdapter(response);
            }

            // Otherwise, assume response is already in correct format
            return response as PaginatedResponse<TData>;
        },
        staleTime: 30000, // 30 seconds - adjust based on data update frequency
        gcTime: 5 * 60 * 1000, // 5 minutes - keep in cache
        refetchOnWindowFocus: false, // Prevent refetch on tab focus
        retry: 2, // Retry failed requests twice
    });
}
