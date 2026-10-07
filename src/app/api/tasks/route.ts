import { NextResponse } from 'next/server';
import { taskService } from '@/lib/taskService';
import { projectService } from '@/lib/projectService';
import { createApiResponse, validateRequestBody } from '@/lib/api';
import {
  getAuthContext,
  canModifyTask,
  canCollaborateOnProject,
  unauthorized,
  forbidden,
  notFound,
  badRequest,
  serverError,
} from '@/lib/apiHelpers';
import { updateTaskSchema } from '@/lib/validation';
import { z } from 'zod';

// Validation schema for creating a task
const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  startDate: z.string().transform((str) => new Date(str)),
  dueDate: z.string().nullish().transform((str) => str ? new Date(str) : undefined),
  projectId: z.string().min(1, 'Project ID is required'),
  assigneeId: z.string().nullish().transform((str) => str || undefined),
});

// PUT takes the task id in the request body; projectId moves stay PATCH-only
// because only PATCH verifies access to the target project
const updateTaskBodySchema = updateTaskSchema.omit({ projectId: true }).extend({
  id: z.string().min(1, 'Task ID is required'),
});

export async function GET() {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return unauthorized();

    // Admins and read-only guests see all tasks; regular users see tasks from their projects or assigned to them
    const tasks = (ctx.isAdmin || ctx.isGuest)
      ? await taskService.getAllTasks()
      : await taskService.getTasksByUser(ctx.userId);
      
    return NextResponse.json(createApiResponse(tasks));
  } catch (error) {
    return serverError('Failed to fetch tasks');
  }
}

export async function POST(request: Request) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return unauthorized();
    if (ctx.isGuest) return forbidden('Forbidden: Guest users cannot create tasks');

    const validation = await validateRequestBody(request, createTaskSchema);
    if (!validation.success) return badRequest(validation.error);
    
    const access = await projectService.getProjectMembership(validation.data.projectId);
    if (!access) return notFound('Project not found');
    if (!canCollaborateOnProject(access, ctx)) {
      return forbidden('Forbidden: You do not have access to this project');
    }
    
    const task = await taskService.createTask(validation.data);
    return NextResponse.json(createApiResponse(task), { status: 201 });
  } catch (error) {
    return serverError('Failed to create task');
  }
}

export async function PUT(request: Request) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return unauthorized();
    if (ctx.isGuest) return forbidden('Forbidden: Guest users cannot update tasks');

    const validation = await validateRequestBody(request, updateTaskBodySchema);
    if (!validation.success) return badRequest(validation.error);
    
    const access = await taskService.getTaskAccess(validation.data.id);
    if (!access) return notFound('Task not found');
    if (!canModifyTask(access, ctx)) {
      return forbidden('Forbidden: You do not have permission to update this task');
    }
    
    const task = await taskService.updateTask(validation.data);
    return NextResponse.json(createApiResponse(task));
  } catch (error) {
    return serverError('Failed to update task');
  }
}
