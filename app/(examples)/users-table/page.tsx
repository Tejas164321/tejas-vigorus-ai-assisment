'use client';

import { Suspense } from 'react';
import { ServerDataTable } from '@/components/data-table/server-data-table';
import { userColumns, User } from './columns';
import { UserFilters } from './filters';
import { TableState, PaginatedResponse } from '@/lib/types/table';
import { Loader2 } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';

/**
 * Example page demonstrating the ServerDataTable component
 * 
 * This shows:
 * 1. How to define columns separately
 * 2. How to create a fetch function
 * 3. How to use a data adapter for API flexibility
 * 4. How to add custom filters
 * 5. Complete URL-driven state management
 */

/**
 * Fetch function for users data
 * This calls our API route and returns the raw response
 */
async function fetchUsers(state: TableState): Promise<any> {
    const params = new URLSearchParams({
        page: state.page.toString(),
        limit: state.limit.toString(),
    });

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
            if (value) {
                params.set(key, Array.isArray(value) ? value.join(',') : value);
            }
        });
    }

    const response = await fetch(`/api/users?${params.toString()}`);

    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }

    return response.json();
}

/**
 * Data adapter function
 * This transforms the API response to match the expected PaginatedResponse format
 * 
 * In this case, our API already returns the correct format, but this demonstrates
 * how you would adapt a different API structure
 */
function usersDataAdapter(response: any): PaginatedResponse<User> {
    return {
        data: response.data,
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
    };
}

/**
 * Table component wrapped in Suspense for React 19 compatibility
 */
function UsersTableContent() {
    return (
        <ServerDataTable<User>
            columns={userColumns}
            fetchFunction={fetchUsers}
            dataAdapter={usersDataAdapter}
            filterComponent={UserFilters}
            searchPlaceholder="Search users by name or email..."
            defaultPageSize={10}
            pageSizeOptions={[10, 20, 50, 100]}
        />
    );
}

/**
 * Loading fallback for Suspense
 */
function TableLoadingFallback() {
    return (
        <div className="flex h-96 items-center justify-center">
            <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Loading table...</p>
            </div>
        </div>
    );
}

export default function UsersTablePage() {
    return (
        <div className="container mx-auto py-10 space-y-8 min-h-screen flex flex-col justify-center">
            <Card className="border-border">
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>
                        A list of all users including their name, role, email, and activity status.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<TableLoadingFallback />}>
                        <UsersTableContent />
                    </Suspense>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">100</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">84</div>
                        <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Active Roles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4</div>
                        <p className="text-xs text-muted-foreground">+19% from last month</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
