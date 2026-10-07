import { NextResponse } from 'next/server';
import { reportingService } from '@/lib/reportingService';
import { createApiResponse } from '@/lib/api';
import {
  getAuthContext,
  unauthorized,
  forbidden,
  serverError,
} from '@/lib/apiHelpers';

export async function GET(request: Request) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return unauthorized();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'overview';
    
    // Admins and read-only guests see global data; regular users see only their own
    const seeAll = ctx.isAdmin || ctx.isGuest;
    const userId = seeAll ? undefined : ctx.userId;
    
    let data;
    
    switch (type) {
      case 'projects':
        data = seeAll
          ? await reportingService.getProjectStats()
          : await reportingService.getProjectStatsByUser(ctx.userId);
        break;
      case 'tasks':
        data = seeAll
          ? await reportingService.getTaskStats()
          : await reportingService.getTaskStatsByUser(ctx.userId);
        break;
      case 'users':
        if (!seeAll) return forbidden('Forbidden: User statistics are only available to admins');
        data = await reportingService.getUserStats();
        break;
      case 'progress':
        data = await reportingService.getProjectProgressData(userId);
        break;
      case 'activity':
        const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : 10;
        data = seeAll
          ? await reportingService.getRecentActivity(limit)
          : await reportingService.getRecentActivityByUser(ctx.userId, limit);
        break;
      case 'trend':
        const days = searchParams.get('days') ? parseInt(searchParams.get('days') as string) : 30;
        data = await reportingService.getTaskCompletionTrend(days, userId);
        break;
      default:
        // Overview data
        const [projectStats, taskStats, userStats, progressData, recentActivity] = await Promise.all([
          seeAll
            ? reportingService.getProjectStats()
            : reportingService.getProjectStatsByUser(ctx.userId),
          seeAll
            ? reportingService.getTaskStats()
            : reportingService.getTaskStatsByUser(ctx.userId),
          seeAll
            ? reportingService.getUserStats()
            : Promise.resolve(null),
          reportingService.getProjectProgressData(userId),
          seeAll
            ? reportingService.getRecentActivity(5)
            : reportingService.getRecentActivityByUser(ctx.userId, 5),
        ]);
        
        data = {
          projects: projectStats,
          tasks: taskStats,
          users: userStats,
          progress: progressData,
          activity: recentActivity,
        };
    }
    
    return NextResponse.json(createApiResponse(data));
  } catch (error) {
    console.error('Error fetching reporting data:', error);
    return serverError('Failed to fetch reporting data');
  }
}
