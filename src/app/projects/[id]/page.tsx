'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

type Project = {
  id: string;
  title: string;
  description: string | null;
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  startDate: string;
  endDate: string | null;
  owner: {
    id: string;
    name: string | null;
    email: string;
  };
  members: {
    id: string;
    name: string | null;
    email: string;
  }[];
  tasks: {
    id: string;
    title: string;
    status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    assignee: {
      id: string;
      name: string | null;
      email: string;
    } | null;
  }[];
};

export default function ProjectDetailPage() {
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
      // Fetch real data from the API
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TODO': return 'bg-slate-100 text-slate-700';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'REVIEW': return 'bg-amber-100 text-amber-800';
      case 'DONE': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-emerald-100 text-emerald-800';
      case 'MEDIUM': return 'bg-amber-100 text-amber-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'URGENT': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900">Project not found</h1>
            <p className="mt-2 text-gray-600">The project you're looking for doesn't exist.</p>
            <Link href="/projects" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
              ← Back to Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <Link href="/projects" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
            ← Back to Projects
          </Link>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900">{project.title}</h1>
          <p className="mt-1 text-gray-600">
            {project.description || 'No description provided'}
          </p>
        </div>
        <Link 
          href={`/projects/${projectId}/edit`} 
          className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
        >
          Edit Project
        </Link>
      </div>

      {/* Project Overview */}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/60 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-gray-900">Project Overview</h3>
        </div>
        <div className="divide-y divide-slate-100">
          <div className="px-5 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-slate-500">Status</dt>
            <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
              <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                {project.status}
              </span>
            </dd>
          </div>
          <div className="px-5 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-slate-500">Start Date</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {new Date(project.startDate).toLocaleDateString()}
            </dd>
          </div>
          <div className="px-5 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-slate-500">End Date</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Not set'}
            </dd>
          </div>
          <div className="px-5 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-slate-500">Owner</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {project.owner.name || project.owner.email}
            </dd>
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/60 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
            Add Member
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {project.members.length > 0 ? (
            project.members.map((member) => (
              <div key={member.id} className="px-5 py-4 flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                    {(member.name || member.email).charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">
                    {member.name || member.email}
                  </div>
                  <div className="text-sm text-slate-500">
                    {member.email}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-5 py-8 text-center text-slate-500 text-sm">
              No team members yet.
            </div>
          )}
        </div>
      </div>

      {/* Tasks */}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/60 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Tasks</h3>
          <Link 
            href={`/tasks/new?projectId=${projectId}`}
            className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-colors"
          >
            Add Task
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {project.tasks.length > 0 ? (
            project.tasks.map((task) => (
              <Link 
                key={task.id} 
                href={`/tasks/${task.id}`}
                className="px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div>
                  <div className="text-sm font-medium text-slate-900">
                    {task.title}
                  </div>
                  {task.assignee && (
                    <div className="text-sm text-slate-500">
                      Assigned to {task.assignee.name || task.assignee.email}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-500 mb-4">No tasks yet.</p>
              <Link 
                href={`/tasks/new?projectId=${projectId}`}
                className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
              >
                Create Your First Task
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}