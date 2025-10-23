# Planova - Project Management System

Planova is a modern, full-stack project management system built to demonstrate real-world software engineering practices. It features real-time collaboration, task tracking, and team management capabilities.

## Current Status

✅ Phase 1: Foundation - COMPLETE
✅ Phase 2: Core Features - COMPLETE
🚧 Phase 3: Advanced Features - IN PROGRESS

## Getting Started

First, run the development server:

```bash
# For standard development
npm run dev

# For development with real-time notifications
npm run dev-socket
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

For real-time features to work properly, you'll need to run both servers:
- Next.js development server on port 3000
- Socket.io server on port 3001

## Project Features

### Completed Features
- Project and task management
- User authentication and management
- Commenting system
- Team collaboration with real-time notifications
- Responsive UI with Shadcn UI components

### Upcoming Features (Phase 3)
- Advanced notification system
- Reporting and analytics dashboard
- Performance optimizations
- Dark/light theme toggle

## Technical Stack

- **Frontend**: Next.js 15.5.6, React 19.1.0, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM, SQLite
- **Real-time**: Socket.io for WebSocket communication
- **UI Components**: Shadcn UI with Radix UI primitives
- **Validation**: Zod for type-safe input validation
- **Monitoring**: Sentry for error tracking

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Prisma Documentation](https://www.prisma.io/docs/) - database toolkit and ORM
- [Socket.io Documentation](https://socket.io/docs/) - real-time communication
- [Shadcn UI Documentation](https://ui.shadcn.com/docs) - accessible UI components

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.