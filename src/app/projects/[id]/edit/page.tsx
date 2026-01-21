'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProjectForm from '@/components/projects/ProjectForm';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';

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

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl" role="alert">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{error || 'Project not found'}</span>
            </div>
          </div>
          <Link 
            href="/projects" 
            className="mt-4 inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Projects
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
            { label: 'Projects', href: '/projects' },
            { label: project.title, href: `/projects/${projectId}` },
            { label: 'Edit', href: `/projects/${projectId}/edit` },
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
              Edit Project
            </h1>
          </div>
          
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
