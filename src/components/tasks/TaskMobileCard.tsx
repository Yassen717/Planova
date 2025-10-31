import React from 'react';
import Link from 'next/link';
import Avatar from '@/components/ui/Avatar';
import { TaskStatusBadge, TaskPriorityBadge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils/dateHelpers';

export interface TaskMobileCardProps {
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
}

const TaskMobileCard: React.FC<TaskMobileCardProps> = ({ task }) => {
  return (
    <Link href={`/tasks/${task.id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1 pr-2">
            {task.title}
          </h3>
          <TaskPriorityBadge priority={task.priority} size="sm" />
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
            {task.description}
          </p>
        )}

        {/* Project */}
        {task.project && (
          <div className="mb-3">
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              {task.project.title}
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
          {/* Assignee */}
          <div className="flex items-center gap-2">
            {task.assignee ? (
              <>
                <Avatar name={task.assignee.name || task.assignee.email} size="xs" />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {task.assignee.name || task.assignee.email}
                </span>
              </>
            ) : (
              <span className="text-xs text-gray-500 dark:text-gray-400">Unassigned</span>
            )}
          </div>

          {/* Status and Due Date */}
          <div className="flex items-center gap-2">
            <TaskStatusBadge status={task.status} size="sm" />
            {task.dueDate && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(task.dueDate)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TaskMobileCard;
