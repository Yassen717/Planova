import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

/**
 * Get the current authenticated user
 * @returns The current user session or null if not authenticated
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user || null;
}

/**
 * Require authentication - throws error if not authenticated
 * @returns The current user session
 * @throws Error if user is not authenticated
 */
export async function requireAuth() {
  const session = await auth();
  
  if (!session?.user) {
    throw new Error("Unauthorized: Authentication required");
  }
  
  return session;
}

/**
 * Require specific role - throws error if user doesn't have the required role
 * @param role - The required role
 * @returns The current user session
 * @throws Error if user doesn't have the required role
 */
export async function requireRole(role: Role) {
  const session = await requireAuth();
  const userRole = (session.user as any).role;
  
  if (userRole !== role) {
    throw new Error(`Forbidden: ${role} role required`);
  }
  
  return session;
}

/**
 * Check if user has a specific role
 * @param role - The role to check
 * @returns True if user has the role, false otherwise
 */
export async function hasRole(role: Role): Promise<boolean> {
  const session = await auth();
  
  if (!session?.user) {
    return false;
  }
  
  const userRole = (session.user as any).role;
  return userRole === role;
}

/**
 * Check if user is admin
 * @returns True if user is admin, false otherwise
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole(Role.ADMIN);
}

/**
 * Hash a password using bcrypt
 * @param password - The plain text password to hash
 * @returns The hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/**
 * Verify a password against a hash
 * @param password - The plain text password to verify
 * @param hash - The hashed password to compare against
 * @returns True if password matches, false otherwise
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Get user ID from current session
 * @returns The user ID or null if not authenticated
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user ? (session.user as any).id : null;
}

/**
 * Check if current user owns a resource
 * @param resourceOwnerId - The ID of the resource owner
 * @returns True if current user owns the resource, false otherwise
 */
export async function isResourceOwner(resourceOwnerId: string): Promise<boolean> {
  const userId = await getCurrentUserId();
  return userId === resourceOwnerId;
}

/**
 * Check if user is guest
 * @returns True if user is guest, false otherwise
 */
export async function isGuest(): Promise<boolean> {
  return hasRole(Role.GUEST);
}

/**
 * Require non-guest user - throws error if user is guest
 * @returns The current user session
 * @throws Error if user is guest
 */
export async function requireNonGuest() {
  const session = await requireAuth();
  const userRole = (session.user as any).role;
  
  if (userRole === Role.GUEST) {
    throw new Error("Forbidden: This action is not available for guest users");
  }
  
  return session;
}
