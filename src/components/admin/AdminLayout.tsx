"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Car,
  MapPin,
  Wallet,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Settings,
  Tag,
  Search,
  Bell,
  Activity,
  UserCheck,
  Code,
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "User Accounts", href: "/admin/users", icon: Users },
  { label: "Drivers & Fleet", href: "/admin/drivers", icon: Car },
  { label: "Rides & Trips", href: "/admin/rides", icon: MapPin },
  { label: "Wallet Ledger", href: "/admin/wallet", icon: Wallet },
  { label: "System Audit Logs", href: "/admin/audit-logs", icon: ShieldCheck },
  { label: "Safety & SOS Desk", href: "/admin/safety", icon: AlertTriangle },
  { label: "Support Center", href: "/admin/support", icon: HelpCircle },
  { label: "Pricing & Rules", href: "/admin/settings", icon: Settings },
  { label: "Promotions", href: "/admin/promotions", icon: Tag },
  { label: "API & Keys", href: "/admin/api", icon: Code },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1e293b] border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#10b982] text-slate-950 flex items-center justify-center font-bold text-xl shadow-lg shadow-[#10b982]/20">
              R
            </div>
            <div>
              <h1 className="font-black text-lg tracking-wide text-slate-100">
                rydra
              </h1>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#10b982] animate-pulse"></span>
                <span className="text-[11px] uppercase font-semibold tracking-wider text-[#10b982]">
                  Super Admin
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-190px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-[#10b982] text-slate-950 font-semibold shadow-md shadow-[#10b982]/20"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                  }`}
                >
                  <Icon
                    size={18}
                    className={isActive ? "text-slate-950" : "text-slate-400"}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Legal & Policy Compliance Links */}
        <div className="px-4 py-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
          <Link href="/terms" className="hover:text-[#10b982] transition-colors">
            Terms
          </Link>
          <span className="text-slate-600">•</span>
          <Link href="/privacy" className="hover:text-[#10b982] transition-colors">
            Privacy
          </Link>
          <span className="text-slate-600">•</span>
          <Link href="/refund" className="hover:text-[#10b982] transition-colors">
            Refunds
          </Link>
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-semibold text-[#10b982]">
              SA
            </div>
            <div className="text-xs">
              <p className="font-semibold text-slate-200">rydra Admin</p>
              <p className="text-[10px] text-slate-400">admin@rydra.com</p>
            </div>
          </div>
          <UserCheck size={16} className="text-[#10b982]" />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-[#1e293b]/80 backdrop-blur border-b border-slate-800 px-6 flex items-center justify-between shrink-0">
          <div className="relative w-80">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search users, rides, transactions..."
              className="w-full h-9 bg-slate-900 border border-slate-700/60 rounded-lg pl-9 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#10b982] transition-colors"
            />
          </div>

          <div className="flex items-center gap-4">
            {/* System Status Pill */}
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-medium text-emerald-400">
              <Activity size={14} className="text-[#10b982] animate-spin" />
              <span>Backend API Online</span>
            </div>

            {/* Notification Bell */}
            <button className="relative p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#10b982]"></span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#0f172a]">
          {children}
        </main>
      </div>
    </div>
  );
}
