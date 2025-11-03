'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import ProjectCard from '@/components/projects/ProjectCard';
import ProjectSearch from '@/components/projects/ProjectSearch';
import ProjectFilters from '@/components/projects/ProjectFilters';
import { EmptyProjects, EmptySearchResults } from '@/components/ui/EmptyState';
import { SkeletonCard } from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import { applySearchFilter, applyStatusFilter, applyDateRangeFilter } from '@/lib/utils/filterHelpers';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: [] as string[],
    dateRange: { start: null as Date | null, end: null as Date | null },
    owner: [] as string[],
  });

  // Fetch data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [projectsRes, usersRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/users'),
      ]);
      
      if (!projectsRes.ok || !usersRes.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const projectsData = await projectsRes.json();
      const usersData = await usersRes.json();
      setProjects(projectsData);
      setUsers(usersData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter projects
  const filteredProjects = useMemo(() => {
    let result = projects;

    // Apply search
    if (searchTerm) {
      result = applySearchFilter(result, searchTerm, ['title', 'description']);
    }

    // Apply status filter
    if (filters.status.length > 0) {
      result = applyStatusFilter(result, filters.status);
    }

    // Apply date range filter
    if (filters.dateRange.start || filters.dateRange.end) {
      result = applyDateRangeFilter(result, 'endDate', filters.dateRange.start, filters.dateRange.end);
    }

    // Apply owner filter
    if (filters.owner.length > 0) {
      result = result.filter((project) => filters.owner.includes(project.ownerId));
    }

    return result;
  }, [projects, searchTerm, filters]);

  const handleFilterChange = (filterId: string, value: any) => {
    setFilters((prev) => ({ ...prev, [filterId]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      status: [],
      dateRange: { start: null, end: null },
      owner: [],
    });
    setSearchTerm('');
  };

  const hasActiveFilters = searchTerm || filters.status.length > 0 || filters.owner.length > 0 || filters.dateRange.start || filters.dateRange.end;

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <svg className="w-16 h-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Failed to load projects</h3>
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
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
        <Link href="/projects/new">
          <Button variant="primary">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <ProjectSearch
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={() => setSearchTerm('')}
          />
        </div>
        <ProjectFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          owners={users}
        />
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <>
          {hasActiveFilters ? (
            <EmptySearchResults />
          ) : (
            <EmptyProjects onCreateProject={() => window.location.href = '/projects/new'} />
          )}
        </>
      )}
    </div>
  );
}
