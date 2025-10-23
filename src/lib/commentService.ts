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
    
    // Create a persistent notification for the task assignee or project owner
    if (input.taskId) {
      try {
        // Get the task with assignee
        const task = await prisma.task.findUnique({
          where: { id: input.taskId },
          include: { 
            assignee: true,
            project: true,
          },
        });
        
        // Notify the assignee if it's not the comment author
        if (task?.assigneeId && task.assigneeId !== input.authorId) {
          await notificationService.sendNotification(
            'info',
            `New comment on your task: ${task.title}`,
            task.assigneeId,
            {
              entityId: comment.id,
              entityType: 'comment',
            }
          );
        }
        
        // Notify the project owner if it's not the comment author and not the assignee
        if (task?.project?.ownerId && 
            task.project.ownerId !== input.authorId && 
            task.project.ownerId !== task.assigneeId) {
          await notificationService.sendNotification(
            'info',
            `New comment on task in your project: ${task.title}`,
            task.project.ownerId,
            {
              entityId: comment.id,
              entityType: 'comment',
            }
          );
        }
      } catch (error) {
        console.error('Error creating notification:', error);
      }
    }
    
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