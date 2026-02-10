'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Badge } from '@/components/ui/badge';

/**
 * User type matching the API response
 */
export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    status: 'active' | 'inactive' | 'pending';
    joinedDate: string;
    lastActive: string;
}

/**
 * Column definitions for the users table
 * This demonstrates how to define columns separately from the table component
 */
export const userColumns: ColumnDef<User>[] = [
    {
        accessorKey: 'id',
        header: ({ column, table }) => (
            <DataTableColumnHeader column={column} title="ID" onSort={(table.options.meta as any)?.onSort} />
        ),
        cell: ({ row }) => <div className="w-[60px]">{row.getValue('id')}</div>,
    },
    {
        accessorKey: 'name',
        header: ({ column, table }) => (
            <DataTableColumnHeader column={column} title="Name" onSort={(table.options.meta as any)?.onSort} />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[200px] truncate font-medium">
                        {row.getValue('name')}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: 'email',
        header: ({ column, table }) => (
            <DataTableColumnHeader column={column} title="Email" onSort={(table.options.meta as any)?.onSort} />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[300px] truncate text-muted-foreground">
                        {row.getValue('email')}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: 'role',
        header: ({ column, table }) => (
            <DataTableColumnHeader column={column} title="Role" onSort={(table.options.meta as any)?.onSort} />
        ),
        cell: ({ row }) => {
            const role = row.getValue('role') as string;
            return (
                <div className="flex w-[100px] items-center">
                    <Badge variant="outline">{role}</Badge>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: 'status',
        header: ({ column, table }) => (
            <DataTableColumnHeader column={column} title="Status" onSort={(table.options.meta as any)?.onSort} />
        ),
        cell: ({ row }) => {
            const status = row.getValue('status') as string;

            const statusColors = {
                active: 'bg-green-500/10 text-green-500 border-green-500/20',
                inactive: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
                pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
            };

            return (
                <div className="flex w-[100px] items-center">
                    <Badge
                        variant="outline"
                        className={statusColors[status as keyof typeof statusColors]}
                    >
                        {status}
                    </Badge>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: 'joinedDate',
        header: ({ column, table }) => (
            <DataTableColumnHeader column={column} title="Joined Date" onSort={(table.options.meta as any)?.onSort} />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex items-center">
                    <span className="text-muted-foreground">
                        {row.getValue('joinedDate')}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: 'lastActive',
        header: ({ column, table }) => (
            <DataTableColumnHeader column={column} title="Last Active" onSort={(table.options.meta as any)?.onSort} />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex items-center">
                    <span className="text-muted-foreground">
                        {row.getValue('lastActive')}
                    </span>
                </div>
            );
        },
    },
];
