import { type NextRequest } from "next/server";
import { sipdService } from "@/services/sipd.service";
import { auditService } from "@/services/audit.service";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";

  try {
    // Invalidate local cache to force a fresh fetch
    sipdService.invalidateCache();

    // Simulate some work delay
    await new Promise(r => setTimeout(r, 2000));

    // Execute sync and save to database
    const syncResult = await sipdService.syncToDatabase();

    if (!syncResult.success) {
      throw new Error(syncResult.error || "Gagal sinkronisasi ke database");
    }

    // Log success to audit trail
    await auditService.log({
      action: "MANUAL_SYNC",
      user_email: "admin@minsel.go.id",
      target: "SIPD E-Walidata",
      status: "success",
      details: { record_count: syncResult.count },
      ip_address: ip
    });

    return Response.json({
      success: true,
      count: syncResult.count,
      timestamp: new Date().toISOString(),
      message: "Sync and database persistence completed successfully"
    });
  } catch (error: any) {
    // Log failure to audit trail
    await auditService.log({
      action: "MANUAL_SYNC",
      user_email: "admin@minsel.go.id",
      target: "SIPD E-Walidata",
      status: "failed",
      details: { error: error.message },
      ip_address: ip
    });

    return Response.json({
      success: false,
      error: error.message || "Unknown sync error"
    }, { status: 500 });
  }
}
