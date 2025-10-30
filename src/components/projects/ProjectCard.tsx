import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { AvatarGroup } from '@/components/ui/Avatar';
import { ProjectStatusBadge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils/dateHelpers';

export interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    startDate: Date;
    endDate: Date | null;
    owner?: {
      id: string;
      name: string | null;
      email: string;
    } | null;
    members?: Array<{
      id: string;
      name: string | null;
      email: string;
    }>;
    tasks?: Array<{
      id: string;
      status: string;
    }>;
    _count?: {
      tasks: number;
    };
  };
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  // Calculate progress
  const totalTasks = project.tasks?.length || project._count?.tasks || 0;
  const completedTasks = project.tasks?.filter((task) => task.status === 'DONE').length || 0;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Get status color for border
  const statusColors = {
    ACTIVE: 'border-l-green-500',
    COMPLETED: 'border-l-blue-500',
    ARCHIVED: 'border-l-gray-400',
  };

  const borderColor = statusColors[project.status as keyof typeof statusColors] || 'border-l-gray-400';

  // Prepare member avatars
  const memberAvatars = project.members?.map((member) => ({
    name: member.name || member.email,
    alt: member.name || member.email,
  })) || [];

  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-lg shadow border-l-4 p-6',
        'hover:shadow-lg transition-all duration-200 hover:-translate-y-1',
        borderColor
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <Link
          href={`/projects/${project.id}`}
          className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          {project.title}
        </Link>
        <ProjectStatusBadge status={project.status} size="sm" />
      </div>

      {/* Description */}
      {project.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {project.description}
        </p>
      )}

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Progress</span>
          <span className="text-xs font-semibold text-gray-900 dark:text-white">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              project.status === 'COMPLETED' ? 'bg-blue-500' : 'bg-green-500'
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Members */}
        <div className="flex items-center gap-2">
          {memberAvatars.length > 0 ? (
            <AvatarGroup avatars={memberAvatars} max={3} size="sm" />
          ) : (
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{project.owner?.name || project.owner?.email || 'No owner'}</span>
            </div>
          )}
        </div>

        {/* Task Count and Date */}
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>{totalTasks}</span>
          </div>
          {project.endDate && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(project.endDate)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
