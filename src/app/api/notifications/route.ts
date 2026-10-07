import { NextResponse } from 'next/server';
import { notificationDbService } from '@/lib/notificationDbService';
import { createApiResponse, validateRequestBody } from '@/lib/api';
import {
  getAuthContext,
  unauthorized,
  forbidden,
  notFound,
  badRequest,
  serverError,
} from '@/lib/apiHelpers';
import { z } from 'zod';

// Validation schema for creating a notification
const createNotificationSchema = z.object({
  type: z.string().min(1, 'Type is required'),
  message: z.string().min(1, 'Message is required'),
  userId: z.string().min(1, 'User ID is required'),
  entityId: z.string().optional(),
  entityType: z.string().optional(),
});

// Validation schema for updating a notification
const updateNotificationSchema = z.object({
  id: z.string().min(1, 'Notification ID is required'),
  read: z.boolean(),
});

export async function GET(request: Request) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return unauthorized();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || ctx.userId;
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    const limitParam = searchParams.get('limit');
    let limit = 10;
    if (limitParam !== null) {
      const parsed = Number(limitParam);
      if (limitParam.trim() === '' || !Number.isFinite(parsed)) {
        return badRequest('Invalid limit parameter');
      }
      limit = Math.min(Math.max(Math.floor(parsed), 1), 100);
    }

    // Users can only access their own notifications; admins can view anyone's
    if (userId !== ctx.userId && !ctx.isAdmin) {
      return forbidden('Forbidden: You can only access your own notifications');
    }
    
    let notifications;
    if (unreadOnly) {
      notifications = await notificationDbService.getUnreadNotificationsByUserId(userId);
    } else {
      notifications = await notificationDbService.getNotificationsByUserId(userId, limit);
    }
    
    return NextResponse.json(createApiResponse(notifications));
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return serverError('Failed to fetch notifications');
  }
}

export async function POST(request: Request) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return unauthorized();
    if (ctx.isGuest) return forbidden('Forbidden: Guest users cannot create notifications');

    const validation = await validateRequestBody(request, createNotificationSchema);
    if (!validation.success) return badRequest(validation.error);
    
    // Users can only create notifications for themselves; admins can target anyone
    if (validation.data.userId !== ctx.userId && !ctx.isAdmin) {
      return forbidden('Forbidden: You cannot create notifications for other users');
    }
    
    const notification = await notificationDbService.createNotification(validation.data);
    return NextResponse.json(createApiResponse(notification), { status: 201 });
  } catch (error) {
    console.error('Error creating notification:', error);
    return serverError('Failed to create notification');
  }
}

export async function PUT(request: Request) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return unauthorized();

    const validation = await validateRequestBody(request, updateNotificationSchema);
    if (!validation.success) return badRequest(validation.error);
    
    const { id, read } = validation.data;

    const existing = await notificationDbService.getNotificationById(id);
    if (!existing) return notFound('Notification not found');
    if (existing.userId !== ctx.userId && !ctx.isAdmin) {
      return forbidden('Forbidden: You can only update your own notifications');
    }

    const notification = await notificationDbService.setRead(id, read);

    return NextResponse.json(createApiResponse(notification));
  } catch (error) {
    console.error('Error updating notification:', error);
    return serverError('Failed to update notification');
  }
}

export async function DELETE(request: Request) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return unauthorized();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return badRequest('Notification ID is required');
    
    const existing = await notificationDbService.getNotificationById(id);
    if (!existing) return notFound('Notification not found');
    if (existing.userId !== ctx.userId && !ctx.isAdmin) {
      return forbidden('Forbidden: You can only delete your own notifications');
    }
    
    await notificationDbService.deleteNotification(id);
    return NextResponse.json(createApiResponse('Notification deleted successfully'));
  } catch (error) {
    console.error('Error deleting notification:', error);
    return serverError('Failed to delete notification');
  }
}
