import { NextResponse } from 'next/server';
import { reportingService } from '@/lib/reportingService';
import { createApiResponse } from '@/lib/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'overview';
    
    let data;
    
    switch (type) {
      case 'projects':
        data = await reportingService.getProjectStats();
        break;
      case 'tasks':
        data = await reportingService.getTaskStats();
        break;
      case 'users':
        data = await reportingService.getUserStats();
        break;
      case 'progress':
        data = await reportingService.getProjectProgressData();
        break;
      case 'activity':
        const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : 10;
        data = await reportingService.getRecentActivity(limit);
        break;
      case 'trend':
        const days = searchParams.get('days') ? parseInt(searchParams.get('days') as string) : 30;
        data = await reportingService.getTaskCompletionTrend(days);
        break;
      default:
        // Overview data
        const [projectStats, taskStats, userStats, progressData, recentActivity] = await Promise.all([
          reportingService.getProjectStats(),
          reportingService.getTaskStats(),
          reportingService.getUserStats(),
          reportingService.getProjectProgressData(),
          reportingService.getRecentActivity(5),
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
    return NextResponse.json(createApiResponse('Failed to fetch reporting data'), { status: 500 });
  }
}