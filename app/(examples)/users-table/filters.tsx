'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { TableState } from '@/lib/types/table';
import { DateRange } from 'react-day-picker';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserFiltersProps {
    state: TableState;
    onFilterChange: (filters: Record<string, string | string[]>) => void;
}

export function UserFilters({ state, onFilterChange }: UserFiltersProps) {
    const currentFilters = state.filters || {};

    const handleRoleChange = (role: string) => {
        const newFilters = { ...currentFilters };
        if (role && role !== 'all') {
            newFilters.role = role;
        } else {
            delete newFilters.role;
        }
        onFilterChange(newFilters);
    };

    const handleStatusChange = (status: string) => {
        const newFilters = { ...currentFilters };
        if (status && status !== 'all') {
            newFilters.status = status;
        } else {
            delete newFilters.status;
        }
        onFilterChange(newFilters);
    };

    const handleJoinedDateChange = (range: DateRange | undefined) => {
        const newFilters = { ...currentFilters };
        if (range?.from) {
            newFilters.joinedDateFrom = range.from.toISOString().split('T')[0];
        } else {
            delete newFilters.joinedDateFrom;
        }

        if (range?.to) {
            newFilters.joinedDateTo = range.to.toISOString().split('T')[0];
        } else {
            delete newFilters.joinedDateTo;
        }

        onFilterChange(newFilters);
    };

    const handleLastActiveDateChange = (range: DateRange | undefined) => {
        const newFilters = { ...currentFilters };
        if (range?.from) {
            newFilters.lastActiveDateFrom = range.from.toISOString().split('T')[0];
        } else {
            delete newFilters.lastActiveDateFrom;
        }

        if (range?.to) {
            newFilters.lastActiveDateTo = range.to.toISOString().split('T')[0];
        } else {
            delete newFilters.lastActiveDateTo;
        }

        onFilterChange(newFilters);
    };

    // Helper to parse date strings back to Date objects for the picker
    const getJoinedDateRange = (): DateRange | undefined => {
        if (!currentFilters.joinedDateFrom) return undefined;
        return {
            from: new Date(currentFilters.joinedDateFrom as string),
            to: currentFilters.joinedDateTo ? new Date(currentFilters.joinedDateTo as string) : undefined
        };
    };

    const getLastActiveDateRange = (): DateRange | undefined => {
        if (!currentFilters.lastActiveDateFrom) return undefined;
        return {
            from: new Date(currentFilters.lastActiveDateFrom as string),
            to: currentFilters.lastActiveDateTo ? new Date(currentFilters.lastActiveDateTo as string) : undefined
        };
    };

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
                {/* Role Filter */}
                <Select
                    value={currentFilters.role as string || 'all'}
                    onValueChange={handleRoleChange}
                >
                    <SelectTrigger className="w-[130px] h-9">
                        <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Editor">Editor</SelectItem>
                        <SelectItem value="Viewer">Viewer</SelectItem>
                        <SelectItem value="Contributor">Contributor</SelectItem>
                    </SelectContent>
                </Select>

                {/* Status Filter */}
                <Select
                    value={currentFilters.status as string || 'all'}
                    onValueChange={handleStatusChange}
                >
                    <SelectTrigger className="w-[130px] h-9">
                        <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                </Select>

                {/* Date Ranges */}
                <DatePickerWithRange
                    value={getJoinedDateRange()}
                    onChange={handleJoinedDateChange}
                    placeholder="Joined Date"
                    className="w-auto"
                />

                <DatePickerWithRange
                    value={getLastActiveDateRange()}
                    onChange={handleLastActiveDateChange}
                    placeholder="Last Active"
                    className="w-auto"
                />

                {/* Reset Filters Quick Action (if any filters active) */}
                {Object.keys(currentFilters).length > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onFilterChange({})}
                        className="h-9 px-2 text-muted-foreground"
                    >
                        <X className="mr-2 h-4 w-4" />
                        Reset
                    </Button>
                )}
            </div>
        </div>
    );
}
