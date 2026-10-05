import React, { useState, useEffect, useRef } from 'react';
import { Waves, ExternalLink, Droplets, ArrowUpRight, Search, Zap, Activity, Shield, Sparkles, Filter, Compass, Disc } from 'lucide-react';

export function OceanAquarium({ tokens = [], onSelectTokenForPool, onOpenTerminal, onSpawnNew }) {
  const canvasRef = useRef(null);
  const [selectedToken, setSelectedToken] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState('aquarium');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTokens = tokens.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filterCategory === 'pools') return t.faucet && t.faucet.enabled;
    if (filterCategory === 'predators') return ['cyber_shark', 'neon_angler', 'volt_ray'].includes(t.species);
    if (filterCategory === 'liquidity') return ['bio_jelly', 'mecha_puffer', 'abyss_whale'].includes(t.species);
    return true;
  });

  useEffect(() => {
    if (viewMode !== 'aquarium') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    const fishes = filteredTokens.map((token, index) => {
      const curve = token.bondingCurvePercent || 15;
      const size = 26 + (curve / 100) * 38;
      return {
        ...token,
        x: Math.random() * (canvas.width - 160) + 80,
        y: Math.random() * (canvas.height - 160) + 80,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 0.8,
        size,
        baseAngle: 0,
        wiggleOffset: index * 1.6,
        color: token.species === 'neon_angler' ? '#00d2ff' :
               token.species === 'cyber_shark' ? '#00ffa3' :
               token.species === 'bio_jelly' ? '#38bdf8' :
               token.species === 'volt_ray' ? '#ffb703' : '#a855f7'
      };
    });

    const render = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep abyss oceanic gradient
      const bgGrad = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 60,
        canvas.width / 2, canvas.height / 2, canvas.width / 1.2
      );
      bgGrad.addColorStop(0, '#041024');
      bgGrad.addColorStop(0.7, '#020714');
      bgGrad.addColorStop(1, '#010308');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Sonar concentric rings
      ctx.strokeStyle = 'rgba(0, 210, 255, 0.06)';
      ctx.lineWidth = 1;
      const sweepAngle = (time * 0.001) % (Math.PI * 2);
      for (let r = 80; r < canvas.width; r += 90) {
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Rotating Sonar Beam Sweep
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(sweepAngle);
      const beamGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, canvas.width / 1.5);
      beamGrad.addColorStop(0, 'rgba(0, 210, 255, 0.14)');
      beamGrad.addColorStop(0.8, 'rgba(0, 255, 163, 0.03)');
      beamGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, canvas.width / 1.5, 0, Math.PI / 4);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Ambient plankton bubbles
      for (let i = 0; i < 26; i++) {
        const bx = (Math.sin(i * 77 + time * 0.0008) * 0.5 + 0.5) * canvas.width;
        const by = ((i * 43 + time * (0.2 + (i % 3) * 0.15)) % canvas.height);
        ctx.beginPath();
        ctx.arc(bx, canvas.height - by, (i % 3) + 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 210, 255, ${0.15 + (i % 4) * 0.06})`;
        ctx.fill();
      }

      // Render Fishes
      fishes.forEach((fish) => {
        fish.x += fish.vx;
        fish.y += fish.vy;

        if (fish.x < 50 || fish.x > canvas.width - 50) fish.vx *= -1;
        if (fish.y < 50 || fish.y > canvas.height - 50) fish.vy *= -1;

        const isFacingLeft = fish.vx < 0;
        const wiggle = Math.sin(time * 0.006 + fish.wiggleOffset) * 5;

        ctx.save();
        ctx.translate(fish.x, fish.y);
        if (isFacingLeft) ctx.scale(-1, 1);

        ctx.shadowColor = fish.color;
        ctx.shadowBlur = (fish.bondingCurvePercent / 100) * 22 + 10;

        // Fish Body
        ctx.fillStyle = fish.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, fish.size * 0.9, fish.size * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();

        // Tail
        ctx.beginPath();
        ctx.moveTo(-fish.size * 0.6, 0);
        ctx.lineTo(-fish.size * 1.3, -fish.size * 0.45 + wiggle);
        ctx.lineTo(-fish.size * 1.0, 0);
        ctx.lineTo(-fish.size * 1.3, fish.size * 0.45 + wiggle);
        ctx.closePath();
        ctx.fill();

        // Eye
        ctx.beginPath();
        ctx.arc(fish.size * 0.45, -fish.size * 0.1, fish.size * 0.12, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        ctx.restore();

        // Overhead HUD Tag
        ctx.save();
        ctx.font = 'bold 11px "JetBrains Mono", monospace';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(`$${fish.symbol}`, fish.x, fish.y - fish.size * 0.75);

        // Progress bar
        const barWidth = 44;
        const barHeight = 4;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.fillRect(fish.x - barWidth / 2, fish.y - fish.size * 0.75 + 4, barWidth, barHeight);
        ctx.fillStyle = fish.color;
        ctx.fillRect(
          fish.x - barWidth / 2,
          fish.y - fish.size * 0.75 + 4,
          barWidth * (Math.min(fish.bondingCurvePercent, 100) / 100),
          barHeight
        );
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render(0);

    const handleCanvasClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      const actualX = clickX * scaleX;
      const actualY = clickY * scaleY;

      const clickedFish = fishes.find((f) => {
        const dx = f.x - actualX;
        const dy = f.y - actualY;
        return Math.sqrt(dx * dx + dy * dy) < f.size + 20;
      });

      if (clickedFish) {
        setSelectedToken(clickedFish);
      }
    };

    canvas.addEventListener('click', handleCanvasClick);
    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [filteredTokens, viewMode]);

  return (
    <div className="w-full max-w-6xl mx-auto my-auto select-none py-2">
      {/* Deep Trench Hydro-Sonar Deck */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#041024]/90 via-[#020917]/95 to-[#01040a]/98 border border-cyan-500/30 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(0,210,255,0.12)] space-y-5">
        
        {/* Top Sonar Deck Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#051833]/80 border border-cyan-400/40 text-[11px] font-mono text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-[#00ffa3] animate-ping"></span>
              <span className="tracking-wider uppercase font-bold">04 / THE LIVING DEEP TRENCH SWARM</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight flex items-center gap-2.5">
              <span>Mariana Trench Hydro-Sonar</span>
              <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                {tokens.length} ENTITIES ACTIVE
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Scan ticker..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3.5 py-2 rounded-xl bg-[#020712] border border-cyan-500/30 text-white text-xs font-mono focus:outline-none focus:border-[#00d2ff] w-36 sm:w-44 placeholder-slate-500"
              />
            </div>

            <div className="flex items-center p-1 rounded-xl bg-[#020712] border border-cyan-500/30">
              <button
                onClick={() => setViewMode('aquarium')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  viewMode === 'aquarium' ? 'bg-gradient-to-r from-[#00d2ff] to-[#00ffa3] text-[#020712] font-black shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Simulation
              </button>
              <button
                onClick={() => setViewMode('sonar_grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  viewMode === 'sonar_grid' ? 'bg-gradient-to-r from-[#00d2ff] to-[#00ffa3] text-[#020712] font-black shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Sonar Matrix
              </button>
            </div>

            <button
              onClick={onSpawnNew}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00d2ff] to-[#00ffa3] text-[#020712] font-heading font-black text-xs transition-all shadow-[0_0_20px_rgba(0,210,255,0.3)] hover:shadow-[0_0_30px_rgba(0,255,163,0.5)]"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Spawn Entity</span>
            </button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono pb-1">
          {[
            { id: 'all', label: 'All Organisms' },
            { id: 'predators', label: 'Alpha Sharks & Anglers' },
            { id: 'liquidity', label: 'Liquidity Floats & Whales' },
            { id: 'pools', label: 'Active Treasury Vaults' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl border transition-all shrink-0 ${
                filterCategory === cat.id
                  ? 'bg-[#092b52] border-cyan-400 text-cyan-200 font-bold shadow-[0_0_15px_rgba(0,210,255,0.25)]'
                  : 'bg-[#020712] border-cyan-500/20 text-slate-400 hover:border-cyan-400/40 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Simulation Observation Deck */}
        {viewMode === 'aquarium' && (
          <div className="relative w-full h-[380px] sm:h-[420px] rounded-3xl overflow-hidden border-2 border-cyan-400/30 bg-[#01040a] shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_0_40px_rgba(0,210,255,0.1)]">
            <canvas
              ref={canvasRef}
              width={1100}
              height={420}
              className="w-full h-full object-cover cursor-pointer"
            />

            <div className="absolute bottom-3 left-3 right-3 flex flex-col sm:flex-row items-center justify-between gap-2 px-4 py-2.5 rounded-2xl bg-[#02060d]/90 border border-cyan-500/30 text-xs font-mono text-slate-300 backdrop-blur-md shadow-lg">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00ffa3] animate-pulse" /> Click any swimming creature to inspect live radar telemetry, claim drops, or trade on Pump.fun.
              </span>
              <span className="text-cyan-300 font-bold">
                Total Trench MC: ${tokens.reduce((acc, t) => acc + (t.marketCapUsd || 0), 0).toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Sonar Matrix Grid View */}
        {viewMode === 'sonar_grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[420px] overflow-y-auto pr-1">
            {filteredTokens.map((token) => (
              <div
                key={token.id}
                onClick={() => setSelectedToken(token)}
                className="p-4 rounded-3xl bg-[#020712] border border-cyan-500/25 hover:border-cyan-400 transition-all cursor-pointer space-y-3 hover:shadow-[0_0_25px_rgba(0,210,255,0.2)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#01040a] border border-cyan-500/30 overflow-hidden flex items-center justify-center p-0.5 shadow-inner">
                      {token.imageUrl ? (
                        <img src={token.imageUrl} alt={token.name} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <span>🐟</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-xs font-heading">{token.name}</h3>
                      <span className="text-xs font-mono text-[#00d2ff] font-bold">${token.symbol}</span>
                    </div>
                  </div>

                  {token.faucet?.enabled && (
                    <span className="px-2.5 py-1 rounded-full bg-[#00ffa3]/10 border border-[#00ffa3]/30 text-[10px] font-mono text-[#00ffa3] font-bold">
                      VAULT LIVE
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {token.description}
                </p>

                <div className="space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between text-slate-300 text-[11px]">
                    <span>Bonding Curve</span>
                    <span className="text-[#00ffa3] font-bold">{token.bondingCurvePercent || 0}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#01040a] overflow-hidden border border-cyan-500/20">
                    <div
                      className="h-full bg-gradient-to-r from-[#00d2ff] to-[#00ffa3] rounded-full"
                      style={{ width: `${Math.min(token.bondingCurvePercent || 0, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-2.5 border-t border-cyan-500/15 font-mono text-xs">
                  <span className="text-slate-400">Market Cap:</span>
                  <span className="text-white font-bold">${(token.marketCapUsd || 0).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected Fish Modal */}
        {selectedToken && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="w-full max-w-lg p-6 sm:p-7 rounded-3xl bg-[#030b18] border-2 border-cyan-400/50 relative space-y-4 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_40px_rgba(0,210,255,0.25)]">
              
              <button
                onClick={() => setSelectedToken(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white font-mono text-sm"
              >
                ✕
              </button>

              <div className="flex items-center gap-3.5">
                <div className="w-16 h-16 rounded-2xl bg-[#01040a] border-2 border-cyan-500/50 overflow-hidden p-0.5 shadow-md">
                  <img src={selectedToken.imageUrl} alt={selectedToken.name} className="w-full h-full object-cover rounded-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white font-heading">{selectedToken.name}</h3>
                  <span className="text-xs font-mono text-[#00d2ff] font-bold">${selectedToken.symbol}</span>
                  <span className="text-xs font-mono text-slate-300 ml-2">({selectedToken.strategy})</span>
                </div>
              </div>

              <p className="text-xs text-slate-200 bg-[#01040a] p-3.5 rounded-2xl border border-cyan-500/25 leading-relaxed">
                {selectedToken.description}
              </p>

              <div className="grid grid-cols-3 gap-2.5 font-mono text-xs text-center">
                <div className="bg-[#01040a] p-3 rounded-2xl border border-cyan-500/20">
                  <span className="text-slate-400 block text-[10px]">MARKET CAP</span>
                  <span className="font-bold text-white text-sm">${(selectedToken.marketCapUsd || 0).toLocaleString()}</span>
                </div>
                <div className="bg-[#01040a] p-3 rounded-2xl border border-cyan-500/20">
                  <span className="text-slate-400 block text-[10px]">CURVE</span>
                  <span className="font-bold text-[#00d2ff] text-sm">{selectedToken.bondingCurvePercent || 0}%</span>
                </div>
                <div className="bg-[#01040a] p-3 rounded-2xl border border-cyan-500/20">
                  <span className="text-slate-400 block text-[10px]">TREASURY</span>
                  <span className="font-bold text-[#00ffa3] text-sm">
                    {selectedToken.faucet?.poolBalance ? `${selectedToken.faucet.poolBalance.toLocaleString()}` : '0'}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                {selectedToken.faucet?.enabled && (
                  <button
                    onClick={() => {
                      const t = selectedToken;
                      setSelectedToken(null);
                      if (onSelectTokenForPool) onSelectTokenForPool(t);
                    }}
                    className="w-full py-3 rounded-2xl bg-[#04142c] hover:bg-[#07244e] border border-cyan-500/40 text-[#00ffa3] text-xs font-bold font-mono flex items-center justify-center gap-2 transition-all"
                  >
                    <Droplets className="w-4 h-4" />
                    <span>Claim from Vault</span>
                  </button>
                )}

                <a
                  href={`https://pump.fun/coin/${selectedToken.mintPublicKey}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#00d2ff] to-[#00ffa3] hover:opacity-90 text-[#020712] text-xs font-black font-mono flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,210,255,0.3)] transition-all"
                >
                  <span>Trade on Pump.fun</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default OceanAquarium;
