'use client';

import { useApi } from '@/hooks/useApi';

type HealthData = {
  status: string;
  timestamp: string;
  service: string;
};

export default function DashboardPage() {
  const { data, loading, error } = useApi<HealthData>('/api/health');

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
            <div className="border-4 border-dashed border-gray-200 dark:border-gray-700 rounded-lg h-96 p-4">
              <h2 className="text-xl font-semibold mb-4">Welcome to Planova</h2>
              
              {loading && (
                <p className="text-gray-600 dark:text-gray-400">Loading...</p>
              )}
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <strong className="font-bold">Error! </strong>
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              
              {data && (
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    API Status: <span className="font-semibold">{data.status}</span>
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Service: <span className="font-semibold">{data.service}</span>
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Timestamp: <span className="font-semibold">{data.timestamp}</span>
                  </p>
                </div>
              )}
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Projects</h3>
                  <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">0</p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Active projects</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Tasks</h3>
                  <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">0</p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Pending tasks</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Team</h3>
                  <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">0</p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Team members</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}