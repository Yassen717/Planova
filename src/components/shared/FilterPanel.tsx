'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { FilterOption } from '@/types/ui';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export interface FilterPanelProps {
  filters: FilterOption[];
  onFilterChange: (filterId: string, value: any) => void;
  onReset: () => void;
  isOpen: boolean;
  onToggle: () => void;
  activeFilterCount?: number;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  onReset,
  isOpen,
  onToggle,
  activeFilterCount = 0,
}) => {
  const renderFilterControl = (filter: FilterOption) => {
    switch (filter.type) {
      case 'select':
        return (
          <select
            value={filter.value || ''}
            onChange={(e) => onFilterChange(filter.id, e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            {filter.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'multiselect':
        return (
          <div className="space-y-2">
            {filter.options?.map((option) => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filter.value?.includes(option.value) || false}
                  onChange={(e) => {
                    const currentValues = filter.value || [];
                    const newValues = e.target.checked
                      ? [...currentValues, option.value]
                      : currentValues.filter((v: string) => v !== option.value);
                    onFilterChange(filter.id, newValues);
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'daterange':
        return (
          <div className="space-y-2">
            <input
              type="date"
              value={filter.value?.start ? new Date(filter.value.start).toISOString().split('T')[0] : ''}
              onChange={(e) =>
                onFilterChange(filter.id, {
                  ...filter.value,
                  start: e.target.value ? new Date(e.target.value) : null,
                })
              }
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Start date"
            />
            <input
              type="date"
              value={filter.value?.end ? new Date(filter.value.end).toISOString().split('T')[0] : ''}
              onChange={(e) =>
                onFilterChange(filter.id, {
                  ...filter.value,
                  end: e.target.value ? new Date(e.target.value) : null,
                })
              }
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="End date"
            />
          </div>
        );

      case 'checkbox':
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filter.value || false}
              onChange={(e) => onFilterChange(filter.id, e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{filter.label}</span>
          </label>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative">
      {/* Filter Toggle Button */}
      <Button
        variant="secondary"
        onClick={onToggle}
        className="relative"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        Filters
        {activeFilterCount > 0 && (
          <Badge variant="info" size="sm" className="ml-2">
            {activeFilterCount}
          </Badge>
        )}
      </Button>

      {/* Filter Panel - Desktop: Dropdown, Mobile: Full Screen */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={onToggle}
          />

          {/* Filter Panel */}
          <div
            className={cn(
              'bg-white rounded-lg shadow-lg z-50',
              'md:absolute md:right-0 md:top-full md:mt-2 md:w-80',
              'fixed inset-x-0 bottom-0 md:inset-auto',
              'max-h-[80vh] overflow-y-auto'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <button
                onClick={onToggle}
                className="text-gray-400 hover:text-gray-600:text-gray-300 md:hidden"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Filter Controls */}
            <div className="p-4 space-y-4">
              {filters.map((filter) => (
                <div key={filter.id}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {filter.label}
                  </label>
                  {renderFilterControl(filter)}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex gap-2 p-4 border-t border-gray-200">
              <Button variant="secondary" onClick={onReset} className="flex-1">
                Reset
              </Button>
              <Button variant="primary" onClick={onToggle} className="flex-1 md:hidden">
                Apply
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FilterPanel;
