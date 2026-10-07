import { prisma } from './prisma';
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

// Attach a doneTaskCount to each project with a single groupBy query
// (no per-project N+1).
async function withDoneTaskCounts<T extends { id: string }>(projects: T[]) {
  if (projects.length === 0) {
    return projects.map((p) => ({ ...p, doneTaskCount: 0 }));
  }
  const doneCounts = await prisma.task.groupBy({
    by: ['projectId'],
    where: {
      projectId: { in: projects.map((p) => p.id) },
      status: 'DONE',
    },
    _count: { _all: true },
  });
  const countByProject = new Map(doneCounts.map((d) => [d.projectId, d._count._all]));
  return projects.map((p) => ({ ...p, doneTaskCount: countByProject.get(p.id) ?? 0 }));
}

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

  // Get all projects (admin only)
  async getAllProjects() {
    const projects = await prisma.project.findMany({
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
    return withDoneTaskCounts(projects);
  },

  // Get projects for a specific user (projects they own or are a member of)
  async getProjectsByUser(userId: string) {
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { id: userId } } },
        ],
      },
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
    return withDoneTaskCounts(projects);
  },

  // Get the fields needed for access control checks
  async getProjectMembership(id: string) {
    return await prisma.project.findUnique({
      where: { id },
      select: {
        ownerId: true,
        members: {
          select: {
            id: true,
          },
        },
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