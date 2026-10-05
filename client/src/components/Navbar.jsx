import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { PhantomWalletButton } from './PhantomWalletButton';

const TwitterIcon = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export function Navbar({ siteConfig, onLogoClick }) {
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
    <header className="w-full bg-transparent py-3 px-4 sm:px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto relative flex items-center justify-between min-h-[40px]">
        
        {/* Left: Logo Text */}
        <div
          onClick={onLogoClick}
          className="flex items-center cursor-pointer hover:opacity-90 transition-opacity z-10"
        >
          <span className="text-xl font-black tracking-tight font-heading text-white">AGEN</span>
          <span className="text-xl font-black tracking-tight font-heading text-[#00d2ff]">SEA</span>
        </div>

        {/* Center: Mathematically Centered Full CA Button */}
        {contractAddress && (
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#04162e]/70 hover:bg-[#062044]/90 border border-cyan-500/30 hover:border-cyan-400 text-slate-200 transition-all font-mono text-xs shadow-sm"
              title="Click to copy full CA"
            >
              <span className="text-cyan-400 font-bold">CA:</span>
              <span className="text-white font-medium select-all">
                {contractAddress}
              </span>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-[#00ffa3] shrink-0" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              )}
            </button>
          </div>
        )}

        {/* Right: X / Twitter & Connect Wallet Button (TikTok removed) */}
        <div className="flex items-center gap-2.5 z-10">
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-[#04162e]/70 hover:bg-[#062044]/90 border border-cyan-500/30 text-slate-200 hover:text-white transition-colors flex items-center justify-center"
            title="X / Twitter"
          >
            <TwitterIcon />
          </a>

          <PhantomWalletButton />
        </div>

      </div>

      {/* Mobile CA bar under navbar if screen is small */}
      {contractAddress && (
        <div className="md:hidden flex justify-center pt-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#04162e]/70 border border-cyan-500/30 text-slate-200 font-mono text-[11px] shadow-sm max-w-full"
            title="Click to copy full CA"
          >
            <span className="text-cyan-400 font-bold">CA:</span>
            <span className="text-white truncate max-w-[200px]">
              {contractAddress}
            </span>
            {copied ? (
              <Check className="w-3 h-3 text-[#00ffa3] shrink-0" />
            ) : (
              <Copy className="w-3 h-3 text-cyan-400 shrink-0" />
            )}
          </button>
        </div>
      )}
    </header>
  );
}

export default Navbar;
