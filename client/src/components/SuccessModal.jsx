import React, { useState } from 'react';
import { ExternalLink, Check, Copy, Rocket, Layers, CheckCircle2 } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="editorial-card-active w-full max-w-lg p-6 bg-[#0f1117] text-center relative space-y-4">
        
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#141720] border border-[#202430] text-xs font-mono text-[#00ffa3]">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>TOKEN DEPLOYED TO SOLANA</span>
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-white font-heading">
          {data.name} <span className="text-[#00d2ff] font-mono">(${data.symbol})</span> Live
        </h2>
        <p className="text-slate-400 text-xs leading-relaxed">
          Your marine entity has hatched into the AgenSea ecosystem and its bonding curve is live on Pump.fun.
        </p>

        {data.imageUrl && (
          <div className="w-28 h-28 mx-auto rounded bg-[#090a0d] border border-[#202430] p-1 overflow-hidden">
            <img src={data.imageUrl} alt={data.name} className="w-full h-full object-cover rounded" />
          </div>
        )}

        {/* Details Card with FULL UNTRUNCATED MINT ADDRESS */}
        <div className="bg-[#090a0d] p-3.5 rounded border border-[#202430] text-left font-mono text-xs space-y-2.5">
          <div>
            <span className="text-slate-500 text-[11px] block mb-1">Full Mint Address:</span>
            <div className="flex items-center justify-between gap-2 p-2 rounded bg-[#141720] border border-[#202430]">
              <span className="text-white text-[11px] break-all select-all font-semibold">
                {data.mintPublicKey}
              </span>
              <button
                onClick={copyAddress}
                className="p-1 rounded bg-[#1a1e2b] hover:bg-[#202430] border border-[#3b4255] text-slate-300 hover:text-white transition-colors shrink-0"
                title="Copy Full Mint Address"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#00ffa3]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {data.signature && (
            <div className="flex items-center justify-between pt-1 border-t border-[#202430]">
              <span className="text-slate-500">Transaction:</span>
              <a
                href={`https://solscan.io/tx/${data.signature}`}
                target="_blank"
                rel="noreferrer"
                className="text-[#00d2ff] hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Solscan</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
          <a
            href={data.mintPublicKey ? `https://pump.fun/coin/${data.mintPublicKey}` : 'https://pump.fun'}
            target="_blank"
            rel="noreferrer"
            className="btn-accent w-full text-xs font-semibold py-2.5"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Trade on Pump.fun</span>
          </a>

          <button
            onClick={onClose}
            className="btn-secondary w-full text-xs font-medium py-2.5"
          >
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>Enter Ecosystem</span>
          </button>
        </div>

      </div>
    </div>
  );
};
