import React, { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import Avatar from '@/components/ui/Avatar';
import { TaskPriorityBadge } from '@/components/ui/Badge';
import { formatDate, isOverdue } from '@/lib/utils/dateHelpers';
import { useGuestCheck } from '@/hooks/useGuestCheck';

export interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    dueDate: Date | null;
    assignee?: {
      id: string;
      name: string | null;
      email: string;
    } | null;
    project?: {
      id: string;
      title: string;
    } | null;
  };
  isDragging?: boolean;
  onClick?: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onDelete?: (taskId: string) => void | Promise<void>;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  isDragging = false,
  onClick,
  onDragStart,
  onDragEnd,
  onDelete,
}) => {
  const { canDelete } = useGuestCheck();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const isPastDue = task.dueDate ? isOverdue(task.dueDate) : false;

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);

    try {
      await onDelete(task.id);
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  const priorityIndicators = {
    URGENT: 'bg-red-500',
    HIGH: 'bg-orange-500',
    MEDIUM: 'bg-amber-500',
    LOW: 'bg-slate-400',
  };
  const priorityColor = priorityIndicators[task.priority as keyof typeof priorityIndicators] || 'bg-slate-400';

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={cn(
        'group relative bg-white rounded-xl p-4 shadow-sm ring-1 ring-slate-200/60',
        'cursor-pointer transition-all duration-200',
        'hover:shadow-lg hover:shadow-slate-200/50 hover:ring-slate-300/60',
        isDragging && 'opacity-60 rotate-2 scale-105 shadow-2xl ring-indigo-300',
        !isDragging && 'hover:-translate-y-0.5'
      )}
    >
      {/* Priority indicator line */}
      <div className={cn('absolute left-0 top-3 bottom-3 w-1 rounded-r-full', priorityColor)} />

      {/* Header with Priority Badge */}
      <div className="flex items-start justify-between mb-2 pl-2">
        <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 flex-1 pr-2 group-hover:text-indigo-600 transition-colors">
          {task.title}
        </h3>
        <div className="flex items-center gap-1.5">
          <TaskPriorityBadge priority={task.priority} size="sm" />
          {canDelete && onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowConfirm(true);
              }}
              disabled={isDeleting}
              className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50 opacity-0 group-hover:opacity-100"
              title="Delete task"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Confirm Delete Modal */}
      {showConfirm && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={(e) => {
            e.stopPropagation();
            if (!isDeleting) setShowConfirm(false);
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full animate-scale-in ring-1 ring-slate-200/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-100 to-red-50 rounded-2xl">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2 text-center">
              Delete Task?
            </h3>

            <p className="text-sm text-slate-500 mb-2 text-center">
              Are you sure you want to delete
            </p>

            <p className="text-base font-semibold text-slate-900 mb-4 text-center px-4 py-2.5 bg-slate-100 rounded-xl">
              "{task.title}"
            </p>

            <p className="text-xs text-red-500 mb-6 text-center font-medium flex items-center justify-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              This action cannot be undone
            </p>

            <div className="flex gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowConfirm(false);
                }}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl transition-all duration-200 disabled:opacity-50 shadow-lg shadow-red-500/25 hover:shadow-red-500/40"
              >
                {isDeleting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Deleting...
                  </span>
                ) : 'Delete Task'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Description */}
      {task.description && (
        <p className="text-xs text-slate-500 line-clamp-2 mb-3 pl-2">
          {task.description}
        </p>
      )}

      {/* Project Tag */}
      {task.project && (
        <div className="mb-3 pl-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 rounded-lg">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            {task.project.title}
          </span>
        </div>
      )}

      {/* Footer with Assignee and Due Date */}
      <div className="flex items-center justify-between pl-2 pt-2 border-t border-slate-100">
        {/* Assignee Avatar */}
        <div>
          {task.assignee ? (
            <Avatar
              name={task.assignee.name || task.assignee.email}
              size="xs"
              status="online"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center ring-2 ring-white">
              <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
        </div>

        {/* Due Date */}
        {task.dueDate && (
          <div
            className={cn(
              'flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg transition-colors',
              isPastDue
                ? 'bg-red-50 text-red-600'
                : 'bg-slate-100 text-slate-600'
            )}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(task.dueDate)}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
