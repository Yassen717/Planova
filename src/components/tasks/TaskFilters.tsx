'use client';

import React, { useState, useMemo } from 'react';
import FilterPanel from '@/components/shared/FilterPanel';
import { FilterOption } from '@/types/ui';
import { countActiveFilters } from '@/lib/utils/filterHelpers';

export interface TaskFiltersProps {
  filters: {
    status: string[];
    priority: string[];
    assignee: string[];
    project: string[];
  };
  onFilterChange: (filterId: string, value: any) => void;
  onReset: () => void;
  assignees?: Array<{ id: string; name: string | null; email: string }>;
  projects?: Array<{ id: string; title: string }>;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  assignees = [],
  projects = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const filterOptions: FilterOption[] = useMemo(() => {
    return [
      {
        id: 'status',
        label: 'Status',
        type: 'multiselect',
        options: [
          { value: 'TODO', label: 'To Do' },
          { value: 'IN_PROGRESS', label: 'In Progress' },
          { value: 'REVIEW', label: 'Review' },
          { value: 'DONE', label: 'Done' },
        ],
        value: filters.status,
      },
      {
        id: 'priority',
        label: 'Priority',
        type: 'multiselect',
        options: [
          { value: 'LOW', label: 'Low' },
          { value: 'MEDIUM', label: 'Medium' },
          { value: 'HIGH', label: 'High' },
          { value: 'URGENT', label: 'Urgent' },
        ],
        value: filters.priority,
      },
      {
        id: 'assignee',
        label: 'Assignee',
        type: 'multiselect',
        options: assignees.map((assignee) => ({
          value: assignee.id,
          label: assignee.name || assignee.email,
        })),
        value: filters.assignee,
      },
      {
        id: 'project',
        label: 'Project',
        type: 'multiselect',
        options: projects.map((project) => ({
          value: project.id,
          label: project.title,
        })),
        value: filters.project,
      },
    ];
  }, [filters, assignees, projects]);

  const activeFilterCount = useMemo(() => {
    return countActiveFilters({
      status: filters.status,
      priority: filters.priority,
      assignee: filters.assignee,
      project: filters.project,
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

export default TaskFilters;
