'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminApi } from '@/lib/api';
import { ShieldCheck, Search, Filter, Eye, Clock, UserCheck } from 'lucide-react';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedLog, setSelectedLog] = useState<any>(null);

  const loadLogs = () => {
    setLoading(true);
    adminApi
      .getAuditLogs({ search })
      .then((res) => {
        setLogs(res.auditLogs || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadLogs();
  }, [search]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2 tracking-tight">
              <ShieldCheck size={22} className="text-[#10b982]" /> System Audit Log
            </h2>
            <p className="text-xs font-semibold text-slate-400">Complete audit trail answering: "Who changed what, when, previous vs current values"</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-[#1e293b] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by actor, action, or entity..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#10b982]"
            />
          </div>
        </div>

        {/* Audit Log Table */}
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
                    <th className="px-4 py-3.5">Timestamp</th>
                    <th className="px-4 py-3.5">Actor</th>
                    <th className="px-4 py-3.5">Action</th>
                    <th className="px-4 py-3.5">Target Entity</th>
                    <th className="px-4 py-3.5">IP Address</th>
                    <th className="px-4 py-3.5 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3.5 text-slate-400 text-[11px] font-mono">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 font-medium text-slate-200">
                        <p className="font-semibold text-slate-100">{log.actorName}</p>
                        <p className="text-[10px] text-[#10b982] font-semibold">{log.actorRole}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-slate-900 text-[#10b982] border border-[#10b982]/20">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-300">
                        <span className="font-semibold text-slate-200">{log.entity}</span> ({log.entityId})
                      </td>
                      <td className="px-4 py-3.5 text-slate-400 font-mono text-[11px]">{log.ipAddress || '127.0.0.1'}</td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center gap-1 ml-auto"
                        >
                          <Eye size={12} /> Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Audit Log Inspection Modal */}
        {selectedLog && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-[#10b982]" /> Audit Inspection
                </h3>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-slate-400 hover:text-slate-100 font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <p className="text-slate-400">Action Name:</p>
                  <p className="font-mono text-sm font-extrabold text-[#10b982]">{selectedLog.action}</p>
                </div>
                <div>
                  <p className="text-slate-400">Actor Account:</p>
                  <p className="font-semibold text-slate-200">
                    {selectedLog.actorName} ({selectedLog.actorRole}) - {selectedLog.actorId}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
                    <p className="text-[10px] font-bold uppercase text-rose-400 mb-1">Previous State</p>
                    <pre className="text-[11px] font-mono text-rose-200 whitespace-pre-wrap">
                      {JSON.stringify(selectedLog.previousValue || 'None', null, 2)}
                    </pre>
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-[10px] font-bold uppercase text-emerald-400 mb-1">New State</p>
                    <pre className="text-[11px] font-mono text-emerald-200 whitespace-pre-wrap">
                      {JSON.stringify(selectedLog.newValue || 'None', null, 2)}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => setSelectedLog(null)}
                  className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
