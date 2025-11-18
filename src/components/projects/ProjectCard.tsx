import React, { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { AvatarGroup } from '@/components/ui/Avatar';
import { ProjectStatusBadge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils/dateHelpers';
import { useGuestCheck } from '@/hooks/useGuestCheck';

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
  onDelete?: (projectId: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDelete }) => {
  const { canDelete } = useGuestCheck();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);

    try {
      await onDelete(project.id);
    } catch (error) {
      console.error('Error deleting project:', error);
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  // Progress
  const totalTasks = project.tasks?.length || project._count?.tasks || 0;
  const completedTasks = project.tasks?.filter(t => t.status === 'DONE').length || 0;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const statusColors = {
    ACTIVE: 'border-l-green-500',
    COMPLETED: 'border-l-blue-500',
    ARCHIVED: 'border-l-gray-400',
  };
  const borderColor = statusColors[project.status as keyof typeof statusColors] || 'border-l-gray-400';

  const memberAvatars =
    project.members?.map(m => ({
      name: m.name || m.email,
      alt: m.name || m.email,
    })) || [];

  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow border-l-4 p-6 transition-all duration-200',
        !showConfirm && 'hover:shadow-lg hover:-translate-y-1',
        borderColor
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <Link
          href={`/projects/${project.id}`}
          className="text-lg font-semibold text-gray-900 hover:text-blue-600:text-blue-400 transition-colors flex-1"
        >
          {project.title}
        </Link>

        <div className="flex items-center gap-2">
          <ProjectStatusBadge status={project.status} size="sm" />

          {canDelete && onDelete && (
            <button
              onClick={() => setShowConfirm(true)}
              disabled={isDeleting}
              className="group p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50:bg-red-900/20 rounded-md transition-all duration-200 disabled:opacity-50 transform hover:scale-110 active:scale-95"
              title="Delete project"
            >
              <svg className="w-5 h-5 transition-transform group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* ========= CONFIRM DELETE MODAL ========= */}
      {showConfirm && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity"
          onClick={() => !isDeleting && setShowConfirm(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
              Delete Project?
            </h3>

            <p className="text-sm text-gray-600 mb-2 text-center">
              Are you sure you want to delete
            </p>

            <p className="text-base font-semibold text-gray-900 mb-4 text-center px-4 py-2 bg-gray-100 rounded-lg">
              "{project.title}"
            </p>

            <p className="text-xs text-red-600 mb-6 text-center font-medium">
              ⚠️ This action cannot be undone
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200:bg-gray-600 rounded-lg transition-all duration-200 disabled:opacity-50 transform hover:scale-105 active:scale-95"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg transition-all duration-200 disabled:opacity-50 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              >
                {isDeleting ? 'Deleting...' : 'Delete Project'}
              </button>
            </div>
          </div>

          <style>{`
            @keyframes scaleIn {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
            }
            .animate-scaleIn {
              animation: scaleIn 0.2s ease-out;
            }
          `}</style>
        </div>
      )}

      {/* Description */}
      {project.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {project.description}
        </p>
      )}

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-600">Progress</span>
          <span className="text-xs font-semibold text-gray-900">{progress}%</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
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
        <div className="flex items-center gap-2">
          {memberAvatars.length > 0 ? (
            <AvatarGroup avatars={memberAvatars} max={3} size="sm" />
          ) : (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{project.owner?.name || project.owner?.email || 'No owner'}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500">
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
