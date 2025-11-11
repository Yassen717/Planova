import { NextResponse } from 'next/server';
import { taskService } from '@/lib/taskService';
import { createApiResponse, validateRequestBody } from '@/lib/api';
import { auth } from '@/lib/auth';
import { z } from 'zod';

// Validation schema for creating a task
const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  startDate: z.string().transform((str) => new Date(str)),
  dueDate: z.string().optional().transform((str) => str ? new Date(str) : undefined),
  projectId: z.string().min(1, 'Project ID is required'),
  assigneeId: z.string().optional(),
});

// Validation schema for updating a task
const updateTaskSchema = z.object({
  id: z.string().min(1, 'Task ID is required'),
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  startDate: z.string().optional().transform((str) => str ? new Date(str) : undefined),
  dueDate: z.string().optional().transform((str) => str ? new Date(str) : undefined),
  assigneeId: z.string().optional(),
});

export async function GET() {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        createApiResponse('Unauthorized'),
        { status: 401 }
      );
    }

    const tasks = await taskService.getAllTasks();
    return NextResponse.json(createApiResponse(tasks));
  } catch (error) {
    return NextResponse.json(createApiResponse('Failed to fetch tasks'), { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        createApiResponse('Unauthorized'),
        { status: 401 }
      );
    }

    const validation = await validateRequestBody(request, createTaskSchema);
    
    if (!validation.success) {
      return NextResponse.json(createApiResponse(validation.error), { status: 400 });
    }
    
    const task = await taskService.createTask(validation.data);
    return NextResponse.json(createApiResponse(task), { status: 201 });
  } catch (error) {
    return NextResponse.json(createApiResponse('Failed to create task'), { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        createApiResponse('Unauthorized'),
        { status: 401 }
      );
    }

    const validation = await validateRequestBody(request, updateTaskSchema);
    
    if (!validation.success) {
      return NextResponse.json(createApiResponse(validation.error), { status: 400 });
    }
    
    const task = await taskService.updateTask(validation.data);
    return NextResponse.json(createApiResponse(task));
  } catch (error) {
    return NextResponse.json(createApiResponse('Failed to update task'), { status: 500 });
  }
}