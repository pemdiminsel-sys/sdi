import { type NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabaseAdmin
      .from("audit_logs")
      .select("*")
      .eq("action", "MANUAL_SYNC")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      // If table doesn't exist, we might get an error.
      // Return empty array instead of failing completely.
      console.error("[API LOGS ERROR]", error);
      return Response.json({ success: true, data: [] });
    }

    return Response.json({ success: true, data: data || [] });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
