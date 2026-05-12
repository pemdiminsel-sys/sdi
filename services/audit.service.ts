import { supabaseAdmin } from "@/lib/supabase";

export interface AuditLog {
  action: string;
  user_email: string;
  target: string;
  status: "success" | "failed";
  details?: any;
  ip_address?: string;
  user_agent?: string;
}

/**
 * Audit Logging Service
 * Records administrative actions to Supabase 'audit_logs' table
 */
export const auditService = {
  /**
   * Log an administrative action
   */
  async log(entry: AuditLog): Promise<void> {
    const timestamp = new Date().toISOString();
    
    // In a real environment, this would save to Supabase
    // table: 'audit_logs'
    // columns: id, created_at, action, user_email, target, status, details, ip_address
    
    console.log(`[AUDIT LOG] ${timestamp} | ${entry.user_email} | ${entry.action} | ${entry.status}`);

    try {
      // Attempt to save to Supabase if configured
      if (process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://YOUR_PROJECT.supabase.co") {
        await supabaseAdmin.from("audit_logs").insert({
          action: entry.action,
          user_email: entry.user_email,
          target: entry.target,
          status: entry.status,
          details: entry.details,
          ip_address: entry.ip_address,
          user_agent: entry.user_agent,
        });
      }
    } catch (err) {
      console.error("[AUDIT LOG ERROR] Failed to save log to database:", err);
    }
  }
};
