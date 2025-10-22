import { z, ZodError } from 'zod';

// Environment variables
export const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

// Generic API response type
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Utility function to handle API route responses
export function createApiResponse<T>(data: T): ApiResponse<T>;
export function createApiResponse<T>(error: string): ApiResponse<T>;
export function createApiResponse<T>(dataOrError: T | string): ApiResponse<T> {
  if (typeof dataOrError === 'string') {
    return {
      success: false,
      error: dataOrError,
    };
  }
  
  return {
    success: true,
    data: dataOrError,
  };
}

// Utility function to validate request body with Zod
export async function validateRequestBody<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);
    
    if (!result.success) {
      const errorMessage = (result.error as ZodError).issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      return {
        success: false,
        error: `Validation error: ${errorMessage}`,
      };
    }
    
    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Invalid JSON in request body',
    };
  }
}