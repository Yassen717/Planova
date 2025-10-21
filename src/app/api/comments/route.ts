import { NextResponse } from 'next/server';
import { commentService } from '@/lib/commentService';
import { createApiResponse, validateRequestBody } from '@/lib/api';
import { z } from 'zod';

// Validation schema for creating a comment
const createCommentSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  authorId: z.string().min(1, 'Author ID is required'),
  taskId: z.string().optional(),
  projectId: z.string().optional(),
}).refine(data => data.taskId || data.projectId, {
  message: 'Either taskId or projectId must be provided',
});

export async function POST(request: Request) {
  try {
    const validation = await validateRequestBody(request, createCommentSchema);
    
    if (!validation.success) {
      return NextResponse.json(createApiResponse(validation.error), { status: 400 });
    }
    
    const comment = await commentService.createComment(validation.data);
    return NextResponse.json(createApiResponse(comment), { status: 201 });
  } catch (error) {
    return NextResponse.json(createApiResponse('Failed to create comment'), { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(createApiResponse('Comment ID is required'), { status: 400 });
    }
    
    const body = await request.json();
    const { content } = body;
    
    if (!content) {
      return NextResponse.json(createApiResponse('Content is required'), { status: 400 });
    }
    
    const comment = await commentService.updateComment(id, content);
    return NextResponse.json(createApiResponse(comment));
  } catch (error) {
    return NextResponse.json(createApiResponse('Failed to update comment'), { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(createApiResponse('Comment ID is required'), { status: 400 });
    }
    
    await commentService.deleteComment(id);
    return NextResponse.json(createApiResponse('Comment deleted successfully'));
  } catch (error) {
    return NextResponse.json(createApiResponse('Failed to delete comment'), { status: 500 });
  }
}