'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminApi } from '@/lib/api';
import { Car, ShieldCheck, ShieldAlert, CheckCircle, XCircle, Clock, FileCheck } from 'lucide-react';

export default function DriversVerificationPage() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const loadDrivers = () => {
    setLoading(true);
    adminApi
      .getDrivers({ status: statusFilter })
      .then((res) => {
        setDrivers(res.drivers || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadDrivers();
  }, [statusFilter]);

  const handleUpdateVerification = (driverId: string, status: string) => {
    adminApi.updateDriverVerification(driverId, status).then(() => {
      loadDrivers();
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2 tracking-tight">
              <Car size={22} className="text-[#10b982]" /> Drivers & Fleet Operations
            </h2>
            <p className="text-xs font-semibold text-slate-400">Review NIN & Driver License verification, fleet categories, and status</p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-[#1e293b] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <FileCheck size={16} className="text-[#10b982]" /> Verification Status:
          </div>
          <div className="flex items-center gap-2">
            {['', 'PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === st
                    ? 'bg-[#10b982] text-slate-950 shadow-md shadow-[#10b982]/20'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                {st === '' ? 'All Drivers' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Drivers Grid / Table */}
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
                    <th className="px-4 py-3.5">Driver & Vehicle</th>
                    <th className="px-4 py-3.5">Category</th>
                    <th className="px-4 py-3.5">Plate Number</th>
                    <th className="px-4 py-3.5">NIN & License</th>
                    <th className="px-4 py-3.5">Verification</th>
                    <th className="px-4 py-3.5">Total Trips</th>
                    <th className="px-4 py-3.5 text-right">Verification Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {drivers.map((drv) => (
                    <tr key={drv.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-slate-200 text-sm">{drv.user?.name || 'Driver'}</p>
                        <p className="text-[11px] text-slate-400">
                          {drv.vehicleMake} {drv.vehicleModel} ({drv.vehicleColor})
                        </p>
                        <p className="text-[10px] text-slate-500">{drv.user?.phone}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-slate-900 text-[#10b982] border border-[#10b982]/30">
                          {drv.vehicleCategory}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-bold tracking-wider text-slate-200">{drv.plateNumber}</td>
                      <td className="px-4 py-3.5 text-slate-300 font-mono text-[11px]">
                        <p>NIN: {drv.ninNumber}</p>
                        <p className="text-slate-400 text-[10px]">Lic: {drv.licenseNumber}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        {drv.verificationStatus === 'APPROVED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle size={12} /> Approved
                          </span>
                        )}
                        {drv.verificationStatus === 'PENDING' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <Clock size={12} /> Pending Review
                          </span>
                        )}
                        {drv.verificationStatus === 'REJECTED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            <XCircle size={12} /> Rejected
                          </span>
                        )}
                        {drv.verificationStatus === 'SUSPENDED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            <ShieldAlert size={12} /> Suspended
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-slate-200">{drv.totalTrips || 0}</td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {drv.verificationStatus !== 'APPROVED' && (
                            <button
                              onClick={() => handleUpdateVerification(drv.id, 'APPROVED')}
                              className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 font-semibold"
                            >
                              Approve
                            </button>
                          )}
                          {drv.verificationStatus !== 'REJECTED' && (
                            <button
                              onClick={() => handleUpdateVerification(drv.id, 'REJECTED')}
                              className="px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 font-semibold"
                            >
                              Reject
                            </button>
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
    </AdminLayout>
  );
}
