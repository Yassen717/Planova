import { NextResponse } from 'next/server';
import { projectService } from '@/lib/projectService';
import { createApiResponse, validateRequestBody } from '@/lib/api';
import {
  getAuthContext,
  canManageProject,
  unauthorized,
  forbidden,
  notFound,
  badRequest,
  serverError,
} from '@/lib/apiHelpers';
import { z } from 'zod';

// Validation schema for adding a member to a project
const addMemberSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  userId: z.string().min(1, 'User ID is required'),
});

export async function POST(request: Request) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return unauthorized();
    if (ctx.isGuest) return forbidden('Forbidden: Guest users cannot manage project members');

    const validation = await validateRequestBody(request, addMemberSchema);
    if (!validation.success) return badRequest(validation.error);
    
    const { projectId, userId } = validation.data;

    const access = await projectService.getProjectMembership(projectId);
    if (!access) return notFound('Project not found');
    if (!canManageProject(access, ctx)) {
      return forbidden('Forbidden: Only the project owner can manage members');
    }

    const updatedProject = await projectService.addMemberToProject(projectId, userId);
    return NextResponse.json(createApiResponse(updatedProject));
  } catch (error) {
    console.error('Error adding member to project:', error);
    return serverError('Failed to add member to project');
  }
}

export async function DELETE(request: Request) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return unauthorized();
    if (ctx.isGuest) return forbidden('Forbidden: Guest users cannot manage project members');

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const userId = searchParams.get('userId');
    if (!projectId || !userId) {
      return badRequest('Project ID and User ID are required');
    }
    
    const access = await projectService.getProjectMembership(projectId);
    if (!access) return notFound('Project not found');
    if (!canManageProject(access, ctx)) {
      return forbidden('Forbidden: Only the project owner can manage members');
    }

    const updatedProject = await projectService.removeMemberFromProject(projectId, userId);
    return NextResponse.json(createApiResponse(updatedProject));
  } catch (error) {
    console.error('Error removing member from project:', error);
    return serverError('Failed to remove member from project');
  }
}
