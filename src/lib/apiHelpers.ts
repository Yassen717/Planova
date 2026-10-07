import { NextResponse } from 'next/server';
import { createApiResponse } from '@/lib/api';
import { auth } from '@/lib/auth';
import { Role } from '@prisma/client';

export type AuthContext = {
  userId: string;
  role: Role;
  isAdmin: boolean;
  isGuest: boolean;
};

export async function getAuthContext(): Promise<AuthContext | null> {
  const session = await auth();
  const user = session?.user as { id?: string; role?: Role } | undefined;
  if (!user?.id) return null;

  const role = user.role ?? 'USER';
  return {
    userId: user.id,
    role,
    isAdmin: role === 'ADMIN',
    isGuest: role === 'GUEST',
  };
}

type ProjectAccessFields = {
  ownerId: string;
  members: { id: string }[];
};

type TaskAccessFields = {
  assigneeId: string | null;
  project: ProjectAccessFields;
};

export function canViewProject(project: ProjectAccessFields, ctx: AuthContext): boolean {
  return (
    ctx.isAdmin ||
    ctx.isGuest ||
    project.ownerId === ctx.userId ||
    project.members.some((m) => m.id === ctx.userId)
  );
}

export function canManageProject(project: ProjectAccessFields, ctx: AuthContext): boolean {
  return ctx.isAdmin || project.ownerId === ctx.userId;
}

export function canCollaborateOnProject(project: ProjectAccessFields, ctx: AuthContext): boolean {
  return (
    ctx.isAdmin ||
    project.ownerId === ctx.userId ||
    project.members.some((m) => m.id === ctx.userId)
  );
}

export function canViewTask(task: TaskAccessFields, ctx: AuthContext): boolean {
  return (
    ctx.isAdmin ||
    ctx.isGuest ||
    task.assigneeId === ctx.userId ||
    task.project.ownerId === ctx.userId ||
    task.project.members.some((m) => m.id === ctx.userId)
  );
}

export function canModifyTask(task: TaskAccessFields, ctx: AuthContext): boolean {
  return (
    ctx.isAdmin ||
    task.assigneeId === ctx.userId ||
    task.project.ownerId === ctx.userId ||
    task.project.members.some((m) => m.id === ctx.userId)
  );
}

export const unauthorized = (message = 'Unauthorized') =>
  NextResponse.json(createApiResponse(message), { status: 401 });

export const forbidden = (message = 'Forbidden') =>
  NextResponse.json(createApiResponse(message), { status: 403 });

export const notFound = (message = 'Resource not found') =>
  NextResponse.json(createApiResponse(message), { status: 404 });

export const badRequest = (message: string) =>
  NextResponse.json(createApiResponse(message), { status: 400 });

export const serverError = (message = 'Internal server error') =>
  NextResponse.json(createApiResponse(message), { status: 500 });
