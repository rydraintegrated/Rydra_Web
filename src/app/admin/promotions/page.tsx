'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useModal } from '@/context/ModalContext';
import { adminApi } from '@/lib/api';
import { Tag, Plus, Trash2, Power, CheckCircle, Clock } from 'lucide-react';

export default function PromotionsPage() {
  const { confirm } = useModal();
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [value, setValue] = useState('');
  const [maxDiscount, setMaxDiscount] = useState('');

  const loadPromos = () => {
    setLoading(true);
    adminApi
      .getPromotions()
      .then((res) => {
        // Unique promotions by id
        const map = new Map<string, any>();
        (res.promotions || []).forEach((p: any) => {
          if (p.id) map.set(p.id, p);
        });
        setPromotions(Array.from(map.values()));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadPromos();
  }, []);

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !value) return;

    adminApi
      .createPromotion({
        code: code.trim().toUpperCase(),
        discountType,
        value: Number(value),
        maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
      })
      .then(() => {
        setCode('');
        setValue('');
        setMaxDiscount('');
        loadPromos();
      })
      .catch((err) => {
        alert(err?.message || 'Failed to create promotion');
      });
  };

  const handleDeletePromo = (p: any) => {
    confirm({
      title: `Delete Promotion ${p.code}?`,
      message: `Are you sure you want to permanently delete discount voucher code ${p.code}? Users will no longer be able to redeem this code.`,
      type: 'danger',
      confirmText: 'Yes, Delete Code',
      onConfirm: async () => {
        try {
          await adminApi.deletePromotion(p.id);
          loadPromos();
        } catch (err: any) {
          alert(err?.message || 'Failed to delete promotion');
        }
      },
    });
  };

  const handleToggleStatus = async (p: any) => {
    try {
      await adminApi.togglePromotionStatus(p.id, !p.active);
      loadPromos();
    } catch (err: any) {
      alert(err?.message || 'Failed to update promotion status');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2 tracking-tight">
              <Tag size={22} className="text-[#10b982]" /> Promotions & Referral Engine
            </h2>
            <p className="text-xs font-semibold text-slate-400">
              Manage promotional discount codes, validity windows, and referral reward rules
            </p>
          </div>
        </div>

        {/* Create Promo Form */}
        <form onSubmit={handleCreatePromo} className="bg-[#1e293b] border border-slate-800 rounded-xl p-4 flex flex-wrap gap-4 items-end">
          <div>
            <label className="text-slate-400 text-[11px] block mb-1 font-medium">Promo Code</label>
            <input
              type="text"
              placeholder="e.g. EKITI100"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-100 uppercase font-mono font-bold focus:outline-none focus:border-[#10b982]"
              required
            />
          </div>

          <div>
            <label className="text-slate-400 text-[11px] block mb-1 font-medium">Discount Type</label>
            <select
              value={discountType}
              onChange={(e: any) => setDiscountType(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#10b982]"
            >
              <option value="PERCENTAGE">Percentage (%)</option>
              <option value="FIXED">Fixed Amount (₦)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 text-[11px] block mb-1 font-medium">Discount Value</label>
            <input
              type="number"
              placeholder="e.g. 20"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#10b982]"
              required
            />
          </div>

          <div>
            <label className="text-slate-400 text-[11px] block mb-1 font-medium">Max Cap (₦)</label>
            <input
              type="number"
              placeholder="Optional cap limit"
              value={maxDiscount}
              onChange={(e) => setMaxDiscount(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#10b982]"
            />
          </div>

          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#10b982] text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all"
          >
            <Plus size={16} /> Create Promo
          </button>
        </form>

        {/* Promo Grid */}
        {loading ? (
          <div className="text-slate-400 text-xs py-12 text-center flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#10b982] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {promotions.map((p) => {
              const isActive = p.active !== false;
              return (
                <div
                  key={p.id}
                  className={`border rounded-xl p-4 space-y-3 transition-all ${
                    isActive
                      ? 'bg-[#1e293b] border-slate-800'
                      : 'bg-slate-900/60 border-slate-800/60 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-base font-extrabold text-[#10b982] bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/20">
                      {p.code}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                        isActive
                          ? 'text-emerald-400 bg-emerald-500/10'
                          : 'text-slate-400 bg-slate-800'
                      }`}
                    >
                      <CheckCircle size={10} /> {isActive ? 'Active' : 'Disabled'}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-slate-200 font-semibold">
                      {p.discountType === 'PERCENTAGE' || p.discountType === 'PERCENT'
                        ? `${p.value}% OFF`
                        : `₦${p.value.toLocaleString()} OFF`}
                      {p.maxDiscount ? ` (Cap: ₦${p.maxDiscount.toLocaleString()})` : ''}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Total Redemptions: {p.usageCount || 0}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={() => handleToggleStatus(p)}
                      className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded border transition-colors ${
                        isActive
                          ? 'text-amber-400 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20'
                          : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20'
                      }`}
                    >
                      <Power size={11} /> {isActive ? 'Pause' : 'Activate'}
                    </button>

                    <button
                      onClick={() => handleDeletePromo(p)}
                      title="Delete Promo"
                      className="p-1.5 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 border border-rose-500/30 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
