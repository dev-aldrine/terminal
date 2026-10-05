import React, { useState } from 'react';
import { ExternalLink, Check, Copy, Rocket, Waves, Droplets, Sparkles, RefreshCw } from 'lucide-react';

export const SuccessModal = ({ data, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  const copyAddress = () => {
    if (data.mintPublicKey) {
      navigator.clipboard.writeText(data.mintPublicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="glass-panel-glow w-full max-w-lg rounded-3xl p-6 md:p-8 border-2 border-cyan-400 shadow-[0_0_60px_rgba(0,245,255,0.4)] text-center relative space-y-5 animate-in fade-in zoom-in duration-200">
        
        {/* Glow Header Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-400 text-cyan-300 font-mono text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
          <span>MARINE AI ENTITY SPAWNED</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold text-white">
          {data.name} <span className="text-gradient-cyan font-mono">(${data.symbol})</span> Live!
        </h2>
        <p className="text-slate-400 text-xs md:text-sm">
          Your autonomous creature has hatched into the AgenSea ocean and its bonding curve is active on Pump.fun.
        </p>

        {/* Creature Avatar Preview */}
        {data.imageUrl && (
          <div className="w-32 h-32 mx-auto rounded-2xl bg-slate-950 border-2 border-cyan-400/60 p-1.5 shadow-[0_0_30px_rgba(0,245,255,0.3)] overflow-hidden">
            <img src={data.imageUrl} alt={data.name} className="w-full h-full object-cover rounded-xl" />
          </div>
        )}

        {/* Details Card */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-cyan-500/20 text-left font-mono text-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Mint Address:</span>
            <div className="flex items-center gap-2">
              <span className="text-cyan-300 font-bold">
                {data.mintPublicKey ? `${data.mintPublicKey.slice(0, 6)}...${data.mintPublicKey.slice(-6)}` : 'Generating...'}
              </span>
              <button
                onClick={copyAddress}
                className="p-1 rounded bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-white transition-all"
                title="Copy Address"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {data.signature && (
            <div className="flex items-center justify-between pt-1 border-t border-slate-900">
              <span className="text-slate-400">Solana Transaction:</span>
              <a
                href={`https://solscan.io/tx/${data.signature}`}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:underline flex items-center gap-1 font-bold"
              >
                <span>View Solscan</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <a
            href={data.mintPublicKey ? `https://pump.fun/coin/${data.mintPublicKey}` : 'https://pump.fun'}
            target="_blank"
            rel="noreferrer"
            className="ocean-btn-primary w-full py-3.5 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2"
          >
            <Rocket className="w-4 h-4" />
            <span>Trade on Pump.fun</span>
          </a>

          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all"
          >
            <Waves className="w-4 h-4 text-cyan-400" />
            <span>Enter The Aquarium</span>
          </button>
        </div>

      </div>
    </div>
  );
};
