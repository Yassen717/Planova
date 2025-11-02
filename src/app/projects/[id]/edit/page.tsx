'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ProjectForm from '@/components/projects/ProjectForm';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import Skeleton from '@/components/ui/Skeleton';

type Project = {
  id: string;
  title: string;
  description: string | null;
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  startDate: string;
  endDate: string | null;
};

export default function EditProjectPage() {
  const params = useParams();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${projectId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch project');
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch project');
      }
      
      setProject(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch project');
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

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{error || 'Project not found'}</span>
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
            { label: 'Projects', href: '/projects' },
            { label: project.title, href: `/projects/${projectId}` },
            { label: 'Edit', href: `/projects/${projectId}/edit` },
          ]}
        />
        
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Edit Project
          </h1>
          
          <ProjectForm
            initialData={{
              id: project.id,
              title: project.title,
              description: project.description || '',
              status: project.status,
              startDate: project.startDate.split('T')[0],
              endDate: project.endDate ? project.endDate.split('T')[0] : '',
            }}
          />
        </div>
      </div>
    </div>
  );
}
