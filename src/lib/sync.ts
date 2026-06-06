import { prisma } from "@/lib/prisma";
import crypto from "crypto";

const syncUrl = process.env.SYNC_API_URL?.replace(/\/+$/, "");
const syncToken = process.env.SYNC_TOKEN;
const storeId = process.env.STORE_ID || "UNKNOWN_STORE";
const hmacSecret = process.env.SYNC_HMAC_SECRET;

export type SyncEntityType =
  | "SALE"
  | "INVENTORY_TRANSACTION"
  | "DEBT"
  | "DEBT_PAYMENT"
  | "PRODUCT"
  | "CUSTOMER"
  | "RECEIPT";

export type SyncStatus = "PENDING" | "SYNCED" | "FAILED";

export async function createSyncEvent(
  entityType: SyncEntityType,
  entityId: string,
  eventType: string,
  payload: object
) {
  return prisma.syncEvent.create({
    data: {
      storeId,
      entityType,
      entityId,
      eventType,
      payload,
      status: "PENDING",
    },
  });
}

export async function getPendingSyncEvents(limit = 50) {
  return prisma.syncEvent.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    take: limit,
  });
}

export async function countPendingSyncEvents() {
  return prisma.syncEvent.count({ where: { status: "PENDING" } });
}

export async function markSyncEventStatus(
  syncEventId: string,
  status: SyncStatus,
  lastError?: string
) {
  return prisma.syncEvent.update({
    where: { id: syncEventId },
    data: {
      status,
      lastError,
      syncedAt: status === "SYNCED" ? new Date() : undefined,
    },
  });
}

export async function sendSyncEvent(event: any) {
  if (!syncUrl) {
    throw new Error("SYNC_API_URL is not configured.");
  }

  const url = `${syncUrl.replace(/\/+$/, "")}/sync/events`;

  const body = JSON.stringify({ storeId, event });
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(syncToken ? { Authorization: `Bearer ${syncToken}` } : {}),
  };

  if (hmacSecret) {
    const sig = crypto.createHmac("sha256", hmacSecret).update(body).digest("hex");
    headers["x-hmac-signature"] = `sha256=${sig}`;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Sync API error ${response.status}: ${text}`);
  }

  return response.json();
}

export type SyncManualResult = {
  ok: true;
  pending: number;
  synced: number;
  failed: number;
  message: string;
};

export async function syncPendingEvents(limit = 50): Promise<SyncManualResult> {
  const events = await getPendingSyncEvents(limit);
  const total = events.length;
  let synced = 0;
  let failed = 0;

  for (const event of events) {
    try {
      await sendSyncEvent(event);
      await markSyncEventStatus(event.id, "SYNCED");
      synced += 1;
    } catch (error: any) {
      await markSyncEventStatus(event.id, "FAILED", error?.message || "unknown error");
      failed += 1;
    }
  }

  const message = total === 0
    ? "No pending events were found. All caught up."
    : `${synced} synced, ${failed} failed, ${total - synced - failed} remaining.`;

  return { ok: true, pending: total, synced, failed, message };
}
