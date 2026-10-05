import React, { useState } from 'react';
import { Rocket, Sparkles, Brain, Droplets, Shield, Zap, Info, Send, Globe, ChevronDown } from 'lucide-react';
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

  const handleToggleFaucet = (e) => {
    const isChecked = e.target.checked;
    onFormChange('faucetEnabled', isChecked);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 font-mono text-xs mb-3">
          <Brain className="w-3.5 h-3.5" />
          <span>AUTONOMOUS AGENT & FAUCET ARCHITECT</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-2">
          Configure Your <span className="text-gradient-cyan">AI Marine Agent</span>
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base">
          Define your creature's trading strategy, personality core, and configure its community Faucet Pool before launching on Pump.fun.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column: Fish Avatar & Spec Summary */}
        <div className="md:col-span-4 space-y-4">
          <div className="glass-panel rounded-3xl p-5 border border-cyan-500/20 text-center space-y-3">
            <div className="relative w-40 h-40 mx-auto rounded-2xl bg-slate-950 border-2 border-cyan-400/50 overflow-hidden shadow-[0_0_30px_rgba(0,245,255,0.25)] flex items-center justify-center">
              {imageDataUrl ? (
                <img src={imageDataUrl} alt="Marine Fish" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl">🐟</span>
              )}
            </div>

            <div>
              <h3 className="font-extrabold text-white text-lg">{formData.name || 'Unnamed Creature'}</h3>
              <p className="text-cyan-400 font-mono text-sm font-bold">${formData.symbol || 'TICKER'}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-left font-mono text-xs space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Species:</span>
                <span className="text-cyan-300 font-bold">{activeSpeciesData.name}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Role:</span>
                <span className="text-emerald-300 font-bold">{activeSpeciesData.role}</span>
              </div>
            </div>

            <button
              onClick={onBackToStudio}
              className="text-xs text-slate-400 hover:text-cyan-300 font-mono underline transition-colors"
            >
              ← Edit Fish Design
            </button>
          </div>
        </div>

        {/* Right Column: Form Tabs & Fields */}
        <div className="md:col-span-8 space-y-5">
          
          {/* Sub Tabs */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-cyan-500/20 font-mono text-xs">
            <button
              onClick={() => setActiveTab('agent')}
              className={`flex-1 py-2 rounded-xl transition-all font-bold flex items-center justify-center gap-1.5 ${
                activeTab === 'agent' ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,245,255,0.3)]' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>1. Identity & Brain</span>
            </button>
            <button
              onClick={() => setActiveTab('faucet')}
              className={`flex-1 py-2 rounded-xl transition-all font-bold flex items-center justify-center gap-1.5 ${
                activeTab === 'faucet' ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,245,255,0.3)]' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>2. Faucet Protocol</span>
            </button>
            <button
              onClick={() => setActiveTab('trading')}
              className={`flex-1 py-2 rounded-xl transition-all font-bold flex items-center justify-center gap-1.5 ${
                activeTab === 'trading' ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,245,255,0.3)]' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>3. Launch & Dev Buy</span>
            </button>
          </div>

          {/* TAB 1: IDENTITY & BRAIN */}
          {activeTab === 'agent' && (
            <div className="glass-panel rounded-3xl p-6 border border-cyan-500/20 space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-slate-300 mb-1.5 block font-bold">
                    Agent Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Neon Angler AI"
                    value={formData.name || ''}
                    onChange={(e) => onFormChange('name', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-cyan-500/30 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-300 mb-1.5 block font-bold">
                    Ticker Symbol <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ANGLER"
                    value={formData.symbol || ''}
                    onChange={(e) => onFormChange('symbol', e.target.value.toUpperCase())}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-cyan-500/30 text-white font-mono text-sm focus:outline-none focus:border-cyan-400 uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 mb-1.5 block font-bold">Agent Lore & Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe your creature's autonomous mission in the Solana deep sea..."
                  value={formData.description || ''}
                  onChange={(e) => onFormChange('description', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-cyan-500/30 text-white text-xs leading-relaxed focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-slate-300 mb-1.5 block font-bold">Strategy Archetype</label>
                  <select
                    value={formData.strategy || 'Dip Sniper & Deep Alpha'}
                    onChange={(e) => onFormChange('strategy', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-cyan-500/30 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Dip Sniper & Deep Alpha">🏮 Dip Sniper & Deep Alpha</option>
                    <option value="Momentum Hunter">🦈 Aggressive Momentum Hunter</option>
                    <option value="Liquidity Float & Yield">🪼 Liquidity Float & Yield</option>
                    <option value="High-Frequency Arbitrage">⚡ High-Frequency Arbitrage</option>
                    <option value="Anti-Dump Fortress">🐡 Anti-Dump Fortress</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-300 mb-1.5 block font-bold">Risk Appetite</label>
                  <select
                    value={formData.riskProfile || 'Aggressive'}
                    onChange={(e) => onFormChange('riskProfile', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-cyan-500/30 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Degenerate">💥 Degenerate (Max Volume)</option>
                    <option value="Aggressive">⚡ Aggressive (Dip Alpha)</option>
                    <option value="Balanced">⚖️ Balanced (Frictionless Float)</option>
                    <option value="Fortress">🛡️ Fortress (Diamond Hands)</option>
                  </select>
                </div>
              </div>

              {/* Social Links */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="relative">
                  <div className="text-slate-500 absolute left-3 top-1/2 -translate-y-1/2">
                    <TwitterIcon />
                  </div>
                  <input
                    type="text"
                    placeholder="X / Twitter"
                    value={formData.twitter || ''}
                    onChange={(e) => onFormChange('twitter', e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div className="relative">
                  <Send className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Telegram"
                    value={formData.telegram || ''}
                    onChange={(e) => onFormChange('telegram', e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div className="relative">
                  <Globe className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Website"
                    value={formData.website || ''}
                    onChange={(e) => onFormChange('website', e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: AUTONOMOUS FAUCET PROTOCOL (FAUPAD) */}
          {activeTab === 'faucet' && (
            <div className="glass-panel rounded-3xl p-6 border border-cyan-500/20 space-y-4">
              
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30">
                <div className="flex items-center gap-3">
                  <Droplets className="w-6 h-6 text-emerald-400" />
                  <div>
                    <h4 className="font-bold text-white text-sm">Deploy Autonomous Faucet Vault</h4>
                    <p className="text-xs text-slate-400">Lock initial tokens in custody for community challenges and drips.</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.faucetEnabled !== false}
                  onChange={handleToggleFaucet}
                  className="w-5 h-5 accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-slate-300 mb-1.5 block font-bold">Claim Mechanism</label>
                  <select
                    value={formData.faucetClaimMode || 'ai_challenge'}
                    onChange={(e) => onFormChange('faucetClaimMode', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-cyan-500/30 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                  >
                    <option value="ai_challenge">🧠 AI Brain Challenge / Riddle Solver</option>
                    <option value="instant_drip">⚡ Instant Deep-Sea Drip</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-300 mb-1.5 block font-bold">Drop Amount Per Claim</label>
                  <input
                    type="number"
                    placeholder="e.g. 5000"
                    value={formData.faucetClaimAmount || '5000'}
                    onChange={(e) => onFormChange('faucetClaimAmount', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-cyan-500/30 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {formData.faucetClaimMode === 'ai_challenge' && (
                <div className="space-y-3 p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30">
                  <div>
                    <label className="text-xs font-mono text-cyan-300 mb-1 block">Aquatic Riddle / Challenge Question</label>
                    <input
                      type="text"
                      placeholder="e.g. What lurks in the deepest trench that never sleeps?"
                      value={formData.faucetChallengePrompt || ''}
                      onChange={(e) => onFormChange('faucetChallengePrompt', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-cyan-300 mb-1 block">Secret Keyword / Answer</label>
                    <input
                      type="text"
                      placeholder="e.g. liquidity"
                      value={formData.faucetChallengeAnswer || ''}
                      onChange={(e) => onFormChange('faucetChallengeAnswer', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 3: LAUNCH & DEV BUY */}
          {activeTab === 'trading' && (
            <div className="glass-panel rounded-3xl p-6 border border-cyan-500/20 space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-slate-300 mb-1.5 block font-bold">
                    Initial Dev Buy (SOL)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.0 (optional)"
                    value={formData.initialBuySol || '0'}
                    onChange={(e) => onFormChange('initialBuySol', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-cyan-500/30 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Snipe your own coin bonding curve at genesis block.
                  </span>
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-300 mb-1.5 block font-bold">Slippage (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formData.slippage || '10'}
                    onChange={(e) => onFormChange('slippage', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-cyan-500/30 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Protocol Fee Notice */}
              <div className="p-4 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span>PumpPortal + Solana Fee:</span>
                  <span className="text-cyan-400 font-bold">~0.005 SOL</span>
                </div>
                <div className="flex justify-between">
                  <span>AgenSea Protocol Fee:</span>
                  <span className="text-cyan-400 font-bold">0.02 SOL</span>
                </div>
              </div>

            </div>
          )}

          {/* Status Message */}
          {statusMessage && (
            <div className="p-4 rounded-2xl bg-cyan-950/80 border border-cyan-400 text-cyan-300 font-mono text-xs animate-pulse">
              🌊 {statusMessage}
            </div>
          )}

          {/* Master Launch Button */}
          <button
            onClick={onLaunch}
            disabled={loading}
            className="ocean-btn-primary w-full py-4 rounded-2xl font-extrabold text-base flex items-center justify-center gap-2 shadow-2xl transition-all"
          >
            <Rocket className="w-5 h-5" />
            <span>{loading ? 'Executing Marine Deployment...' : 'Spawn & Launch Coin to Pump.fun'}</span>
          </button>

        </div>

      </div>
    </div>
  );
}
