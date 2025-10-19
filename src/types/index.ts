// User type
export type User = {
  id: string;
  email: string;
  name: string | null;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
};

// Project type
export type Project = {
  id: string;
  title: string;
  description: string | null;
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  startDate: Date;
  endDate: Date | null;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
};

// Task type
export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  startDate: Date;
  dueDate: Date | null;
  assigneeId: string | null;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
};

// Comment type
export type Comment = {
  id: string;
  content: string;
  authorId: string;
  taskId: string;
  createdAt: Date;
  updatedAt: Date;
};