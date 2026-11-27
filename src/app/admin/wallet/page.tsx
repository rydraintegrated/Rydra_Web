'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminApi } from '@/lib/api';
import { Wallet, CheckCircle2, Plus, ArrowUpRight, ArrowDownLeft, X } from 'lucide-react';

export default function WalletLedgerPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Manual Adjustment Modal State
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustForm, setAdjustForm] = useState({
    userId: '',
    amount: '',
    type: 'CREDIT' as 'CREDIT' | 'DEBIT',
    reason: '',
  });
  const [adjustLoading, setAdjustLoading] = useState(false);
  const [adjustError, setAdjustError] = useState('');

  const loadLedger = () => {
    setLoading(true);
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
  };

  useEffect(() => {
    loadLedger();
  }, []);

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdjustError('');
    if (!adjustForm.userId || !adjustForm.amount) {
      setAdjustError('User ID and amount are required.');
      return;
    }

    setAdjustLoading(true);
    try {
      await adminApi.adjustWalletBalance({
        userId: adjustForm.userId.trim(),
        amount: Number(adjustForm.amount),
        type: adjustForm.type,
        reason: adjustForm.reason.trim() || undefined,
      });
      setShowAdjustModal(false);
      setAdjustForm({
        userId: '',
        amount: '',
        type: 'CREDIT',
        reason: '',
      });
      loadLedger();
    } catch (err: any) {
      setAdjustError(err?.message || 'Failed to adjust wallet balance');
    } finally {
      setAdjustLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2 tracking-tight">
              <Wallet size={22} className="text-[#10b982]" /> Wallet Ledger & Financial Audit
            </h2>
            <p className="text-xs font-semibold text-slate-400">
              Immutable financial ledger records for deposits, ride deductions, manual credits, and refunds
            </p>
          </div>
          <button
            onClick={() => setShowAdjustModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#10b982] text-slate-950 font-bold text-xs hover:bg-emerald-400 shadow-sm transition-all"
          >
            <Plus size={16} /> Manual Balance Adjustment
          </button>
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

      {/* Manual Wallet Adjustment Modal */}
      {showAdjustModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1e293b] border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Wallet size={18} className="text-[#10b982]" /> Manual Wallet Adjustment
              </h3>
              <button
                onClick={() => setShowAdjustModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            {adjustError && (
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-xs font-semibold">
                {adjustError}
              </div>
            )}

            <form onSubmit={handleAdjustSubmit} className="space-y-3.5">
              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1">
                  Target User ID *
                </label>
                <input
                  type="text"
                  placeholder="e.g. usr_cust_1 or usr_driver_1"
                  value={adjustForm.userId}
                  onChange={(e) =>
                    setAdjustForm({ ...adjustForm, userId: e.target.value })
                  }
                  required
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-[#10b982]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 text-xs font-medium mb-1">
                    Adjustment Direction *
                  </label>
                  <select
                    value={adjustForm.type}
                    onChange={(e: any) =>
                      setAdjustForm({ ...adjustForm, type: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#10b982]"
                  >
                    <option value="CREDIT">CREDIT (+) User Wallet</option>
                    <option value="DEBIT">DEBIT (-) User Wallet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 text-xs font-medium mb-1">
                    Amount (₦) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 5000"
                    value={adjustForm.amount}
                    onChange={(e) =>
                      setAdjustForm({ ...adjustForm, amount: e.target.value })
                    }
                    required
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#10b982]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1">
                  Reason / Internal Audit Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Promotional settlement / Service dispute refund"
                  value={adjustForm.reason}
                  onChange={(e) =>
                    setAdjustForm({ ...adjustForm, reason: e.target.value })
                  }
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#10b982]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adjustLoading}
                  className="px-4 py-2 rounded-lg bg-[#10b982] text-slate-950 text-xs font-bold hover:bg-emerald-400 disabled:opacity-50"
                >
                  {adjustLoading ? 'Applying...' : 'Apply Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
