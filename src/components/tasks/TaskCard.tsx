import React from 'react';
import { cn } from '@/lib/utils/cn';
import Avatar from '@/components/ui/Avatar';
import { TaskPriorityBadge } from '@/components/ui/Badge';
import { formatDate, isOverdue } from '@/lib/utils/dateHelpers';

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
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  isDragging = false,
  onClick,
  onDragStart,
  onDragEnd,
}) => {
  const isPastDue = task.dueDate ? isOverdue(task.dueDate) : false;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={cn(
        'bg-white rounded-lg p-4 shadow-sm border border-gray-200',
        'cursor-pointer transition-all duration-200',
        'hover:shadow-md hover:border-blue-300:border-blue-600',
        isDragging && 'opacity-50 rotate-2 scale-105',
        !isDragging && 'hover:-translate-y-0.5'
      )}
    >
      {/* Header with Priority Badge */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 flex-1 pr-2">
          {task.title}
        </h3>
        <TaskPriorityBadge priority={task.priority} size="sm" />
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-600 line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      {/* Project Tag */}
      {task.project && (
        <div className="mb-3">
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            {task.project.title}
          </span>
        </div>
      )}

      {/* Footer with Assignee and Due Date */}
      <div className="flex items-center justify-between">
        {/* Assignee Avatar */}
        <div>
          {task.assignee ? (
            <Avatar
              name={task.assignee.name || task.assignee.email}
              size="xs"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
              <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
        </div>

        {/* Due Date */}
        {task.dueDate && (
          <div
            className={cn(
              'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded',
              isPastDue
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-700'
            )}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
