// Notification service for real-time updates using Socket.io
import { io, Socket } from 'socket.io-client';
import { notificationDbService } from './notificationDbService';

// Server-side code reaches the socket server via SOCKET_URL (private);
// the browser uses NEXT_PUBLIC_SOCKET_URL.
function socketServerUrl(): string {
  if (typeof window === 'undefined') {
    return (
      process.env.SOCKET_URL ??
      process.env.NEXT_PUBLIC_SOCKET_URL ??
      'http://localhost:3001'
    );
  }
  return process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:3001';
}

class NotificationService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();
  private isConnected: boolean = false;

  // Connect to the Socket.io server (browser only)
  connect() {
    if (this.socket && this.isConnected) return;
    if (typeof window === 'undefined') return;

    this.socket = io(socketServerUrl(), {
      transports: ['websocket'],
      withCredentials: true,
    });

    this.socket.on('connect', () => {
      console.log('Connected to notification service with ID:', this.socket?.id);
      this.isConnected = true;
      this.handleEvent('connected', { message: 'Successfully connected to notification service' });
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from notification service');
      this.isConnected = false;
    });

    // Listen for notifications (per-user room events from the server)
    this.socket.on('notification', (data) => {
      console.log('Received notification:', data);
      this.handleEvent('notification', data);
    });

    // Legacy local event name, kept for same-tab feedback if the server echoes it
    this.socket.on('sendNotification', (data) => {
      this.handleEvent('sendNotification', data);
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

  // Emit an event. Server-side there is no socket connection, so events are
  // relayed to the socket server over its authenticated /emit endpoint.
  emit(event: string, data: any) {
    if (typeof window === 'undefined') {
      this.relay(event, data);
      return;
    }

    if (!this.socket || !this.isConnected) {
      console.warn('Not connected to notification service. Cannot emit event:', event);
      return;
    }

    this.socket.emit(event, data);
  }

  // Relay an event to the socket server via POST /emit (server-side only).
  private relay(event: string, data: any, userId?: string) {
    const secret = process.env.SOCKET_SECRET;
    if (!secret) {
      console.warn('SOCKET_SECRET is not set; skipping realtime emit:', event);
      return;
    }

    fetch(`${socketServerUrl()}/emit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-socket-secret': secret,
      },
      body: JSON.stringify({ event, userId, data }),
    }).catch((error) => {
      console.error('Failed to relay socket event:', error);
    });
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

  // Deliver a notification payload to the recipient in real time.
  // Server-side it goes straight to the user's room over /emit; client-side it
  // is sent over the socket for the server to relay as a 'notification' event.
  private deliverNotification(payload: { userId: string } & Record<string, any>) {
    if (typeof window === 'undefined') {
      this.relay('notification', payload, payload.userId);
    } else {
      this.emit('sendNotification', payload);
    }
  }

  // Send a notification and persist it to the database
  async sendNotification(type: string, message: string, userId: string, data?: any) {
    const payload = {
      type,
      message,
      userId,
      data,
      timestamp: new Date().toISOString(),
    };

    try {
      const notification = await notificationDbService.createNotification({
        type,
        message,
        userId,
        entityId: data?.entityId,
        entityType: data?.entityType,
      });

      this.deliverNotification({ ...payload, id: notification.id });
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      // Still emit the notification even if database persistence fails
      this.deliverNotification(payload);
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
