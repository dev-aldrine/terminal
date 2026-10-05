import React, { useState } from 'react';
import { Copy, Check, Waves, Send, Globe } from 'lucide-react';

const TwitterIcon = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export function ContractBar({ siteConfig, totalSpawned = 3, activePools = 3 }) {
  const [copied, setCopied] = useState(false);

  const contractAddress = siteConfig?.ca || 'AgenSea7xJkM9QvW2p8L4s5T3u1Y6z8N0m2B4v6C8d0Ef';
  const twitterUrl = siteConfig?.twitter || 'https://x.com/agensea';

  const handleCopy = () => {
    if (!contractAddress) return;
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-[#05080f] border-b border-white/[0.08] py-2 px-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
        
        {/* Left: Metrics & Status */}
        <div className="flex items-center gap-4 text-slate-400 font-mono">
          <div className="flex items-center gap-1.5 text-[#00e5ff]">
            <Waves className="w-3.5 h-3.5" />
            <span>{totalSpawned} Active Marine Agents</span>
          </div>
          <span className="text-slate-700 hidden sm:inline">•</span>
          <div className="hidden sm:flex items-center gap-1 text-slate-400">
            <span>Launch Fee:</span>
            <strong className="text-white">~0.0001 SOL (Almost Free)</strong>
          </div>
        </div>

        {/* Right: Contract Address & Socials */}
        <div className="flex items-center gap-2">
          {contractAddress && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0c1322] hover:bg-[#111b2e] border border-white/[0.08] hover:border-[#00e5ff]/40 text-slate-300 transition-all font-mono text-xs"
              title="Click to copy official CA"
            >
              <span className="text-slate-500">CA:</span>
              <span className="text-[#00e5ff] font-medium">
                {contractAddress.slice(0, 4)}...{contractAddress.slice(-4)}
              </span>
              {copied ? <Check className="w-3 h-3 text-[#00ffa3]" /> : <Copy className="w-3 h-3 text-slate-400" />}
            </button>
          )}

          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded bg-[#0c1322] hover:bg-[#111b2e] border border-white/[0.08] text-slate-400 hover:text-[#00e5ff] transition-all"
            title="AgenSea on X"
          >
            <TwitterIcon />
          </a>

          <a
            href="https://t.me/agensea"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded bg-[#0c1322] hover:bg-[#111b2e] border border-white/[0.08] text-slate-400 hover:text-[#00e5ff] transition-all"
            title="AgenSea Telegram"
          >
            <Send className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </div>
  );
}
