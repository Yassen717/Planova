'use client';

import React from 'react';
import ProjectForm from '@/components/projects/ProjectForm';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';

export default function NewProjectPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Projects', href: '/projects' },
            { label: 'New Project', href: '/projects/new' },
          ]}
        />
        
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Create New Project
          </h1>
          
          <ProjectForm />
        </div>
      </div>
    </div>
  );
}
