import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createApiResponse, validateRequestBody } from '@/lib/api';
import { z } from 'zod';

// Validation schema for creating a comment
const createCommentSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  authorId: z.string().min(1, 'Author ID is required'),
  taskId: z.string().min(1, 'Task ID is required'),
});

export async function POST(request: Request) {
  try {
    const validation = await validateRequestBody(request, createCommentSchema);

    if (!validation.success) {
      return NextResponse.json(
        createApiResponse(validation.error),
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        content: validation.data.content,
        authorId: validation.data.authorId,
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
