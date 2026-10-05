import React, { useState, useEffect, useRef } from 'react';
import { Waves, ExternalLink, Droplets, ArrowUpRight, Search, Zap, Activity } from 'lucide-react';

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
      const curve = token.bondingCurvePercent || 10;
      const size = 30 + (curve / 100) * 40;
      return {
        ...token,
        x: Math.random() * (canvas.width - 150) + 75,
        y: Math.random() * (canvas.height - 150) + 75,
        vx: (Math.random() - 0.5) * 1.4,
        vy: (Math.random() - 0.5) * 0.7,
        size,
        baseAngle: 0,
        wiggleOffset: index * 1.5,
        color: token.species === 'neon_angler' ? '#00e5ff' :
               token.species === 'cyber_shark' ? '#00ffa3' :
               token.species === 'bio_jelly' ? '#38bdf8' : '#ffb703'
      };
    });

    const render = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep matte background
      ctx.fillStyle = '#05080f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Technical Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Render Fishes
      fishes.forEach((fish) => {
        fish.x += fish.vx;
        fish.y += fish.vy;

        if (fish.x < 40 || fish.x > canvas.width - 40) fish.vx *= -1;
        if (fish.y < 40 || fish.y > canvas.height - 40) fish.vy *= -1;

        const isFacingLeft = fish.vx < 0;
        const wiggle = Math.sin(time * 0.005 + fish.wiggleOffset) * 4;

        ctx.save();
        ctx.translate(fish.x, fish.y);
        if (isFacingLeft) ctx.scale(-1, 1);

        ctx.shadowColor = fish.color;
        ctx.shadowBlur = (fish.bondingCurvePercent / 100) * 20 + 8;

        ctx.fillStyle = fish.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, fish.size * 0.9, fish.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-fish.size * 0.7, 0);
        ctx.lineTo(-fish.size * 1.3, -fish.size * 0.4 + wiggle);
        ctx.lineTo(-fish.size * 1.0, 0);
        ctx.lineTo(-fish.size * 1.3, fish.size * 0.4 + wiggle);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.arc(fish.size * 0.45, -fish.size * 0.12, fish.size * 0.1, 0, Math.PI * 2);
        ctx.fillStyle = '#05080f';
        ctx.fill();

        ctx.restore();

        // Label
        ctx.save();
        ctx.font = 'bold 11px "JetBrains Mono", monospace';
        ctx.fillStyle = '#f8fafc';
        ctx.textAlign = 'center';
        ctx.fillText(`$${fish.symbol}`, fish.x, fish.y - fish.size * 0.7);

        const barWidth = 36;
        const barHeight = 3;
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.fillRect(fish.x - barWidth / 2, fish.y - fish.size * 0.7 + 4, barWidth, barHeight);
        ctx.fillStyle = '#00e5ff';
        ctx.fillRect(fish.x - barWidth / 2, fish.y - fish.size * 0.7 + 4, barWidth * (fish.bondingCurvePercent / 100), barHeight);
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render(0);

    const handleCanvasClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const clickedFish = fishes.find((f) => {
        const dx = f.x - clickX;
        const dy = f.y - clickY;
        return Math.sqrt(dx * dx + dy * dy) < f.size + 15;
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
    <div className="w-full max-w-6xl mx-auto py-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="text-left space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#00e5ff]">
            <span>04 / THE LIVING AQUARIUM</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-heading">
            Live Ocean Ecosystem
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            All deployed tokens swimming in a shared simulation. Entity size reflects Pump.fun bonding curve progress.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ticker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded bg-[#080d17] border border-white/[0.1] text-white text-xs font-mono focus:outline-none focus:border-[#00e5ff] w-40"
            />
          </div>

          <div className="flex items-center p-0.5 rounded bg-[#080d17] border border-white/[0.08]">
            <button
              onClick={() => setViewMode('aquarium')}
              className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                viewMode === 'aquarium' ? 'bg-[#0c1322] border border-[#00e5ff] text-[#00e5ff] font-bold' : 'text-slate-400'
              }`}
            >
              Simulation
            </button>
            <button
              onClick={() => setViewMode('sonar_grid')}
              className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                viewMode === 'sonar_grid' ? 'bg-[#0c1322] border border-[#00e5ff] text-[#00e5ff] font-bold' : 'text-slate-400'
              }`}
            >
              Radar Grid
            </button>
          </div>

          <button
            onClick={onSpawnNew}
            className="btn-primary text-xs font-bold"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Spawn Entity</span>
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto text-xs font-mono">
        {[
          { id: 'all', label: 'All Entities' },
          { id: 'predators', label: 'Predators (Sharks/Anglers)' },
          { id: 'liquidity', label: 'Liquidity Floats' },
          { id: 'pools', label: 'Active Treasury Pools' }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.id)}
            className={`px-3 py-1 rounded border transition-all ${
              filterCategory === cat.id
                ? 'bg-[#0c1322] border-[#00e5ff] text-[#00e5ff] font-bold'
                : 'bg-[#080d17] border-white/[0.08] text-slate-400'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Simulation View */}
      {viewMode === 'aquarium' && (
        <div className="relative w-full h-[500px] rounded-xl overflow-hidden border border-white/[0.1] bg-[#05080f]">
          <canvas
            ref={canvasRef}
            width={1100}
            height={500}
            className="w-full h-full object-cover cursor-pointer"
          />

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3.5 py-2 rounded bg-[#05080f]/90 border border-white/[0.08] text-xs font-mono text-slate-400">
            <span>Click any swimming creature to inspect live radar telemetry, claim drops, or trade on Pump.fun.</span>
            <span className="text-[#00e5ff] font-semibold">Total MC: ${tokens.reduce((acc, t) => acc + (t.marketCapUsd || 0), 0).toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Radar Grid View */}
      {viewMode === 'sonar_grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTokens.map((token) => (
            <div
              key={token.id}
              onClick={() => setSelectedToken(token)}
              className="editorial-card p-4 hover:border-[#00e5ff]/50 transition-all cursor-pointer space-y-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded bg-[#05080f] border border-white/[0.1] overflow-hidden flex items-center justify-center p-0.5">
                    {token.imageUrl ? (
                      <img src={token.imageUrl} alt={token.name} className="w-full h-full object-cover rounded" />
                    ) : (
                      <span>🐟</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm font-heading">{token.name}</h3>
                    <span className="text-xs font-mono text-[#00e5ff]">${token.symbol}</span>
                  </div>
                </div>

                {token.faucet?.enabled && (
                  <span className="px-2 py-0.5 rounded bg-[#00ffa3]/10 border border-[#00ffa3]/30 text-[10px] font-mono text-[#00ffa3] font-bold">
                    TREASURY LIVE
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {token.description}
              </p>

              <div className="space-y-1 font-mono text-xs">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Bonding Curve</span>
                  <span className="text-white font-bold">{token.bondingCurvePercent || 0}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#05080f] overflow-hidden border border-white/[0.08]">
                  <div
                    className="h-full bg-[#00e5ff] rounded-full"
                    style={{ width: `${Math.min(token.bondingCurvePercent || 0, 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between pt-2 border-t border-white/[0.06] font-mono text-xs">
                <span className="text-slate-500">Market Cap:</span>
                <span className="text-white font-bold">${(token.marketCapUsd || 0).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Modal */}
      {selectedToken && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="editorial-card-highlight w-full max-w-lg p-6 relative space-y-4">
            
            <button
              onClick={() => setSelectedToken(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-mono text-xs"
            >
              ✕
            </button>

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded bg-[#05080f] border border-white/[0.12] overflow-hidden p-0.5">
                <img src={selectedToken.imageUrl} alt={selectedToken.name} className="w-full h-full object-cover rounded" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-heading">{selectedToken.name}</h3>
                <span className="text-xs font-mono text-[#00e5ff] font-bold">${selectedToken.symbol}</span>
                <span className="text-xs font-mono text-slate-400 ml-2">({selectedToken.strategy})</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-[#05080f] p-3 rounded border border-white/[0.06] leading-relaxed">
              {selectedToken.description}
            </p>

            <div className="grid grid-cols-3 gap-2 font-mono text-xs text-center">
              <div className="bg-[#05080f] p-2.5 rounded border border-white/[0.06]">
                <span className="text-slate-500 block text-[10px]">MARKET CAP</span>
                <span className="font-bold text-white">${(selectedToken.marketCapUsd || 0).toLocaleString()}</span>
              </div>
              <div className="bg-[#05080f] p-2.5 rounded border border-white/[0.06]">
                <span className="text-slate-500 block text-[10px]">CURVE</span>
                <span className="font-bold text-[#00e5ff]">{selectedToken.bondingCurvePercent || 0}%</span>
              </div>
              <div className="bg-[#05080f] p-2.5 rounded border border-white/[0.06]">
                <span className="text-slate-500 block text-[10px]">TREASURY</span>
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
                  className="btn-secondary w-full text-xs font-bold"
                >
                  <Droplets className="w-3.5 h-3.5 text-[#00ffa3]" />
                  <span>Claim from Pool</span>
                </button>
              )}

              <a
                href={`https://pump.fun/coin/${selectedToken.mintPublicKey}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full text-xs font-bold"
              >
                <span>Trade on Pump.fun</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
