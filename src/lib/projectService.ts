import { prisma } from './db';
import { Project } from '@/types';

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
    return await prisma.project.create({
      data: {
        title: input.title,
        description: input.description,
        startDate: input.startDate,
        endDate: input.endDate,
        status: 'ACTIVE',
        ownerId: input.ownerId,
      },
    });
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
    return await prisma.project.update({
      where: { id },
      data: updateData,
    });
  },

  // Delete project
  async deleteProject(id: string) {
    return await prisma.project.delete({
      where: { id },
    });
  },

  // Add member to project
  async addMemberToProject(projectId: string, userId: string) {
    return await prisma.project.update({
      where: { id: projectId },
      data: {
        members: {
          connect: { id: userId },
        },
      },
    });
  },

  // Remove member from project
  async removeMemberFromProject(projectId: string, userId: string) {
    return await prisma.project.update({
      where: { id: projectId },
      data: {
        members: {
          disconnect: { id: userId },
        },
      },
    });
  },
};