'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import TaskForm from '@/components/tasks/TaskForm';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import Skeleton from '@/components/ui/Skeleton';

type Task = {
  id: string;
  title: string;
  description: string | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  startDate: string | null;
  dueDate: string | null;
  projectId: string;
  assigneeId: string | null;
};

export default function EditTaskPage() {
  const params = useParams();
  const taskId = params.id as string;
  
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (taskId) {
      fetchTask();
    }
  }, [taskId]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tasks/${taskId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch task');
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch task');
      }
      
      setTask(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch task');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Skeleton variant="text" width="200px" height="20px" className="mb-6" />
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <Skeleton variant="text" width="300px" height="32px" className="mb-6" />
            <div className="space-y-6">
              <Skeleton variant="rectangular" height="80px" />
              <Skeleton variant="rectangular" height="120px" />
              <Skeleton variant="rectangular" height="80px" />
              <Skeleton variant="rectangular" height="80px" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{error || 'Task not found'}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Tasks', href: '/tasks' },
            { label: task.title, href: `/tasks/${taskId}` },
            { label: 'Edit', href: `/tasks/${taskId}/edit` },
          ]}
        />
        
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Edit Task
          </h1>
          
          <TaskForm
            initialData={{
              id: task.id,
              title: task.title,
              description: task.description || '',
              priority: task.priority,
              status: task.status,
              startDate: task.startDate ? task.startDate.split('T')[0] : '',
              dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
              projectId: task.projectId,
              assigneeId: task.assigneeId || '',
            }}
          />
        </div>
      </div>
    </div>
  );
}
