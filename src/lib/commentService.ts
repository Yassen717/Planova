import { prisma } from './db';
import { notificationService } from './notificationService';

export type CreateCommentInput = {
  content: string;
  authorId: string;
  taskId?: string;
  projectId?: string;
};

export const commentService = {
  // Create a new comment
  async createComment(input: CreateCommentInput) {
    // Build the data object dynamically to avoid TypeScript errors
    const data: any = {
      content: input.content,
      authorId: input.authorId,
    };
    
    if (input.taskId) {
      data.taskId = input.taskId;
    }
    
    if (input.projectId) {
      data.projectId = input.projectId;
    }

    const comment = await prisma.comment.create({
      data,
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
    
    // Emit real-time notification
    notificationService.emit('commentAdded', {
      action: 'created',
      comment,
      timestamp: new Date().toISOString(),
    });
    
    return comment;
  },

  // Get comments by task ID
  async getCommentsByTaskId(taskId: string) {
    return await prisma.comment.findMany({
      where: { taskId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  // Get comments by project ID
  async getCommentsByProjectId(projectId: string) {
    return await prisma.comment.findMany({
      where: { projectId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  // Update comment
  async updateComment(id: string, content: string) {
    const comment = await prisma.comment.update({
      where: { id },
      data: { content },
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
    
    // Emit real-time notification
    notificationService.emit('commentAdded', {
      action: 'updated',
      comment,
      timestamp: new Date().toISOString(),
    });
    
    return comment;
  },

  // Delete comment
  async deleteComment(id: string) {
    const comment = await prisma.comment.delete({
      where: { id },
    });
    
    // Emit real-time notification
    notificationService.emit('commentAdded', {
      action: 'deleted',
      commentId: id,
      timestamp: new Date().toISOString(),
    });
    
    return comment;
  },
};