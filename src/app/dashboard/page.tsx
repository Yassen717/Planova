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
import { auth } from '@/lib/auth';

export const metadata = getDashboardMetadata();

// Server-side data fetching with user-based filtering
async function getDashboardData() {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return {
        projectStats: { total: 0, active: 0, completed: 0 },
        taskStats: { total: 0, byStatus: [], byPriority: [] },
        recentActivity: [],
        projects: [],
        tasks: [],
      };
    }

    const userId = (session.user as any).id;
    const userRole = (session.user as any).role;
    const isAdmin = userRole === 'ADMIN';

    // Fetch data based on user role - Admin sees all, regular users see only their data
    const [projectStats, taskStats, recentActivity, projects, tasks] = await Promise.all([
      isAdmin 
        ? reportingService.getProjectStats()
        : reportingService.getProjectStatsByUser(userId),
      isAdmin
        ? reportingService.getTaskStats()
        : reportingService.getTaskStatsByUser(userId),
      isAdmin
        ? reportingService.getRecentActivity(5)
        : reportingService.getRecentActivityByUser(userId, 5),
      isAdmin
        ? projectService.getAllProjects()
        : projectService.getProjectsByUser(userId),
      isAdmin
        ? taskService.getAllTasks()
        : taskService.getTasksByUser(userId),
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
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-slate-500 mt-1">Welcome back! Here's an overview of your workspace.</p>
        </div>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <StatCard
          title="Total Projects"
          value={projectStats.total}
          subtitle="Across all statuses"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
          color="primary"
          href="/projects"
        />
        <StatCard
          title="Active Projects"
          value={projectStats.active}
          subtitle="Currently in progress"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
          color="success"
        />
        <StatCard
          title="Total Tasks"
          value={taskStats.total}
          subtitle={`${completedTasks} completed, ${inProgressTasks} in progress`}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          color="secondary"
          href="/tasks"
        />
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Project Progress */}
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/60 p-5 sm:p-6 w-full hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/25">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Active Projects Progress</h2>
              <p className="text-sm text-slate-500">Track completion rates</p>
            </div>
          </div>
          <div className="w-full overflow-x-auto">
            <ProgressChart projects={activeProjects} maxDisplay={5} />
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/60 p-5 sm:p-6 w-full hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl text-white shadow-lg shadow-amber-500/25">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Upcoming Deadlines</h2>
              <p className="text-sm text-slate-500">Stay on track</p>
            </div>
          </div>
          <div className="w-full">
            <DeadlinesList items={upcomingDeadlines} maxDisplay={5} />
          </div>
        </div>

        {/* Task Distribution */}
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/60 p-5 sm:p-6 w-full hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl text-white shadow-lg shadow-violet-500/25">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Task Distribution</h2>
              <p className="text-sm text-slate-500">By team member</p>
            </div>
          </div>
          <div className="w-full overflow-x-auto">
            <TaskDistributionChart data={taskDistribution} maxDisplay={5} />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/60 p-5 sm:p-6 w-full hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl text-white shadow-lg shadow-cyan-500/25">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
              <p className="text-sm text-slate-500">Latest updates</p>
            </div>
          </div>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                    activity.type === 'project' 
                      ? 'bg-gradient-to-br from-indigo-100 to-indigo-50' 
                      : 'bg-gradient-to-br from-emerald-100 to-emerald-50'
                  }`}>
                    {activity.type === 'project' ? (
                      <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{activity.title}</p>
                    <p className="text-sm text-slate-500 truncate">{activity.description}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-slate-500">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}