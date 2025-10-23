import { prisma } from './db';

export const reportingService = {
  // Get project statistics
  async getProjectStats() {
    const totalProjects = await prisma.project.count();
    const activeProjects = await prisma.project.count({
      where: { status: 'ACTIVE' },
    });
    const completedProjects = await prisma.project.count({
      where: { status: 'COMPLETED' },
    });
    
    return {
      total: totalProjects,
      active: activeProjects,
      completed: completedProjects,
    };
  },

  // Get task statistics
  async getTaskStats() {
    const totalTasks = await prisma.task.count();
    
    const tasksByStatus = await prisma.task.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });
    
    const tasksByPriority = await prisma.task.groupBy({
      by: ['priority'],
      _count: {
        priority: true,
      },
    });
    
    return {
      total: totalTasks,
      byStatus: tasksByStatus,
      byPriority: tasksByPriority,
    };
  },

  // Get user statistics
  async getUserStats() {
    const totalUsers = await prisma.user.count();
    
    // Get users with project ownership
    const usersWithProjects = await prisma.user.count({
      where: {
        ownedProjects: {
          some: {},
        },
      },
    });
    
    // Get users with task assignments
    const usersWithTasks = await prisma.user.count({
      where: {
        assignedTasks: {
          some: {},
        },
      },
    });
    
    return {
      total: totalUsers,
      projectOwners: usersWithProjects,
      taskAssignees: usersWithTasks,
    };
  },

  // Get project progress data
  async getProjectProgressData() {
    const projects = await prisma.project.findMany({
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
        tasks: {
          select: {
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10, // Last 10 projects
    });
    
    return projects.map(project => {
      const totalTasks = project._count.tasks;
      const completedTasks = project.tasks.filter(task => task.status === 'DONE').length;
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      
      return {
        id: project.id,
        title: project.title,
        totalTasks,
        completedTasks,
        progress,
        createdAt: project.createdAt,
      };
    });
  },

  // Get recent activity
  async getRecentActivity(limit: number = 10) {
    // Get recent projects
    const recentProjects = await prisma.project.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        owner: {
          select: {
            name: true,
          },
        },
      },
    });
    
    // Get recent tasks
    const recentTasks = await prisma.task.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        status: true,
        assignee: {
          select: {
            name: true,
          },
        },
      },
    });
    
    // Combine and sort by date
    const allActivity = [
      ...recentProjects.map(project => ({
        id: project.id,
        type: 'project' as const,
        title: project.title,
        description: `Project created by ${project.owner?.name || 'Unknown'}`,
        createdAt: project.createdAt,
      })),
      ...recentTasks.map(task => ({
        id: task.id,
        type: 'task' as const,
        title: task.title,
        description: `Task ${task.status === 'DONE' ? 'completed' : 'created'}${task.assignee?.name ? ` by ${task.assignee.name}` : ''}`,
        createdAt: task.createdAt,
      })),
    ];
    
    return allActivity
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },

  // Get task completion trend
  async getTaskCompletionTrend(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const completedTasks = await prisma.task.findMany({
      where: {
        status: 'DONE',
        updatedAt: {
          gte: startDate,
        },
      },
      select: {
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'asc',
      },
    });
    
    // Group by date
    const trendData: Record<string, number> = {};
    
    completedTasks.forEach(task => {
      const date = task.updatedAt.toISOString().split('T')[0]; // YYYY-MM-DD
      trendData[date] = (trendData[date] || 0) + 1;
    });
    
    // Create array with all dates in range
    const result = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      const dateStr = date.toISOString().split('T')[0];
      
      result.push({
        date: dateStr,
        count: trendData[dateStr] || 0,
      });
    }
    
    return result;
  },
};