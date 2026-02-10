'use client';

import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Column } from '@tanstack/react-table';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';

interface DataTableColumnHeaderProps<TData, TValue> {
    column: Column<TData, TValue>;
    title: string;
    onSort?: (columnId: string, direction: 'asc' | 'desc' | undefined) => void;
}

export function DataTableColumnHeader<TData, TValue>({
    column,
    title,
    onSort,
}: DataTableColumnHeaderProps<TData, TValue>) {
    if (!column.getCanSort()) {
        return <div className={cn("text-left")}>{title}</div>;
    }

    const sorted = column.getIsSorted();

    const handleSort = () => {
        let newDirection: 'asc' | 'desc' | undefined;

        if (!sorted) {
            newDirection = 'asc';
        } else if (sorted === 'asc') {
            newDirection = 'desc';
        } else {
            newDirection = undefined;
        }

        column.toggleSorting(sorted === 'asc');
        onSort?.(column.id, newDirection);
    };

    return (
        <div className={cn("flex items-center space-x-2")}>
            <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 data-[state=open]:bg-accent"
                onClick={handleSort}
            >
                <span>{title}</span>
                {sorted === 'desc' ? (
                    <ArrowDown className="ml-2 h-4 w-4" />
                ) : sorted === 'asc' ? (
                    <ArrowUp className="ml-2 h-4 w-4" />
                ) : (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                )}
            </Button>
        </div>
    );
}
