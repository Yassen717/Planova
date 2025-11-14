import { NextResponse } from 'next/server';
import { projectService } from '@/lib/projectService';
import { createApiResponse, validateRequestBody } from '@/lib/api';
import { auth } from '@/lib/auth';
import { z } from 'zod';

// Validation schema for creating a project
const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z.string().optional().transform((str) => str ? new Date(str) : undefined),
  ownerId: z.string().min(1, 'Owner ID is required'),
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
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        createApiResponse('Unauthorized'),
        { status: 401 }
      );
    }

    const projects = await projectService.getAllProjects();
    return NextResponse.json(createApiResponse(projects));
  } catch (error) {
    return NextResponse.json(createApiResponse('Failed to fetch projects'), { status: 500 });
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

    // Check if user is guest
    if ((session.user as any).role === 'GUEST') {
      return NextResponse.json(
        createApiResponse('Forbidden: Guest users cannot create projects'),
        { status: 403 }
      );
    }

    const validation = await validateRequestBody(request, createProjectSchema);
    
    if (!validation.success) {
      return NextResponse.json(createApiResponse(validation.error), { status: 400 });
    }
    
    const project = await projectService.createProject(validation.data);
    return NextResponse.json(createApiResponse(project), { status: 201 });
  } catch (error) {
    return NextResponse.json(createApiResponse('Failed to create project'), { status: 500 });
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

    // Check if user is guest
    if ((session.user as any).role === 'GUEST') {
      return NextResponse.json(
        createApiResponse('Forbidden: Guest users cannot update projects'),
        { status: 403 }
      );
    }

    const validation = await validateRequestBody(request, updateProjectSchema);
    
    if (!validation.success) {
      return NextResponse.json(createApiResponse(validation.error), { status: 400 });
    }
    
    const project = await projectService.updateProject(validation.data);
    return NextResponse.json(createApiResponse(project));
  } catch (error) {
    return NextResponse.json(createApiResponse('Failed to update project'), { status: 500 });
  }
}