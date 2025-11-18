import { getDashboardMetadata } from '@/lib/metadata';
import { projectService } from '@/lib/projectService';
import { taskService } from '@/lib/taskService';
import { reportingService } from '@/lib/reportingService';
import { transformProjectsToChartData, transformTasksByAssignee } from '@/lib/utils/chartHelpers';
import StatCard from '@/components/dashboard/StatCard';
import ProgressChart from '@/components/dashboard/ProgressChart';
import DeadlinesList from '@/components/dashboard/DeadlinesList';
import TaskDistributionChart from '@/components/dashboard/TaskDistributionChart';
import { Suspense } from 'react';
import { SkeletonDashboard } from '@/components/ui/Skeleton';

export const metadata = getDashboardMetadata();

// Server-side data fetching
async function getDashboardData() {
  try {
    const [projectStats, taskStats, recentActivity, projects, tasks] = await Promise.all([
      reportingService.getProjectStats(),
      reportingService.getTaskStats(),
      reportingService.getRecentActivity(5),
      projectService.getAllProjects(),
      taskService.getAllTasks(),
    ]);
    
    return { projectStats, taskStats, recentActivity, projects, tasks };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return {
      projectStats: { total: 0, active: 0, completed: 0 },
      taskStats: { total: 0, byStatus: [], byPriority: [] },
      recentActivity: [],
      projects: [],
      tasks: [],
    };
  }
}

export default async function DashboardPage() {
  const { projectStats, taskStats, recentActivity, projects, tasks } = await getDashboardData();
  
  // Calculate task status counts
  const inProgressTasks = taskStats.byStatus.find((s: any) => s.status === 'IN_PROGRESS')?._count.status || 0;
  const completedTasks = taskStats.byStatus.find((s: any) => s.status === 'DONE')?._count.status || 0;
  
  // Transform data for charts
  const projectsWithProgress = transformProjectsToChartData(projects);
  const activeProjects = projectsWithProgress.filter(p => p.status === 'ACTIVE');
  const taskDistribution = transformTasksByAssignee(tasks);
  
  // Get upcoming deadlines
  const upcomingDeadlines = [
    ...projects
      .filter((p: any) => p.endDate && new Date(p.endDate) > new Date())
      .map((p: any) => ({
        id: p.id,
        title: p.title,
        dueDate: new Date(p.endDate!),
        type: 'project' as const,
      })),
    ...tasks
      .filter((t: any) => t.dueDate && new Date(t.dueDate) > new Date())
      .map((t: any) => ({
        id: t.id,
        title: t.title,
        dueDate: new Date(t.dueDate!),
        type: 'task' as const,
        priority: t.priority,
      })),
  ];
  
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <StatCard
          title="Total Projects"
          value={projectStats.total}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
          color="blue"
          href="/projects"
        />
        <StatCard
          title="Active Projects"
          value={projectStats.active}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
          color="green"
        />
        <StatCard
          title="Total Tasks"
          value={taskStats.total}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          color="orange"
          href="/tasks"
        />
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Project Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 w-full">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Active Projects Progress</h2>
          <div className="w-full overflow-x-auto">
            <ProgressChart projects={activeProjects} maxDisplay={5} />
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 w-full">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Upcoming Deadlines</h2>
          <div className="w-full">
            <DeadlinesList items={upcomingDeadlines} maxDisplay={5} />
          </div>
        </div>

        {/* Task Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 w-full">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Task Distribution by Assignee</h2>
          <div className="w-full overflow-x-auto">
            <TaskDistributionChart data={taskDistribution} maxDisplay={5} />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 w-full">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'project' ? 'bg-blue-100 dark:bg-blue-900/20' : 'bg-green-100 dark:bg-green-900/20'
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
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{activity.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{activity.description}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}