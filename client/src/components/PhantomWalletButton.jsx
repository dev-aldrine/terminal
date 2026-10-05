import React, { useState, useRef, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Wallet, LogOut, Copy, Check } from 'lucide-react';

export const PhantomWalletButton = () => {
  const { wallet, wallets, select, connect, disconnect, connected, connecting, disconnecting, publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClick = async () => {
    if (connected) {
      setDropdownOpen((prev) => !prev);
      return;
    }

    const phantom = wallets.find((w) => w.adapter.name.toLowerCase().includes('phantom')) || wallets[0];
    if (phantom) {
      try {
        select(phantom.adapter.name);
        await phantom.adapter.connect();
        return;
      } catch (err) {
        if (
          err?.name === 'WalletConnectionError' ||
          err?.message?.includes('User rejected') ||
          err?.message?.includes('rejected the request')
        ) {
          return;
        }
        console.warn('Phantom connection attempt, opening wallet selector:', err);
      }
    }

    // Fallback: Open Solana Wallet Modal
    setVisible(true);
  };

  const handleCopy = async (e) => {
    e.stopPropagation();
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey.toBase58());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleDisconnect = async (e) => {
    e.stopPropagation();
    setDropdownOpen(false);
    await disconnect();
  };

  const truncatedAddress = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : '';

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <button
        type="button"
        onClick={handleClick}
        disabled={connecting || disconnecting}
        className={`h-9 px-3.5 rounded-lg text-xs font-heading font-semibold transition-all duration-150 inline-flex items-center gap-2 outline-none ${
          connected
            ? 'bg-[#141720] border border-[#202430] hover:border-[#00d2ff] text-slate-200'
            : 'bg-[#00d2ff] hover:bg-[#38bdf8] text-[#090a0d] border border-[#00d2ff] shadow-sm'
        }`}
      >
        <Wallet className={`w-3.5 h-3.5 ${connected ? 'text-[#00d2ff]' : 'text-[#090a0d]'}`} />
        <span>
          {connecting
            ? 'Connecting...'
            : disconnecting
            ? 'Disconnecting...'
            : connected
            ? truncatedAddress
            : 'Connect Wallet'}
        </span>
        {connected && (
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ffa3]"></span>
        )}
      </button>

      {/* Connected Dropdown menu */}
      {connected && dropdownOpen && (
        <div className="absolute right-0 mt-2 min-w-[180px] bg-[#141720] border border-[#202430] rounded-lg shadow-2xl p-1.5 z-50 flex flex-col gap-1 font-mono text-xs">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-2 w-full px-3 py-2 rounded text-left text-slate-300 hover:text-white hover:bg-[#1a1e2b] transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#00ffa3]" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copied!' : 'Copy Address'}</span>
          </button>

          <div className="h-[1px] bg-[#202430] my-0.5"></div>

          <button
            type="button"
            onClick={handleDisconnect}
            className="flex items-center gap-2 w-full px-3 py-2 rounded text-left text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Disconnect</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PhantomWalletButton;
