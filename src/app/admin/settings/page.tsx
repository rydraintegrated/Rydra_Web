"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminApi } from "@/lib/api";
import {
  Settings,
  Save,
  CheckCircle2,
  ShieldCheck,
  DollarSign,
} from "lucide-react";

export default function SystemSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    adminApi
      .getSettings()
      .then((res) => {
        setSettings(res.settings || {});
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSave = () => {
    setSaving(true);
    setSavedSuccess(false);

    adminApi
      .updateSettings(settings)
      .then((res) => {
        setSettings(res.settings);
        setSaving(false);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      })
      .catch((err) => {
        console.error(err);
        setSaving(false);
      });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[#10b982] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  const pricing = settings?.pricing || {};

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2 tracking-tight">
              <Settings size={22} className="text-[#10b982]" /> Pricing Engine &
              System Rules
            </h2>
            <p className="text-xs font-semibold text-slate-400">
              Configure base fares, distance/time multipliers, maximum cash
              limits, and platform rules
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#10b982] text-slate-950 font-bold text-xs shadow-lg hover:bg-emerald-400 transition-all disabled:opacity-50"
          >
            <Save size={16} /> {saving ? "Saving..." : "Save System Settings"}
          </button>
        </div>

        {savedSuccess && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 size={16} /> System settings updated successfully and
            logged in Audit Trail.
          </div>
        )}

        {/* Pricing Matrix */}
        <div className="bg-[#1e293b] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-2">
            🚗 Vehicle Category Pricing Matrix (Ekiti LGA Zone)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(["CAR", "OKADA", "KEKE"] as const).map((cat) => {
              const catPricing = pricing[cat] || {
                baseFare: 0,
                perKm: 0,
                perMin: 0,
                minFare: 0,
              };
              return (
                <div
                  key={cat}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#10b982]">
                      {cat}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      Active
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="text-slate-400 block text-[11px]">
                        Base Fare (₦)
                      </label>
                      <input
                        type="number"
                        value={catPricing.baseFare}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            pricing: {
                              ...pricing,
                              [cat]: {
                                ...catPricing,
                                baseFare: Number(e.target.value),
                              },
                            },
                          })
                        }
                        className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 font-semibold focus:outline-none focus:border-[#10b982]"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 block text-[11px]">
                        Per KM Rate (₦)
                      </label>
                      <input
                        type="number"
                        value={catPricing.perKm}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            pricing: {
                              ...pricing,
                              [cat]: {
                                ...catPricing,
                                perKm: Number(e.target.value),
                              },
                            },
                          })
                        }
                        className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 font-semibold focus:outline-none focus:border-[#10b982]"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 block text-[11px]">
                        Per Minute Rate (₦)
                      </label>
                      <input
                        type="number"
                        value={catPricing.perMin}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            pricing: {
                              ...pricing,
                              [cat]: {
                                ...catPricing,
                                perMin: Number(e.target.value),
                              },
                            },
                          })
                        }
                        className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 font-semibold focus:outline-none focus:border-[#10b982]"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Global Financial Rules */}
        <div className="bg-[#1e293b] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-2">
            🛡️ Platform Limits & Policy Rules
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-400 block text-[11px] mb-1 font-medium">
                Maximum Cash Fare Threshold (₦) [FR-PAY-09]
              </label>
              <input
                type="number"
                value={settings?.maxCashFare || 15000}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    maxCashFare: Number(e.target.value),
                  })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-semibold focus:outline-none focus:border-[#10b982]"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Fares exceeding this limit cannot be paid with cash.
              </p>
            </div>

            <div>
              <label className="text-slate-400 block text-[11px] mb-1 font-medium">
                Cancellation Fee Policy (₦) [FR-FARE-05]
              </label>
              <input
                type="number"
                value={settings?.cancellationFee || 300}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    cancellationFee: Number(e.target.value),
                  })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-semibold focus:outline-none focus:border-[#10b982]"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Charged to user when cancelling after driver arrival.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
