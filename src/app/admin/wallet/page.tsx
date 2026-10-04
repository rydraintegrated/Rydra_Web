'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminApi } from '@/lib/api';
import { Wallet, ArrowUpRight, ArrowDownLeft, CheckCircle2, FileSpreadsheet } from 'lucide-react';

export default function WalletLedgerPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getWalletLedger()
      .then((res) => {
        setTransactions(res.transactions || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2 tracking-tight">
              <Wallet size={22} className="text-[#10b982]" /> Wallet Ledger & Audit
            </h2>
            <p className="text-xs font-semibold text-slate-400">Immutable financial ledger records for deposits, ride deductions, and refunds</p>
          </div>
        </div>

        {/* Ledger Table */}
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
                    <th className="px-4 py-3.5">Transaction Ref</th>
                    <th className="px-4 py-3.5">User ID</th>
                    <th className="px-4 py-3.5">Type</th>
                    <th className="px-4 py-3.5">Amount</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Description</th>
                    <th className="px-4 py-3.5">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3.5 font-mono text-[#10b982] font-semibold">{tx.reference}</td>
                      <td className="px-4 py-3.5 font-medium text-slate-200">{tx.userId}</td>
                      <td className="px-4 py-3.5">
                        <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-slate-900 text-slate-200 border border-slate-700">
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-extrabold text-slate-100">
                        ₦{tx.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 size={12} /> {tx.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-300">{tx.description}</td>
                      <td className="px-4 py-3.5 text-slate-400 text-[11px]">
                        {new Date(tx.createdAt).toLocaleString()}
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
