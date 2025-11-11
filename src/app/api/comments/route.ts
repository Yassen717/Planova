import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createApiResponse, validateRequestBody } from '@/lib/api';
import { auth } from '@/lib/auth';
import { z } from 'zod';

// Validation schema for creating a comment
const createCommentSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  taskId: z.string().min(1, 'Task ID is required'),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        createApiResponse('Unauthorized'),
        { status: 401 }
      );
    }

    const validation = await validateRequestBody(request, createCommentSchema);

    if (!validation.success) {
      return NextResponse.json(
        createApiResponse(validation.error),
        { status: 400 }
      );
    }

    // Use userId from session instead of request body
    const comment = await prisma.comment.create({
      data: {
        content: validation.data.content,
        authorId: (session.user as any).id,
        taskId: validation.data.taskId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(createApiResponse(comment), { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      createApiResponse('Failed to create comment'),
      { status: 500 }
    );
  }
}
