import { TableState } from '../types/table';

/**
 * Debounce function for delaying execution
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;

    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

/**
 * Serialize table state to URL query string
 */
export function serializeTableState(state: TableState): string {
    const params = new URLSearchParams();

    params.set('page', state.page.toString());
    params.set('limit', state.limit.toString());

    if (state.search) {
        params.set('search', state.search);
    }

    if (state.sortBy) {
        params.set('sort_by', state.sortBy);
    }

    if (state.sortOrder) {
        params.set('sort_order', state.sortOrder);
    }

    // Add custom filters
    if (state.filters) {
        Object.entries(state.filters).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach(v => params.append(key, v));
            } else if (value) {
                params.set(key, value);
            }
        });
    }

    return params.toString();
}

/**
 * Parse URL query parameters to table state
 */
export function parseTableState(
    searchParams: URLSearchParams,
    defaults: Partial<TableState> = {}
): TableState {
    const state: TableState = {
        page: parseInt(searchParams.get('page') || '1'),
        limit: parseInt(searchParams.get('limit') || defaults.limit?.toString() || '10'),
        search: searchParams.get('search') || '',
        sortBy: searchParams.get('sort_by') || undefined,
        sortOrder: (searchParams.get('sort_order') as 'asc' | 'desc') || undefined,
        filters: {},
    };

    // Extract custom filters (any params not in standard set)
    const standardParams = ['page', 'limit', 'search', 'sort_by', 'sort_order'];
    searchParams.forEach((value, key) => {
        if (!standardParams.includes(key)) {
            if (state.filters![key]) {
                // Multiple values for same key
                if (Array.isArray(state.filters![key])) {
                    (state.filters![key] as string[]).push(value);
                } else {
                    state.filters![key] = [state.filters![key] as string, value];
                }
            } else {
                state.filters![key] = value;
            }
        }
    });

    return state;
}

/**
 * Generate a stable query key for TanStack Query
 */
export function generateQueryKey(
    baseKey: string,
    state: TableState
): string[] {
    return [
        baseKey,
        state.page.toString(),
        state.limit.toString(),
        state.search,
        state.sortBy || '',
        state.sortOrder || '',
        JSON.stringify(state.filters || {}),
    ];
}

/**
 * Type guard to check if response is PaginatedResponse
 */
export function isPaginatedResponse(response: any): boolean {
    return (
        response &&
        typeof response === 'object' &&
        Array.isArray(response.data) &&
        typeof response.total === 'number' &&
        typeof response.page === 'number' &&
        typeof response.limit === 'number'
    );
}

/**
 * Get default table state
 */
export function getDefaultTableState(
    overrides: Partial<TableState> = {}
): TableState {
    return {
        page: 1,
        limit: 10,
        search: '',
        filters: {},
        ...overrides,
    };
}
