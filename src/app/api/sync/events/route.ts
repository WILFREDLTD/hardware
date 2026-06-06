import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

type IncomingEvent = {
  id: string;
  entityType: string;
  entityId: string;
  eventType: string;
  payload: any;
};

export async function POST(req: Request) {
  try {
    const auth = req.headers.get("authorization") || "";
    const expected = process.env.SYNC_TOKEN;
    if (!expected || auth !== `Bearer ${expected}`) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Optional IP allowlist: comma-separated IPs in SYNC_IP_ALLOWLIST
    const allowlist = process.env.SYNC_IP_ALLOWLIST;
    if (allowlist) {
      const xf = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "";
      const remote = xf.split(",").map(s => s.trim()).filter(Boolean)[0] || "";
      const allowed = allowlist.split(",").map(s => s.trim()).filter(Boolean);
      if (allowed.length > 0 && remote && !allowed.includes(remote)) {
        return new NextResponse("Forbidden", { status: 403 });
      }
    }

    // Read raw body for HMAC verification when configured
    const raw = await req.text();
    // If HMAC secret is provided, verify the signature header
    const hmacSecret = process.env.SYNC_HMAC_SECRET;
    if (hmacSecret) {
      const sigHeader = req.headers.get("x-hmac-signature") || req.headers.get("x-signature") || "";
      if (!sigHeader) {
        return new NextResponse("Missing signature", { status: 401 });
      }
      const h = crypto.createHmac("sha256", hmacSecret).update(raw).digest("hex");
      try {
        const a = Buffer.from(h, "hex");
        const b = Buffer.from(sigHeader.replace(/^sha256=/, ""), "hex");
        if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
          return new NextResponse("Invalid signature", { status: 401 });
        }
      } catch (e) {
        return new NextResponse("Invalid signature format", { status: 401 });
      }
    }

    const body = raw ? JSON.parse(raw) : {};
    const storeId = body?.storeId;
    const event: IncomingEvent | undefined = body?.event;

    if (!event || !event.id || !event.entityType || !event.entityId) {
      return new NextResponse("Invalid event payload", { status: 400 });
    }

    // Idempotency: if we've already received this event, return success.
    const existing = await prisma.syncEvent.findUnique({ where: { id: event.id } });
    if (existing) {
      return NextResponse.json({ ok: true, id: event.id, note: "already_processed" });
    }

    // Use a transaction so any partial work rolls back on failure.
    await prisma.$transaction(async (tx) => {
      await tx.syncEvent.create({
        data: {
          id: event.id,
          storeId: storeId || "UNKNOWN",
          // event.entityType is an external string; assert any to satisfy
          // the Prisma enum typing here — we still validate presence above.
          entityType: event.entityType as any,
          entityId: event.entityId,
          eventType: event.eventType,
          payload: event.payload || {},
          status: "SYNCED",
        },
      });

      // NOTE: The online DB is intended for read-only usage for selling.
      // We only persist the event metadata here so the cloud side can
      // materialize a read-replica or analytics views. Do not perform
      // local sale-side business actions here to avoid accidental writes.
    });

    return NextResponse.json({ ok: true, id: event.id });
  } catch (err: any) {
    console.error("/api/sync/events error:", err);
    return new NextResponse(`Server error: ${err?.message || "unknown"}`, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, info: "Sync events endpoint" });
}
