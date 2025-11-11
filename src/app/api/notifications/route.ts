import { NextResponse } from 'next/server';
import { notificationDbService } from '@/lib/notificationDbService';
import { createApiResponse, validateRequestBody } from '@/lib/api';
import { auth } from '@/lib/auth';
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
  read: z.boolean().optional(),
});

export async function GET(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        createApiResponse('Unauthorized'),
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || (session.user as any).id;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : 10;
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    
    // Ensure user can only access their own notifications
    if (userId !== (session.user as any).id) {
      return NextResponse.json(
        createApiResponse('Forbidden: You can only access your own notifications'),
        { status: 403 }
      );
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
    return NextResponse.json(createApiResponse('Failed to fetch notifications'), { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        createApiResponse('Unauthorized'),
        { status: 401 }
      );
    }

    const validation = await validateRequestBody(request, createNotificationSchema);
    
    if (!validation.success) {
      return NextResponse.json(createApiResponse(validation.error), { status: 400 });
    }
    
    const notification = await notificationDbService.createNotification(validation.data);
    return NextResponse.json(createApiResponse(notification), { status: 201 });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(createApiResponse('Failed to create notification'), { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        createApiResponse('Unauthorized'),
        { status: 401 }
      );
    }

    const validation = await validateRequestBody(request, updateNotificationSchema);
    
    if (!validation.success) {
      return NextResponse.json(createApiResponse(validation.error), { status: 400 });
    }
    
    const { id, read } = validation.data;
    
    let notification;
    if (read !== undefined) {
      notification = await notificationDbService.markAsRead(id);
    }
    
    return NextResponse.json(createApiResponse(notification));
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(createApiResponse('Failed to update notification'), { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        createApiResponse('Unauthorized'),
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(createApiResponse('Notification ID is required'), { status: 400 });
    }
    
    await notificationDbService.deleteNotification(id);
    return NextResponse.json(createApiResponse('Notification deleted successfully'));
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json(createApiResponse('Failed to delete notification'), { status: 500 });
  }
}