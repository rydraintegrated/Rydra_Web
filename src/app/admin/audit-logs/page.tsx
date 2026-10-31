'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Modal from '@/components/ui/Modal';
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
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 w-72">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search actions or entities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none w-full"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#1e293b] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/60 border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Actor</th>
                <th className="p-4">Action</th>
                <th className="p-4">Target Entity</th>
                <th className="p-4">Client IP</th>
                <th className="p-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500">
                    Loading audit trail...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500">
                    No audit records logged yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40">
                    <td className="p-4 font-mono text-[11px] text-slate-400">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <UserCheck size={14} className="text-[#10b982]" />
                        <span className="font-semibold text-slate-200">{log.actorName || 'System'}</span>
                        <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                          {log.actorRole}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-mono font-bold text-[#10b982] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-[11px]">
                      {log.entity} #{log.entityId}
                    </td>
                    <td className="p-4 font-mono text-[11px] text-slate-400">{log.ipAddress || '127.0.0.1'}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-[11px]"
                      >
                        <Eye size={12} /> Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Custom Rydra Audit Log Inspection Modal */}
        <Modal
          isOpen={selectedLog !== null}
          onClose={() => setSelectedLog(null)}
          title="Audit Trail Inspection"
          description={selectedLog ? `Entity #${selectedLog.entityId} (${selectedLog.entity})` : undefined}
          icon={<ShieldCheck size={20} className="text-[#10b982]" />}
          maxWidth="lg"
          footer={
            <button
              onClick={() => setSelectedLog(null)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors"
            >
              Close
            </button>
          }
        >
          {selectedLog && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                <div>
                  <p className="text-slate-400 text-[11px]">Action</p>
                  <p className="font-mono text-sm font-extrabold text-[#10b982]">{selectedLog.action}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[11px]">Timestamp</p>
                  <p className="font-mono text-xs text-slate-200">{new Date(selectedLog.createdAt).toLocaleString()}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-slate-400 text-[11px]">Actor</p>
                  <p className="font-semibold text-slate-200">
                    {selectedLog.actorName} ({selectedLog.actorRole}) - <span className="font-mono text-slate-400">{selectedLog.actorId}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <p className="text-[10px] font-bold uppercase text-rose-400 mb-1.5 flex items-center gap-1">
                    Previous State
                  </p>
                  <pre className="text-[11px] font-mono text-rose-200 whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {JSON.stringify(selectedLog.previousValue || 'None', null, 2)}
                  </pre>
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-[10px] font-bold uppercase text-emerald-400 mb-1.5 flex items-center gap-1">
                    New State
                  </p>
                  <pre className="text-[11px] font-mono text-emerald-200 whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {JSON.stringify(selectedLog.newValue || 'None', null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
}
