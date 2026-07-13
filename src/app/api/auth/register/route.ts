import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .refine((val) => /[A-Z]/.test(val), "Password must contain at least one uppercase letter")
    .refine((val) => /[0-9]/.test(val), "Password must contain at least one number")
    .refine((val) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val), "Password must contain at least one punctuation mark"),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().optional(),
  storeName: z.string().min(1),
  storeLocation: z.string().min(1),
  storeDescription: z.string().min(1).max(500),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const { email, password, firstName, lastName, phone, storeName, storeLocation, storeDescription } = registerSchema.parse(body);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with optional store information
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        storeName: storeName ?? null,
        storeLocation: storeLocation ?? null,
        storeDescription: storeDescription ?? null,
      },
    });

    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("/api/auth/register POST error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
