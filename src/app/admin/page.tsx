"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminApi } from "@/lib/api";
import {
  Users,
  Car,
  Clock,
  TrendingUp,
  ShieldAlert,
  HelpCircle,
  ArrowUpRight,
  CheckCircle,
  AlertCircle,
  FileText,
} from "lucide-react";

export default function AdminOverviewPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getAnalytics()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching analytics:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64 text-slate-400">
          <div className="w-8 h-8 border-2 border-[#10b982] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  const metrics = data?.metrics || {};
  const recentRides = data?.recentRides || [];
  const recentAuditLogs = data?.recentAuditLogs || [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Title */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-100 tracking-tight">
              Super Admin Dashboard
            </h2>
            <p className="text-xs font-semibold text-slate-400">
              Real-time operational summary and platform control
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#10b982]/10 border border-[#10b982]/30 text-[#10b982]">
              Ekiti State Transport Zone
            </span>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#1e293b] border border-slate-800 rounded-xl p-5 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs text-slate-400 font-medium">
                Total Gross Revenue
              </p>
              <h3 className="text-2xl font-extrabold text-slate-100 mt-1">
                ₦{(metrics.totalRevenue || 0).toLocaleString()}
              </h3>
              <p className="text-[11px] text-[#10b982] flex items-center gap-1 mt-1 font-medium">
                <TrendingUp size={12} /> Live completed trips
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#10b982]/10 text-[#10b982] flex items-center justify-center shrink-0 ml-3">
              <TrendingUp size={24} />
            </div>
          </div>

          <div className="bg-[#1e293b] border border-slate-800 rounded-xl p-5 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs text-slate-400 font-medium">
                Registered Customers
              </p>
              <h3 className="text-2xl font-extrabold text-slate-100 mt-1">
                {metrics.totalUsers || 0}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                OTP Verified Accounts
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 ml-3">
              <Users size={24} />
            </div>
          </div>

          <div className="bg-[#1e293b] border border-slate-800 rounded-xl p-5 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs text-slate-400 font-medium">
                Pending Driver Approvals
              </p>
              <h3 className="text-2xl font-extrabold text-amber-400 mt-1">
                {metrics.pendingDrivers || 0}
              </h3>
              <p className="text-[11px] text-amber-400/80 mt-1">
                NIN / License Review
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 ml-3">
              <Clock size={24} />
            </div>
          </div>

          <div className="bg-[#1e293b] border border-slate-800 rounded-xl p-5 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs text-slate-400 font-medium">
                Active Rides Now
              </p>
              <h3 className="text-2xl font-extrabold text-[#10b982] mt-1">
                {metrics.activeRides || 0}
              </h3>
              <p className="text-[11px] text-[#10b982] mt-1">
                In progress on road
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#10b982]/10 text-[#10b982] flex items-center justify-center shrink-0 ml-3">
              <Car size={24} />
            </div>
          </div>
        </div>

        {/* Operational Highlights Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#1e293b] border border-amber-500/30 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <ShieldAlert size={20} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">
                  Active SOS Alerts
                </h4>
                <p className="text-xs text-slate-400">
                  {metrics.activeSosAlerts || 0} emergency requests requiring
                  attention
                </p>
              </div>
            </div>
            <a
              href="/admin/safety"
              className="text-xs font-semibold text-amber-400 hover:underline flex items-center gap-1"
            >
              Safety Desk <ArrowUpRight size={14} />
            </a>
          </div>

          <div className="bg-[#1e293b] border border-blue-500/30 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                <HelpCircle size={20} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">
                  Open Support Cases
                </h4>
                <p className="text-xs text-slate-400">
                  {metrics.openSupportCases || 0} customer tickets pending
                  resolution
                </p>
              </div>
            </div>
            <a
              href="/admin/support"
              className="text-xs font-semibold text-blue-400 hover:underline flex items-center gap-1"
            >
              Support Center <ArrowUpRight size={14} />
            </a>
          </div>
        </div>

        {/* Live Recent Rides & Audit Stream Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Rides */}
          <div className="bg-[#1e293b] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <Car size={16} className="text-[#10b982]" /> Live Recent Rides
              </h3>
              <a
                href="/admin/rides"
                className="text-xs text-[#10b982] font-semibold hover:underline"
              >
                View All
              </a>
            </div>

            <div className="space-y-3">
              {recentRides.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">
                  No recent rides found
                </p>
              ) : (
                recentRides.map((ride: any) => (
                  <div
                    key={ride.id}
                    className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-200">
                          {ride.id}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {ride.vehicleCategory}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {ride.customerName || "Customer"} →{" "}
                        {ride.driverName || "Searching..."}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate max-w-xs">
                        {ride.pickup?.address}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-[#10b982]">
                        ₦
                        {(
                          ride.finalFare ||
                          ride.estimatedFare ||
                          0
                        ).toLocaleString()}
                      </span>
                      <p className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">
                        {ride.status}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* System Audit Stream */}
          <div className="bg-[#1e293b] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <FileText size={16} className="text-[#10b982]" /> System Audit
                Stream
              </h3>
              <a
                href="/admin/audit-logs"
                className="text-xs text-[#10b982] font-semibold hover:underline"
              >
                View Audit Log
              </a>
            </div>

            <div className="space-y-3">
              {recentAuditLogs.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">
                  No audit logs logged
                </p>
              ) : (
                recentAuditLogs.map((log: any) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#10b982]">
                        {log.action}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(log.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      By <span className="font-semibold">{log.actorName}</span>{" "}
                      on {log.entity} ({log.entityId})
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
