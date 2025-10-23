'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProjectsMetadata } from '@/lib/metadata';

export const metadata = getProjectsMetadata();

export default function ProjectsPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
        <Link 
          href="/projects" 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          New Project
        </Link>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Project List</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-400">No projects found.</p>
        </div>
      </div>
    </div>
  );
}
