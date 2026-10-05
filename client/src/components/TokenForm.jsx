import React, { useState } from 'react';
import { Rocket, Brain, Droplets, Zap, Send, Globe, Waves, Activity, Shield, Sparkles, Terminal, Sliders, CheckCircle2 } from 'lucide-react';
import { SPECIES_LIST } from './FishStudio';

const TwitterIcon = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export function TokenForm({
  formData,
  onFormChange,
  onLaunch,
  loading,
  statusMessage,
  imageDataUrl,
  selectedSpecies,
  onBackToStudio
}) {
  const [activeTab, setActiveTab] = useState('agent');
  const activeSpeciesData = SPECIES_LIST.find((s) => s.id === selectedSpecies) || SPECIES_LIST[0];

  const handleTogglePool = (e) => {
    onFormChange('faucetEnabled', e.target.checked);
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-auto select-none py-2">
      {/* Submarine Tactical Command Bridge */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#041024]/90 via-[#020917]/95 to-[#01040a]/98 border border-cyan-500/30 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(0,210,255,0.12)] space-y-6">
        
        {/* Top Tactical Command HUD */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-cyan-500/20">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#051833]/80 border border-cyan-400/40 text-[11px] font-mono text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-[#00d2ff] animate-ping"></span>
              <span className="tracking-wider uppercase font-bold">03 / TACTICAL MISSION CONTROL</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight flex items-center gap-2.5">
              <span>Deploy Autonomous Entity</span>
              <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                PUMP.FUN LIVE
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2.5 font-mono text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-[#04142c] border border-cyan-500/30 text-center">
              <span className="text-slate-400 block text-[9px]">SOL NETWORK GAS</span>
              <span className="text-[#00ffa3] font-bold">~0.0001 SOL</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-[#04142c] border border-cyan-500/30 text-center">
              <span className="text-slate-400 block text-[9px]">RADAR STATUS</span>
              <span className="text-[#00d2ff] font-bold">ARMED</span>
            </div>
          </div>
        </div>

        {/* 2-Column Bridge Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Specimen Holographic Identity Card */}
          <div className="lg:col-span-4 space-y-3">
            <div className="p-5 rounded-3xl bg-gradient-to-b from-[#061936] to-[#020b1a] border border-cyan-500/30 text-center space-y-3.5 shadow-xl relative overflow-hidden">
              <div className="relative w-32 h-32 mx-auto rounded-2xl bg-[#01040a] border-2 border-cyan-400/50 overflow-hidden flex items-center justify-center shadow-[0_0_25px_rgba(0,210,255,0.2)]">
                {imageDataUrl ? (
                  <img src={imageDataUrl} alt="Marine Entity" className="w-full h-full object-cover" />
                ) : (
                  <Waves className="w-12 h-12 text-[#00d2ff] animate-pulse" />
                )}
                <div className="absolute top-1.5 right-1.5 text-xs">
                  {activeSpeciesData.icon}
                </div>
              </div>

              <div>
                <h3 className="text-white text-base font-black font-heading tracking-tight">{formData.name || 'Unnamed Specimen'}</h3>
                <span className="text-[#00d2ff] font-mono text-sm font-bold tracking-wider">${formData.symbol || 'TICKER'}</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#01040a]/80 border border-cyan-500/20 text-left font-mono text-xs space-y-1.5">
                <div className="flex justify-between text-slate-300">
                  <span>Species:</span>
                  <span className="text-white font-bold">{activeSpeciesData.name}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Directive:</span>
                  <span className="text-[#00ffa3] font-bold">{formData.strategy || 'Dip Sniper'}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Risk Vector:</span>
                  <span className="text-[#ffb703] font-bold">{formData.riskProfile || 'Aggressive'}</span>
                </div>
              </div>

              <button
                onClick={onBackToStudio}
                className="w-full py-2 rounded-xl bg-[#030e20] hover:bg-[#071c3d] border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold transition-all"
              >
                ← Morph Entity DNA
              </button>
            </div>
          </div>

          {/* Right Column: Mission Matrix Sub-Tabs */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Tab Pills */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#020712] border border-cyan-500/30 font-mono text-xs">
              <button
                onClick={() => setActiveTab('agent')}
                className={`flex-1 py-2 rounded-xl transition-all font-bold flex items-center justify-center gap-2 ${
                  activeTab === 'agent'
                    ? 'bg-gradient-to-r from-[#00d2ff] to-[#00ffa3] text-[#020712] shadow-[0_0_15px_rgba(0,210,255,0.3)]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Brain className="w-3.5 h-3.5" />
                <span>1. Strategy Matrix</span>
              </button>
              <button
                onClick={() => setActiveTab('pool')}
                className={`flex-1 py-2 rounded-xl transition-all font-bold flex items-center justify-center gap-2 ${
                  activeTab === 'pool'
                    ? 'bg-gradient-to-r from-[#00d2ff] to-[#00ffa3] text-[#020712] shadow-[0_0_15px_rgba(0,210,255,0.3)]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Droplets className="w-3.5 h-3.5" />
                <span>2. Treasury Vault</span>
              </button>
              <button
                onClick={() => setActiveTab('deploy')}
                className={`flex-1 py-2 rounded-xl transition-all font-bold flex items-center justify-center gap-2 ${
                  activeTab === 'deploy'
                    ? 'bg-gradient-to-r from-[#00d2ff] to-[#00ffa3] text-[#020712] shadow-[0_0_15px_rgba(0,210,255,0.3)]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Rocket className="w-3.5 h-3.5" />
                <span>3. Ignition & Launch</span>
              </button>
            </div>

            {/* TAB 1: IDENTITY & STRATEGY */}
            {activeTab === 'agent' && (
              <div className="p-5 rounded-3xl bg-[#020712]/90 border border-cyan-500/25 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono text-cyan-300 mb-1.5 block font-bold uppercase">
                      Entity Call-Sign <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Neon Angler Core"
                      value={formData.name || ''}
                      onChange={(e) => onFormChange('name', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#01040a] border border-cyan-500/30 text-white font-mono text-xs focus:outline-none focus:border-[#00d2ff]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-cyan-300 mb-1.5 block font-bold uppercase">
                      Ticker Symbol <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ANGLER"
                      value={formData.symbol || ''}
                      onChange={(e) => onFormChange('symbol', e.target.value.toUpperCase())}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#01040a] border border-cyan-500/30 text-white font-mono text-xs focus:outline-none focus:border-[#00d2ff] uppercase font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-cyan-300 mb-1.5 block font-bold uppercase">Autonomous Mission Directive</label>
                  <textarea
                    rows={2}
                    placeholder="Describe your creature's autonomous trading instincts across the Solana deep trench..."
                    value={formData.description || ''}
                    onChange={(e) => onFormChange('description', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#01040a] border border-cyan-500/30 text-white text-xs leading-relaxed focus:outline-none focus:border-[#00d2ff]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono text-cyan-300 mb-1.5 block font-bold uppercase">Tactical Strategy</label>
                    <select
                      value={formData.strategy || 'Dip Sniper & Deep Alpha'}
                      onChange={(e) => onFormChange('strategy', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#01040a] border border-cyan-500/30 text-white font-mono text-xs focus:outline-none focus:border-[#00d2ff]"
                    >
                      <option value="Dip Sniper & Deep Alpha">Dip Sniper & Deep Alpha</option>
                      <option value="Momentum Hunter">Aggressive Momentum Hunter</option>
                      <option value="Liquidity Float & Yield">Liquidity Float & Yield</option>
                      <option value="High-Frequency Arbitrage">High-Frequency Arbitrage</option>
                      <option value="Anti-Dump Fortress">Anti-Dump Fortress</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-cyan-300 mb-1.5 block font-bold uppercase">Risk Profile</label>
                    <select
                      value={formData.riskProfile || 'Aggressive'}
                      onChange={(e) => onFormChange('riskProfile', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#01040a] border border-cyan-500/30 text-white font-mono text-xs focus:outline-none focus:border-[#00d2ff]"
                    >
                      <option value="Aggressive">Aggressive (High Alpha)</option>
                      <option value="Degenerate">Predatory (Volume Surges)</option>
                      <option value="Balanced">Balanced (Sustainable Yield)</option>
                      <option value="Defensive">Defensive (Floor Guard)</option>
                    </select>
                  </div>
                </div>

                {/* Social Radios */}
                <div className="pt-2 border-t border-cyan-500/20 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
                  <div className="flex items-center gap-2 bg-[#01040a] px-3 py-2 rounded-xl border border-cyan-500/30">
                    <TwitterIcon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="https://x.com/..."
                      value={formData.twitter || ''}
                      onChange={(e) => onFormChange('twitter', e.target.value)}
                      className="bg-transparent border-none text-white text-xs w-full focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2 bg-[#01040a] px-3 py-2 rounded-xl border border-cyan-500/30">
                    <Send className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="https://t.me/..."
                      value={formData.telegram || ''}
                      onChange={(e) => onFormChange('telegram', e.target.value)}
                      className="bg-transparent border-none text-white text-xs w-full focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2 bg-[#01040a] px-3 py-2 rounded-xl border border-cyan-500/30">
                    <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="https://..."
                      value={formData.website || ''}
                      onChange={(e) => onFormChange('website', e.target.value)}
                      className="bg-transparent border-none text-white text-xs w-full focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('pool')}
                  className="w-full py-2.5 rounded-xl bg-[#061936] hover:bg-[#0a2957] border border-cyan-400/40 text-cyan-200 text-xs font-mono font-bold transition-all"
                >
                  Proceed to Treasury Pool Config →
                </button>
              </div>
            )}

            {/* TAB 2: TREASURY POOLS */}
            {activeTab === 'pool' && (
              <div className="p-5 rounded-3xl bg-[#020712]/90 border border-cyan-500/25 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
                  <div>
                    <h4 className="text-white text-sm font-heading font-bold">Community Faucet Vault</h4>
                    <p className="text-slate-300 text-xs mt-0.5">Let community members claim drip supply by solving AI riddles.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.faucetEnabled !== false}
                      onChange={handleTogglePool}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00ffa3]"></div>
                  </label>
                </div>

                {formData.faucetEnabled !== false && (
                  <div className="space-y-3 font-mono text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-cyan-300 block mb-1 font-bold">Claim Drip Amount (Tokens)</label>
                        <input
                          type="number"
                          value={formData.faucetClaimAmount || '5000'}
                          onChange={(e) => onFormChange('faucetClaimAmount', e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#01040a] border border-cyan-500/30 text-white focus:outline-none focus:border-[#00d2ff]"
                        />
                      </div>

                      <div>
                        <label className="text-cyan-300 block mb-1 font-bold">Verification Mode</label>
                        <select
                          value={formData.faucetClaimMode || 'ai_challenge'}
                          onChange={(e) => onFormChange('faucetClaimMode', e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#01040a] border border-cyan-500/30 text-white focus:outline-none focus:border-[#00d2ff]"
                        >
                          <option value="ai_challenge">AI Cognitive Riddle</option>
                          <option value="instant_drip">Instant Cooldown Drip</option>
                        </select>
                      </div>
                    </div>

                    {formData.faucetClaimMode === 'ai_challenge' && (
                      <div className="space-y-2.5 bg-[#01040a] p-3.5 rounded-2xl border border-cyan-500/25">
                        <div>
                          <label className="text-slate-300 block mb-1">Entity's Secret Riddle Prompt</label>
                          <input
                            type="text"
                            value={formData.faucetChallengePrompt || 'What is the secret fuel of the Solana ocean depths?'}
                            onChange={(e) => onFormChange('faucetChallengePrompt', e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl bg-[#020712] border border-cyan-500/30 text-white text-xs focus:outline-none focus:border-[#00d2ff]"
                          />
                        </div>

                        <div>
                          <label className="text-slate-300 block mb-1">Accepted Secret Keyword</label>
                          <input
                            type="text"
                            value={formData.faucetChallengeAnswer || 'liquidity'}
                            onChange={(e) => onFormChange('faucetChallengeAnswer', e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl bg-[#020712] border border-cyan-500/30 text-white text-xs focus:outline-none focus:border-[#00d2ff]"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={() => setActiveTab('deploy')}
                  className="w-full py-2.5 rounded-xl bg-[#061936] hover:bg-[#0a2957] border border-cyan-400/40 text-cyan-200 text-xs font-mono font-bold transition-all"
                >
                  Proceed to Ignition Settings →
                </button>
              </div>
            )}

            {/* TAB 3: IGNITION & DEPLOY */}
            {activeTab === 'deploy' && (
              <div className="p-5 rounded-3xl bg-[#020712]/90 border border-cyan-500/25 space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-cyan-300 block mb-1 font-bold">
                      Initial Dev Sniping (SOL)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.0"
                      value={formData.initialBuySol || '0'}
                      onChange={(e) => onFormChange('initialBuySol', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#01040a] border border-cyan-500/30 text-white focus:outline-none focus:border-[#00d2ff]"
                    />
                  </div>

                  <div>
                    <label className="text-cyan-300 block mb-1 font-bold">
                      Launch Slippage Tolerance (%)
                    </label>
                    <input
                      type="number"
                      placeholder="10"
                      value={formData.slippage || '10'}
                      onChange={(e) => onFormChange('slippage', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#01040a] border border-cyan-500/30 text-white focus:outline-none focus:border-[#00d2ff]"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#01040a] border border-cyan-500/20 space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Destination:</span>
                    <span className="text-[#00ffa3] font-bold">Pump.fun Solana Bonding Curve</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Creation Gas:</span>
                    <span className="text-white font-bold">~0.0001 SOL</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Autonomous Radar:</span>
                    <span className="text-[#00d2ff] font-bold">Armed & Synced</span>
                  </div>
                </div>

                {statusMessage && (
                  <div className="p-3 rounded-2xl bg-[#061936] border border-cyan-400/50 text-cyan-200 text-xs text-center animate-pulse font-bold">
                    {statusMessage}
                  </div>
                )}

                <button
                  onClick={onLaunch}
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#00d2ff] via-[#00ffa3] to-[#38bdf8] hover:opacity-95 text-[#020712] font-heading font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-[0_0_35px_rgba(0,210,255,0.5)] transition-all transform active:scale-95 disabled:opacity-50"
                >
                  <Rocket className="w-5 h-5 fill-current" />
                  <span>{loading ? 'TRANSMITTING ON-CHAIN TO SOLANA...' : 'IGNITE & LAUNCH ON PUMP.FUN'}</span>
                </button>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}

export default TokenForm;
