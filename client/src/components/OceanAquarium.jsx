import React, { useState, useEffect, useRef } from 'react';
import { Waves, ExternalLink, Droplets, ArrowUpRight, Search, Zap, Activity, Shield, Sparkles, Filter } from 'lucide-react';
import BorderGlow from './BorderGlow';

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
      const size = 26 + (curve / 100) * 36;
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
      bgGrad.addColorStop(0, '#040d1e');
      bgGrad.addColorStop(0.7, '#020712');
      bgGrad.addColorStop(1, '#010308');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Sonar radar rings
      ctx.strokeStyle = 'rgba(0, 210, 255, 0.05)';
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
      beamGrad.addColorStop(0, 'rgba(0, 210, 255, 0.12)');
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
      for (let i = 0; i < 24; i++) {
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
        const barWidth = 42;
        const barHeight = 3.5;
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
    <div className="w-full max-w-5xl mx-auto my-auto select-none">
      <BorderGlow
        edgeSensitivity={32}
        glowColor="190 100 65"
        backgroundColor="rgba(3, 14, 33, 0.65)"
        borderRadius={24}
        glowRadius={40}
        glowIntensity={1.2}
        coneSpread={28}
        animated={false}
        colors={['#00d2ff', '#00ffa3', '#38bdf8']}
        className="w-full shadow-[0_20px_50px_rgba(0,5,20,0.7),0_0_30px_rgba(0,210,255,0.08)] border border-cyan-400/30"
      >
        <div className="w-full p-5 sm:p-6 space-y-4">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/25 pb-3">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#020712] border border-cyan-400/50 text-[10px] font-mono text-cyan-300 mb-1">
                <Waves className="w-3 h-3 text-[#00d2ff]" />
                <span className="font-semibold">04 / THE LIVING OCEAN SWARM</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-heading">
                Solana Mariana Trench Ecosystem
              </h2>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter ticker..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-[#020712] border border-cyan-500/30 text-white text-xs font-mono focus:outline-none focus:border-[#00d2ff] w-36 sm:w-44 placeholder-slate-500"
                />
              </div>

              <div className="flex items-center p-1 rounded-xl bg-[#020712] border border-cyan-500/30">
                <button
                  onClick={() => setViewMode('aquarium')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                    viewMode === 'aquarium' ? 'bg-[#08152b] text-[#00d2ff] font-bold border border-cyan-500/40 shadow-sm' : 'text-slate-400'
                  }`}
                >
                  Simulation
                </button>
                <button
                  onClick={() => setViewMode('sonar_grid')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                    viewMode === 'sonar_grid' ? 'bg-[#08152b] text-[#00d2ff] font-bold border border-cyan-500/40 shadow-sm' : 'text-slate-400'
                  }`}
                >
                  Radar Grid
                </button>
              </div>

              <button
                onClick={onSpawnNew}
                className="btn-primary text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Spawn Agent</span>
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono pb-1">
            {[
              { id: 'all', label: 'All Marine Organisms' },
              { id: 'predators', label: 'Alpha Predators (Sharks/Anglers)' },
              { id: 'liquidity', label: 'Liquidity Floats (Jellies/Whales)' },
              { id: 'pools', label: 'Active Treasury Faucets' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-3 py-1 rounded-xl border transition-all shrink-0 ${
                  filterCategory === cat.id
                    ? 'bg-[#08152b] border-[#00d2ff] text-[#00d2ff] font-bold shadow-[0_0_12px_rgba(0,210,255,0.2)]'
                    : 'bg-[#020712] border-cyan-500/20 text-slate-300 hover:border-cyan-400/40'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Simulation View */}
          {viewMode === 'aquarium' && (
            <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-cyan-400/30 bg-[#01040a] shadow-[0_15px_40px_rgba(0,0,0,0.8),inset_0_0_30px_rgba(0,210,255,0.06)]">
              <canvas
                ref={canvasRef}
                width={1000}
                height={400}
                className="w-full h-full object-cover cursor-pointer"
              />

              <div className="absolute bottom-3 left-3 right-3 flex flex-col sm:flex-row items-center justify-between gap-2 px-4 py-2 rounded-xl bg-[#020712]/90 border border-cyan-500/30 text-xs font-mono text-slate-300 backdrop-blur-md">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#00ffa3]" /> Click any swimming fish to inspect live radar telemetry, claim drops, or trade on Pump.fun.
                </span>
                <span className="text-[#00d2ff] font-bold">
                  Total Ecosystem MC: ${tokens.reduce((acc, t) => acc + (t.marketCapUsd || 0), 0).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* Radar Grid View */}
          {viewMode === 'sonar_grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[400px] overflow-y-auto pr-1">
              {filteredTokens.map((token) => (
                <div
                  key={token.id}
                  onClick={() => setSelectedToken(token)}
                  className="p-4 rounded-2xl bg-[#020712] border border-cyan-500/25 hover:border-cyan-400 transition-all cursor-pointer space-y-3 hover:shadow-[0_0_20px_rgba(0,210,255,0.15)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-[#01040a] border border-cyan-500/30 overflow-hidden flex items-center justify-center p-0.5">
                        {token.imageUrl ? (
                          <img src={token.imageUrl} alt={token.name} className="w-full h-full object-cover rounded-lg" />
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
                      <span className="px-2 py-0.5 rounded-full bg-[#00ffa3]/10 border border-[#00ffa3]/30 text-[10px] font-mono text-[#00ffa3] font-bold">
                        TREASURY LIVE
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                    {token.description}
                  </p>

                  <div className="space-y-1 font-mono text-xs">
                    <div className="flex justify-between text-slate-300 text-[11px]">
                      <span>Bonding Curve</span>
                      <span className="text-[#00ffa3] font-bold">{token.bondingCurvePercent || 0}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#01040a] overflow-hidden border border-cyan-500/20">
                      <div
                        className="h-full bg-gradient-to-r from-[#00d2ff] to-[#00ffa3] rounded-full"
                        style={{ width: `${Math.min(token.bondingCurvePercent || 0, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-2 border-t border-cyan-500/15 font-mono text-xs">
                    <span className="text-slate-400">Market Cap:</span>
                    <span className="text-white font-bold">${(token.marketCapUsd || 0).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Selected Fish Modal */}
          {selectedToken && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <div className="w-full max-w-lg p-6 rounded-2xl bg-[#030914] border border-cyan-400/40 relative space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(0,210,255,0.2)]">
                
                <button
                  onClick={() => setSelectedToken(null)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white font-mono text-sm"
                >
                  ✕
                </button>

                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-[#01040a] border border-cyan-500/40 overflow-hidden p-0.5">
                    <img src={selectedToken.imageUrl} alt={selectedToken.name} className="w-full h-full object-cover rounded-lg" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white font-heading">{selectedToken.name}</h3>
                    <span className="text-xs font-mono text-[#00d2ff] font-bold">${selectedToken.symbol}</span>
                    <span className="text-xs font-mono text-slate-400 ml-2">({selectedToken.strategy})</span>
                  </div>
                </div>

                <p className="text-xs text-slate-200 bg-[#01040a] p-3 rounded-xl border border-cyan-500/20 leading-relaxed">
                  {selectedToken.description}
                </p>

                <div className="grid grid-cols-3 gap-2 font-mono text-xs text-center">
                  <div className="bg-[#01040a] p-2.5 rounded-xl border border-cyan-500/20">
                    <span className="text-slate-400 block text-[10px]">MARKET CAP</span>
                    <span className="font-bold text-white">${(selectedToken.marketCapUsd || 0).toLocaleString()}</span>
                  </div>
                  <div className="bg-[#01040a] p-2.5 rounded-xl border border-cyan-500/20">
                    <span className="text-slate-400 block text-[10px]">CURVE</span>
                    <span className="font-bold text-[#00d2ff]">{selectedToken.bondingCurvePercent || 0}%</span>
                  </div>
                  <div className="bg-[#01040a] p-2.5 rounded-xl border border-cyan-500/20">
                    <span className="text-slate-400 block text-[10px]">TREASURY</span>
                    <span className="font-bold text-[#00ffa3]">
                      {selectedToken.faucet?.poolBalance ? `${selectedToken.faucet.poolBalance.toLocaleString()}` : '0'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2.5 pt-2">
                  {selectedToken.faucet?.enabled && (
                    <button
                      onClick={() => {
                        const t = selectedToken;
                        setSelectedToken(null);
                        if (onSelectTokenForPool) onSelectTokenForPool(t);
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#020712] border border-cyan-500/40 text-[#00ffa3] hover:bg-[#08152b] text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Droplets className="w-3.5 h-3.5" />
                      <span>Claim from Pool</span>
                    </button>
                  )}

                  <a
                    href={`https://pump.fun/coin/${selectedToken.mintPublicKey}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full py-2.5 rounded-xl text-xs font-bold font-mono flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,210,255,0.3)]"
                  >
                    <span>Trade on Pump.fun</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>
            </div>
          )}

        </div>
      </BorderGlow>
    </div>
  );
}

export default OceanAquarium;
