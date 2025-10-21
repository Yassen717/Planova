import { prisma } from './db';

export type CreateCommentInput = {
  content: string;
  authorId: string;
  taskId?: string;
  projectId?: string;
};

export const commentService = {
  // Create a new comment
  async createComment(input: CreateCommentInput) {
    return await prisma.comment.create({
      data: {
        content: input.content,
        authorId: input.authorId,
        taskId: input.taskId,
        projectId: input.projectId,
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
    return await prisma.comment.update({
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
  },

  // Delete comment
  async deleteComment(id: string) {
    return await prisma.comment.delete({
      where: { id },
    });
  },
};