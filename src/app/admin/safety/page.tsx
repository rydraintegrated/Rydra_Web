'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useModal } from '@/context/ModalContext';
import { adminApi } from '@/lib/api';
import { AlertTriangle, ShieldCheck, MapPin, CheckCircle } from 'lucide-react';

export default function SafetyDeskPage() {
  const { confirm } = useModal();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAlerts = () => {
    setLoading(true);
    adminApi
      .getSafetyAlerts()
      .then((res) => {
        setAlerts(res.alerts || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleResolveAlert = (alert: any) => {
    confirm({
      title: 'Resolve Safety Incident?',
      message: `Are you sure you want to resolve the ${alert.type} alert for ${alert.userName}? Confirm that the customer and emergency contacts have been reached safely.`,
      type: 'warning',
      confirmText: 'Yes, Resolve Alert',
      onConfirm: async () => {
        await adminApi.updateSafetyAlert(alert.id, 'RESOLVED', 'Resolved by Super Admin Safety Desk');
        loadAlerts();
      },
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2 tracking-tight">
              <AlertTriangle size={22} className="text-amber-400" /> Safety & Emergency Operations Desk
            </h2>
            <p className="text-xs font-semibold text-slate-400">Live SOS emergency alerts, trip safety monitoring, and incident management</p>
          </div>
        </div>

        {/* Safety Alerts List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center p-12 bg-[#1e293b] rounded-xl border border-slate-800">
              <div className="w-8 h-8 border-2 border-[#10b982] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : alerts.length === 0 ? (
            <div className="p-8 text-center bg-[#1e293b] rounded-xl border border-slate-800 text-slate-400 text-xs">
              No safety or SOS alerts reported.
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`bg-[#1e293b] border rounded-xl p-5 shadow-sm space-y-3 ${
                  alert.status === 'ACTIVE' ? 'border-amber-500/50 bg-amber-500/5' : 'border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded text-xs font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {alert.type} ALERT
                    </span>
                    <span className="text-xs font-semibold text-slate-200">{alert.userName}</span>
                    <span className="text-[11px] text-slate-400">Trip: {alert.tripId || 'N/A'}</span>
                  </div>

                  <div>
                    {alert.status === 'ACTIVE' ? (
                      <button
                        onClick={() => handleResolveAlert(alert)}
                        className="px-3 py-1 rounded-lg bg-[#10b982] text-slate-950 text-xs font-bold shadow hover:bg-emerald-400 transition-colors"
                      >
                        Resolve SOS Alert
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                        <CheckCircle size={14} /> Resolved
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-300 font-medium">{alert.notes || 'Emergency triggered by user during trip'}</p>

                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/60">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} className="text-[#10b982]" /> Coordinates: {alert.lat || 7.625}, {alert.lng || 5.228}
                  </span>
                  <span>Triggered at: {new Date(alert.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
