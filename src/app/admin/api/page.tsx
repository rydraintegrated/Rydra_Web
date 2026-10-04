'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminApi } from '@/lib/api';
import {
  Code,
  Key,
  Copy,
  Check,
  Eye,
  EyeOff,
  Save,
  CheckCircle2,
  Server,
  Globe,
  RefreshCw,
  Terminal,
} from 'lucide-react';

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<any>({
    paystackSecretKey: 'sk_live_98234789234789237489',
    paystackPublicKey: 'pk_live_19283749283749283749',
    googleMapsApiKey: 'AIzaSyA8923748923748923749823',
    smsApiKey: 'termii_sec_9283749823749823',
    jwtSecret: 'rydra_super_secret_jwt_key_2026',
    webhookUrl: 'https://api.rydra.ng/v1/webhooks',
    rateLimitPerMin: 120,
    developerApiKey: 'rydra_live_sec_892374892374892374',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'KEYS' | 'ENDPOINTS' | 'WEBHOOKS'>('KEYS');
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('/admin/analytics');
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    adminApi
      .getApiKeys()
      .then((res) => {
        if (res.apiKeys) setApiKeys(res.apiKeys);
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
      .updateApiKeys(apiKeys)
      .then((res) => {
        if (res.apiKeys) setApiKeys(res.apiKeys);
        setSaving(false);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      })
      .catch((err) => {
        console.error(err);
        setSaving(false);
      });
  };

  const toggleShowKey = (keyName: string) => {
    setShowKeys((prev) => ({ ...prev, [keyName]: !prev[keyName] }));
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGenerateNewDevKey = () => {
    const randomHex = Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    setApiKeys({ ...apiKeys, developerApiKey: `rydra_live_${randomHex}` });
  };

  const handleTestEndpoint = async (endpoint: string) => {
    setTesting(true);
    setTestResponse(null);
    try {
      const res = await fetch(`http://localhost:5000/api${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer jwt_mock_token_usr_superadmin_SUPER_ADMIN',
        },
      });
      const data = await res.json();
      setTestResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setTestResponse(JSON.stringify({ error: err.message || 'Failed to connect to backend' }, null, 2));
    } finally {
      setTesting(false);
    }
  };

  const endpointsList = [
    { method: 'GET', path: '/admin/analytics', auth: 'Super Admin', desc: 'Fetch system KPI overview & revenue metrics' },
    { method: 'GET', path: '/admin/users', auth: 'Super Admin', desc: 'List all registered customers and drivers' },
    { method: 'GET', path: '/admin/drivers', auth: 'Super Admin', desc: 'Get driver profiles and verification status' },
    { method: 'GET', path: '/admin/rides', auth: 'Super Admin', desc: 'Real-time ride monitor and trip history' },
    { method: 'GET', path: '/admin/wallet/ledger', auth: 'Super Admin', desc: 'Wallet transaction ledger and platform balance' },
    { method: 'GET', path: '/admin/settings', auth: 'Super Admin', desc: 'Pricing matrix, per-km rates, and policy rules' },
    { method: 'GET', path: '/admin/audit-logs', auth: 'Super Admin', desc: 'System security audit trail & action logs' },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[#10b982] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2 tracking-tight">
              <Code size={22} className="text-[#10b982]" /> API & Developer Integrations
            </h2>
            <p className="text-xs font-semibold text-slate-400">
              Manage payment gateways, Google Maps credentials, SMS tokens, and API rate limits
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#10b982] text-slate-950 font-bold text-xs shadow-lg hover:bg-emerald-400 transition-all disabled:opacity-50"
            >
              <Save size={16} /> {saving ? 'Saving...' : 'Save API Config'}
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 size={16} /> API keys and developer configurations updated successfully.
          </div>
        )}

        {/* Tab Selection Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('KEYS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'KEYS'
                ? 'bg-[#10b982] text-slate-950 shadow-md'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key size={15} /> API Keys & Credentials
          </button>

          <button
            onClick={() => setActiveTab('ENDPOINTS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'ENDPOINTS'
                ? 'bg-[#10b982] text-slate-950 shadow-md'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal size={15} /> Endpoint Explorer
          </button>

          <button
            onClick={() => setActiveTab('WEBHOOKS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'WEBHOOKS'
                ? 'bg-[#10b982] text-slate-950 shadow-md'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe size={15} /> Webhooks & Rate Limits
          </button>
        </div>

        {/* ============================================================ */}
        {/* --- TAB 1: API KEYS & CREDENTIALS --- */}
        {/* ============================================================ */}
        {activeTab === 'KEYS' && (
          <div className="space-y-5">
            {/* Developer Master Secret Key Card */}
            <div className="bg-[#1e293b] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#10b982]/10 text-[#10b982] flex items-center justify-center font-bold">
                    🔑
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">Live Developer API Key</h3>
                    <p className="text-[11px] text-slate-400">Used for authenticating REST API requests from third-party client apps</p>
                  </div>
                </div>

                <button
                  onClick={handleGenerateNewDevKey}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-slate-100 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  <RefreshCw size={13} /> Roll / Regenerate Key
                </button>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type={showKeys['dev'] ? 'text' : 'password'}
                  value={apiKeys.developerApiKey}
                  readOnly
                  className="flex-1 bg-slate-900 border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-xs font-mono text-[#10b982] font-semibold focus:outline-none"
                />
                <button
                  onClick={() => toggleShowKey('dev')}
                  className="p-2.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors border border-slate-700"
                >
                  {showKeys['dev'] ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button
                  onClick={() => handleCopy(apiKeys.developerApiKey, 'dev')}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-[#10b982] text-slate-950 font-bold text-xs transition-colors"
                >
                  {copiedKey === 'dev' ? <Check size={16} /> : <Copy size={16} />}
                  {copiedKey === 'dev' ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* External Integration Gateways */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Google Maps API Key */}
              <div className="bg-[#1e293b] border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="font-bold text-sm text-slate-100 flex items-center gap-2">
                    🗺️ Google Maps API Key
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Used for geocoding, route calculation, and map tiles</p>
                <div className="flex items-center gap-2">
                  <input
                    type={showKeys['maps'] ? 'text' : 'password'}
                    value={apiKeys.googleMapsApiKey}
                    onChange={(e) => setApiKeys({ ...apiKeys, googleMapsApiKey: e.target.value })}
                    className="flex-1 bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#10b982]"
                  />
                  <button
                    onClick={() => toggleShowKey('maps')}
                    className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700"
                  >
                    {showKeys['maps'] ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                  <button
                    onClick={() => handleCopy(apiKeys.googleMapsApiKey, 'maps')}
                    className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700"
                  >
                    {copiedKey === 'maps' ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
                  </button>
                </div>
              </div>

              {/* Paystack Secret Key */}
              <div className="bg-[#1e293b] border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="font-bold text-sm text-slate-100 flex items-center gap-2">
                    💳 Paystack Secret Key
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Live Mode
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Processes customer card payments and driver wallet top-ups</p>
                <div className="flex items-center gap-2">
                  <input
                    type={showKeys['paystackSec'] ? 'text' : 'password'}
                    value={apiKeys.paystackSecretKey}
                    onChange={(e) => setApiKeys({ ...apiKeys, paystackSecretKey: e.target.value })}
                    className="flex-1 bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#10b982]"
                  />
                  <button
                    onClick={() => toggleShowKey('paystackSec')}
                    className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700"
                  >
                    {showKeys['paystackSec'] ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                  <button
                    onClick={() => handleCopy(apiKeys.paystackSecretKey, 'paystackSec')}
                    className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700"
                  >
                    {copiedKey === 'paystackSec' ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
                  </button>
                </div>
              </div>

              {/* SMS Service Key */}
              <div className="bg-[#1e293b] border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="font-bold text-sm text-slate-100 flex items-center gap-2">
                    📱 SMS / Termii Gateway Token
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Sends 4-digit mobile verification codes via SMS & WhatsApp</p>
                <div className="flex items-center gap-2">
                  <input
                    type={showKeys['sms'] ? 'text' : 'password'}
                    value={apiKeys.smsApiKey}
                    onChange={(e) => setApiKeys({ ...apiKeys, smsApiKey: e.target.value })}
                    className="flex-1 bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#10b982]"
                  />
                  <button
                    onClick={() => toggleShowKey('sms')}
                    className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700"
                  >
                    {showKeys['sms'] ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                  <button
                    onClick={() => handleCopy(apiKeys.smsApiKey, 'sms')}
                    className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700"
                  >
                    {copiedKey === 'sms' ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
                  </button>
                </div>
              </div>

              {/* JWT Secret */}
              <div className="bg-[#1e293b] border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="font-bold text-sm text-slate-100 flex items-center gap-2">
                    🔒 JWT Authentication Secret
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    HS256
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Signs and verifies bearer tokens for authenticated mobile sessions</p>
                <div className="flex items-center gap-2">
                  <input
                    type={showKeys['jwt'] ? 'text' : 'password'}
                    value={apiKeys.jwtSecret}
                    onChange={(e) => setApiKeys({ ...apiKeys, jwtSecret: e.target.value })}
                    className="flex-1 bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#10b982]"
                  />
                  <button
                    onClick={() => toggleShowKey('jwt')}
                    className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700"
                  >
                    {showKeys['jwt'] ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                  <button
                    onClick={() => handleCopy(apiKeys.jwtSecret, 'jwt')}
                    className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700"
                  >
                    {copiedKey === 'jwt' ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* --- TAB 2: ENDPOINT EXPLORER --- */}
        {/* ============================================================ */}
        {activeTab === 'ENDPOINTS' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Left: Endpoints Directory */}
            <div className="bg-[#1e293b] border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-2 flex items-center gap-2">
                <Server size={16} className="text-[#10b982]" /> System REST API Endpoints
              </h3>

              <div className="space-y-2">
                {endpointsList.map((ep) => (
                  <div
                    key={ep.path}
                    onClick={() => setSelectedEndpoint(ep.path)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      selectedEndpoint === ep.path
                        ? 'border-[#10b982] bg-slate-800/90'
                        : 'border-slate-800 bg-slate-900 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[#10b982] text-slate-950">
                          {ep.method}
                        </span>
                        <span className="font-mono text-xs font-bold text-slate-200">{ep.path}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                        {ep.auth}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{ep.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Interactive Response Tester */}
            <div className="bg-[#1e293b] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">Test API Endpoint</h3>
                    <p className="font-mono text-xs text-[#10b982] mt-0.5">GET http://localhost:5000/api{selectedEndpoint}</p>
                  </div>
                  <button
                    onClick={() => handleTestEndpoint(selectedEndpoint)}
                    disabled={testing}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#10b982] text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw size={13} className={testing ? 'animate-spin' : ''} /> {testing ? 'Testing...' : 'Send Request'}
                  </button>
                </div>

                <div className="mt-4">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">JSON Response:</span>
                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 max-h-96 overflow-y-auto font-mono text-xs text-emerald-400 leading-relaxed">
                    {testResponse ? (
                      <pre>{testResponse}</pre>
                    ) : (
                      <span className="text-slate-600 italic">Click "Send Request" to test endpoint live...</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800 flex items-center justify-between">
                <span>Base URL: http://localhost:5000/api</span>
                <span>Auth: Bearer JWT Token</span>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* --- TAB 3: WEBHOOKS & RATE LIMITING --- */}
        {/* ============================================================ */}
        {activeTab === 'WEBHOOKS' && (
          <div className="bg-[#1e293b] border border-slate-800 rounded-xl p-5 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-2">
              🌐 Webhook Dispatcher & Rate Limiting Controls
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div className="space-y-2">
                <label className="text-slate-300 font-semibold block">Webhook Target URL</label>
                <input
                  type="text"
                  value={apiKeys.webhookUrl}
                  onChange={(e) => setApiKeys({ ...apiKeys, webhookUrl: e.target.value })}
                  placeholder="https://your-domain.com/webhooks"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono text-xs focus:outline-none focus:border-[#10b982]"
                />
                <p className="text-[10px] text-slate-500">Real-time event payloads (ride completed, SOS alert, payment received) are posted here.</p>
              </div>

              <div className="space-y-2">
                <label className="text-slate-300 font-semibold block">Global API Rate Limit (Req / min)</label>
                <input
                  type="number"
                  value={apiKeys.rateLimitPerMin}
                  onChange={(e) => setApiKeys({ ...apiKeys, rateLimitPerMin: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-semibold text-xs focus:outline-none focus:border-[#10b982]"
                />
                <p className="text-[10px] text-slate-500">Maximum allowed API requests per minute per client IP address.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
