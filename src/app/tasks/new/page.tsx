'use client';

import React from 'react';
import TaskForm from '@/components/tasks/TaskForm';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';

export default function NewTaskPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Tasks', href: '/tasks' },
            { label: 'New Task', href: '/tasks/new' },
          ]}
        />
        
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Create New Task
          </h1>
          
          <TaskForm />
        </div>
      </div>
    </div>
  );
}
