import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Lock, Check, ArrowLeft, RefreshCw, Sparkles, Copy, ShieldCheck, AlertCircle } from 'lucide-react';
import { PhantomWalletButton } from './PhantomWalletButton';

const AUTHORIZED_ADMIN_WALLET = '7jMX3CSDvXu3DfKewrepvAyYTGZ4h1VWRzuDB14tPau4';

export const AdminView = ({ onBack }) => {
  const { publicKey, connected } = useWallet();
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return sessionStorage.getItem('drawpad_admin_auth') === 'true';
  });
  const [errorMsg, setErrorMsg] = useState('');

  const [ca, setCa] = useState('');
  const [twitter, setTwitter] = useState('');
  const [pinataJwt, setPinataJwt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const isAuthorizedWallet = connected && publicKey && publicKey.toBase58() === AUTHORIZED_ADMIN_WALLET;

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/config');
      const data = await res.json();
      if (data && data.success) {
        setCa(data.ca || '');
        setTwitter(data.twitter || '');
        setPinataJwt(data.pinataJwt || '');
      }
    } catch (err) {
      console.error('Failed to fetch config:', err);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!isAuthorizedWallet) {
      setErrorMsg(`Access Denied: Connected wallet is not authorized. Please switch to ${AUTHORIZED_ADMIN_WALLET}.`);
      return;
    }
    if (password === '!123!123!') {
      setIsUnlocked(true);
      sessionStorage.setItem('drawpad_admin_auth', 'true');
      setErrorMsg('');
    } else {
      setErrorMsg('Incorrect admin password. Please try again.');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isAuthorizedWallet) {
      setErrorMsg('Unauthorized: Connected wallet is not authorized to save settings.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password: '!123!123!',
          adminWallet: publicKey.toBase58(),
          ca: ca.trim(),
          twitter: twitter.trim(),
          pinataJwt: pinataJwt.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save config');
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      setErrorMsg(err.message || 'Error saving settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('drawpad_admin_auth');
    setIsUnlocked(false);
    setPassword('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-6 p-6 sm:p-8 bg-[#0f1117] border border-[#202430] rounded-xl shadow-2xl relative z-20">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-5 mb-6 border-b border-[#202430]">
        <div>
          <h2 className="text-xl font-heading font-bold text-white tracking-tight flex items-center gap-2">
            AgenSea <span className="px-2 py-0.5 rounded text-xs font-mono bg-[#141720] border border-[#202430] text-[#00d2ff]">Admin Protocol</span>
          </h2>
          <div className="text-xs text-slate-500 font-mono mt-1">
            route: /pukinginamo
          </div>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="btn-secondary text-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Terminal</span>
        </button>
      </div>

      {/* Wallet Authorization & Password Gate */}
      {!isUnlocked ? (
        <form onSubmit={handleLogin} className="space-y-5 py-2">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-xl bg-[#141720] border border-[#202430] text-[#00d2ff]">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-heading font-bold text-white">
              Wallet-Gated Admin Control
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Authorized Authority: <span className="text-[#00d2ff] bg-[#141720] px-1.5 py-0.5 rounded border border-[#202430]">{AUTHORIZED_ADMIN_WALLET.slice(0, 4)}...{AUTHORIZED_ADMIN_WALLET.slice(-4)}</span>
            </p>
          </div>

          {/* Wallet Connection Status */}
          <div className="p-4 rounded-lg bg-[#141720] border border-[#202430] flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Connected Wallet</div>
              <div className="font-mono text-xs font-semibold text-slate-200 mt-0.5">
                {connected ? `${publicKey.toBase58().slice(0, 6)}...${publicKey.toBase58().slice(-6)}` : 'No wallet connected'}
              </div>
            </div>
            {!isAuthorizedWallet ? (
              <PhantomWalletButton />
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> Authorized Admin
              </span>
            )}
          </div>

          {isAuthorizedWallet && (
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 font-semibold">
                  Admin Passkey (2FA):
                </label>
                <input
                  type="password"
                  placeholder="Enter admin password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                  className="w-full px-3.5 py-2.5 bg-[#090a0d] border border-[#202430] focus:border-[#00d2ff] rounded-lg text-sm font-mono text-slate-100 outline-none transition-colors"
                />
              </div>

              {errorMsg && (
                <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full btn-accent justify-center py-2.5"
              >
                Authenticate Dashboard
              </button>
            </div>
          )}
        </form>
      ) : (
        /* Authenticated Admin Form */
        <form onSubmit={handleSave} className="space-y-5">
          <div className="flex justify-between items-center pb-2 border-b border-[#202430] text-xs font-mono">
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Active Authenticated Session
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="text-rose-400 hover:text-rose-300 transition-colors"
            >
              Lock / Logout
            </button>
          </div>

          {/* CA Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 font-semibold">
              1. Solana Contract Address (CA):
            </label>
            <input
              type="text"
              placeholder="e.g. 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
              value={ca}
              onChange={(e) => setCa(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#090a0d] border border-[#202430] focus:border-[#00d2ff] rounded-lg text-xs font-mono text-slate-100 outline-none transition-colors"
            />
            <span className="text-[11px] text-slate-500 block font-mono">
              Updates the global full CA banner and ticker across the entire terminal.
            </span>
          </div>

          {/* Twitter Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 font-semibold">
              2. Official X (Twitter) Link / Handle:
            </label>
            <input
              type="text"
              placeholder="e.g. https://x.com/agensea_sol or @agensea_sol"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#090a0d] border border-[#202430] focus:border-[#00d2ff] rounded-lg text-xs font-mono text-slate-100 outline-none transition-colors"
            />
            <span className="text-[11px] text-slate-500 block font-mono">
              Links your official X community in the header and radar.
            </span>
          </div>

          {/* Pinata IPFS JWT Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 font-semibold">
              3. Pinata IPFS JWT (Optional):
            </label>
            <input
              type="password"
              placeholder="Paste Pinata JWT secret key..."
              value={pinataJwt}
              onChange={(e) => setPinataJwt(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#090a0d] border border-[#202430] focus:border-[#00d2ff] rounded-lg text-xs font-mono text-slate-100 outline-none transition-colors"
            />
            <span className="text-[11px] text-slate-500 block font-mono">
              Used to pin creature vector metadata to IPFS for PumpPortal genesis.
            </span>
          </div>

          {/* Live Preview Box */}
          <div className="p-3.5 rounded-lg bg-[#141720] border border-[#202430] space-y-2">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
              Live Banner Preview:
            </div>
            <div className="p-2.5 rounded bg-[#090a0d] border border-[#202430] flex items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2 min-w-0">
                <span className="px-1.5 py-0.5 rounded bg-[#141720] border border-[#202430] text-[#00d2ff] font-bold text-[10px]">CA</span>
                <span className="text-slate-300 truncate">
                  {ca || 'No Contract Address set yet'}
                </span>
              </div>
              {twitter && (
                <span className="text-[10px] text-[#00d2ff] bg-[#141720] px-2 py-0.5 rounded border border-[#202430] shrink-0">
                  X Linked
                </span>
              )}
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {saveSuccess && (
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Settings saved successfully. Published live to all terminals.</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-accent justify-center py-2.5 text-xs font-semibold"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving Configuration...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Publish & Save Global Settings</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminView;
