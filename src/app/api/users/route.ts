import { NextResponse } from 'next/server';
import { userService } from '@/lib/userService';
import { createApiResponse, validateRequestBody } from '@/lib/api';
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
    const users = await userService.getAllUsers();
    return NextResponse.json(createApiResponse(users));
  } catch (error) {
    return NextResponse.json(createApiResponse('Failed to fetch users'), { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const validation = await validateRequestBody(request, createUserSchema);
    
    if (!validation.success) {
      return NextResponse.json(createApiResponse(validation.error), { status: 400 });
    }
    
    // Check if user already exists
    const existingUser = await userService.getUserByEmail(validation.data.email);
    if (existingUser) {
      return NextResponse.json(createApiResponse('User with this email already exists'), { status: 400 });
    }
    
    const user = await userService.createUser(validation.data);
    return NextResponse.json(createApiResponse(user), { status: 201 });
  } catch (error) {
    return NextResponse.json(createApiResponse('Failed to create user'), { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const validation = await validateRequestBody(request, updateUserSchema);
    
    if (!validation.success) {
      return NextResponse.json(createApiResponse(validation.error), { status: 400 });
    }
    
    const user = await userService.updateUser(validation.data);
    return NextResponse.json(createApiResponse(user));
  } catch (error) {
    return NextResponse.json(createApiResponse('Failed to update user'), { status: 500 });
  }
}