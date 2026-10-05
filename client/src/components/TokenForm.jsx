import React, { useState } from 'react';
import { Rocket, Brain, Droplets, Zap, Send, Globe } from 'lucide-react';
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
    <div className="w-full max-w-4xl mx-auto py-6">
      
      {/* Header */}
      <div className="text-left mb-6 space-y-1">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-[#00ffa3]">
          <span>03 / AGENT BRAIN & DEPLOYMENT</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-heading">
          Configure Agent Brain & Launch
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm">
          Define your entity's strategy directive, set community treasury drips, and deploy on Pump.fun with ~0.0001 SOL network gas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column: Avatar & Summary */}
        <div className="md:col-span-4 space-y-3">
          <div className="editorial-card p-4 text-center space-y-3">
            <div className="relative w-36 h-36 mx-auto rounded-lg bg-[#05080f] border border-white/[0.12] overflow-hidden flex items-center justify-center">
              {imageDataUrl ? (
                <img src={imageDataUrl} alt="Marine Entity" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl">🐟</span>
              )}
            </div>

            <div>
              <strong className="text-white text-base block font-heading">{formData.name || 'Unnamed Entity'}</strong>
              <span className="text-[#00e5ff] font-mono text-xs font-bold">${formData.symbol || 'TICKER'}</span>
            </div>

            <div className="p-2.5 rounded bg-[#05080f] border border-white/[0.06] text-left font-mono text-xs space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Archetype:</span>
                <span className="text-white font-bold">{activeSpeciesData.name}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Role:</span>
                <span className="text-[#00ffa3]">{activeSpeciesData.role.split(' ')[0]}</span>
              </div>
            </div>

            <button
              onClick={onBackToStudio}
              className="text-xs text-slate-400 hover:text-[#00e5ff] font-mono underline transition-colors"
            >
              ← Edit Entity Visuals
            </button>
          </div>
        </div>

        {/* Right Column: Form Tabs */}
        <div className="md:col-span-8 space-y-4">
          
          {/* Sub Navigation */}
          <div className="flex items-center gap-2 p-1 rounded-lg bg-[#080d17] border border-white/[0.08] font-mono text-xs">
            <button
              onClick={() => setActiveTab('agent')}
              className={`flex-1 py-1.5 rounded transition-all font-semibold flex items-center justify-center gap-1.5 ${
                activeTab === 'agent' ? 'bg-[#0c1322] border border-[#00e5ff] text-[#00e5ff]' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>1. Strategy</span>
            </button>
            <button
              onClick={() => setActiveTab('pool')}
              className={`flex-1 py-1.5 rounded transition-all font-semibold flex items-center justify-center gap-1.5 ${
                activeTab === 'pool' ? 'bg-[#0c1322] border border-[#00e5ff] text-[#00e5ff]' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>2. Treasury Pool</span>
            </button>
            <button
              onClick={() => setActiveTab('deploy')}
              className={`flex-1 py-1.5 rounded transition-all font-semibold flex items-center justify-center gap-1.5 ${
                activeTab === 'deploy' ? 'bg-[#0c1322] border border-[#00e5ff] text-[#00e5ff]' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>3. Deploy</span>
            </button>
          </div>

          {/* TAB 1: STRATEGY & IDENTITY */}
          {activeTab === 'agent' && (
            <div className="editorial-card p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-slate-300 mb-1 block font-semibold">
                    Entity Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Neon Angler Core"
                    value={formData.name || ''}
                    onChange={(e) => onFormChange('name', e.target.value)}
                    className="w-full px-3 py-2 rounded bg-[#05080f] border border-white/[0.1] text-white font-mono text-xs focus:outline-none focus:border-[#00e5ff]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-300 mb-1 block font-semibold">
                    Ticker Symbol <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ANGLER"
                    value={formData.symbol || ''}
                    onChange={(e) => onFormChange('symbol', e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded bg-[#05080f] border border-white/[0.1] text-white font-mono text-xs focus:outline-none focus:border-[#00e5ff] uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 mb-1 block font-semibold">Agent Mission Directive</label>
                <textarea
                  rows={2}
                  placeholder="Describe your creature's autonomous strategy across the Solana deep-sea..."
                  value={formData.description || ''}
                  onChange={(e) => onFormChange('description', e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#05080f] border border-white/[0.1] text-white text-xs leading-relaxed focus:outline-none focus:border-[#00e5ff]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-slate-300 mb-1 block font-semibold">Strategy Archetype</label>
                  <select
                    value={formData.strategy || 'Dip Sniper & Deep Alpha'}
                    onChange={(e) => onFormChange('strategy', e.target.value)}
                    className="w-full px-3 py-2 rounded bg-[#05080f] border border-white/[0.1] text-white font-mono text-xs focus:outline-none focus:border-[#00e5ff]"
                  >
                    <option value="Dip Sniper & Deep Alpha">Dip Sniper & Deep Alpha</option>
                    <option value="Momentum Hunter">Aggressive Momentum Hunter</option>
                    <option value="Liquidity Float & Yield">Liquidity Float & Yield</option>
                    <option value="High-Frequency Arbitrage">High-Frequency Arbitrage</option>
                    <option value="Anti-Dump Fortress">Anti-Dump Fortress</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-300 mb-1 block font-semibold">Risk Appetite</label>
                  <select
                    value={formData.riskProfile || 'Aggressive'}
                    onChange={(e) => onFormChange('riskProfile', e.target.value)}
                    className="w-full px-3 py-2 rounded bg-[#05080f] border border-white/[0.1] text-white font-mono text-xs focus:outline-none focus:border-[#00e5ff]"
                  >
                    <option value="Degenerate">High Volume (Degen)</option>
                    <option value="Aggressive">Aggressive Alpha</option>
                    <option value="Balanced">Balanced Float</option>
                    <option value="Fortress">Fortress Defense</option>
                  </select>
                </div>
              </div>

              {/* Socials */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="relative">
                  <div className="text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2">
                    <TwitterIcon />
                  </div>
                  <input
                    type="text"
                    placeholder="X / Twitter"
                    value={formData.twitter || ''}
                    onChange={(e) => onFormChange('twitter', e.target.value)}
                    className="w-full pl-7 pr-2 py-1.5 rounded bg-[#05080f] border border-white/[0.08] text-white text-[11px] font-mono focus:outline-none focus:border-[#00e5ff]"
                  />
                </div>
                <div className="relative">
                  <Send className="w-3 h-3 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Telegram"
                    value={formData.telegram || ''}
                    onChange={(e) => onFormChange('telegram', e.target.value)}
                    className="w-full pl-7 pr-2 py-1.5 rounded bg-[#05080f] border border-white/[0.08] text-white text-[11px] font-mono focus:outline-none focus:border-[#00e5ff]"
                  />
                </div>
                <div className="relative">
                  <Globe className="w-3 h-3 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Website"
                    value={formData.website || ''}
                    onChange={(e) => onFormChange('website', e.target.value)}
                    className="w-full pl-7 pr-2 py-1.5 rounded bg-[#05080f] border border-white/[0.08] text-white text-[11px] font-mono focus:outline-none focus:border-[#00e5ff]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TREASURY POOLS */}
          {activeTab === 'pool' && (
            <div className="editorial-card p-5 space-y-4">
              <div className="flex items-center justify-between p-3 rounded bg-[#05080f] border border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <Droplets className="w-5 h-5 text-[#00ffa3]" />
                  <div>
                    <strong className="text-white text-xs block font-heading">Activate Community Treasury Pool</strong>
                    <span className="text-[11px] text-slate-400">Lock initial supply in custody for autonomous community drips and AI challenges.</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.faucetEnabled !== false}
                  onChange={handleTogglePool}
                  className="w-4 h-4 accent-[#00e5ff] cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-slate-300 mb-1 block font-semibold">Distribution Rule</label>
                  <select
                    value={formData.faucetClaimMode || 'ai_challenge'}
                    onChange={(e) => onFormChange('faucetClaimMode', e.target.value)}
                    className="w-full px-3 py-2 rounded bg-[#05080f] border border-white/[0.1] text-white font-mono text-xs focus:outline-none focus:border-[#00e5ff]"
                  >
                    <option value="ai_challenge">AI Brain Challenge / Riddle Solver</option>
                    <option value="instant_drip">Instant Timed Drip Cooldown</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-300 mb-1 block font-semibold">Drop Amount Per Claim</label>
                  <input
                    type="number"
                    placeholder="5000"
                    value={formData.faucetClaimAmount || '5000'}
                    onChange={(e) => onFormChange('faucetClaimAmount', e.target.value)}
                    className="w-full px-3 py-2 rounded bg-[#05080f] border border-white/[0.1] text-white font-mono text-xs focus:outline-none focus:border-[#00e5ff]"
                  />
                </div>
              </div>

              {formData.faucetClaimMode === 'ai_challenge' && (
                <div className="space-y-2.5 p-3 rounded bg-[#05080f] border border-white/[0.08]">
                  <div>
                    <label className="text-[11px] font-mono text-[#00e5ff] mb-1 block">Riddle / Vibe Check Question</label>
                    <input
                      type="text"
                      placeholder="e.g. What lurks in the deepest trench that never sleeps?"
                      value={formData.faucetChallengePrompt || ''}
                      onChange={(e) => onFormChange('faucetChallengePrompt', e.target.value)}
                      className="w-full px-3 py-1.5 rounded bg-[#080d17] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-[#00e5ff]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-[#00e5ff] mb-1 block">Secret Verification Keyword</label>
                    <input
                      type="text"
                      placeholder="liquidity"
                      value={formData.faucetChallengeAnswer || ''}
                      onChange={(e) => onFormChange('faucetChallengeAnswer', e.target.value)}
                      className="w-full px-3 py-1.5 rounded bg-[#080d17] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-[#00e5ff]"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DEPLOY */}
          {activeTab === 'deploy' && (
            <div className="editorial-card p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-slate-300 mb-1 block font-semibold">
                    Genesis Buy (SOL)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.0 (optional)"
                    value={formData.initialBuySol || '0'}
                    onChange={(e) => onFormChange('initialBuySol', e.target.value)}
                    className="w-full px-3 py-2 rounded bg-[#05080f] border border-white/[0.1] text-white font-mono text-xs focus:outline-none focus:border-[#00e5ff]"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Optional initial dev buy on the bonding curve.
                  </span>
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-300 mb-1 block font-semibold">Slippage (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formData.slippage || '10'}
                    onChange={(e) => onFormChange('slippage', e.target.value)}
                    className="w-full px-3 py-2 rounded bg-[#05080f] border border-white/[0.1] text-white font-mono text-xs focus:outline-none focus:border-[#00e5ff]"
                  />
                </div>
              </div>

              {/* Gas Fee Notice */}
              <div className="p-3 rounded bg-[#05080f] border border-white/[0.08] text-xs font-mono space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span>Solana Gas & PumpPortal:</span>
                  <span className="text-[#00ffa3] font-bold">~0.0001 SOL (Almost Free)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Protocol Tax:</span>
                  <span className="text-white">0% (Zero Tax)</span>
                </div>
              </div>
            </div>
          )}

          {/* Status Message */}
          {statusMessage && (
            <div className="p-3 rounded bg-[#0c1322] border border-[#00e5ff]/50 text-[#00e5ff] font-mono text-xs animate-pulse">
              ⚡ {statusMessage}
            </div>
          )}

          {/* Deploy CTA */}
          <button
            onClick={onLaunch}
            disabled={loading}
            className="btn-primary w-full py-3 text-sm font-bold shadow-lg"
          >
            <Rocket className="w-4 h-4" />
            <span>{loading ? 'Broadcasting to Solana...' : 'Deploy Marine Entity to Pump.fun (~0.0001 SOL)'}</span>
          </button>

        </div>

      </div>
    </div>
  );
}
