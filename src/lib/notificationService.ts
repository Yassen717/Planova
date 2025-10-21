// Notification service for real-time updates using Socket.io
import { io, Socket } from 'socket.io-client';

class NotificationService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  // Connect to the Socket.io server
  connect() {
    if (this.socket) return;

    // In a real application, this would connect to your Socket.io server
    // For now, we'll simulate the connection
    console.log('Connecting to notification service...');
    
    // Simulate connection
    setTimeout(() => {
      console.log('Connected to notification service');
      this.emit('connected', { message: 'Successfully connected to notification service' });
    }, 1000);
  }

  // Disconnect from the Socket.io server
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Emit an event
  emit(event: string, data: any) {
    console.log(`Emitting event: ${event}`, data);
    
    // Simulate emitting to server
    // In a real implementation: this.socket?.emit(event, data);
    
    // Simulate receiving the event back
    setTimeout(() => {
      this.handleEvent(event, data);
    }, 100);
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

  // Simulate receiving a notification
  simulateNotification(type: string, message: string, data?: any) {
    this.handleEvent('notification', {
      type,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  }
}

// Export singleton instance
export const notificationService = new NotificationService();