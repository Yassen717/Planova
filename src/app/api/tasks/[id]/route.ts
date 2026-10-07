import { NextResponse } from 'next/server';
import { taskService } from '@/lib/taskService';
import { projectService } from '@/lib/projectService';
import { userService } from '@/lib/userService';
import { createApiResponse, validateRequestBody } from '@/lib/api';
import {
  getAuthContext,
  canViewTask,
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
    let targetAccess = access.project;
    if (validation.data.projectId) {
      const target = await projectService.getProjectMembership(validation.data.projectId);
      if (!target) return notFound('Target project not found');
      if (!canCollaborateOnProject(target, ctx)) {
        return forbidden('Forbidden: You cannot move this task to that project');
      }
      targetAccess = target;
    }

    // A provided assignee must exist and belong to the task's (possibly new) project
    if (validation.data.assigneeId) {
      const assignee = await userService.getUserById(validation.data.assigneeId);
      if (!assignee) return badRequest('Assignee not found');
      if (!isProjectMember(targetAccess, validation.data.assigneeId)) {
        return badRequest('Assignee must be a member of the project');
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return unauthorized();
    if (ctx.isGuest) return forbidden('Forbidden: Guest users cannot delete tasks');

    const { id } = await params;
    const access = await taskService.getTaskAccess(id);
    if (!access) return notFound('Task not found');
    if (!canModifyTask(access, ctx)) {
      return forbidden('Forbidden: You do not have permission to delete this task');
    }

    await taskService.deleteTask(id);
    return NextResponse.json(createApiResponse('Task deleted successfully'));
  } catch (error) {
    return serverError('Failed to delete task');
  }
}
