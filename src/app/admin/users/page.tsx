"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useModal } from "@/context/ModalContext";
import { adminApi } from "@/lib/api";
import { getMediaUrl } from "@/lib/mediaApi";
import {
  Users,
  Search,
  CheckCircle2,
  UserX,
  Trash2,
  Plus,
  Eye,
  Shield,
  Wallet,
  X,
} from "lucide-react";

export default function UsersManagementPage() {
  const { confirm } = useModal();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Create User Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    phone: "",
    email: "",
    role: "CUSTOMER",
    status: "ACTIVE",
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  // View Details Modal State
  const [selectedUserDetail, setSelectedUserDetail] = useState<any>(null);

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

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    if (!createForm.name || !createForm.phone) {
      setCreateError("Name and phone number are required.");
      return;
    }
    setCreateLoading(true);
    try {
      await adminApi.createUser(createForm);
      setShowCreateModal(false);
      setCreateForm({
        name: "",
        phone: "",
        email: "",
        role: "CUSTOMER",
        status: "ACTIVE",
      });
      loadUsers();
    } catch (err: any) {
      setCreateError(err?.message || "Failed to create user account");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleInspectUser = async (userId: string) => {
    setSelectedUserDetail(null);
    try {
      const data = await adminApi.getUserDetails(userId);
      setSelectedUserDetail(data);
    } catch (err: any) {
      alert(err?.message || "Failed to load user profile details");
    }
  };

  const handleChangeRole = (user: any, newRole: string) => {
    if (user.role === newRole) return;
    confirm({
      title: `Change role for ${user.name}?`,
      message: `Are you sure you want to change ${user.name}'s role from ${user.role} to ${newRole}? This affects access permissions immediately.`,
      type: "warning",
      confirmText: `Confirm Role: ${newRole}`,
      onConfirm: async () => {
        try {
          await adminApi.updateUserRole(user.id, newRole);
          loadUsers();
        } catch (err: any) {
          alert(err?.message || "Failed to update role");
        }
      },
    });
  };

  const handleDeleteUser = (user: any) => {
    confirm({
      title: `Permanently Delete ${user.name}?`,
      message: `Are you sure you want to delete ${user.name} (${user.phone})? This will permanently remove their user record, credentials, and associated driver or rider profiles from the system. This action cannot be undone.`,
      type: "danger",
      confirmText: "Yes, Delete User",
      onConfirm: async () => {
        try {
          await adminApi.deleteUser(user.id);
          loadUsers();
        } catch (err: any) {
          alert(err?.message || "Failed to delete user");
        }
      },
    });
  };

  const handleToggleStatus = (user: any) => {
    const isSuspending = user.status === "ACTIVE";
    const newStatus = isSuspending ? "SUSPENDED" : "ACTIVE";

    confirm({
      title: isSuspending ? `Suspend ${user.name}?` : `Reactivate ${user.name}?`,
      message: isSuspending
        ? `This will immediately block ${user.name} (${user.phone}) from logging in, booking rides, or accessing Rydra services.`
        : `This will restore platform access and permissions for ${user.name} (${user.phone}).`,
      type: isSuspending ? "danger" : "warning",
      confirmText: isSuspending ? "Yes, Suspend Account" : "Yes, Reactivate",
      onConfirm: async () => {
        await adminApi.updateUserStatus(user.id, newStatus);
        loadUsers();
      },
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2 tracking-tight">
              <Users size={22} className="text-[#10b982]" /> User Accounts Management
            </h2>
            <p className="text-xs font-semibold text-slate-400">
              View, provision, and manage registered customers, drivers, and administrators
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#10b982] text-slate-950 font-bold text-xs hover:bg-emerald-400 shadow-sm transition-all"
          >
            <Plus size={16} /> Create User / Admin
          </button>
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
              <option value="UNVERIFIED">Unverified</option>
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
                        <div className="w-8 h-8 rounded-full bg-slate-700 text-[#10b982] flex items-center justify-center font-bold shrink-0 overflow-hidden border border-slate-700">
                          {user.photoUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={getMediaUrl(user.photoUrl)}
                              alt={user.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            user.name.charAt(0)
                          )}
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
                        {user.role === "SUPER_ADMIN" ? (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            SUPER ADMIN
                          </span>
                        ) : (
                          <select
                            value={user.role}
                            onChange={(e) => handleChangeRole(user, e.target.value)}
                            className="bg-slate-900 border border-slate-700/80 rounded px-2 py-0.5 text-[11px] font-semibold text-[#10b982] focus:outline-none focus:border-[#10b982]"
                          >
                            <option value="CUSTOMER">CUSTOMER</option>
                            <option value="DRIVER">DRIVER</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        {user.status === "ACTIVE" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 size={12} /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            <UserX size={12} /> {user.status}
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
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleInspectUser(user.id)}
                            title="Inspect Profile & Wallet"
                            className="p-1.5 rounded text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                          >
                            <Eye size={13} />
                          </button>

                          {user.role !== "SUPER_ADMIN" && (
                            <>
                              <button
                                onClick={() => handleToggleStatus(user)}
                                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                                  user.status === "ACTIVE"
                                    ? "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30"
                                    : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30"
                                }`}
                              >
                                {user.status === "ACTIVE"
                                  ? "Suspend"
                                  : "Reactivate"}
                              </button>

                              <button
                                onClick={() => handleDeleteUser(user)}
                                title="Delete user"
                                className="p-1.5 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 border border-rose-500/30 transition-colors"
                              >
                                <Trash2 size={13} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create User / Admin Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1e293b] border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Users size={18} className="text-[#10b982]" /> Provision New User Account
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            {createError && (
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-xs font-semibold">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Samuel Adeyemi"
                  value={createForm.name}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, name: e.target.value })
                  }
                  required
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#10b982]"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1">
                  Phone Number (E.164) *
                </label>
                <input
                  type="text"
                  placeholder="e.g. +2348012345678"
                  value={createForm.phone}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, phone: e.target.value })
                  }
                  required
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#10b982]"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. user@rydra.ng"
                  value={createForm.email}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, email: e.target.value })
                  }
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#10b982]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 text-xs font-medium mb-1">
                    System Role
                  </label>
                  <select
                    value={createForm.role}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, role: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#10b982]"
                  >
                    <option value="CUSTOMER">CUSTOMER</option>
                    <option value="DRIVER">DRIVER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 text-xs font-medium mb-1">
                    Account Status
                  </label>
                  <select
                    value={createForm.status}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, status: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#10b982]"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="UNVERIFIED">UNVERIFIED</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-4 py-2 rounded-lg bg-[#10b982] text-slate-950 text-xs font-bold hover:bg-emerald-400 disabled:opacity-50"
                >
                  {createLoading ? "Creating..." : "Save Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Details & Wallet Modal */}
      {selectedUserDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1e293b] border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Shield size={18} className="text-[#10b982]" /> User Profile & Wallet Details
              </h3>
              <button
                onClick={() => setSelectedUserDetail(null)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Name:</span>
                  <span className="text-slate-100 font-bold">{selectedUserDetail.user?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Phone:</span>
                  <span className="text-slate-200 font-mono">{selectedUserDetail.user?.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Email:</span>
                  <span className="text-slate-200">{selectedUserDetail.user?.email || "None"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Role:</span>
                  <span className="text-[#10b982] font-extrabold">{selectedUserDetail.user?.role}</span>
                </div>
              </div>

              {/* Wallet overview */}
              <div className="bg-[#10b982]/10 border border-[#10b982]/20 p-3.5 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet size={18} className="text-[#10b982]" />
                  <span className="text-slate-200 font-semibold">Wallet Balance</span>
                </div>
                <span className="text-base font-extrabold text-[#10b982]">
                  ₦{(selectedUserDetail.wallet?.balance || 0).toLocaleString()}
                </span>
              </div>

              {/* Driver info if available */}
              {selectedUserDetail.driverProfile && (
                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                  <p className="text-[11px] uppercase font-bold text-slate-400">Driver Profile</p>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Vehicle:</span>
                    <span className="text-slate-200 font-medium">
                      {selectedUserDetail.driverProfile.vehicleCategory} - {selectedUserDetail.driverProfile.vehicleMake} {selectedUserDetail.driverProfile.vehicleModel} ({selectedUserDetail.driverProfile.plateNumber})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Verification:</span>
                    <span className="text-emerald-400 font-bold">{selectedUserDetail.driverProfile.verificationStatus}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Trips Completed:</span>
                    <span className="text-slate-200 font-bold">{selectedUserDetail.driverProfile.totalTrips || 0}</span>
                  </div>
                </div>
              )}

              {/* Recent activity */}
              <div>
                <p className="text-[11px] uppercase font-bold text-slate-400 mb-1.5">Recent Trips ({selectedUserDetail.recentRides?.length || 0})</p>
                {selectedUserDetail.recentRides?.length === 0 ? (
                  <p className="text-slate-500 italic">No recorded rides for this user.</p>
                ) : (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {selectedUserDetail.recentRides?.map((r: any) => (
                      <div key={r.id} className="bg-slate-900/60 p-2 rounded border border-slate-800/80 flex justify-between items-center text-[11px]">
                        <div>
                          <span className="font-mono text-[#10b982] font-semibold">{r.id}</span>
                          <span className="text-slate-400 mx-1.5">•</span>
                          <span className="text-slate-300">{r.pickup?.address?.split(',')[0]} → {r.dropoff?.address?.split(',')[0]}</span>
                        </div>
                        <span className="font-bold text-slate-200">₦{(r.finalFare || r.estimatedFare || 0).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedUserDetail(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
