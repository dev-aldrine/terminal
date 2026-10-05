import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { PhantomWalletButton } from './PhantomWalletButton';

const TwitterIcon = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TikTokIcon = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.5 6.3 6.3 0 0 0 1.96-4.54V8.75a8.28 8.28 0 0 0 4.81 1.52V6.84a4.87 4.87 0 0 1-1-.15z" />
  </svg>
);

export function Navbar({ siteConfig, onLogoClick }) {
  const [copied, setCopied] = useState(false);

  // Full contract address (Never truncated)
  const contractAddress = siteConfig?.ca || 'AgenSea7xJkM9QvW2p8L4s5T3u1Y6z8N0m2B4v6C8d0Ef';
  const twitterUrl = siteConfig?.twitter || 'https://x.com/agensea';
  const tiktokUrl = siteConfig?.tiktok || 'https://www.tiktok.com/@agensea';

  const handleCopy = () => {
    if (!contractAddress) return;
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="w-full bg-transparent py-3 px-4 sm:px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Logo Text */}
        <div
          onClick={onLogoClick}
          className="flex items-center cursor-pointer hover:opacity-90 transition-opacity"
        >
          <span className="text-xl font-black tracking-tight font-heading text-white">AGEN</span>
          <span className="text-xl font-black tracking-tight font-heading text-[#00d2ff]">SEA</span>
        </div>

        {/* Center: Full Contract Address Button */}
        {contractAddress && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#04162e]/70 hover:bg-[#062044]/90 border border-cyan-500/30 hover:border-cyan-400 text-slate-200 transition-all font-mono text-xs shadow-sm"
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
        )}

        {/* Right: Socials (X + TikTok, no Telegram) and Wallet Button */}
        <div className="flex items-center gap-2.5">
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-[#04162e]/70 hover:bg-[#062044]/90 border border-cyan-500/30 text-slate-200 hover:text-white transition-colors flex items-center justify-center"
            title="X / Twitter"
          >
            <TwitterIcon />
          </a>

          <a
            href={tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-[#04162e]/70 hover:bg-[#062044]/90 border border-cyan-500/30 text-slate-200 hover:text-white transition-colors flex items-center justify-center"
            title="TikTok"
          >
            <TikTokIcon />
          </a>

          <PhantomWalletButton />
        </div>

      </div>
    </header>
  );
}

export default Navbar;
