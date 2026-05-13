"use client";

import { 
  Users, 
  UserPlus, 
  Search, 
  MoreHorizontal, 
  Mail, 
  Shield, 
  CheckCircle2,
  Lock
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const MOCK_USERS = [
  { id: 1, name: "Admin Utama", email: "admin@minsel.go.id", role: "Super Admin", status: "Active", lastLogin: "2 hours ago" },
  { id: 2, name: "Operator Diskominfo", email: "op.kominfo@minsel.go.id", role: "Walidata", status: "Active", lastLogin: "5 mins ago" },
  { id: 3, name: "Admin Dinas Kesehatan", email: "dinkes@minsel.go.id", role: "Admin OPD", status: "Active", lastLogin: "Yesterday" },
  { id: 4, name: "Admin Dinas Pendidikan", email: "disdik@minsel.go.id", role: "Admin OPD", status: "Inactive", lastLogin: "2 weeks ago" },
];

export default function UsersPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowAddForm(false);
      toast.success("User baru berhasil ditambahkan (Simulasi)");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Add User Modal Placeholder */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-card w-full max-w-md p-8 border-white/10 animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-white mb-6">Register New User</h2>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Full Name</label>
                <input type="text" className="input-field" placeholder="John Doe" required />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Email Address</label>
                <input type="email" className="input-field" placeholder="user@minsel.go.id" required />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Account Role</label>
                <select className="input-field text-sm">
                  <option>Super Admin</option>
                  <option>Walidata</option>
                  <option>Admin OPD</option>
                  <option>Viewer</option>
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 btn-secondary py-2"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 btn-primary py-2 justify-center"
                >
                  {isSubmitting ? "Processing..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">User Accounts</h1>
          <p className="text-sm text-slate-400 mt-1">Manage platform access for government agencies and walidata</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="btn-primary"
        >
          <UserPlus size={16} className="mr-2" />
          Add New User
        </button>
      </div>

      <div className="glass-card p-4 flex gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search by name, email or agency..." 
            className="input-field pl-10"
          />
        </div>
        <button className="btn-secondary px-4 py-2">Filter Roles</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {MOCK_USERS.map((user) => (
          <div key={user.id} className="glass-card p-5 group hover:border-red-500/30 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users size={20} className="text-slate-400 group-hover:text-red-400 transition-colors" />
              </div>
              <button className="p-1.5 rounded-lg hover:bg-white/10 text-slate-500 hover:text-white transition-all">
                <MoreHorizontal size={18} />
              </button>
            </div>
            
            <div className="mb-6">
              <h3 className="text-base font-bold text-white">{user.name}</h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                <Mail size={12} />
                <span>{user.email}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider mb-1">Role</span>
                <div className="flex items-center gap-1.5">
                  <Shield size={12} className="text-blue-400" />
                  <span className="text-xs font-bold text-slate-300">{user.role}</span>
                </div>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider mb-1">Status</span>
                <div className="flex items-center gap-1.5">
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    user.status === "Active" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-slate-700"
                  )}></div>
                  <span className={cn(
                    "text-xs font-bold",
                    user.status === "Active" ? "text-green-400" : "text-slate-500"
                  )}>{user.status}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-2 pt-4 border-t border-white/5">
              <button className="flex-1 btn-secondary py-1.5 text-[10px] font-bold uppercase tracking-widest justify-center">
                Edit Profile
              </button>
              <button className="p-2 rounded-lg bg-red-900/10 border border-red-900/20 text-red-500 hover:bg-red-900/20 transition-all" title="Reset Password">
                <Lock size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
