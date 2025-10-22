import { prisma } from './db';
import { Task } from '@/types';
import { notificationService } from './notificationService';

export type CreateTaskInput = {
  title: string;
  description?: string;
  startDate: Date;
  dueDate?: Date;
  projectId: string;
  assigneeId?: string;
};

export type UpdateTaskInput = {
  id: string;
  title?: string;
  description?: string;
  status?: Task['status'];
  priority?: Task['priority'];
  startDate?: Date;
  dueDate?: Date;
  assigneeId?: string;
};

export const taskService = {
  // Create a new task
  async createTask(input: CreateTaskInput) {
    const task = await prisma.task.create({
      data: {
        title: input.title,
        description: input.description,
        startDate: input.startDate,
        dueDate: input.dueDate,
        status: 'TODO',
        priority: 'MEDIUM',
        projectId: input.projectId,
        assigneeId: input.assigneeId,
      },
    });
    
    // Emit real-time notification
    notificationService.emit('taskUpdated', {
      action: 'created',
      task,
      timestamp: new Date().toISOString(),
    });
    
    return task;
  },

  // Get all tasks
  async getAllTasks() {
    return await prisma.task.findMany({
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },
        assignee: {
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

  // Get tasks by project ID
  async getTasksByProjectId(projectId: string) {
    return await prisma.task.findMany({
      where: { projectId },
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },
        assignee: {
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

  // Get task by ID
  async getTaskById(id: string) {
    return await prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        comments: {
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
        },
      },
    });
  },

  // Update task
  async updateTask(input: UpdateTaskInput) {
    const { id, ...updateData } = input;
    const task = await prisma.task.update({
      where: { id },
      data: updateData,
    });
    
    // Emit real-time notification
    notificationService.emit('taskUpdated', {
      action: 'updated',
      task,
      timestamp: new Date().toISOString(),
    });
    
    return task;
  },

  // Delete task
  async deleteTask(id: string) {
    const task = await prisma.task.delete({
      where: { id },
    });
    
    // Emit real-time notification
    notificationService.emit('taskUpdated', {
      action: 'deleted',
      taskId: id,
      timestamp: new Date().toISOString(),
    });
    
    return task;
  },
};