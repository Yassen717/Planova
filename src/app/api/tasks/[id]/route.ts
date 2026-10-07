import { NextResponse } from 'next/server';
import { taskService } from '@/lib/taskService';
import { projectService } from '@/lib/projectService';
import { createApiResponse, validateRequestBody } from '@/lib/api';
import {
  getAuthContext,
  canViewTask,
  canModifyTask,
  canCollaborateOnProject,
  unauthorized,
  forbidden,
  notFound,
  badRequest,
  serverError,
} from '@/lib/apiHelpers';
import { z } from 'zod';

// Validation schema for updating a task
const updateTaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  startDate: z.string().optional().transform((str) => str ? new Date(str) : undefined),
  dueDate: z.string().nullish().transform((str) => str === null ? null : str ? new Date(str) : undefined),
  assigneeId: z.string().nullish().transform((str) => str === null ? null : str || undefined),
  projectId: z.string().optional(),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return unauthorized();

    const { id } = await params;
    const access = await taskService.getTaskAccess(id);
    if (!access) return notFound('Task not found');
    if (!canViewTask(access, ctx)) {
      return forbidden('Forbidden: You do not have access to this task');
    }

    const task = await taskService.getTaskById(id);
    return NextResponse.json(createApiResponse(task));
  } catch (error) {
    return serverError('Failed to fetch task');
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return unauthorized();
    if (ctx.isGuest) return forbidden('Forbidden: Guest users cannot update tasks');

    const { id } = await params;
    const access = await taskService.getTaskAccess(id);
    if (!access) return notFound('Task not found');
    if (!canModifyTask(access, ctx)) {
      return forbidden('Forbidden: You do not have permission to update this task');
    }

    const validation = await validateRequestBody(request, updateTaskSchema);
    if (!validation.success) return badRequest(validation.error);
    
    // If the task is being moved to another project, require access to the target
    if (validation.data.projectId) {
      const target = await projectService.getProjectMembership(validation.data.projectId);
      if (!target) return notFound('Target project not found');
      if (!canCollaborateOnProject(target, ctx)) {
        return forbidden('Forbidden: You cannot move this task to that project');
      }
    }
    
    const task = await taskService.updateTask({
      id,
      ...validation.data,
    });
    
    return NextResponse.json(createApiResponse(task));
  } catch (error) {
    return serverError('Failed to update task');
  }
}
