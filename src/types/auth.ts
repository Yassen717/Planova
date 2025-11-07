import { Role } from "@prisma/client";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  image?: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  name: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthSession {
  user: AuthUser;
  expires: string;
}
