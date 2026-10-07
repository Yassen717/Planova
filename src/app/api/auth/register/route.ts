import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { createApiResponse, createApiErrorResponse, validateRequestBody } from "@/lib/api";
import { badRequest, serverError } from "@/lib/apiHelpers";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: Request) {
  try {
    // Rate limit: 10 registrations per hour per IP
    const { allowed, retryAfterSeconds } = checkRateLimit(
      `register:${getClientIp(request)}`,
      10,
      60 * 60 * 1000
    );

    if (!allowed) {
      return NextResponse.json(
        createApiErrorResponse("Too many registration attempts. Please try again later."),
        { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
      );
    }

    const validation = await validateRequestBody(request, registerSchema);
    if (!validation.success) return badRequest(validation.error);
    const { email, name, password } = validation.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return badRequest("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      }
    });

    return NextResponse.json(
      createApiResponse({
        message: "User created successfully",
        user
      }),
      { status: 201 }
    );

  } catch (error) {
    console.error("Registration error:", error);
    return serverError();
  }
}
