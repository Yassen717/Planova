import { z } from 'zod';
import { zDateString } from '@/lib/api';

// Validation schema for updating a project
export const updateProjectSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['ACTIVE', 'COMPLETED', 'ARCHIVED']).optional(),
  startDate: zDateString.optional(),
  endDate: zDateString.optional(),
});

// Validation schema for updating a task
export const updateTaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  startDate: zDateString.optional(),
  dueDate: zDateString.nullish(),
  assigneeId: z.string().nullish().transform((str) => str === null ? null : str || undefined),
  projectId: z.string().optional(),
});
