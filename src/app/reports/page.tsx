'use client';

import React, { useState, useEffect } from 'react';

interface ProjectStats {
  total: number;
  active: number;
  completed: number;
}

interface TaskStats {
  total: number;
  byStatus: { status: string; _count: { status: number } }[];
  byPriority: { priority: string; _count: { priority: number } }[];
}

interface UserStats {
  total: number;
  projectOwners: number;
  taskAssignees: number;
}

interface ProjectProgress {
  id: string;
  title: string;
  totalTasks: number;
  completedTasks: number;
  progress: number;
  createdAt: Date;
}

interface Activity {
  id: string;
  type: 'project' | 'task';
  title: string;
  description: string;
  createdAt: Date;
}

interface TrendData {
  date: string;
  count: number;
}

export default function ReportingDashboard() {
  const [projectStats, setProjectStats] = useState<ProjectStats | null>(null);
  const [taskStats, setTaskStats] = useState<TaskStats | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [progressData, setProgressData] = useState<ProjectProgress[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30);

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data from API endpoints
      const [projectRes, taskRes, activityRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/tasks'),
        fetch('/api/reports/activity?limit=10'),
      ]);
      
      const projects = await projectRes.json();
      const tasks = await taskRes.json();
      const activity = activityRes.ok ? await activityRes.json() : [];
      
      // Calculate project stats
      const projectData = {
        total: projects.length,
        active: projects.filter((p: any) => p.status === 'ACTIVE').length,
        completed: projects.filter((p: any) => p.status === 'COMPLETED').length,
      };
      
      // Calculate task stats
      const taskData = {
        total: tasks.length,
        byStatus: ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'].map(status => ({
          status,
          _count: { status: tasks.filter((t: any) => t.status === status).length }
        })),
        byPriority: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map(priority => ({
          priority,
          _count: { priority: tasks.filter((t: any) => t.priority === priority).length }
        })),
      };
      
      // Calculate user stats (simplified)
      const userData = {
        total: 0,
        projectOwners: 0,
        taskAssignees: 0,
      };
      
      // Calculate progress data
      const progressData = projects.slice(0, 5).map((project: any) => ({
        id: project.id,
        title: project.title,
        totalTasks: project._count?.tasks || 0,
        completedTasks: project.tasks?.filter((t: any) => t.status === 'DONE').length || 0,
        progress: project._count?.tasks > 0 
          ? Math.round(((project.tasks?.filter((t: any) => t.status === 'DONE').length || 0) / project._count.tasks) * 100)
          : 0,
        createdAt: project.createdAt,
      }));
      
      // Calculate trend data (simplified - last N days)
      const trendData = Array.from({ length: timeRange }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (timeRange - i - 1));
        return {
          date: date.toISOString().split('T')[0],
          count: Math.floor(Math.random() * 10), // Placeholder
        };
      });
      
      setProjectStats(projectData);
      setTaskStats(taskData);
      setUserStats(userData);
      setProgressData(progressData);
      setRecentActivity(activity);
      setTrendData(trendData);
    } catch (error) {
      console.error('Error fetching reporting data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchData();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DONE': return 'bg-green-500 dark:bg-green-600';
      case 'IN_PROGRESS': return 'bg-blue-500 dark:bg-blue-600';
      case 'REVIEW': return 'bg-yellow-500 dark:bg-yellow-600';
      case 'TODO': return 'bg-gray-500 dark:bg-gray-600';
      default: return 'bg-gray-500 dark:bg-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-500 dark:bg-red-600';
      case 'HIGH': return 'bg-orange-500 dark:bg-orange-600';
      case 'MEDIUM': return 'bg-yellow-500 dark:bg-yellow-600';
      case 'LOW': return 'bg-green-500 dark:bg-green-600';
      default: return 'bg-gray-500 dark:bg-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Reporting & Analytics</h1>
          <div className="flex space-x-2">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-1 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
            <button 
              onClick={refreshData}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-sm"
            >
              Refresh
            </button>
          </div>
        </div>
        
        {/* Skeleton Loading */}
        <div className="space-y-6">
          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 space-y-3">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Charts Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Reporting & Analytics</h1>
        <div className="flex space-x-2">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-1 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <button 
            onClick={refreshData}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
          <h2 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">Projects</h2>
          <div className="space-y-4">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{projectStats?.total || 0}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Projects</p>
            </div>
            <div className="flex justify-between">
              <div>
                <p className="text-lg font-medium text-blue-600 dark:text-blue-400">{projectStats?.active || 0}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
              </div>
              <div>
                <p className="text-lg font-medium text-green-600 dark:text-green-400">{projectStats?.completed || 0}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
          <h2 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">Tasks</h2>
          <div className="space-y-4">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{taskStats?.total || 0}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Tasks</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2 dark:text-gray-400">By Status</p>
              <div className="space-y-2">
                {taskStats?.byStatus.map((item) => (
                  <div key={item.status} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(item.status)}`}></div>
                      <span className="text-sm text-gray-900 dark:text-white">{item.status}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{item._count.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
          <h2 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">Users</h2>
          <div className="space-y-4">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{userStats?.total || 0}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Project Owners</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{userStats?.projectOwners || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Task Assignees</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{userStats?.taskAssignees || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Task Completion Trend */}
        <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
          <h2 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">Task Completion Trend</h2>
          <div className="h-64 flex items-end space-x-1">
            {trendData.map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors dark:bg-blue-600 dark:hover:bg-blue-700"
                  style={{ height: `${Math.max(5, (item.count / Math.max(...trendData.map(d => d.count)) * 100))}%` }}
                  title={`${item.date}: ${item.count} tasks`}
                ></div>
                {index % 5 === 0 && (
                  <span className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                    {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Project Progress */}
        <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
          <h2 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">Recent Project Progress</h2>
          <div className="space-y-4">
            {progressData.map((project) => (
              <div key={project.id}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 truncate dark:text-gray-300">{project.title}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div 
                    className="bg-blue-600 h-2 rounded-full dark:bg-blue-500" 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1 dark:text-gray-400">
                  <span>{project.completedTasks} of {project.totalTasks} tasks</span>
                  <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
        <h2 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
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
          ))}
        </div>
      </div>
    </div>
  );
}