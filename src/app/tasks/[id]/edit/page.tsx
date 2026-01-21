'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import TaskForm from '@/components/tasks/TaskForm';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
        <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-5 bg-slate-200 rounded w-48"></div>
            <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/60 p-6 space-y-6">
              <div className="h-8 bg-slate-200 rounded w-32"></div>
              <div className="h-12 bg-slate-200 rounded"></div>
              <div className="h-24 bg-slate-200 rounded"></div>
              <div className="h-12 bg-slate-200 rounded"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-12 bg-slate-200 rounded"></div>
                <div className="h-12 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl" role="alert">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{error || 'Task not found'}</span>
            </div>
          </div>
          <Link 
            href="/tasks" 
            className="mt-4 inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Tasks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Tasks', href: '/tasks' },
            { label: task.title, href: `/tasks/${taskId}` },
            { label: 'Edit', href: `/tasks/${taskId}/edit` },
          ]}
        />
        
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/60 p-6 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl text-white shadow-lg shadow-indigo-500/25">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Edit Task
            </h1>
          </div>
          
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
