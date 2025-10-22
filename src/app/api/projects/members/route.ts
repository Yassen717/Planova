import { NextResponse } from 'next/server';
import { projectService } from '@/lib/projectService';
import { createApiResponse, validateRequestBody } from '@/lib/api';
import { z } from 'zod';

// Validation schema for adding a member to a project
const addMemberSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  userId: z.string().min(1, 'User ID is required'),
});

export async function POST(request: Request) {
  try {
    const validation = await validateRequestBody(request, addMemberSchema);
    
    if (!validation.success) {
      return NextResponse.json(createApiResponse(validation.error), { status: 400 });
    }
    
    const { projectId, userId } = validation.data;
    const updatedProject = await projectService.addMemberToProject(projectId, userId);
    
    // Emit a real-time notification
    // In a real implementation, this would be done through a service
    
    return NextResponse.json(createApiResponse(updatedProject));
  } catch (error) {
    console.error('Error adding member to project:', error);
    return NextResponse.json(createApiResponse('Failed to add member to project'), { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const userId = searchParams.get('userId');
    
    if (!projectId || !userId) {
      return NextResponse.json(createApiResponse('Project ID and User ID are required'), { status: 400 });
    }
    
    const updatedProject = await projectService.removeMemberFromProject(projectId, userId);
    
    // Emit a real-time notification
    // In a real implementation, this would be done through a service
    
    return NextResponse.json(createApiResponse(updatedProject));
  } catch (error) {
    console.error('Error removing member from project:', error);
    return NextResponse.json(createApiResponse('Failed to remove member from project'), { status: 500 });
  }
}