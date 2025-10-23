import { prisma } from './db';
import { Project } from '@/types';
import { notificationService } from './notificationService';

export type CreateProjectInput = {
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  ownerId: string;
};

export type UpdateProjectInput = {
  id: string;
  title?: string;
  description?: string;
  status?: Project['status'];
  startDate?: Date;
  endDate?: Date;
};

export const projectService = {
  // Create a new project
  async createProject(input: CreateProjectInput) {
    const project = await prisma.project.create({
      data: {
        title: input.title,
        description: input.description,
        startDate: input.startDate,
        endDate: input.endDate,
        status: 'ACTIVE',
        ownerId: input.ownerId,
      },
    });
    
    // Emit real-time notification
    notificationService.emit('projectUpdated', {
      action: 'created',
      project,
      timestamp: new Date().toISOString(),
    });
    
    // Create a persistent notification for the project owner
    try {
      await notificationService.sendNotification(
        'info',
        `You have created a new project: ${input.title}`,
        input.ownerId,
        {
          entityId: project.id,
          entityType: 'project',
        }
      );
    } catch (error) {
      console.error('Error creating notification:', error);
    }
    
    return project;
  },

  // Get all projects
  async getAllProjects() {
    return await prisma.project.findMany({
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        members: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            tasks: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  // Get project by ID
  async getProjectById(id: string) {
    return await prisma.project.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        members: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tasks: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  },

  // Update project
  async updateProject(input: UpdateProjectInput) {
    const { id, ...updateData } = input;
    const project = await prisma.project.update({
      where: { id },
      data: updateData,
    });
    
    // Emit real-time notification
    notificationService.emit('projectUpdated', {
      action: 'updated',
      project,
      timestamp: new Date().toISOString(),
    });
    
    return project;
  },

  // Delete project
  async deleteProject(id: string) {
    const project = await prisma.project.delete({
      where: { id },
    });
    
    // Emit real-time notification
    notificationService.emit('projectUpdated', {
      action: 'deleted',
      projectId: id,
      timestamp: new Date().toISOString(),
    });
    
    return project;
  },

  // Add member to project
  async addMemberToProject(projectId: string, userId: string) {
    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        members: {
          connect: { id: userId },
        },
      },
      include: {
        owner: true,
        members: true,
        tasks: true,
      },
    });
    
    // Emit real-time notification
    notificationService.emit('projectUpdated', {
      action: 'memberAdded',
      project,
      userId,
      timestamp: new Date().toISOString(),
    });
    
    // Create a persistent notification for the added member
    try {
      await notificationService.sendNotification(
        'info',
        `You have been added to project: ${project.title}`,
        userId,
        {
          entityId: project.id,
          entityType: 'project',
        }
      );
    } catch (error) {
      console.error('Error creating notification:', error);
    }
    
    return project;
  },

  // Remove member from project
  async removeMemberFromProject(projectId: string, userId: string) {
    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        members: {
          disconnect: { id: userId },
        },
      },
      include: {
        owner: true,
        members: true,
        tasks: true,
      },
    });
    
    // Emit real-time notification
    notificationService.emit('projectUpdated', {
      action: 'memberRemoved',
      project,
      userId,
      timestamp: new Date().toISOString(),
    });
    
    return project;
  },
};