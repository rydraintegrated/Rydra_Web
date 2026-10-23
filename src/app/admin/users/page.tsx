"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminApi } from "@/lib/api";
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  UserX,
} from "lucide-react";

export default function UsersManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const loadUsers = () => {
    setLoading(true);
    adminApi
      .getUsers({ search, role: roleFilter, status: statusFilter })
      .then((res) => {
        setUsers(res.users || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadUsers();
  }, [search, roleFilter, statusFilter]);

  const handleToggleStatus = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    adminApi.updateUserStatus(userId, newStatus).then(() => {
      loadUsers();
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2 tracking-tight">
              <Users size={22} className="text-[#10b982]" /> User Accounts
              Management
            </h2>
            <p className="text-xs font-semibold text-slate-400">
              View and manage registered customers, riders, and administrators
            </p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-[#1e293b] border border-slate-800 rounded-xl p-4 flex flex-wrap gap-4 items-center justify-between">
          <div className="relative flex-1 min-w-[240px]">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by name, phone, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#10b982]"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#10b982]"
            >
              <option value="">All Roles</option>
              <option value="CUSTOMER">Customer</option>
              <option value="DRIVER">Driver</option>
              <option value="ADMIN">Admin</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#10b982]"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-[#1e293b] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="w-8 h-8 border-2 border-[#10b982] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                    <th className="px-4 py-3.5">User</th>
                    <th className="px-4 py-3.5">Contact Details</th>
                    <th className="px-4 py-3.5">Role</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Rating</th>
                    <th className="px-4 py-3.5">Joined Date</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-4 py-3.5 font-medium text-slate-100 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-700 text-[#10b982] flex items-center justify-center font-bold shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-200">
                            {user.name}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {user.id}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-slate-200 font-medium">
                          {user.phone}
                        </p>
                        <p className="text-slate-400 text-[11px]">
                          {user.email || "No email"}
                        </p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-900 text-[#10b982] border border-[#10b982]/20">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        {user.status === "ACTIVE" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 size={12} /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            <UserX size={12} /> Suspended
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-amber-400 font-semibold">
                        ★ {user.rating ? user.rating.toFixed(1) : "5.0"}
                      </td>
                      <td className="px-4 py-3.5 text-slate-400 text-[11px]">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        {user.role !== "SUPER_ADMIN" && (
                          <button
                            onClick={() =>
                              handleToggleStatus(user.id, user.status)
                            }
                            className={`px-3 py-1 rounded text-[11px] font-semibold transition-colors ${
                              user.status === "ACTIVE"
                                ? "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30"
                                : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30"
                            }`}
                          >
                            {user.status === "ACTIVE"
                              ? "Suspend"
                              : "Reactivate"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
