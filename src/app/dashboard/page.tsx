'use client';

import { useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';

type HealthData = {
  status: string;
  timestamp: string;
  service: string;
};

type Project = {
  id: string;
  title: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  _count: {
    tasks: number;
  };
};

type Task = {
  id: string;
  title: string;
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  project: {
    id: string;
    title: string;
  };
};

export default function DashboardPage() {
  const { data: healthData, loading: healthLoading, error: healthError } = useApi<HealthData>('/api/health');
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch projects
        const projectsResponse = await fetch('/api/projects');
        const projectsResult = await projectsResponse.json();
        
        if (projectsResult.success) {
          setProjects(projectsResult.data);
        }
        
        // Fetch tasks
        const tasksResponse = await fetch('/api/tasks');
        const tasksResult = await tasksResponse.json();
        
        if (tasksResult.success) {
          setTasks(tasksResult.data);
        }
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate statistics
  const activeProjects = projects.filter(p => p.status === 'ACTIVE').length;
  const completedProjects = projects.filter(p => p.status === 'COMPLETED').length;
  
  const todoTasks = tasks.filter(t => t.status === 'TODO').length;
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const completedTasks = tasks.filter(t => t.status === 'DONE').length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* System Status */}
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-8">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">System Status</h2>
                
                {healthLoading && (
                  <p className="text-gray-600 dark:text-gray-400">Checking system status...</p>
                )}
                
                {healthError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error! </strong>
                    <span className="block sm:inline">{healthError}</span>
                  </div>
                )}
                
                {healthData && (
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">
                      API Status: <span className="font-semibold text-green-600">Operational</span>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      Service: <span className="font-semibold">{healthData.service}</span>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      Last Check: <span className="font-semibold">{new Date(healthData.timestamp).toLocaleString()}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Active Projects</h3>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{activeProjects}</p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Currently in progress</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Completed Projects</h3>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{completedProjects}</p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Finished this month</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Pending Tasks</h3>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{todoTasks + inProgressTasks}</p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">To do and in progress</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Completed Tasks</h3>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{completedTasks}</p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Finished this week</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Recent Activity</h3>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700">
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : error ? (
                  <div className="p-6">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                      <strong className="font-bold">Error! </strong>
                      <span className="block sm:inline">{error}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="flow-root">
                      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        <li className="py-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <div className="bg-blue-100 text-blue-800 rounded-full p-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                New project created
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                Website Redesign project was created
                              </p>
                            </div>
                            <div className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400">
                              2 hours ago
                            </div>
                          </div>
                        </li>
                        <li className="py-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <div className="bg-green-100 text-green-800 rounded-full p-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                Task completed
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                "Create wireframes" task was marked as complete
                              </p>
                            </div>
                            <div className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400">
                              5 hours ago
                            </div>
                          </div>
                        </li>
                        <li className="py-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <div className="bg-yellow-100 text-yellow-800 rounded-full p-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                New comment
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                Jane Smith commented on "Design homepage" task
                              </p>
                            </div>
                            <div className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400">
                              1 day ago
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}