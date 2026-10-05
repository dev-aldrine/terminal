import React, { useState } from 'react';
import { Rocket, Brain, Droplets, Zap, Send, Globe, Waves, Activity, Shield } from 'lucide-react';
import { SPECIES_LIST } from './FishStudio';
import BorderGlow from './BorderGlow';

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
    <div className="w-full max-w-4xl mx-auto my-auto select-none">
      <BorderGlow
        edgeSensitivity={35}
        glowColor="190 100 65"
        backgroundColor="rgba(6, 16, 36, 0.45)"
        borderRadius={24}
        glowRadius={36}
        glowIntensity={1.2}
        coneSpread={28}
        animated={false}
        colors={['#00d2ff', '#00ffa3', '#38bdf8']}
        className="w-full backdrop-blur-xl border border-cyan-400/30 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(0,210,255,0.08)]"
      >
        <div className="p-6 sm:p-7 space-y-4">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#040a16]/80 border border-cyan-400/40 text-[10px] font-mono text-cyan-300 mb-1">
                <Brain className="w-3 h-3 text-[#00ffa3]" />
                <span>03 / AGENT BRAIN & STRATEGY</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-heading">
                Configure Agent Brain & Launch
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            
            {/* Left Column: Avatar & Summary */}
            <div className="md:col-span-4 space-y-2.5">
              <div className="p-4 rounded-2xl bg-[#030914]/75 border border-cyan-400/25 text-center space-y-2.5 shadow-md">
                <div className="relative w-28 h-28 mx-auto rounded-xl bg-[#020610] border border-cyan-500/30 overflow-hidden flex items-center justify-center shadow-inner">
                  {imageDataUrl ? (
                    <img src={imageDataUrl} alt="Marine Entity" className="w-full h-full object-cover" />
                  ) : (
                    <Waves className="w-10 h-10 text-[#00d2ff]" />
                  )}
                </div>

                <div>
                  <strong className="text-white text-sm block font-heading">{formData.name || 'Unnamed Entity'}</strong>
                  <span className="text-[#00d2ff] font-mono text-xs font-bold">${formData.symbol || 'TICKER'}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#020610]/80 border border-cyan-500/15 text-left font-mono text-[11px] space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Archetype:</span>
                    <span className="text-white font-semibold">{activeSpeciesData.name}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Role:</span>
                    <span className="text-[#00ffa3]">{activeSpeciesData.role.split(' ')[0]}</span>
                  </div>
                </div>

                <button
                  onClick={onBackToStudio}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-mono transition-colors block mx-auto pt-0.5"
                >
                  ← Edit Entity Visuals
                </button>
              </div>
            </div>

            {/* Right Column: Form Tabs */}
            <div className="md:col-span-8 space-y-3">
              
              {/* Sub Navigation */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#030914]/75 border border-cyan-500/25 font-mono text-xs">
                <button
                  onClick={() => setActiveTab('agent')}
                  className={`flex-1 py-1.5 rounded-lg transition-all font-semibold flex items-center justify-center gap-1.5 ${
                    activeTab === 'agent' ? 'bg-[#08152b] border border-[#00d2ff] text-[#00d2ff]' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Brain className="w-3 h-3" />
                  <span>1. Strategy</span>
                </button>
                <button
                  onClick={() => setActiveTab('pool')}
                  className={`flex-1 py-1.5 rounded-lg transition-all font-semibold flex items-center justify-center gap-1.5 ${
                    activeTab === 'pool' ? 'bg-[#08152b] border border-[#00d2ff] text-[#00d2ff]' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Droplets className="w-3 h-3" />
                  <span>2. Treasury Pool</span>
                </button>
                <button
                  onClick={() => setActiveTab('deploy')}
                  className={`flex-1 py-1.5 rounded-lg transition-all font-semibold flex items-center justify-center gap-1.5 ${
                    activeTab === 'deploy' ? 'bg-[#08152b] border border-[#00d2ff] text-[#00d2ff]' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Rocket className="w-3 h-3" />
                  <span>3. Deploy</span>
                </button>
              </div>

              {/* TAB 1: AGENT IDENTITY & STRATEGY */}
              {activeTab === 'agent' && (
                <div className="p-4 rounded-2xl bg-[#030914]/75 border border-cyan-400/25 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-mono text-slate-200 mb-1 block font-semibold">
                        Entity Name <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Neon Angler Core"
                        value={formData.name || ''}
                        onChange={(e) => onFormChange('name', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#020610]/90 border border-cyan-500/20 text-white font-mono text-xs focus:outline-none focus:border-[#00d2ff]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono text-slate-200 mb-1 block font-semibold">
                        Ticker Symbol <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ANGLER"
                        value={formData.symbol || ''}
                        onChange={(e) => onFormChange('symbol', e.target.value.toUpperCase())}
                        className="w-full px-3 py-2 rounded-xl bg-[#020610]/90 border border-cyan-500/20 text-white font-mono text-xs focus:outline-none focus:border-[#00d2ff] uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-200 mb-1 block font-semibold">Agent Mission Directive</label>
                    <textarea
                      rows={2}
                      placeholder="Describe your creature's autonomous strategy across the Solana deep-sea..."
                      value={formData.description || ''}
                      onChange={(e) => onFormChange('description', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#020610]/90 border border-cyan-500/20 text-white text-xs leading-relaxed focus:outline-none focus:border-[#00d2ff]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-mono text-slate-200 mb-1 block font-semibold">Strategy Archetype</label>
                      <select
                        value={formData.strategy || 'Dip Sniper & Deep Alpha'}
                        onChange={(e) => onFormChange('strategy', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#020610]/90 border border-cyan-500/20 text-white font-mono text-xs focus:outline-none focus:border-[#00d2ff]"
                      >
                        <option value="Dip Sniper & Deep Alpha">Dip Sniper & Deep Alpha</option>
                        <option value="Momentum Hunter">Aggressive Momentum Hunter</option>
                        <option value="Liquidity Float & Yield">Liquidity Float & Yield</option>
                        <option value="High-Frequency Arbitrage">High-Frequency Arbitrage</option>
                        <option value="Anti-Dump Fortress">Anti-Dump Fortress</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-mono text-slate-200 mb-1 block font-semibold">Risk Appetite</label>
                      <select
                        value={formData.riskProfile || 'Aggressive'}
                        onChange={(e) => onFormChange('riskProfile', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#020610]/90 border border-cyan-500/20 text-white font-mono text-xs focus:outline-none focus:border-[#00d2ff]"
                      >
                        <option value="Aggressive">Aggressive (High Alpha)</option>
                        <option value="Degenerate">Predatory (Volume Waves)</option>
                        <option value="Balanced">Balanced (Sustainable Yield)</option>
                        <option value="Defensive">Defensive (Floor Shield)</option>
                      </select>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="pt-2 border-t border-cyan-500/20 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                    <div className="flex items-center gap-1.5 bg-[#020610]/90 px-2.5 py-1.5 rounded-lg border border-cyan-500/20">
                      <TwitterIcon className="w-3 h-3 text-cyan-400 shrink-0" />
                      <input
                        type="text"
                        placeholder="https://x.com/..."
                        value={formData.twitter || ''}
                        onChange={(e) => onFormChange('twitter', e.target.value)}
                        className="bg-transparent border-none text-white text-xs w-full focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 bg-[#020610]/90 px-2.5 py-1.5 rounded-lg border border-cyan-500/20">
                      <Send className="w-3 h-3 text-cyan-400 shrink-0" />
                      <input
                        type="text"
                        placeholder="https://t.me/..."
                        value={formData.telegram || ''}
                        onChange={(e) => onFormChange('telegram', e.target.value)}
                        className="bg-transparent border-none text-white text-xs w-full focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 bg-[#020610]/90 px-2.5 py-1.5 rounded-lg border border-cyan-500/20">
                      <Globe className="w-3 h-3 text-cyan-400 shrink-0" />
                      <input
                        type="text"
                        placeholder="https://..."
                        value={formData.website || ''}
                        onChange={(e) => onFormChange('website', e.target.value)}
                        className="bg-transparent border-none text-white text-xs w-full focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: TREASURY POOLS */}
              {activeTab === 'pool' && (
                <div className="p-4 rounded-2xl bg-[#030914]/75 border border-cyan-400/25 space-y-3">
                  <div className="flex items-center justify-between pb-2.5 border-b border-cyan-500/20">
                    <div>
                      <h4 className="text-white text-xs font-heading font-semibold">Enable Community Treasury Pool</h4>
                      <p className="text-slate-300 text-[11px] mt-0.5">Let community members claim supply via cognitive challenges.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.faucetEnabled !== false}
                        onChange={handleTogglePool}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-[#020610] border border-cyan-500/40 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#00d2ff] after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#08152b] peer-checked:border-[#00d2ff]"></div>
                    </label>
                  </div>

                  {formData.faucetEnabled !== false && (
                    <div className="space-y-3 pt-1">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-mono text-slate-200 mb-1 block font-semibold">
                            Tokens Per Claim
                          </label>
                          <input
                            type="number"
                            placeholder="5000"
                            value={formData.faucetClaimAmount || '5000'}
                            onChange={(e) => onFormChange('faucetClaimAmount', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-[#020610]/90 border border-cyan-500/20 text-white font-mono text-xs focus:outline-none focus:border-[#00d2ff]"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-mono text-slate-200 mb-1 block font-semibold">
                            Verification Mode
                          </label>
                          <select
                            value={formData.faucetClaimMode || 'ai_challenge'}
                            onChange={(e) => onFormChange('faucetClaimMode', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-[#020610]/90 border border-cyan-500/20 text-white font-mono text-xs focus:outline-none focus:border-[#00d2ff]"
                          >
                            <option value="ai_challenge">AI Cognitive Gate (Natural Language)</option>
                            <option value="instant_drip">Timed Direct Drip</option>
                          </select>
                        </div>
                      </div>

                      {formData.faucetClaimMode === 'ai_challenge' && (
                        <div className="p-3 rounded-xl bg-[#020610]/90 border border-cyan-500/20 space-y-2 font-mono text-xs">
                          <div>
                            <label className="text-slate-300 mb-1 block text-[10px] font-semibold">AI Riddle Prompt</label>
                            <input
                              type="text"
                              placeholder="What is the lifeblood of the Solana deep-sea?"
                              value={formData.faucetChallengePrompt || ''}
                              onChange={(e) => onFormChange('faucetChallengePrompt', e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg bg-[#08152b] border border-cyan-500/30 text-white text-xs focus:outline-none focus:border-[#00d2ff]"
                            />
                          </div>
                          <div>
                            <label className="text-slate-300 mb-1 block text-[10px] font-semibold">Accepted Keyword Answer</label>
                            <input
                              type="text"
                              placeholder="liquidity"
                              value={formData.faucetChallengeAnswer || ''}
                              onChange={(e) => onFormChange('faucetChallengeAnswer', e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg bg-[#08152b] border border-cyan-500/30 text-white text-xs focus:outline-none focus:border-[#00d2ff]"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: DEPLOY */}
              {activeTab === 'deploy' && (
                <div className="p-4 rounded-2xl bg-[#030914]/75 border border-cyan-400/25 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-mono text-slate-200 mb-1 block font-semibold">
                        Genesis Buy (SOL)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.0 (optional)"
                        value={formData.initialBuySol || '0'}
                        onChange={(e) => onFormChange('initialBuySol', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#020610]/90 border border-cyan-500/20 text-white font-mono text-xs focus:outline-none focus:border-[#00d2ff]"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block font-mono">
                        Optional initial dev buy on the bonding curve.
                      </span>
                    </div>

                    <div>
                      <label className="text-xs font-mono text-slate-200 mb-1 block font-semibold">Slippage (%)</label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={formData.slippage || '10'}
                        onChange={(e) => onFormChange('slippage', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#020610]/90 border border-cyan-500/20 text-white font-mono text-xs focus:outline-none focus:border-[#00d2ff]"
                      />
                    </div>
                  </div>

                  {/* Gas Fee Notice */}
                  <div className="p-3 rounded-xl bg-[#020610]/90 border border-cyan-500/20 text-xs font-mono space-y-1 text-slate-300">
                    <div className="flex justify-between">
                      <span>Solana Gas & PumpPortal:</span>
                      <span className="text-[#00ffa3] font-bold">~0.0001 SOL (Almost Free)</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Protocol Launch Tax:</span>
                      <span className="text-cyan-300">0% (Zero Tax)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Message */}
              {statusMessage && (
                <div className="p-3 rounded-xl bg-[#08152b] border border-[#00d2ff]/50 text-[#00d2ff] font-mono text-xs animate-pulse">
                  ⚡ {statusMessage}
                </div>
              )}

              {/* Deploy CTA */}
              <button
                onClick={onLaunch}
                disabled={loading}
                className="btn-primary w-full py-3 text-sm font-bold shadow-[0_0_25px_rgba(0,210,255,0.3)] rounded-xl"
              >
                <Rocket className="w-4 h-4" />
                <span>{loading ? 'Broadcasting to Solana...' : 'Deploy Marine Entity to Pump.fun (~0.0001 SOL)'}</span>
              </button>

            </div>

          </div>

        </div>
      </BorderGlow>
    </div>
  );
}

export default TokenForm;
