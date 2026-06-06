import "dotenv/config";
import { getPendingSyncEvents, markSyncEventStatus, sendSyncEvent } from "../src/lib/sync";

const intervalMs = Number(process.env.SYNC_INTERVAL_MS || 300000);
const maxBatch = Number(process.env.SYNC_BATCH_SIZE || 50);

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function syncBatch() {
  const events = await getPendingSyncEvents(maxBatch);
  if (events.length === 0) {
    console.log("[sync-worker] No pending events to sync.");
    return;
  }

  console.log(`[sync-worker] Syncing ${events.length} pending event(s)`);

  for (const event of events) {
    try {
      await sendSyncEvent(event);
      await markSyncEventStatus(event.id, "SYNCED");
      console.log(`[sync-worker] Synced event ${event.id}`);
    } catch (error: any) {
      console.error(`[sync-worker] Failed to sync event ${event.id}:`, error?.message || error);
      await markSyncEventStatus(event.id, "FAILED", error?.message || "unknown error");
    }
  }
}

async function main() {
  if (!process.env.SYNC_API_URL) {
    console.error("Missing SYNC_API_URL. Aborting sync worker.");
    process.exit(1);
  }

  console.log("[sync-worker] Starting offline-first sync worker...");

  while (true) {
    try {
      await syncBatch();
    } catch (error: any) {
      console.error("[sync-worker] Worker error:", error?.message || error);
    }

    await delay(intervalMs);
  }
}

main();
