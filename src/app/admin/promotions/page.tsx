'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminApi } from '@/lib/api';
import { Tag, Plus, CheckCircle } from 'lucide-react';

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENT' | 'FIXED'>('PERCENT');
  const [value, setValue] = useState('');
  const [maxDiscount, setMaxDiscount] = useState('');

  const loadPromos = () => {
    setLoading(true);
    adminApi
      .getPromotions()
      .then((res) => {
        setPromotions(res.promotions || []);
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
        code,
        discountType,
        value: Number(value),
        maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
      })
      .then(() => {
        setCode('');
        setValue('');
        setMaxDiscount('');
        loadPromos();
      });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2 tracking-tight">
              <Tag size={22} className="text-[#10b982]" /> Promotions & Referral Engine
            </h2>
            <p className="text-xs font-semibold text-slate-400">Manage promotional discount codes and referral reward rules</p>
          </div>
        </div>

        {/* Create Promo Form */}
        <form onSubmit={handleCreatePromo} className="bg-[#1e293b] border border-slate-800 rounded-xl p-4 flex flex-wrap gap-4 items-end">
          <div>
            <label className="text-slate-400 text-[11px] block mb-1 font-medium">Promo Code</label>
            <input
              type="text"
              placeholder="e.g. RYDRA50"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-100 uppercase font-mono font-bold focus:outline-none focus:border-[#10b982]"
              required
            />
          </div>

          <div>
            <label className="text-slate-400 text-[11px] block mb-1 font-medium">Type</label>
            <select
              value={discountType}
              onChange={(e: any) => setDiscountType(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#10b982]"
            >
              <option value="PERCENT">Percentage (%)</option>
              <option value="FIXED">Fixed Amount (₦)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 text-[11px] block mb-1 font-medium">Discount Value</label>
            <input
              type="number"
              placeholder="e.g. 15"
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
              placeholder="Optional limit"
              value={maxDiscount}
              onChange={(e) => setMaxDiscount(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#10b982]"
            />
          </div>

          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#10b982] text-slate-950 font-bold text-xs hover:bg-emerald-400"
          >
            <Plus size={16} /> Create Promo
          </button>
        </form>

        {/* Promo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {promotions.map((p) => (
            <div key={p.id} className="bg-[#1e293b] border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-base font-extrabold text-[#10b982] bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/20">
                  {p.code}
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-200 font-semibold">
                {p.discountType === 'PERCENT' ? `${p.value}% OFF` : `₦${p.value} OFF`}
                {p.maxDiscount ? ` (Up to ₦${p.maxDiscount})` : ''}
              </p>
              <p className="text-[11px] text-slate-400">Total Usages: {p.usageCount || 0}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
