<div align="center">

# 📊 Planova - Project Management System

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.5.6-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-6.17.1-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind" />
</p>

<p align="center">
  A modern, full-stack project management system built with cutting-edge technologies.
  <br />
  Features real-time collaboration, authentication, task tracking, and team management.
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-authentication">Authentication</a> •
  <a href="#-deployment">Deployment</a>
</p>

</div>

---


## 🚀 Getting Started

### Prerequisites

- Node.js 20+ 
- npm or yarn
- PostgreSQL (Docker recommended, or cloud database)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/planova.git
   cd planova
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   # For local development with Docker
   DATABASE_URL="postgresql://planova:planova123@localhost:5432/planova_dev"
   
   # Or use a cloud database (Vercel Postgres, Supabase, Railway)
   # DATABASE_URL="postgresql://username:password@host:port/database"
   
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   GITHUB_ID="your-github-oauth-id"
   GITHUB_SECRET="your-github-oauth-secret"
   ```

4. **Start PostgreSQL**
   
   **Option A: Docker (Recommended)**
   ```bash
   docker-compose up -d
   ```
   
   **Option B: Cloud Database**
   - Use Vercel Postgres, Supabase, or Railway
   - Copy the connection string to `.env`
   
   See [POSTGRES_SETUP.md](POSTGRES_SETUP.md) for detailed instructions.

5. **Set up the database**
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### 🧪 Test Users

After seeding, you can login with:

| Email | Password | Role |
|-------|----------|------|
| admin@planova.com | admin123 | ADMIN |
| user@planova.com | user123 | USER |
| guest@planova.com | guest123 | GUEST (Read-only) |

## ✨ Features

### 🔐 Authentication & Authorization
- ✅ **Email/Password Authentication** - Secure login with bcrypt hashing
- ✅ **GitHub OAuth** - Social login integration
- ✅ **Guest Mode** - Try the app without registration (read-only)
- ✅ **Role-Based Access Control** - ADMIN, USER, and GUEST roles
- ✅ **Protected Routes** - Middleware-based route protection
- ✅ **Session Management** - JWT-based sessions with 30-day expiration

### 📊 Project Management
- ✅ **Project CRUD** - Create, read, update, and delete projects
- ✅ **Project Status Tracking** - Active, Completed, Archived
- ✅ **Progress Visualization** - Real-time progress bars
- ✅ **Team Collaboration** - Add members to projects
- ✅ **Project Filtering** - Filter by status, owner, date range
- ✅ **Beautiful Delete Confirmation** - Animated modal with backdrop blur

### ✅ Task Management
- ✅ **Task CRUD** - Full task lifecycle management
- ✅ **Kanban Board** - Drag-and-drop task organization
- ✅ **Task Status** - TODO, IN_PROGRESS, REVIEW, DONE
- ✅ **Priority Levels** - LOW, MEDIUM, HIGH, URGENT
- ✅ **Task Assignment** - Assign tasks to team members
- ✅ **Due Dates** - Track deadlines and overdue tasks

### 💬 Collaboration
- ✅ **Comments System** - Comment on tasks and projects
- ✅ **Real-time Notifications** - Socket.io WebSocket updates
- ✅ **Notification Center** - Persistent notification system
- ✅ **Team Management** - User roles and permissions

### 🎨 User Interface
- ✅ **Modern Design** - Clean, professional interface
- ✅ **Dark/Light Theme** - System preference detection
- ✅ **Responsive Layout** - Mobile, tablet, and desktop support
- ✅ **Animations** - Smooth transitions and micro-interactions
- ✅ **Toast Notifications** - User feedback for actions
- ✅ **Loading States** - Skeleton screens and spinners

### 📈 Dashboard & Analytics
- ✅ **Project Statistics** - Overview of all projects
- ✅ **Task Analytics** - Task distribution and status
- ✅ **Progress Charts** - Visual progress tracking
- ✅ **Recent Activity** - Timeline of recent changes
- ✅ **Upcoming Deadlines** - Never miss a deadline

### 🔧 Developer Experience
- ✅ **TypeScript** - Full type safety
- ✅ **ESLint & Prettier** - Code quality and formatting
- ✅ **Prisma ORM** - Type-safe database access
- ✅ **API Validation** - Zod schema validation
- ✅ **Error Handling** - Comprehensive error management
- ✅ **Documentation** - Well-documented codebase

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15.5.6 (App Router)
- **UI Library:** React 19.1.0
- **Language:** TypeScript 5.0
- **Styling:** Tailwind CSS 4.0
- **Components:** Shadcn UI + Radix UI
- **Icons:** Heroicons
- **Animations:** Tailwind transitions

### Backend
- **API:** Next.js API Routes
- **ORM:** Prisma 6.17.1
- **Database:** PostgreSQL
- **Authentication:** NextAuth.js v5
- **Password Hashing:** bcryptjs
- **Validation:** Zod

### Real-time
- **WebSocket:** Socket.io
- **Notifications:** Custom notification system

### DevOps
- **Deployment:** Vercel
- **CI/CD:** GitHub Actions
- **Monitoring:** Sentry
- **Logging:** Logtail

### Development Tools
- **Package Manager:** npm
- **Linting:** ESLint
- **Formatting:** Prettier
- **Git Hooks:** Husky (optional)

## 🏗️ Architecture

```
planova/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Dashboard page
│   │   ├── projects/          # Projects pages
│   │   ├── tasks/             # Tasks pages
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── ui/               # UI components
│   │   ├── projects/         # Project components
│   │   ├── tasks/            # Task components
│   │   └── navigation/       # Navigation components
│   ├── lib/                   # Utilities & services
│   │   ├── auth.ts           # NextAuth configuration
│   │   ├── auth-utils.ts     # Auth helper functions
│   │   ├── prisma.ts         # Prisma client
│   │   └── services/         # Business logic
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # TypeScript types
│   └── middleware.ts          # Route protection
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Database migrations
│   └── seed.ts               # Seed data
├── docs/                      # Documentation
│   ├── authentication.md      # Auth documentation
│   └── authentication-testing.md
└── public/                    # Static assets
```

### Design Patterns

- **Service Layer Pattern** - Business logic separated from API routes
- **Repository Pattern** - Data access abstraction with Prisma
- **Component Composition** - Reusable UI components
- **Custom Hooks** - Shared logic extraction
- **Middleware Pattern** - Route protection and authentication

## 🔐 Authentication

Planova uses **NextAuth.js v5** for authentication with multiple providers:

### Supported Authentication Methods

1. **Credentials (Email/Password)**
   - Secure password hashing with bcrypt (12 rounds)
   - Email validation
   - Session management with JWT

2. **GitHub OAuth**
   - One-click social login
   - Automatic account creation
   - Profile sync

3. **Guest Mode**
   - Try the app without registration
   - Read-only access
   - Limited permissions

### Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT-based sessions (30-day expiration)
- ✅ Protected routes with middleware
- ✅ API route protection
- ✅ Role-based access control (RBAC)
- ✅ CSRF protection
- ✅ Secure session cookies

For detailed authentication documentation, see [docs/authentication.md](docs/authentication.md)

---

## 🚀 Deployment

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/planova)

### Manual Deployment

1. **Set up environment variables** in your hosting platform
2. **Run database migrations**: `npx prisma migrate deploy`
3. **Build the application**: `npm run build`
4. **Start the server**: `npm start`

### Deployment Options

- **Vercel** (Recommended) - Zero configuration
- **Netlify** - Easy setup with CLI
- **Railway** - Built-in PostgreSQL
- **Docker** - Containerized deployment
- **VPS** - Full control with Docker Compose

For detailed deployment guide, see [deploy.md](deploy.md)

---

## 📚 Documentation

- [Authentication Guide](docs/authentication.md) - Complete auth documentation
- [Authentication Testing](docs/authentication-testing.md) - Testing checklist
- [Deployment Guide](deploy.md) - Step-by-step deployment instructions

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 Scripts

```bash
# Development
npm run dev              # Start development server
npm run dev-socket       # Start with Socket.io server

