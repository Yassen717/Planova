const http = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3001; // Use a different port for the Socket.io server
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = http.createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // Next.js dev server
      methods: ["GET", "POST"]
    }
  });

  // Handle Socket.io connections
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle notification events
    socket.on('sendNotification', (data) => {
      console.log('Received notification:', data);
      // Broadcast to all connected clients
      io.emit('notification', data);
    });

    // Handle task updates
    socket.on('taskUpdated', (data) => {
      console.log('Task updated:', data);
      // Broadcast to all connected clients
      io.emit('taskUpdated', data);
    });

    // Handle project updates
    socket.on('projectUpdated', (data) => {
      console.log('Project updated:', data);
      // Broadcast to all connected clients
      io.emit('projectUpdated', data);
    });

    // Handle comment additions
    socket.on('commentAdded', (data) => {
      console.log('Comment added:', data);
      // Broadcast to all connected clients
      io.emit('commentAdded', data);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Socket.io server listening at http://localhost:${port}`);
  });
});