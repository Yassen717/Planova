'use client';

import React, { useState, useMemo } from 'react';
import FilterPanel from '@/components/shared/FilterPanel';
import { FilterOption } from '@/types/ui';
import { countActiveFilters } from '@/lib/utils/filterHelpers';

export interface ProjectFiltersProps {
  filters: {
    status: string[];
    dateRange: {
      start: Date | null;
      end: Date | null;
    };
    owner: string[];
  };
  onFilterChange: (filterId: string, value: any) => void;
  onReset: () => void;
  owners?: Array<{ id: string; name: string | null; email: string }>;
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  owners = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const filterOptions: FilterOption[] = useMemo(() => {
    return [
      {
        id: 'status',
        label: 'Status',
        type: 'multiselect',
        options: [
          { value: 'ACTIVE', label: 'Active' },
          { value: 'COMPLETED', label: 'Completed' },
          { value: 'ARCHIVED', label: 'Archived' },
        ],
        value: filters.status,
      },
      {
        id: 'dateRange',
        label: 'Date Range',
        type: 'daterange',
        value: filters.dateRange,
      },
      {
        id: 'owner',
        label: 'Owner',
        type: 'multiselect',
        options: owners.map((owner) => ({
          value: owner.id,
          label: owner.name || owner.email,
        })),
        value: filters.owner,
      },
    ];
  }, [filters, owners]);

  const activeFilterCount = useMemo(() => {
    return countActiveFilters({
      status: filters.status,
      dateRange: filters.dateRange,
      assignee: filters.owner,
    });
  }, [filters]);

  return (
    <FilterPanel
      filters={filterOptions}
      onFilterChange={onFilterChange}
      onReset={onReset}
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
      activeFilterCount={activeFilterCount}
    />
  );
};

export default ProjectFilters;
