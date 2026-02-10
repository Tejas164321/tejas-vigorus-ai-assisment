import { NextRequest, NextResponse } from 'next/server';

/**
 * Mock user data
 * In production, this would come from a database
 */
interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    status: 'active' | 'inactive' | 'pending';
    joinedDate: string;
    lastActive: string;
}

const MOCK_USERS: User[] = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: ['Admin', 'Editor', 'Viewer', 'Contributor'][Math.floor(Math.random() * 4)],
    status: (['active', 'inactive', 'pending'] as const)[Math.floor(Math.random() * 3)],
    joinedDate: new Date(2020 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString().split('T')[0],
    lastActive: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString().split('T')[0],
}));

/**
 * GET /api/users
 * 
 * Server-side endpoint with pagination, sorting, filtering, and search
 * 
 * Query Parameters:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10)
 * - search: Search query (searches name and email)
 * - sort_by: Column to sort by
 * - sort_order: 'asc' or 'desc'
 * - role: Filter by role
 * - status: Filter by status
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;

        // Parse query parameters
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';
        const sortBy = searchParams.get('sort_by') || '';
        const sortOrder = searchParams.get('sort_order') || 'asc';
        const roleFilter = searchParams.get('role') || '';
        const statusFilter = searchParams.get('status') || '';
        const joinedDateFrom = searchParams.get('joinedDateFrom') || '';
        const joinedDateTo = searchParams.get('joinedDateTo') || '';
        const lastActiveDateFrom = searchParams.get('lastActiveDateFrom') || '';
        const lastActiveDateTo = searchParams.get('lastActiveDateTo') || '';

        // Start with all users
        let filteredUsers = [...MOCK_USERS];

        // Apply search
        if (search) {
            const searchLower = search.toLowerCase();
            filteredUsers = filteredUsers.filter(
                (user) =>
                    user.name.toLowerCase().includes(searchLower) ||
                    user.email.toLowerCase().includes(searchLower)
            );
        }

        // Apply filters
        if (roleFilter) {
            filteredUsers = filteredUsers.filter((user) => user.role === roleFilter);
        }

        if (statusFilter) {
            filteredUsers = filteredUsers.filter((user) => user.status === statusFilter);
        }

        // Apply joined date range filter
        if (joinedDateFrom) {
            filteredUsers = filteredUsers.filter((user) => user.joinedDate >= joinedDateFrom);
        }

        if (joinedDateTo) {
            filteredUsers = filteredUsers.filter((user) => user.joinedDate <= joinedDateTo);
        }

        // Apply last active date range filter
        if (lastActiveDateFrom) {
            filteredUsers = filteredUsers.filter((user) => user.lastActive >= lastActiveDateFrom);
        }

        if (lastActiveDateTo) {
            filteredUsers = filteredUsers.filter((user) => user.lastActive <= lastActiveDateTo);
        }

        // Apply sorting
        if (sortBy) {
            filteredUsers.sort((a, b) => {
                const aValue = a[sortBy as keyof User];
                const bValue = b[sortBy as keyof User];

                if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
                return 0;
            });
        }

        // Calculate pagination
        const total = filteredUsers.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

        // Simulate network delay for demo purposes
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Return response
        return NextResponse.json({
            data: paginatedUsers,
            total,
            page,
            limit,
            totalPages,
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        );
    }
}
