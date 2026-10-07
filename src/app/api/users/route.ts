import { NextResponse } from 'next/server';
import { userService } from '@/lib/userService';
import { createApiResponse, validateRequestBody } from '@/lib/api';
import {
  getAuthContext,
  unauthorized,
  forbidden,
  badRequest,
  serverError,
} from '@/lib/apiHelpers';
import { z } from 'zod';

// Validation schema for creating a user
const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Validation schema for updating a user
const updateUserSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
  email: z.string().email('Invalid email address').optional(),
  name: z.string().optional(),
});

export async function GET() {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return unauthorized();

    // Non-admin callers only get the minimal fields needed for pickers
    // (id, name, image). Admins get the full field set.
    const users = ctx.isAdmin
      ? await userService.getAllUsers()
      : await userService.getAssignableUsers();
    return NextResponse.json(createApiResponse(users));
  } catch (error) {
    return serverError('Failed to fetch users');
  }
}

export async function POST(request: Request) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return unauthorized();

    // Only admins can create users through this endpoint
    if (!ctx.isAdmin) {
      return forbidden('Forbidden: Only admins can create users');
    }

    const validation = await validateRequestBody(request, createUserSchema);
    if (!validation.success) return badRequest(validation.error);
    
    // Check if user already exists
    const existingUser = await userService.getUserByEmail(validation.data.email);
    if (existingUser) {
      return badRequest('User with this email already exists');
    }
    
    const user = await userService.createUser(validation.data);
    return NextResponse.json(createApiResponse(user), { status: 201 });
  } catch (error) {
    return serverError('Failed to create user');
  }
}

export async function PUT(request: Request) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return unauthorized();
    if (ctx.isGuest) return forbidden('Forbidden: Guest users cannot update users');

    const validation = await validateRequestBody(request, updateUserSchema);
    if (!validation.success) return badRequest(validation.error);
    
    // Users can only update their own profile; admins can update anyone
    if (validation.data.id !== ctx.userId && !ctx.isAdmin) {
      return forbidden('Forbidden: You can only update your own profile');
    }
    
    const user = await userService.updateUser(validation.data);
    return NextResponse.json(createApiResponse(user));
  } catch (error) {
    return serverError('Failed to update user');
  }
}
