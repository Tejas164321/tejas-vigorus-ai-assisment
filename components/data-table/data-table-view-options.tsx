'use client';

import { Settings2 } from 'lucide-react';
import { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface DataTableViewOptionsProps<TData> {
    table: Table<TData>;
}

export function DataTableViewOptions<TData>({
    table,
}: DataTableViewOptionsProps<TData>) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <Button
                variant="outline"
                size="sm"
                className="ml-auto h-8"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Settings2 className="mr-2 h-4 w-4" />
                View
            </Button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute right-0 z-50 mt-2 w-[200px] rounded-md border bg-popover p-3 shadow-md">
                        <div className="mb-2 text-sm font-medium">Toggle columns</div>
                        <div className="space-y-2">
                            {table
                                .getAllColumns()
                                .filter(
                                    (column) =>
                                        typeof column.accessorFn !== 'undefined' && column.getCanHide()
                                )
                                .map((column) => {
                                    return (
                                        <div key={column.id} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-input"
                                                checked={column.getIsVisible()}
                                                onChange={(e) =>
                                                    column.toggleVisibility(e.target.checked)
                                                }
                                            />
                                            <label className="text-sm font-normal capitalize cursor-pointer">
                                                {column.id.replace(/([A-Z])/g, ' $1').trim()}
                                            </label>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
