import { NextResponse } from 'next/server';
import { taskService } from '@/lib/taskService';
import { createApiResponse, validateRequestBody } from '@/lib/api';
import { z } from 'zod';

// Validation schema for updating a task
const updateTaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  startDate: z.string().optional().transform((str) => str ? new Date(str) : undefined),
  dueDate: z.string().optional().transform((str) => str ? new Date(str) : undefined),
  assigneeId: z.string().optional().nullable(),
  projectId: z.string().optional(),
});

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

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const validation = await validateRequestBody(request, updateTaskSchema);
    
    if (!validation.success) {
      return NextResponse.json(
        createApiResponse(validation.error),
        { status: 400 }
      );
    }
    
    const task = await taskService.updateTask({
      id: params.id,
      ...validation.data,
    });
    
    return NextResponse.json(createApiResponse(task));
  } catch (error) {
    return NextResponse.json(
      createApiResponse('Failed to update task'),
      { status: 500 }
    );
  }
}
