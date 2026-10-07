import { prisma } from './prisma';

export type CreateNotificationInput = {
  type: string;
  message: string;
  userId: string;
  entityId?: string;
  entityType?: string;
};

export type UpdateNotificationInput = {
  id: string;
  read?: boolean;
};

export const notificationDbService = {
  // Create a new notification
  async createNotification(input: CreateNotificationInput) {
    return await prisma.notification.create({
      data: {
        type: input.type,
        message: input.message,
        userId: input.userId,
        entityId: input.entityId,
        entityType: input.entityType,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  },

  // Get a notification by ID
  async getNotificationById(id: string) {
    return await prisma.notification.findUnique({
      where: { id },
    });
  },

  // Get notifications by user ID
  async getNotificationsByUserId(userId: string, limit: number = 10) {
    return await prisma.notification.findMany({
      where: { userId },
      include: {
        user: {
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
      take: limit,
    });
  },

  // Get unread notifications by user ID
  async getUnreadNotificationsByUserId(userId: string) {
    return await prisma.notification.findMany({
      where: { 
        userId,
        read: false,
      },
      include: {
        user: {
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

  // Mark notification as read
  async markAsRead(id: string) {
    return await prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  },

  // Set the read flag explicitly (supports un-marking a notification)
  async setRead(id: string, read: boolean) {
    return await prisma.notification.update({
      where: { id },
      data: { read },
    });
  },

  // Mark all notifications as read for a user
  async markAllAsRead(userId: string) {
    return await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  },

  // Delete notification
  async deleteNotification(id: string) {
    return await prisma.notification.delete({
      where: { id },
    });
  },

  // Get notification count for a user
  async getNotificationCount(userId: string) {
    return await prisma.notification.count({
      where: { userId },
    });
  },

  // Get unread notification count for a user
  async getUnreadNotificationCount(userId: string) {
    return await prisma.notification.count({
      where: { 
        userId,
        read: false,
      },
    });
  },
};