import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateProfileSchema = z.object({
  storeName: z.string().min(2, "Store name must be at least 2 characters").optional(),
  storeLocation: z.string().min(2, "Location must be at least 2 characters").optional(),
  storeDescription: z.string().max(500, "Description must be 500 characters or less").optional(),
  autoLockTimeoutMinutes: z.number().int().min(1, "Auto-lock timeout must be at least 1 minute").optional(),
});

const DEFAULT_USER_SETTINGS = {
  storeName: "My Hardware Store",
  storeLocation: "",
  storeDescription: "",
  autoLockTimeoutMinutes: 1,
};

async function getUserSettings(email: string) {
  try {
    const rows = await prisma.$queryRaw<
      Array<{
        storeName: string | null;
        storeLocation: string | null;
        storeDescription: string | null;
        autoLockTimeoutMinutes: number | null;
      }>
    >`
      SELECT "storeName", "storeLocation", "storeDescription", "autoLockTimeoutMinutes"
      FROM "hardware"."users"
      WHERE email = ${email}
      LIMIT 1
    `;

    if (!rows?.length) {
      return DEFAULT_USER_SETTINGS;
    }

    return {
      storeName: rows[0].storeName ?? DEFAULT_USER_SETTINGS.storeName,
      storeLocation: rows[0].storeLocation ?? DEFAULT_USER_SETTINGS.storeLocation,
      storeDescription: rows[0].storeDescription ?? DEFAULT_USER_SETTINGS.storeDescription,
      autoLockTimeoutMinutes: rows[0].autoLockTimeoutMinutes ?? DEFAULT_USER_SETTINGS.autoLockTimeoutMinutes,
    };
  } catch (rawError: any) {
    const message = String(rawError?.message || rawError);
    if (
      message.includes('column "storeName" does not exist') ||
      message.includes('column "storeLocation" does not exist') ||
      message.includes('column "storeDescription" does not exist') ||
      message.includes('column "autoLockTimeoutMinutes" does not exist') ||
      message.includes('does not exist')
    ) {
      return DEFAULT_USER_SETTINGS;
    }
    throw rawError;
  }
}

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const settings = await getUserSettings(session.user.email);

    return NextResponse.json({
      ...user,
      ...settings,
    });
  } catch (error: any) {
    console.error("/api/user/profile GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { storeName, storeLocation, storeDescription, autoLockTimeoutMinutes } = updateProfileSchema.parse(body);
    const data: Record<string, any> = {};

    if (storeName !== undefined) data.storeName = storeName;
    if (storeLocation !== undefined) data.storeLocation = storeLocation;
    if (storeDescription !== undefined) data.storeDescription = storeDescription;
    if (autoLockTimeoutMinutes !== undefined) data.autoLockTimeoutMinutes = autoLockTimeoutMinutes;

    try {
      const user = await prisma.user.update({
        where: { email: session.user.email },
        data,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        },
      });

      return NextResponse.json({
        ...user,
        ...data,
      });
    } catch (dbError: any) {
      const message = String(dbError?.message || dbError);
      const shouldFallback =
        dbError.code === 'P2009' ||
        message.includes('Unknown field') ||
        message.includes('Unknown argument') ||
        message.includes('Unknown arg');

      if (shouldFallback) {
        console.warn("Store fields not yet in database schema, but update acknowledged");

        try {
          if (storeName !== undefined) {
            await prisma.$executeRaw`
              UPDATE "hardware"."users"
              SET "storeName" = ${storeName}
              WHERE email = ${session.user.email}
            `;
          }

          if (storeLocation !== undefined) {
            await prisma.$executeRaw`
              UPDATE "hardware"."users"
              SET "storeLocation" = ${storeLocation}
              WHERE email = ${session.user.email}
            `;
          }

          if (storeDescription !== undefined) {
            await prisma.$executeRaw`
              UPDATE "hardware"."users"
              SET "storeDescription" = ${storeDescription}
              WHERE email = ${session.user.email}
            `;
          }

          if (autoLockTimeoutMinutes !== undefined) {
            await prisma.$executeRaw`
              UPDATE "hardware"."users"
              SET "autoLockTimeoutMinutes" = ${autoLockTimeoutMinutes}
              WHERE email = ${session.user.email}
            `;
          }
        } catch (rawError: any) {
          const rawMessage = String(rawError?.message || rawError);
          if (!rawMessage.includes('column "storeName" does not exist') && !rawMessage.includes('column "storeLocation" does not exist') && !rawMessage.includes('column "storeDescription" does not exist') && !rawMessage.includes('column "autoLockTimeoutMinutes" does not exist')) {
            throw rawError;
          }
        }

        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        });

        return NextResponse.json({
          ...user,
          ...data,
        });
      }
      throw dbError;
    }
  } catch (error: any) {
    console.error("/api/user/profile PUT error:", error);
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
