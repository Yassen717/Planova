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
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: [] as string[],
    dateRange: { start: null as Date | null, end: null as Date | null },
    owner: [] as string[],
  });

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      try {
        const [projectsRes, usersRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/users'),
        ]);
        const projectsData = await projectsRes.json();
        const usersData = await usersRes.json();
        setProjects(projectsData);
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }
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
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
