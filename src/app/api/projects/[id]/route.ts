import { NextResponse } from 'next/server';
import { projectService } from '@/lib/projectService';
import { createApiResponse, validateRequestBody } from '@/lib/api';
import {
  getAuthContext,
  canViewProject,
  canManageProject,
  unauthorized,
  forbidden,
  notFound,
  badRequest,
  serverError,
} from '@/lib/apiHelpers';
import { z } from 'zod';

// Validation schema for updating a project
const updateProjectSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['ACTIVE', 'COMPLETED', 'ARCHIVED']).optional(),
  startDate: z.string().optional().transform((str) => str ? new Date(str) : undefined),
  endDate: z.string().optional().transform((str) => str ? new Date(str) : undefined),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return unauthorized();

    const { id } = await params;
    const access = await projectService.getProjectMembership(id);
    if (!access) return notFound('Project not found');
    if (!canViewProject(access, ctx)) {
      return forbidden('Forbidden: You do not have access to this project');
    }

    const project = await projectService.getProjectById(id);
    return NextResponse.json(createApiResponse(project));
  } catch (error) {
    return serverError('Failed to fetch project');
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return unauthorized();
    if (ctx.isGuest) return forbidden('Forbidden: Guest users cannot update projects');

    const { id } = await params;
    const access = await projectService.getProjectMembership(id);
    if (!access) return notFound('Project not found');
    if (!canManageProject(access, ctx)) {
      return forbidden('Forbidden: You do not have permission to update this project');
    }

    const validation = await validateRequestBody(request, updateProjectSchema);
    if (!validation.success) return badRequest(validation.error);
    
    const project = await projectService.updateProject({
      id,
      ...validation.data,
    });
    
    return NextResponse.json(createApiResponse(project));
  } catch (error) {
    return serverError('Failed to update project');
  }
}
