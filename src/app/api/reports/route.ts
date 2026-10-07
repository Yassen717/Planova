import { NextResponse } from 'next/server';
import { reportingService } from '@/lib/reportingService';
import { createApiResponse } from '@/lib/api';
import {
  getAuthContext,
  unauthorized,
  forbidden,
  badRequest,
  serverError,
} from '@/lib/apiHelpers';

// Parse an optional integer query param: absent → fallback, unparseable → null
// (caller turns that into a 400), otherwise clamped into [min, max].
function parseBoundedInt(
  raw: string | null,
  { min, max, fallback }: { min: number; max: number; fallback: number }
): number | null {
  if (raw === null) return fallback;
  const value = Number(raw);
  if (raw.trim() === '' || !Number.isFinite(value)) return null;
  return Math.min(Math.max(Math.floor(value), min), max);
}

export async function GET(request: Request) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return unauthorized();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'overview';

    const limit = parseBoundedInt(searchParams.get('limit'), { min: 1, max: 100, fallback: 10 });
    if (limit === null) return badRequest('Invalid limit parameter');
    const days = parseBoundedInt(searchParams.get('days'), { min: 1, max: 365, fallback: 30 });
    if (days === null) return badRequest('Invalid days parameter');

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
        if (!ctx.isAdmin) return forbidden('Forbidden: User statistics are only available to admins');
        data = await reportingService.getUserStats();
        break;
      case 'progress':
        data = await reportingService.getProjectProgressData(userId);
        break;
      case 'activity':
        data = seeAll
          ? await reportingService.getRecentActivity(limit)
          : await reportingService.getRecentActivityByUser(ctx.userId, limit);
        break;
      case 'trend':
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
          ctx.isAdmin
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
