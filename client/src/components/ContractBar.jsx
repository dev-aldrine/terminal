import React, { useState } from 'react';
import { Copy, Check, Waves, Droplets, Terminal, Send, Sparkles, Globe } from 'lucide-react';

const TwitterIcon = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export function ContractBar({ siteConfig, totalSpawned = 3, activeFaucets = 3 }) {
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
    <div className="w-full bg-[#040c1a]/90 backdrop-blur-md border-b border-cyan-500/20 py-2.5 px-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs md:text-sm">
        
        {/* Left: Protocol Status & Live Metrics */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="font-semibold tracking-wider">SOLANA MAINNET</span>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-slate-300 font-mono">
            <div className="flex items-center gap-1.5 text-cyan-300">
              <Waves className="w-3.5 h-3.5 text-cyan-400" />
              <span>{totalSpawned} Living Agents</span>
            </div>
            <span className="text-slate-600">•</span>
            <div className="flex items-center gap-1.5 text-emerald-300">
              <Droplets className="w-3.5 h-3.5 text-emerald-400" />
              <span>{activeFaucets} Faucet Vaults</span>
            </div>
          </div>
        </div>

        {/* Right: Contract Address & Socials */}
        <div className="flex items-center gap-2.5 flex-wrap ml-auto">
          {contractAddress && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/20 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-300 transition-all font-mono text-xs"
              title="Click to copy official CA"
            >
              <span className="text-slate-400">CA:</span>
              <span className="text-cyan-400 font-medium">
                {contractAddress.slice(0, 4)}...{contractAddress.slice(-4)}
              </span>
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            </button>
          )}

          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-cyan-950 border border-cyan-500/20 hover:border-cyan-400 text-slate-400 hover:text-cyan-400 transition-all"
            title="AgenSea on X"
          >
            <TwitterIcon />
          </a>

          <a
            href="https://t.me/agensea"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-cyan-950 border border-cyan-500/20 hover:border-cyan-400 text-slate-400 hover:text-cyan-400 transition-all"
            title="AgenSea Telegram"
          >
            <Send className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </div>
  );
}
