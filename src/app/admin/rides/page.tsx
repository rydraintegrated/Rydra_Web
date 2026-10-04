'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminApi } from '@/lib/api';
import { MapPin, Navigation, DollarSign, Calendar, RefreshCw } from 'lucide-react';

export default function RidesManagementPage() {
  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2 tracking-tight">
              <MapPin size={22} className="text-[#10b982]" /> Rides & Trip Operations
            </h2>
            <p className="text-xs font-semibold text-slate-400">Monitor live trips, inspect fare breakdowns, and audit route parameters</p>
          </div>
          <button
            onClick={loadRides}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-slate-100 text-xs font-semibold border border-slate-700"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* Status Filter tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-[#1e293b] p-3 rounded-xl border border-slate-800">
          {['', 'SEARCHING', 'ASSIGNED', 'ARRIVING', 'ARRIVED', 'STARTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-[#10b982] text-slate-950 shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {st === '' ? 'All Trips' : st}
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
            rides.map((ride) => (
              <div key={ride.id} className="bg-[#1e293b] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-extrabold text-[#10b982] bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                      {ride.id}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-700">
                      {ride.vehicleCategory}
                    </span>
                    <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded bg-slate-800 text-amber-400">
                      {ride.status}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-extrabold text-[#10b982]">
                      ₦{(ride.finalFare || ride.estimatedFare || 0).toLocaleString()}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                      Payment: {ride.paymentMethod} ({ride.paymentStatus})
                    </span>
                  </div>
                </div>

                {/* Pickup & Dropoff Route Detail */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-900/60 p-3.5 rounded-lg border border-slate-800/80">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                      <MapPin size={12} /> Pickup Location
                    </p>
                    <p className="font-medium text-slate-200">{ride.pickup?.address}</p>
                    {ride.pickup?.landmark && (
                      <p className="text-[11px] text-slate-400">Landmark: {ride.pickup.landmark}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-rose-400 flex items-center gap-1">
                      <Navigation size={12} /> Destination Dropoff
                    </p>
                    <p className="font-medium text-slate-200">{ride.dropoff?.address}</p>
                  </div>
                </div>

                {/* Parties Involved & Fare Breakdown */}
                <div className="flex flex-wrap justify-between items-center text-xs text-slate-400 pt-1">
                  <div>
                    <span>Customer: <strong className="text-slate-200">{ride.customerName || ride.customerId}</strong></span>
                    <span className="mx-2">•</span>
                    <span>Driver: <strong className="text-slate-200">{ride.driverName || 'Unassigned'}</strong></span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Created: {new Date(ride.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
