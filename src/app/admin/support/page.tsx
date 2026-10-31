'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useModal } from '@/context/ModalContext';
import { adminApi } from '@/lib/api';
import { HelpCircle, CheckCircle, MessageSquare } from 'lucide-react';

export default function SupportCenterPage() {
  const { confirm } = useModal();
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCases = () => {
    setLoading(true);
    adminApi
      .getSupportCases()
      .then((res) => {
        setCases(res.cases || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadCases();
  }, []);

  const handleResolveCase = (cs: any) => {
    confirm({
      title: 'Resolve Support Ticket?',
      message: `Are you sure you want to resolve case #${cs.id} ("${cs.subject}") for customer ${cs.userName}?`,
      type: 'confirm',
      confirmText: 'Yes, Mark Resolved',
      onConfirm: async () => {
        await adminApi.updateSupportCase(cs.id, 'RESOLVED', 'Issue investigated and resolved by support agent');
        loadCases();
      },
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2 tracking-tight">
              <HelpCircle size={22} className="text-blue-400" /> Customer Support Center
            </h2>
            <p className="text-xs font-semibold text-slate-400">Manage user support cases, trip complaints, and inquiry resolutions</p>
          </div>
        </div>

        {/* Support Case List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center p-12 bg-[#1e293b] rounded-xl border border-slate-800">
              <div className="w-8 h-8 border-2 border-[#10b982] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : cases.length === 0 ? (
            <div className="p-8 text-center bg-[#1e293b] rounded-xl border border-slate-800 text-slate-400 text-xs">
              No open support cases.
            </div>
          ) : (
            cases.map((cs) => (
              <div key={cs.id} className="bg-[#1e293b] border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#10b982] bg-emerald-500/10 px-2.5 py-1 rounded">
                      {cs.id}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-slate-900 text-slate-300">
                      {cs.category}
                    </span>
                    <span className="text-xs font-bold text-slate-200">{cs.userName}</span>
                  </div>

                  <div>
                    {cs.status === 'OPEN' ? (
                      <button
                        onClick={() => handleResolveCase(cs)}
                        className="px-3 py-1 rounded bg-[#10b982] text-slate-950 text-xs font-bold hover:bg-emerald-400"
                      >
                        Mark Resolved
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                        <CheckCircle size={14} /> Resolved
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-slate-100">{cs.subject}</h4>
                  <p className="text-xs text-slate-300">{cs.description}</p>
                </div>

                {cs.resolutionNotes && (
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-400">
                    <strong className="text-slate-200">Resolution Notes:</strong> {cs.resolutionNotes}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
