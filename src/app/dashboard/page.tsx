import { getDashboardMetadata } from '@/lib/metadata';
import { projectService } from '@/lib/projectService';
import { taskService } from '@/lib/taskService';
import { reportingService } from '@/lib/reportingService';

export const metadata = getDashboardMetadata();

// Server-side data fetching
async function getDashboardData() {
  try {
    const [projectStats, taskStats, recentActivity] = await Promise.all([
      reportingService.getProjectStats(),
      reportingService.getTaskStats(),
      reportingService.getRecentActivity(5),
    ]);
    
    return { projectStats, taskStats, recentActivity };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return {
      projectStats: { total: 0, active: 0, completed: 0 },
      taskStats: { total: 0, byStatus: [], byPriority: [] },
      recentActivity: [],
    };
  }
}

export default async function DashboardPage() {
  const { projectStats, taskStats, recentActivity } = await getDashboardData();
  
  // Calculate task status counts
  const inProgressTasks = taskStats.byStatus.find(s => s.status === 'IN_PROGRESS')?._count.status || 0;
  const completedTasks = taskStats.byStatus.find(s => s.status === 'DONE')?._count.status || 0;
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Project Summary Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Projects</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total</span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{projectStats.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Active</span>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{projectStats.active}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Completed</span>
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">{projectStats.completed}</span>
            </div>
          </div>
        </div>

        {/* Task Summary Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Tasks</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total</span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{taskStats.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">In Progress</span>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{inProgressTasks}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Completed</span>
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">{completedTasks}</span>
            </div>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 md:col-span-2 lg:col-span-1">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'project' ? 'bg-blue-100 dark:bg-blue-900' : 'bg-green-100 dark:bg-green-900'
                  }`}>
                    {activity.type === 'project' ? (
                      <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{activity.description}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}