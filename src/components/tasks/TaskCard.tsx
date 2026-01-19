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
        <TaskPriorityBadge priority={task.priority} size="sm" />
      </div>

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
