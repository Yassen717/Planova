const io = require('socket.io-client');

// Connect to the Socket.io server
const socket = io('http://localhost:3001', {
  transports: ['websocket'],
});

socket.on('connect', () => {
  console.log('Connected to notification service with ID:', socket.id);
  
  // Send a test notification after a delay
  setTimeout(() => {
    console.log('Sending test notification...');
    socket.emit('sendNotification', {
      type: 'info',
      message: 'Test notification from client',
      userId: 'user-123',
      timestamp: new Date().toISOString(),
    });
  }, 2000);
  
  setTimeout(() => {
    console.log('Sending test task update...');
    socket.emit('taskUpdated', {
      action: 'created',
      task: {
        id: 'test-task-123',
        title: 'Test Task',
        status: 'TODO',
      },
      timestamp: new Date().toISOString(),
    });
  }, 3000);
});

socket.on('disconnect', () => {
  console.log('Disconnected from notification service');
});

// Listen for notifications
socket.on('notification', (data) => {
  console.log('Received notification:', data);
});

// Listen for task updates
socket.on('taskUpdated', (data) => {
  console.log('Received task update:', data);
});

// Listen for project updates
socket.on('projectUpdated', (data) => {
  console.log('Received project update:', data);
});

// Listen for comment updates
socket.on('commentAdded', (data) => {
  console.log('Received comment update:', data);
});