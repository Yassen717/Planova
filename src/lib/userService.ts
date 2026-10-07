import { prisma } from './db';
import bcrypt from 'bcryptjs';

export type CreateUserInput = {
  email: string;
  name?: string;
  password: string;
};

export type UpdateUserInput = {
  id: string;
  email?: string;
  name?: string;
};

export const userService = {
  // Create a new user
  async createUser(input: CreateUserInput) {
    const hashedPassword = await bcrypt.hash(input.password, 12);
    return await prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        password: hashedPassword,
        role: 'USER',
      },
    });
  },

  // Get all users
  async getAllUsers() {
    return await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  // Get user by ID
  async getUserById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        ownedProjects: {
          select: {
            id: true,
            title: true,
          },
        },
        memberProjects: {
          select: {
            id: true,
            title: true,
          },
        },
        assignedTasks: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  },

  // Get user by email
  async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  },

  // Update user
  async updateUser(input: UpdateUserInput) {
    const { id, ...updateData } = input;
    return await prisma.user.update({
      where: { id },
      data: updateData,
    });
  },

  // Delete user
  async deleteUser(id: string) {
    return await prisma.user.delete({
      where: { id },
    });
  },
};