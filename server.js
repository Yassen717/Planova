const http = require('http');
const fs = require('fs');
const path = require('path');
const { Server } = require('socket.io');

// Minimal .env loader so AUTH_SECRET / SOCKET_* work without a dotenv dep.
try {
  const envPath = path.join(__dirname, '.env');
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match || match[0].startsWith('#')) continue;
    const [, key, raw] = match;
    if (process.env[key] === undefined) {
      process.env[key] = raw.replace(/^(['"])(.*)\1$/, '$2');
    }
  }
} catch {
  // .env is optional — real env vars may already be set
}

const port = Number(process.env.SOCKET_PORT) || 3001;
const corsOrigin = process.env.SOCKET_CORS_ORIGIN || 'http://localhost:3000';
const socketSecret = process.env.SOCKET_SECRET;

// The session cookie is __Secure- prefixed when the app is served over https
const secureCookie =
  process.env.SOCKET_SECURE_COOKIE !== undefined
    ? process.env.SOCKET_SECURE_COOKIE === 'true'
    : corsOrigin.startsWith('https://');

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

  // Server-side emit relay: POST /emit { event, userId?, data } guarded by
  // the shared SOCKET_SECRET so only the Next.js backend can push events.
  if (req.method === 'POST' && pathname === '/emit') {
    if (!socketSecret || req.headers['x-socket-secret'] !== socketSecret) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Unauthorized' }));
      return;
    }

    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1024 * 1024) req.destroy();
    });
    req.on('end', () => {
      try {
        const { event, userId, data } = JSON.parse(body || '{}');
        if (typeof event !== 'string' || !event) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'event is required' }));
          return;
        }
        if (userId) {
          io.to(`user:${userId}`).emit(event, data);
        } else {
          io.emit(event, data);
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid JSON body' }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ success: false, error: 'Not found' }));
});

const io = new Server(server, {
  cors: {
    origin: corsOrigin,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Reject unauthenticated sockets: verify the NextAuth session JWT carried in
// the handshake cookie header.
io.use(async (socket, next) => {
  try {
    const cookie = socket.handshake.headers.cookie;
    if (!cookie) return next(new Error('Authentication required'));

    const { getToken } = await import('next-auth/jwt');
    const token = await getToken({
      req: { headers: { cookie } },
      secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
      secureCookie,
    });

    const userId = token?.id ?? token?.sub;
    if (!userId) return next(new Error('Authentication required'));

    socket.data.userId = userId;
    next();
  } catch (error) {
    console.error('Socket authentication failed:', error);
    next(new Error('Authentication required'));
  }
});

io.on('connection', (socket) => {
  socket.join(`user:${socket.data.userId}`);
  console.log('User connected:', socket.id, 'user:', socket.data.userId);

  // Targeted notification relay → only the recipient's room
  socket.on('sendNotification', (data) => {
    if (data?.userId) {
      io.to(`user:${data.userId}`).emit('notification', data);
    }
  });

  socket.on('taskUpdated', (data) => {
    io.emit('taskUpdated', data);
  });

  socket.on('projectUpdated', (data) => {
    io.emit('projectUpdated', data);
  });

  socket.on('commentAdded', (data) => {
    io.emit('commentAdded', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(port, () => {
  console.log(`> Socket.io server listening on http://localhost:${port}`);
});
