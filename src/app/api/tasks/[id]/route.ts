import { NextResponse } from 'next/server';
import { taskService } from '@/lib/taskService';
import { createApiResponse } from '@/lib/api';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const task = await taskService.getTaskById(params.id);
    
    if (!task) {
      return NextResponse.json(
        createApiResponse('Task not found'),
        { status: 404 }
      );
    }
    
    return NextResponse.json(createApiResponse(task));
  } catch (error) {
    return NextResponse.json(
      createApiResponse('Failed to fetch task'),
      { status: 500 }
    );
  }
}
