'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Modal from '@/components/ui/Modal';
import { useModal } from '@/context/ModalContext';
import { adminApi } from '@/lib/api';
import {
  Car,
  ShieldCheck,
  ShieldAlert,
  CheckCircle,
  XCircle,
  Clock,
  FileCheck,
  Eye,
  User,
  CreditCard,
} from 'lucide-react';

export default function DriversVerificationPage() {
  const { confirm } = useModal();
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [inspectDriver, setInspectDriver] = useState<any>(null);

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

  const handleUpdateVerification = (driver: any, newStatus: string) => {
    const isApprove = newStatus === 'APPROVED';
    confirm({
      title: isApprove
        ? `Approve ${driver.user?.name || 'Driver'}?`
        : `Reject ${driver.user?.name || 'Driver'}?`,
      message: isApprove
        ? `This driver will be authorized to go online, accept rides, and operate under Rydra.`
        : `This driver will be rejected and prevented from accepting rides.`,
      type: isApprove ? 'success' : 'danger',
      confirmText: isApprove ? 'Yes, Approve Driver' : 'Yes, Reject Driver',
      onConfirm: async () => {
        await adminApi.updateDriverVerification(driver.id, newStatus);
        if (inspectDriver?.id === driver.id) {
          setInspectDriver(null);
        }
        loadDrivers();
      },
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
            <p className="text-xs font-semibold text-slate-400">
              Review NIN & Driver License verification, fleet categories, and status
            </p>
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
                          <button
                            onClick={() => setInspectDriver(drv)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold inline-flex items-center gap-1"
                          >
                            <Eye size={12} /> Inspect
                          </button>
                          {drv.verificationStatus !== 'APPROVED' && (
                            <button
                              onClick={() => handleUpdateVerification(drv, 'APPROVED')}
                              className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 font-semibold"
                            >
                              Approve
                            </button>
                          )}
                          {drv.verificationStatus !== 'REJECTED' && (
                            <button
                              onClick={() => handleUpdateVerification(drv, 'REJECTED')}
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

        {/* Custom Driver Inspection Modal */}
        <Modal
          isOpen={inspectDriver !== null}
          onClose={() => setInspectDriver(null)}
          title="Driver Verification Profile"
          description={inspectDriver?.user?.name || 'Driver details'}
          icon={<Car size={20} className="text-[#10b982]" />}
          maxWidth="lg"
          footer={
            <div className="flex items-center justify-between w-full">
              <button
                onClick={() => setInspectDriver(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors"
              >
                Close
              </button>
              {inspectDriver && (
                <div className="flex items-center gap-2">
                  {inspectDriver.verificationStatus !== 'APPROVED' && (
                    <button
                      onClick={() => handleUpdateVerification(inspectDriver, 'APPROVED')}
                      className="px-4 py-2 rounded-xl bg-[#10b982] hover:bg-emerald-600 text-xs font-bold text-white transition-colors"
                    >
                      Approve Driver
                    </button>
                  )}
                  {inspectDriver.verificationStatus !== 'REJECTED' && (
                    <button
                      onClick={() => handleUpdateVerification(inspectDriver, 'REJECTED')}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white transition-colors"
                    >
                      Reject Driver
                    </button>
                  )}
                </div>
              )}
            </div>
          }
        >
          {inspectDriver && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-slate-400 text-[11px]">Driver Name</p>
                  <p className="font-bold text-slate-100 text-sm">{inspectDriver.user?.name}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[11px]">Phone</p>
                  <p className="font-medium text-slate-200">{inspectDriver.user?.phone}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[11px]">Vehicle Category</p>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#10b982]/10 text-[#10b982] border border-[#10b982]/20">
                    {inspectDriver.vehicleCategory}
                  </span>
                </div>
                <div>
                  <p className="text-slate-400 text-[11px]">License Plate</p>
                  <p className="font-mono font-bold text-slate-100 text-sm tracking-wider">{inspectDriver.plateNumber}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <CreditCard size={14} className="text-[#10b982]" /> Government Identification
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-slate-500 text-[10px]">National Identity Number (NIN)</p>
                    <p className="font-mono font-semibold text-slate-200">{inspectDriver.ninNumber}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-[10px]">Driver License Number</p>
                    <p className="font-mono font-semibold text-slate-200">{inspectDriver.licenseNumber}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-slate-400 text-[10px]">Vehicle</p>
                  <p className="font-bold text-slate-200">{inspectDriver.vehicleMake} {inspectDriver.vehicleModel}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px]">Color</p>
                  <p className="font-bold text-slate-200">{inspectDriver.vehicleColor}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px]">Total Trips</p>
                  <p className="font-bold text-[#10b982]">{inspectDriver.totalTrips || 0}</p>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
}
