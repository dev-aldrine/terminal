import React, { useState } from 'react';
import { Copy, Check, Activity, Send } from 'lucide-react';

const TwitterIcon = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export function ContractBar({ siteConfig, totalSpawned = 3 }) {
  const [copied, setCopied] = useState(false);

  // Full contract address (Never truncated)
  const contractAddress = siteConfig?.ca || 'AgenSea7xJkM9QvW2p8L4s5T3u1Y6z8N0m2B4v6C8d0Ef';
  const twitterUrl = siteConfig?.twitter || 'https://x.com/agensea';

  const handleCopy = () => {
    if (!contractAddress) return;
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-[#090a0d] border-b border-[#202430] py-2 px-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Left: Metrics & Cost */}
        <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
          <div className="flex items-center gap-1.5 text-[#00d2ff]">
            <Activity className="w-3.5 h-3.5" />
            <span>{totalSpawned} Active Agents</span>
          </div>
          <span className="text-slate-700 hidden sm:inline">•</span>
          <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
            <span>Launch Cost:</span>
            <strong className="text-white">~0.0001 SOL (Almost Free)</strong>
          </div>
        </div>

        {/* Right: Full Untruncated CA & Social Links */}
        <div className="flex items-center gap-2 flex-wrap">
          {contractAddress && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#141720] hover:bg-[#1a1e2b] border border-[#202430] hover:border-[#3b4255] text-slate-300 transition-colors font-mono text-xs"
              title="Click to copy full CA"
            >
              <span className="text-slate-500 font-medium">CA:</span>
              {/* FULL UNTRUNCATED ADDRESS */}
              <span className="text-white font-medium select-all">
                {contractAddress}
              </span>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-[#00ffa3] shrink-0" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
            </button>
          )}

          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded bg-[#141720] hover:bg-[#1a1e2b] border border-[#202430] text-slate-400 hover:text-white transition-colors"
            title="X / Twitter"
          >
            <TwitterIcon />
          </a>

          <a
            href="https://t.me/agensea"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded bg-[#141720] hover:bg-[#1a1e2b] border border-[#202430] text-slate-400 hover:text-white transition-colors"
            title="Telegram"
          >
            <Send className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </div>
  );
}
