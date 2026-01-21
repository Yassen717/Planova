'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import TaskForm from '@/components/tasks/TaskForm';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';

function NewTaskContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId') || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Tasks', href: '/tasks' },
            { label: 'New Task', href: '/tasks/new' },
          ]}
        />
        
        <div className="mt-6 bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/60 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Create New Task</h1>
                <p className="text-sm text-indigo-100 mt-0.5">Fill in the details to create a new task</p>
              </div>
            </div>
          </div>
          
          {/* Form */}
          <div className="p-6">
            <TaskForm initialProjectId={projectId} />
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-48 mb-6"></div>
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/60 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5">
              <div className="h-8 bg-white/20 rounded w-64"></div>
            </div>
            <div className="p-6 space-y-4">
              <div className="h-10 bg-slate-200 rounded"></div>
              <div className="h-10 bg-slate-200 rounded"></div>
              <div className="h-32 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewTaskPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <NewTaskContent />
    </Suspense>
  );
}
