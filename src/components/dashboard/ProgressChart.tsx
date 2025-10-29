import React from 'react';
import Link from 'next/link';
import { getProjectStatusColor } from '@/lib/utils/chartHelpers';

export interface ProgressChartProps {
  projects: Array<{
    id: string;
    title: string;
    progress: number;
    status: string;
  }>;
  maxDisplay?: number;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ projects, maxDisplay = 5 }) => {
  const displayProjects = projects.slice(0, maxDisplay);

  if (displayProjects.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No active projects to display
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayProjects.map((project) => (
        <div key={project.id}>
          <div className="flex items-center justify-between mb-2">
            <Link
              href={`/projects/${project.id}`}
              className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 truncate"
            >
              {project.title}
            </Link>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-2">
              {project.progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-2.5 rounded-full transition-all duration-300"
              style={{
                width: `${project.progress}%`,
                backgroundColor: getProjectStatusColor(project.status),
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressChart;
