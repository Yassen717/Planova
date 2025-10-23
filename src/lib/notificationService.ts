// Notification service for real-time updates using Socket.io
import { io, Socket } from 'socket.io-client';
import { NEXT_PUBLIC_API_BASE_URL } from '@/lib/api';
import { notificationDbService } from './notificationDbService';

class NotificationService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();
  private isConnected: boolean = false;

  // Connect to the Socket.io server
  connect() {
    if (this.socket && this.isConnected) return;

    // Connect to the Socket.io server (using port 3001 for socket server)
    const socketUrl = NEXT_PUBLIC_API_BASE_URL?.replace(':3000', ':3001') || 'http://localhost:3001';
    this.socket = io(socketUrl, {
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to notification service with ID:', this.socket?.id);
      this.isConnected = true;
      this.emit('connected', { message: 'Successfully connected to notification service' });
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from notification service');
      this.isConnected = false;
    });

    // Listen for notifications
    this.socket.on('notification', (data) => {
      console.log('Received notification:', data);
      this.handleEvent('notification', data);
    });

    // Listen for task updates
    this.socket.on('taskUpdated', (data) => {
      console.log('Received task update:', data);
      this.handleEvent('taskUpdated', data);
    });

    // Listen for project updates
    this.socket.on('projectUpdated', (data) => {
      console.log('Received project update:', data);
      this.handleEvent('projectUpdated', data);
    });

    // Listen for comment updates
    this.socket.on('commentAdded', (data) => {
      console.log('Received comment update:', data);
      this.handleEvent('commentAdded', data);
    });
  }

  // Disconnect from the Socket.io server
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Emit an event to the server
  emit(event: string, data: any) {
    if (!this.socket || !this.isConnected) {
      console.warn('Not connected to notification service. Cannot emit event:', event);
      return;
    }
    
    console.log(`Emitting event: ${event}`, data);
    this.socket.emit(event, data);
  }

  // Listen for events
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    
    this.listeners.get(event)?.push(callback);
  }

  // Remove event listener
  off(event: string, callback: Function) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  // Handle incoming events
  private handleEvent(event: string, data: any) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in notification listener for ${event}:`, error);
        }
      });
    }
  }

  // Send a notification and persist it to the database
  async sendNotification(type: string, message: string, userId: string, data?: any) {
    // Persist to database
    try {
      const notification = await notificationDbService.createNotification({
        type,
        message,
        userId,
        entityId: data?.entityId,
        entityType: data?.entityType,
      });
      
      // Emit real-time notification
      this.emit('sendNotification', {
        type,
        message,
        userId,
        data,
        timestamp: new Date().toISOString(),
        id: notification.id,
      });
      
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      // Still emit the notification even if database persistence fails
      this.emit('sendNotification', {
        type,
        message,
        userId,
        data,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  }
  
  // Get notifications for a user
  async getNotifications(userId: string, limit: number = 10) {
    return await notificationDbService.getNotificationsByUserId(userId, limit);
  }
  
  // Get unread notifications for a user
  async getUnreadNotifications(userId: string) {
    return await notificationDbService.getUnreadNotificationsByUserId(userId);
  }
  
  // Mark notification as read
  async markAsRead(id: string) {
    return await notificationDbService.markAsRead(id);
  }
  
  // Mark all notifications as read for a user
  async markAllAsRead(userId: string) {
    return await notificationDbService.markAllAsRead(userId);
  }
}

// Export singleton instance
export const notificationService = new NotificationService();