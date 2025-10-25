# Planova - Project Management System

Planova is a modern, full-stack project management system built to demonstrate real-world software engineering practices. It features real-time collaboration, task tracking, and team management capabilities.

## Current Status

✅ Phase 1: Foundation - COMPLETE
✅ Phase 2: Core Features - COMPLETE
✅ Phase 3: Advanced Features - COMPLETE
✅ Phase 4: Polish & Deployment - COMPLETE

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

### Core Features
- Project and task management with full CRUD operations
- User authentication and management
- Commenting system on tasks and projects
- Team collaboration with real-time notifications
- Responsive UI with Shadcn UI components
- Dark/light theme toggle with system preference detection

### Advanced Features
- Real-time updates with Socket.io WebSocket communication
- Persistent notification system with real-time updates
- Comprehensive reporting and analytics dashboard
- Performance optimizations and SEO enhancements
- Complete dark/light theme implementation

## Technical Stack

- **Frontend**: Next.js 15.5.6, React 19.1.0, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM, PostgreSQL
- **Database**: PostgreSQL with Prisma ORM
- **Real-time**: Socket.io for WebSocket communication
- **UI Components**: Shadcn UI with Radix UI primitives
- **Validation**: Zod for type-safe input validation
- **Monitoring**: Sentry for error tracking and Logtail for logging
- **Deployment**: Vercel with CI/CD pipeline

## Architecture

The application follows a clean architecture pattern with:
- **Frontend**: Next.js App Router with Server Components
- **Service Layer**: Business logic separated from API routes
- **API Layer**: RESTful API endpoints with Zod validation
- **Database**: Prisma ORM with PostgreSQL
- **Real-time**: Socket.io server for WebSocket communication

## Deployment

The application is deployed on Vercel with:
- Automatic CI/CD pipeline
- Sentry for error monitoring
- Logtail for structured logging
- Performance monitoring and optimization

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Prisma Documentation](https://www.prisma.io/docs/) - database toolkit and ORM
- [Socket.io Documentation](https://socket.io/docs/) - real-time communication
- [Shadcn UI Documentation](https://ui.shadcn.com/docs) - accessible UI components

## Portfolio Presentation

This project demonstrates full-stack development skills with modern web technologies. Key highlights include:

1. **Full-Stack Development**: Complete implementation from database to UI
2. **Modern Tech Stack**: Next.js 15, React 19, TypeScript, and Tailwind CSS
3. **Real-time Features**: WebSocket communication with Socket.io
4. **Performance Optimized**: Best practices for loading speed and runtime performance
5. **Clean Architecture**: Well-organized codebase following industry-standard patterns