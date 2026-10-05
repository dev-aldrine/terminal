import React, { useState, useEffect } from 'react';
import { Shield, Key, Copy, Check, Save, ArrowLeft, RefreshCw, AlertCircle, CheckCircle2, Lock, Terminal } from 'lucide-react';

export function AdminView({ siteConfig, onConfigUpdated, onBack }) {
  const [ca, setCa] = useState(siteConfig?.ca || '');
  const [twitter, setTwitter] = useState(siteConfig?.twitter || '');
  const [password, setPassword] = useState('!123!123!');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (siteConfig?.ca) setCa(siteConfig.ca);
    if (siteConfig?.twitter) setTwitter(siteConfig.twitter);
  }, [siteConfig]);

  const handleSave = async (e) => {
    e?.preventDefault();
    if (!ca.trim()) {
      setStatus({ type: 'error', message: 'Contract Address (CA) cannot be empty.' });
      return;
    }

    try {
      setLoading(true);
      setStatus(null);

      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: password.trim(),
          ca: ca.trim(),
          twitter: twitter.trim()
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update configuration.');
      }

      setStatus({ type: 'success', message: 'Contract Address updated & broadcast live on-chain!' });
      if (onConfigUpdated) {
        onConfigUpdated({ ca: data.ca, twitter: data.twitter });
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Update failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!ca) return;
    navigator.clipboard.writeText(ca);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-xl mx-auto my-auto select-none py-6 px-4">
      {/* Minimalist Glass Admin Panel */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#041024]/95 via-[#020917]/98 to-[#01040a]/98 border border-cyan-500/30 backdrop-blur-3xl shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(0,210,255,0.15)] space-y-6">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#061936] border border-cyan-400/40 flex items-center justify-center text-[#00ffa3] shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white font-heading tracking-tight">
                AgenSea Admin Control
              </h2>
              <span className="text-[11px] font-mono text-cyan-300">
                Route: <code className="text-[#00ffa3]">/pukinginamo</code>
              </span>
            </div>
          </div>

          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#04142c] hover:bg-[#07244e] border border-cyan-500/30 text-slate-300 text-xs font-mono transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to App</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 font-mono text-xs">
          
          {/* CA Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-cyan-300 font-bold uppercase text-[11px] flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#00d2ff]" />
                <span>Live Contract Address (CA)</span>
              </label>
              {ca && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-[10px] text-slate-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  {copied ? <Check className="w-3 h-3 text-[#00ffa3]" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>
            <textarea
              rows={2}
              value={ca}
              onChange={(e) => setCa(e.target.value)}
              placeholder="e.g. AgenSea7xJkM9QvW2p8L4s5T3u1Y6z8N0m2B4v6C8d0Ef"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#01040a] border border-cyan-500/30 text-white font-mono text-xs focus:outline-none focus:border-[#00d2ff] leading-relaxed resize-none"
            />
            <span className="text-[10px] text-slate-400 block mt-1">
              Updating this CA will instantly sync across the navbar, hero cards, and trading links without page reloads.
            </span>
          </div>

          {/* Twitter / X Input */}
          <div>
            <label className="text-cyan-300 font-bold uppercase text-[11px] block mb-1.5">
              Official Twitter / X URL
            </label>
            <input
              type="text"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              placeholder="https://x.com/agensea"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#01040a] border border-cyan-500/30 text-white font-mono text-xs focus:outline-none focus:border-[#00d2ff]"
            />
          </div>

          {/* Admin Password */}
          <div>
            <label className="text-cyan-300 font-bold uppercase text-[11px] block mb-1.5">
              Admin Master Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#01040a] border border-cyan-500/30 text-white font-mono text-xs focus:outline-none focus:border-[#00d2ff]"
              />
              <Key className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Status Feedback */}
          {status && (
            <div
              className={`p-3 rounded-2xl border text-xs flex items-center gap-2.5 ${
                status.type === 'success'
                  ? 'bg-[#00ffa3]/10 border-[#00ffa3]/40 text-[#00ffa3]'
                  : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
              }`}
            >
              {status.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{status.message}</span>
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#00d2ff] via-[#00ffa3] to-[#38bdf8] text-[#020712] font-heading font-black text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,210,255,0.4)] hover:shadow-[0_0_35px_rgba(0,255,163,0.6)] transition-all transform active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4 fill-current" />
            <span>{loading ? 'BROADCASTING UPDATE...' : 'SAVE & BROADCAST NEW CA'}</span>
          </button>

        </form>

      </div>
    </div>
  );
}

export default AdminView;
