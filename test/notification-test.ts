// Test file for verifying real-time notifications
import { notificationService } from '../src/lib/notificationService';

// Connect to the notification service
console.log('Connecting to notification service...');
notificationService.connect();

// Listen for notifications
notificationService.on('notification', (data: any) => {
  console.log('Received notification:', data);
});

// Listen for task updates
notificationService.on('taskUpdated', (data: any) => {
  console.log('Received task update:', data);
});

// Listen for project updates
notificationService.on('projectUpdated', (data: any) => {
  console.log('Received project update:', data);
});

// Listen for comment updates
notificationService.on('commentAdded', (data: any) => {
  console.log('Received comment update:', data);
});

// Send a test notification after a delay
setTimeout(() => {
  console.log('Sending test notification...');
  notificationService.sendNotification('info', 'Test notification from client');
}, 2000);

setTimeout(() => {
  console.log('Sending test task update...');
  notificationService.emit('taskUpdated', {
    action: 'created',
    task: {
      id: 'test-task-123',
      title: 'Test Task',
      status: 'TODO',
    },
    timestamp: new Date().toISOString(),
  });
}, 3000);