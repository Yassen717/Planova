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

// Validation schema for creating a project
const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z.string().optional().transform((str) => str ? new Date(str) : undefined),
});

// Validation schema for updating a project
const updateProjectSchema = z.object({
  id: z.string().min(1, 'Project ID is required'),
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['ACTIVE', 'COMPLETED', 'ARCHIVED']).optional(),
  startDate: z.string().optional().transform((str) => str ? new Date(str) : undefined),
  endDate: z.string().optional().transform((str) => str ? new Date(str) : undefined),
});

export async function GET() {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return unauthorized();

    // Admins and read-only guests see all projects; regular users see only their own
    const projects = (ctx.isAdmin || ctx.isGuest)
      ? await projectService.getAllProjects()
      : await projectService.getProjectsByUser(ctx.userId);
      
    return NextResponse.json(createApiResponse(projects));
  } catch (error) {
    return serverError('Failed to fetch projects');
  }
}

export async function POST(request: Request) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return unauthorized();
    if (ctx.isGuest) return forbidden('Forbidden: Guest users cannot create projects');

    const validation = await validateRequestBody(request, createProjectSchema);
    if (!validation.success) return badRequest(validation.error);
    
    // Owner is always the authenticated user
    const project = await projectService.createProject({
      ...validation.data,
      ownerId: ctx.userId,
    });
    return NextResponse.json(createApiResponse(project), { status: 201 });
  } catch (error) {
    return serverError('Failed to create project');
  }
}

export async function PUT(request: Request) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return unauthorized();
    if (ctx.isGuest) return forbidden('Forbidden: Guest users cannot update projects');

    const validation = await validateRequestBody(request, updateProjectSchema);
    if (!validation.success) return badRequest(validation.error);
    
    const access = await projectService.getProjectMembership(validation.data.id);
    if (!access) return notFound('Project not found');
    if (!canManageProject(access, ctx)) {
      return forbidden('Forbidden: You do not have permission to update this project');
    }
    
    const project = await projectService.updateProject(validation.data);
    return NextResponse.json(createApiResponse(project));
  } catch (error) {
    return serverError('Failed to update project');
  }
}

export async function DELETE(request: Request) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return unauthorized();
    if (ctx.isGuest) return forbidden('Forbidden: Guest users cannot delete projects');

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return badRequest('Project ID is required');
    
    const access = await projectService.getProjectMembership(id);
    if (!access) return notFound('Project not found');
    if (!canManageProject(access, ctx)) {
      return forbidden('Forbidden: You do not have permission to delete this project');
    }
    
    await projectService.deleteProject(id);
    return NextResponse.json(createApiResponse('Project deleted successfully'));
  } catch (error) {
    return serverError('Failed to delete project');
  }
}
