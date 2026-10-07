import { NextResponse } from 'next/server';
import { commentService } from '@/lib/commentService';
import { taskService } from '@/lib/taskService';
import { createApiResponse, validateRequestBody } from '@/lib/api';
import {
  getAuthContext,
  canModifyTask,
  unauthorized,
  forbidden,
  notFound,
  badRequest,
  serverError,
} from '@/lib/apiHelpers';
import { z } from 'zod';

// Validation schema for creating a comment
const createCommentSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  taskId: z.string().min(1, 'Task ID is required'),
});

export async function POST(request: Request) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return unauthorized();
    if (ctx.isGuest) return forbidden('Forbidden: Guest users cannot create comments');

    const validation = await validateRequestBody(request, createCommentSchema);
    if (!validation.success) return badRequest(validation.error);

    const access = await taskService.getTaskAccess(validation.data.taskId);
    if (!access) return notFound('Task not found');
    if (!canModifyTask(access, ctx)) {
      return forbidden('Forbidden: You do not have access to this task');
    }

    // authorId always comes from the session, never from the request body
    const comment = await commentService.createComment({
      content: validation.data.content,
      authorId: ctx.userId,
      taskId: validation.data.taskId,
    });

    return NextResponse.json(createApiResponse(comment), { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return serverError('Failed to create comment');
  }
}