# Database
npx prisma migrate dev   # Run migrations (development)
npx prisma migrate deploy # Run migrations (production)
npx prisma db seed       # Seed database
npx prisma studio        # Open Prisma Studio

# Build
npm run build            # Build for production
npm start                # Start production server

# Testing
npm test                 # Run tests (if configured)
```

---

## 🎯 Project Highlights

This project demonstrates professional full-stack development skills:

### Technical Excellence
- ✅ **Modern Stack** - Next.js 15, React 19, TypeScript
- ✅ **Clean Architecture** - Well-organized, maintainable codebase
- ✅ **Type Safety** - Full TypeScript coverage
- ✅ **Best Practices** - Industry-standard patterns and conventions
- ✅ **Performance** - Optimized for speed and efficiency

### Features Showcase
- ✅ **Authentication** - Complete auth system with multiple providers
- ✅ **Real-time** - WebSocket communication with Socket.io
- ✅ **CRUD Operations** - Full data management capabilities
- ✅ **Responsive Design** - Works on all devices
- ✅ **Dark Mode** - Complete theme system

### Development Quality
- ✅ **Documentation** - Comprehensive docs and comments
- ✅ **Error Handling** - Robust error management
- ✅ **Security** - Following security best practices
- ✅ **Scalability** - Built to scale
- ✅ **Maintainability** - Easy to understand and extend

---

## 📖 Learn More

### Technologies Used

- [Next.js Documentation](https://nextjs.org/docs) - Next.js features and API
- [React Documentation](https://react.dev) - React library
- [TypeScript Documentation](https://www.typescriptlang.org/docs/) - TypeScript language
- [Prisma Documentation](https://www.prisma.io/docs/) - Database ORM
- [NextAuth.js Documentation](https://next-auth.js.org/) - Authentication
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Utility-first CSS
- [Socket.io Documentation](https://socket.io/docs/) - Real-time communication
- [Shadcn UI Documentation](https://ui.shadcn.com/docs) - UI components

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Yassen Ibrahim**

- GitHub:https://github.com/Yassen717
- LinkedIn: https://www.linkedin.com/in/yassen-ibrahim-993117363/


---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Vercel](https://vercel.com/) - Deployment platform
- [Prisma](https://www.prisma.io/) - Database toolkit
- [Shadcn UI](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ and ☕

</div>