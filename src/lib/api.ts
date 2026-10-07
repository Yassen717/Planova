import { z, ZodError } from 'zod';

// Environment variables
export const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

// Generic API response type
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
};

// Utility function to handle API route responses
// A string payload is a success message (e.g. for DELETE endpoints);
// use createApiErrorResponse for errors.
export function createApiResponse<T>(data: T | string): ApiResponse<T> {
  if (typeof data === 'string') {
    return {
      success: true,
      message: data,
    };
  }

  return {
    success: true,
    data,
  };
}

// Utility function to build an error response envelope
export function createApiErrorResponse(error: string): ApiResponse<never> {
  return {
    success: false,
    error,
  };
}

// Zod helper: accept a date string, reject unparseable values with a 400-level
// validation error instead of letting an Invalid Date reach Prisma.
export const zDateString = z
  .string()
  .refine((str) => !Number.isNaN(new Date(str).getTime()), { message: 'Invalid date' })
  .transform((str) => new Date(str));

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