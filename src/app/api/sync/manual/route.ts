import { NextResponse } from "next/server";
import { countPendingSyncEvents, syncPendingEvents } from "@/lib/sync";

export async function GET() {
  try {
    const pending = await countPendingSyncEvents();
    return NextResponse.json({ ok: true, pending });
  } catch (err: any) {
    console.error("/api/sync/manual GET error:", err);
    return new NextResponse(`Sync status failed: ${err?.message || "unknown"}`, { status: 500 });
  }
}

export async function POST() {
  try {
    const result = await syncPendingEvents(100);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("/api/sync/manual error:", err);
    return new NextResponse(`Sync failed: ${err?.message || "unknown"}`, { status: 500 });
  }
}
