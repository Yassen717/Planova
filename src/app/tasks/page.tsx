'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import TaskKanban from '@/components/tasks/TaskKanban';
import TaskSearch from '@/components/tasks/TaskSearch';
import TaskFilters from '@/components/tasks/TaskFilters';
import TaskMobileCard from '@/components/tasks/TaskMobileCard';
import { EmptyTasks, EmptySearchResults } from '@/components/ui/EmptyState';
import { SkeletonTable } from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import { TaskStatusBadge, TaskPriorityBadge } from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import SortableHeader from '@/components/shared/SortableHeader';
import Pagination from '@/components/shared/Pagination';
import { formatDate } from '@/lib/utils/dateHelpers';
import { useSort } from '@/hooks/useSort';
import { usePagination } from '@/hooks/usePagination';
import {
  applySearchFilter,
  applyStatusFilter,
  applyPriorityFilter,
  applyAssigneeFilter,
  applyProjectFilter,
} from '@/lib/utils/filterHelpers';
import { useGuestCheck } from '@/hooks/useGuestCheck';

type ViewMode = 'table' | 'kanban';

export default function TasksPage() {
  const { canCreate } = useGuestCheck();
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: [] as string[],
    priority: [] as string[],
    assignee: [] as string[],
    project: [] as string[],
  });

  // Load view preference from localStorage
  useEffect(() => {
    const savedView = localStorage.getItem('tasksViewMode') as ViewMode;
    if (savedView) {
      setViewMode(savedView);
    }
  }, []);

  // Fetch data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [tasksRes, projectsRes, usersRes] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/projects'),
        fetch('/api/users'),
      ]);
      
      if (!tasksRes.ok || !projectsRes.ok || !usersRes.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const tasksData = await tasksRes.json();
      const projectsData = await projectsRes.json();
      const usersData = await usersRes.json();
      setTasks(tasksData.data || tasksData);
      setProjects(projectsData.data || projectsData);
      setUsers(usersData.data || usersData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    let result = tasks;

    // Apply search
    if (searchTerm) {
      result = applySearchFilter(result, searchTerm, ['title', 'description']);
    }

    // Apply filters
    if (filters.status.length > 0) {
      result = applyStatusFilter(result, filters.status);
    }
    if (filters.priority.length > 0) {
      result = applyPriorityFilter(result, filters.priority);
    }
    if (filters.assignee.length > 0) {
      result = applyAssigneeFilter(result, filters.assignee);
    }
    if (filters.project.length > 0) {
      result = applyProjectFilter(result, filters.project);
    }

    return result;
  }, [tasks, searchTerm, filters]);

  // Sort tasks
  const { sortState, sortedData, sortBy } = useSort({
    data: filteredTasks,
    initialSort: null,
  });

  // Ensure sortedData is an array
  const sortedTasksArray = Array.isArray(sortedData) ? sortedData : [];

  // Paginate tasks
  const pagination = usePagination({
    totalItems: sortedTasksArray.length,
    initialPageSize: 20,
  });

  const paginatedTasks = useMemo(() => {
    return sortedTasksArray.slice(pagination.startIndex, pagination.endIndex);
  }, [sortedTasksArray, pagination.startIndex, pagination.endIndex]);

  const handleFilterChange = (filterId: string, value: any) => {
    setFilters((prev) => ({ ...prev, [filterId]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      status: [],
      priority: [],
      assignee: [],
      project: [],
    });
    setSearchTerm('');
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('tasksViewMode', mode);
  };

  const handleTaskMove = async (taskId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('API Error:', response.status, errorData);
        throw new Error('Failed to update task');
      }

      // Update local state
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const hasActiveFilters =
    searchTerm ||
    filters.status.length > 0 ||
    filters.priority.length > 0 ||
    filters.assignee.length > 0 ||
    filters.project.length > 0;

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Tasks</h1>
        </div>
        <SkeletonTable rows={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Tasks</h1>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <svg className="w-16 h-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Failed to load tasks</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <Button onClick={fetchData} variant="primary">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Tasks</h1>
        {canCreate && (
          <Link href="/tasks/new">
            <Button variant="primary">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Task
            </Button>
          </Link>
        )}
      </div>

      {/* Search, Filters, and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1">
          <TaskSearch
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={() => setSearchTerm('')}
          />
        </div>
        <div className="flex gap-2">
          <TaskFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
            assignees={users}
            projects={projects}
          />
          {/* View Toggle - Hidden on mobile, show cards by default */}
          <div className="hidden sm:flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => handleViewModeChange('table')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
              aria-label="Table view"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            <button
              onClick={() => handleViewModeChange('kanban')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
              aria-label="Kanban view"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {filteredTasks.length > 0 ? (
        <>
          {viewMode === 'kanban' ? (
            <div className="overflow-x-auto">
              <TaskKanban tasks={filteredTasks} onTaskMove={handleTaskMove} />
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="sm:hidden">
                <div className="space-y-3">
                  {paginatedTasks.map((task) => (
                    <TaskMobileCard key={task.id} task={task} />
                  ))}
                </div>
                {/* Mobile Pagination */}
                {sortedTasksArray.length > 10 && (
                  <div className="mt-4">
                    <Pagination
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      pageSize={pagination.pageSize}
                      totalItems={pagination.totalItems}
                      onPageChange={pagination.goToPage}
                      onPageSizeChange={pagination.setPageSize}
                    />
                  </div>
                )}
              </div>
              
              {/* Desktop Table View */}
              <div className="hidden sm:block bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <SortableHeader
                        label="Task"
                        sortKey="title"
                        currentSort={sortState}
                        onSort={sortBy}
                      />
                      <SortableHeader
                        label="Assignee"
                        sortKey="assignee.name"
                        currentSort={sortState}
                        onSort={sortBy}
                      />
                      <SortableHeader
                        label="Status"
                        sortKey="status"
                        currentSort={sortState}
                        onSort={sortBy}
                      />
                      <SortableHeader
                        label="Priority"
                        sortKey="priority"
                        currentSort={sortState}
                        onSort={sortBy}
                      />
                      <SortableHeader
                        label="Due Date"
                        sortKey="dueDate"
                        currentSort={sortState}
                        onSort={sortBy}
                      />
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    {paginatedTasks.map((task) => (
                      <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4">
                          <Link
                            href={`/tasks/${task.id}`}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                          >
                            {task.title}
                          </Link>
                          {task.description && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                              {task.description}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {task.assignee ? (
                            <div className="flex items-center gap-2">
                              <Avatar name={task.assignee.name || task.assignee.email} size="sm" />
                              <span className="text-sm text-gray-900 dark:text-white">
                                {task.assignee.name || task.assignee.email}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500 dark:text-gray-400">Unassigned</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <TaskStatusBadge status={task.status} size="sm" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <TaskPriorityBadge priority={task.priority} size="sm" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {task.dueDate ? formatDate(task.dueDate) : 'No due date'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              {sortedTasksArray.length > 10 && (
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  pageSize={pagination.pageSize}
                  totalItems={pagination.totalItems}
                  onPageChange={pagination.goToPage}
                  onPageSizeChange={pagination.setPageSize}
                />
              )}
            </div>
            </>
          )}
        </>
      ) : (
        <>
          {hasActiveFilters ? (
            <EmptySearchResults />
          ) : (
            <EmptyTasks onCreateTask={() => (window.location.href = '/tasks/new')} />
          )}
        </>
      )}
    </div>
  );
}
