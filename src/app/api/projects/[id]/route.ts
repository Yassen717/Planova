import { NextResponse } from 'next/server';
import { projectService } from '@/lib/projectService';
import { createApiResponse, validateRequestBody } from '@/lib/api';
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
    const { id } = await params;
    const project = await projectService.getProjectById(id);
    
    if (!project) {
      return NextResponse.json(
        createApiResponse('Project not found'),
        { status: 404 }
      );
    }
    
    return NextResponse.json(createApiResponse(project));
  } catch (error) {
    return NextResponse.json(
      createApiResponse('Failed to fetch project'),
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const validation = await validateRequestBody(request, updateProjectSchema);
    
    if (!validation.success) {
      return NextResponse.json(
        createApiResponse(validation.error),
        { status: 400 }
      );
    }
    
    const project = await projectService.updateProject({
      id,
      ...validation.data,
    });
    
    return NextResponse.json(createApiResponse(project));
  } catch (error) {
    return NextResponse.json(
      createApiResponse('Failed to update project'),
      { status: 500 }
    );
  }
}
