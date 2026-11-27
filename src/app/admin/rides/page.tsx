"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useModal } from "@/context/ModalContext";
import { adminApi } from "@/lib/api";
import {
  MapPin,
  Navigation,
  RefreshCw,
  Ban,
  X,
  AlertTriangle,
} from "lucide-react";

export default function RidesManagementPage() {
  const { confirm } = useModal();
  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  // Cancel ride modal
  const [cancellingRide, setCancellingRide] = useState<any>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [submittingCancel, setSubmittingCancel] = useState(false);

  const loadRides = () => {
    setLoading(true);
    adminApi
      .getRides({ status: statusFilter })
      .then((res) => {
        setRides(res.rides || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadRides();
  }, [statusFilter]);

  const handleAdminCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancellingRide) return;

    setSubmittingCancel(true);
    try {
      await adminApi.cancelRide(
        cancellingRide.id,
        cancelReason || "Cancelled by admin dispatcher"
      );
      setCancellingRide(null);
      setCancelReason("");
      loadRides();
    } catch (err: any) {
      alert(err?.message || "Failed to cancel ride");
    } finally {
      setSubmittingCancel(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2 tracking-tight">
              <MapPin size={22} className="text-[#10b982]" /> Rides & Trip Operations
            </h2>
            <p className="text-xs font-semibold text-slate-400">
              Monitor live trips, inspect fare breakdowns, and audit route parameters
            </p>
          </div>
          <button
            onClick={loadRides}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-slate-100 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* Status Filter tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-[#1e293b] p-3 rounded-xl border border-slate-800">
          {[
            "",
            "SEARCHING",
            "ASSIGNED",
            "ARRIVING",
            "ARRIVED",
            "STARTED",
            "IN_PROGRESS",
            "COMPLETED",
            "CANCELLED",
          ].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === st
                  ? "bg-[#10b982] text-slate-950 shadow-sm"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200"
              }`}
            >
              {st === "" ? "All Trips" : st}
            </button>
          ))}
        </div>

        {/* Rides List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center p-12 bg-[#1e293b] rounded-xl border border-slate-800">
              <div className="w-8 h-8 border-2 border-[#10b982] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : rides.length === 0 ? (
            <div className="p-8 text-center bg-[#1e293b] rounded-xl border border-slate-800 text-slate-400 text-xs">
              No rides match the selected filter.
            </div>
          ) : (
            rides.map((ride) => {
              const canCancel =
                ride.status !== "COMPLETED" && ride.status !== "CANCELLED";

              return (
                <div
                  key={ride.id}
                  className="bg-[#1e293b] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-extrabold text-[#10b982] bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                        {ride.id}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-700">
                        {ride.vehicleCategory}
                      </span>
                      <span
                        className={`text-xs font-extrabold uppercase px-2.5 py-1 rounded ${
                          ride.status === "COMPLETED"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : ride.status === "CANCELLED"
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {ride.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-base font-extrabold text-[#10b982]">
                          ₦
                          {(
                            ride.finalFare ||
                            ride.estimatedFare ||
                            0
                          ).toLocaleString()}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                          Payment: {ride.paymentMethod} ({ride.paymentStatus})
                        </span>
                      </div>

                      {canCancel && (
                        <button
                          onClick={() => {
                            setCancellingRide(ride);
                            setCancelReason("");
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-bold transition-colors"
                        >
                          <Ban size={13} /> Cancel Trip
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Pickup & Dropoff Route Detail */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-900/60 p-3.5 rounded-lg border border-slate-800/80">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                        <MapPin size={12} /> Pickup Location
                      </p>
                      <p className="font-medium text-slate-200">
                        {ride.pickup?.address}
                      </p>
                      {ride.pickup?.landmark && (
                        <p className="text-[11px] text-slate-400">
                          Landmark: {ride.pickup.landmark}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-rose-400 flex items-center gap-1">
                        <Navigation size={12} /> Destination Dropoff
                      </p>
                      <p className="font-medium text-slate-200">
                        {ride.dropoff?.address}
                      </p>
                    </div>
                  </div>

                  {/* Cancellation Reason if cancelled */}
                  {ride.cancellationReason && (
                    <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-xs">
                      <strong>Cancellation Reason:</strong> {ride.cancellationReason}
                    </div>
                  )}

                  {/* Parties Involved & Fare Breakdown */}
                  <div className="flex flex-wrap justify-between items-center text-xs text-slate-400 pt-1">
                    <div>
                      <span>
                        Customer:{" "}
                        <strong className="text-slate-200">
                          {ride.customerName || ride.customerId}
                        </strong>
                      </span>
                      <span className="mx-2">•</span>
                      <span>
                        Driver:{" "}
                        <strong className="text-slate-200">
                          {ride.driverName || "Unassigned"}
                        </strong>
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Created: {new Date(ride.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Admin Cancel Ride Modal */}
      {cancellingRide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1e293b] border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-rose-400 flex items-center gap-2">
                <AlertTriangle size={18} /> Administrative Trip Cancellation
              </h3>
              <button
                onClick={() => setCancellingRide(null)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              You are about to cancel trip <span className="font-mono font-bold text-slate-100">{cancellingRide.id}</span>. If a driver is assigned, their status will be restored to available.
            </p>

            <form onSubmit={handleAdminCancelSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1">
                  Reason for Cancellation *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Passenger vehicle breakdown / Operational route intervention"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-rose-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCancellingRide(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Dismiss
                </button>
                <button
                  type="submit"
                  disabled={submittingCancel}
                  className="px-4 py-2 rounded-lg bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 disabled:opacity-50"
                >
                  {submittingCancel ? "Cancelling..." : "Confirm Cancellation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
