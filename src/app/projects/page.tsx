import Link from 'next/link';
import { getProjectsMetadata } from '@/lib/metadata';
import { projectService } from '@/lib/projectService';

export const metadata = getProjectsMetadata();

// Server-side data fetching
async function getProjects() {
  try {
    const projects = await projectService.getAllProjects();
    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
        <Link 
          href="/projects/new" 
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
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow dark:border-gray-700">
                  <div className="flex justify-between items-start">
                    <Link href={`/projects/${project.id}`} className="text-lg font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                      {project.title}
                    </Link>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      project.status === 'ACTIVE' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                      project.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  {project.description && (
                    <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                      {project.description.substring(0, 100)}{project.description.length > 100 ? '...' : ''}
                    </p>
                  )}
                  <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{project.owner?.name || project.owner?.email || 'Unknown'}</span>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>{project._count?.tasks || 0} tasks</span>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(project.startDate).toLocaleDateString()}
                    </span>
                    {project.endDate && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Due: {new Date(project.endDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No projects found.</p>
          )}
        </div>
      </div>
    </div>
  );
}