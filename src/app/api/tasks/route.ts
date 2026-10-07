import { NextResponse } from 'next/server';
import { taskService } from '@/lib/taskService';
import { projectService } from '@/lib/projectService';
import { userService } from '@/lib/userService';
import { createApiResponse, validateRequestBody, zDateString } from '@/lib/api';
import {
  getAuthContext,
  canModifyTask,
  canCollaborateOnProject,
  isProjectMember,
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
  status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  startDate: zDateString,
  dueDate: zDateString.nullish(),
  projectId: z.string().min(1, 'Project ID is required'),
  assigneeId: z.string().nullish().transform((str) => str || undefined),
});

// PUT takes the task id in the request body; projectId moves stay PATCH-only
// because only PATCH verifies access to the target project
const updateTaskBodySchema = updateTaskSchema.omit({ projectId: true }).extend({
  id: z.string().min(1, 'Task ID is required'),
});

// Verify a provided assignee exists and belongs to the target project.
// Returns a NextResponse on failure, null when the assignee is valid.
async function validateAssignee(
  assigneeId: string | null | undefined,
  project: { ownerId: string; members: { id: string }[] }
) {
  if (!assigneeId) return null;
  const assignee = await userService.getUserById(assigneeId);
  if (!assignee) return badRequest('Assignee not found');
  if (!isProjectMember(project, assigneeId)) {
    return badRequest('Assignee must be a member of the project');
  }
  return null;
}

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

    const assigneeError = await validateAssignee(validation.data.assigneeId, access);
    if (assigneeError) return assigneeError;
    
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

    const assigneeError = await validateAssignee(validation.data.assigneeId, access.project);
    if (assigneeError) return assigneeError;
    
    const task = await taskService.updateTask(validation.data);
    return NextResponse.json(createApiResponse(task));
  } catch (error) {
    return serverError('Failed to update task');
  }
}
