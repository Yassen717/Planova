'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import TaskCard from './TaskCard';
import { useRouter } from 'next/navigation';

export interface TaskKanbanProps {
  tasks: Array<{
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
  }>;
  onTaskMove: (taskId: string, newStatus: string) => Promise<void>;
}

const COLUMNS = [
  { id: 'TODO', label: 'To Do', color: 'bg-gray-500' },
  { id: 'IN_PROGRESS', label: 'In Progress', color: 'bg-blue-500' },
  { id: 'REVIEW', label: 'Review', color: 'bg-yellow-500' },
  { id: 'DONE', label: 'Done', color: 'bg-green-500' },
];

const TaskKanban: React.FC<TaskKanbanProps> = ({ tasks, onTaskMove }) => {
  const router = useRouter();
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  const handleDragStart = (taskId: string) => {
    setDraggedTaskId(taskId);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    
    if (!draggedTaskId) return;

    const task = tasks.find((t) => t.id === draggedTaskId);
    if (!task || task.status === newStatus) {
      handleDragEnd();
      return;
    }

    try {
      await onTaskMove(draggedTaskId, newStatus);
    } catch (error) {
      console.error('Error moving task:', error);
    } finally {
      handleDragEnd();
    }
  };

  const handleTaskClick = (taskId: string) => {
    router.push(`/tasks/${taskId}`);
  };

  return (
    <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
      {COLUMNS.map((column) => {
        const columnTasks = getTasksByStatus(column.id);
        const isDragOver = dragOverColumn === column.id;

        return (
          <div
            key={column.id}
            className="flex-shrink-0 w-72 sm:w-80"
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={cn('w-3 h-3 rounded-full', column.color)} />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {column.label}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({columnTasks.length})
                </span>
              </div>
              <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className={cn('h-full', column.color)} style={{ width: '100%' }} />
              </div>
            </div>

            {/* Column Content */}
            <div
              className={cn(
                'min-h-[200px] p-3 rounded-lg transition-colors',
                isDragOver
                  ? 'bg-blue-50 dark:bg-blue-900/10 border-2 border-dashed border-blue-400'
                  : 'bg-gray-50 dark:bg-gray-900/50 border-2 border-transparent'
              )}
            >
              <div className="space-y-3">
                {columnTasks.length > 0 ? (
                  columnTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      isDragging={draggedTaskId === task.id}
                      onClick={() => handleTaskClick(task.id)}
                      onDragStart={() => handleDragStart(task.id)}
                      onDragEnd={handleDragEnd}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400 dark:text-gray-600 text-sm">
                    {isDragOver ? 'Drop here' : 'No tasks'}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskKanban;
