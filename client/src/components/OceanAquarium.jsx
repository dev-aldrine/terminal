import React, { useState, useEffect, useRef } from 'react';
import { Waves, Sparkles, ExternalLink, Droplets, Terminal, Shield, ArrowUpRight, Search, Zap, Radio, Info } from 'lucide-react';

export function OceanAquarium({ tokens = [], onSelectTokenForFaucet, onOpenTerminal, onSpawnNew }) {
  const canvasRef = useRef(null);
  const [selectedToken, setSelectedToken] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all'); // 'all', 'predators', 'liquidity', 'faucets'
  const [viewMode, setViewMode] = useState('aquarium'); // 'aquarium', 'sonar_grid'
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered tokens
  const filteredTokens = tokens.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filterCategory === 'faucets') return t.faucet && t.faucet.enabled;
    if (filterCategory === 'predators') return ['cyber_shark', 'neon_angler', 'volt_ray'].includes(t.species);
    if (filterCategory === 'liquidity') return ['bio_jelly', 'mecha_puffer', 'abyss_whale'].includes(t.species);
    return true;
  });

  // Animated Fish Simulation on Canvas
  useEffect(() => {
    if (viewMode !== 'aquarium') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    const fishes = filteredTokens.map((token, index) => {
      // Scale size based on bonding curve % (min 30px, max 85px)
      const curve = token.bondingCurvePercent || 10;
      const size = 32 + (curve / 100) * 45;
      return {
        ...token,
        x: Math.random() * (canvas.width - 150) + 75,
        y: Math.random() * (canvas.height - 150) + 75,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 0.8,
        size,
        baseAngle: 0,
        wiggleOffset: index * 1.5,
        color: token.species === 'neon_angler' ? '#00f5ff' :
               token.species === 'cyber_shark' ? '#05ffa1' :
               token.species === 'bio_jelly' ? '#a855f7' : '#ffb703'
      };
    });

    const render = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep ocean background
      const grad = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 50, canvas.width / 2, canvas.height / 2, canvas.width);
      grad.addColorStop(0, '#061730');
      grad.addColorStop(0.7, '#040d1c');
      grad.addColorStop(1, '#020610');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Ambient underwater light rays
      ctx.save();
      ctx.globalAlpha = 0.07;
      for (let i = 0; i < 5; i++) {
        const rayX = (canvas.width / 5) * i + Math.sin(time * 0.001 + i) * 40;
        const rayGrad = ctx.createLinearGradient(rayX, 0, rayX + 60, canvas.height);
        rayGrad.addColorStop(0, '#00f5ff');
        rayGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = rayGrad;
        ctx.beginPath();
        ctx.moveTo(rayX - 30, 0);
        ctx.lineTo(rayX + 90, 0);
        ctx.lineTo(rayX + 200, canvas.height);
        ctx.lineTo(rayX - 100, canvas.height);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // Render & Update Fishes
      fishes.forEach((fish) => {
        // Update physics
        fish.x += fish.vx;
        fish.y += fish.vy;

        // Bounce off walls
        if (fish.x < 50 || fish.x > canvas.width - 50) fish.vx *= -1;
        if (fish.y < 50 || fish.y > canvas.height - 50) fish.vy *= -1;

        const isFacingLeft = fish.vx < 0;
        const angle = Math.atan2(fish.vy, fish.vx);
        const wiggle = Math.sin(time * 0.005 + fish.wiggleOffset) * 4;

        ctx.save();
        ctx.translate(fish.x, fish.y);
        if (isFacingLeft) ctx.scale(-1, 1);

        // Glow Aura
        ctx.shadowColor = fish.color;
        ctx.shadowBlur = (fish.bondingCurvePercent / 100) * 25 + 10;

        // Fish Body
        ctx.fillStyle = fish.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, fish.size * 0.9, fish.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Fish Tail
        ctx.beginPath();
        ctx.moveTo(-fish.size * 0.7, 0);
        ctx.lineTo(-fish.size * 1.3, -fish.size * 0.4 + wiggle);
        ctx.lineTo(-fish.size * 1.0, 0);
        ctx.lineTo(-fish.size * 1.3, fish.size * 0.4 + wiggle);
        ctx.closePath();
        ctx.fill();

        // Eye
        ctx.beginPath();
        ctx.arc(fish.size * 0.45, -fish.size * 0.12, fish.size * 0.12, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(fish.size * 0.47, -fish.size * 0.12, fish.size * 0.06, 0, Math.PI * 2);
        ctx.fillStyle = '#020610';
        ctx.fill();

        // Ticker Tag on Hover
        ctx.restore();

        // Text Badge above fish
        ctx.save();
        ctx.font = 'bold 11px "Space Grotesk", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 4;
        ctx.fillText(`$${fish.symbol}`, fish.x, fish.y - fish.size * 0.7);

        // Curve % mini bar
        const barWidth = 40;
        const barHeight = 4;
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(fish.x - barWidth / 2, fish.y - fish.size * 0.7 + 4, barWidth, barHeight);
        ctx.fillStyle = '#00f5ff';
        ctx.fillRect(fish.x - barWidth / 2, fish.y - fish.size * 0.7 + 4, barWidth * (fish.bondingCurvePercent / 100), barHeight);
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render(0);

    // Canvas Click Listener to select a fish
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
    <div className="w-full max-w-7xl mx-auto py-6 px-4">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-400 font-mono text-xs mb-2">
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            <span>GLOBAL MARINE ECOSYSTEM</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            The AgenSea <span className="text-gradient-cyan">Aquarium</span>
          </h2>
          <p className="text-slate-400 text-sm">
            Live interactive ocean of autonomous marine AI entities. Size and luminescence represent Pump.fun bonding curve progress.
          </p>
        </div>

        {/* Action & Filter Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or ticker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-cyan-400 w-48"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setViewMode('aquarium')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                viewMode === 'aquarium' ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(0,245,255,0.4)]' : 'text-slate-400 hover:text-white'
              }`}
            >
              🌊 Aquarium
            </button>
            <button
              onClick={() => setViewMode('sonar_grid')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                viewMode === 'sonar_grid' ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(0,245,255,0.4)]' : 'text-slate-400 hover:text-white'
              }`}
            >
              📡 Sonar Grid
            </button>
          </div>

          <button
            onClick={onSpawnNew}
            className="ocean-btn-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Spawn Agent</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 text-xs font-mono">
        {[
          { id: 'all', label: 'All Marine Entities' },
          { id: 'predators', label: '🦈 Predators (Snipers/Hunters)' },
          { id: 'liquidity', label: '🪼 Liquidity Floats & Whales' },
          { id: 'faucets', label: '🚰 Active Faucet Vaults' }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl border transition-all whitespace-nowrap ${
              filterCategory === cat.id
                ? 'bg-cyan-950 border-cyan-400 text-cyan-300 font-bold shadow-[0_0_10px_rgba(0,245,255,0.2)]'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* MAIN VIEW: Interactive Aquarium Canvas */}
      {viewMode === 'aquarium' && (
        <div className="relative w-full h-[540px] rounded-3xl overflow-hidden border-2 border-cyan-500/30 shadow-[0_0_50px_rgba(0,245,255,0.12)] bg-[#020610]">
          <canvas
            ref={canvasRef}
            width={1100}
            height={540}
            className="w-full h-full object-cover cursor-pointer"
          />

          <div className="absolute inset-0 pointer-events-none scanline-overlay opacity-20"></div>

          {/* Bottom Overlay Info Banner */}
          <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-cyan-500/20 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400" />
              <span>Click on any swimming creature to open its telemetry, Faucet claim & Pump.fun bonding curve.</span>
            </div>
            <div className="text-cyan-400 font-semibold">
              Total Ocean Market Cap: ${tokens.reduce((acc, t) => acc + (t.marketCapUsd || 0), 0).toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* SONAR GRID VIEW */}
      {viewMode === 'sonar_grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTokens.map((token) => (
            <div
              key={token.id}
              onClick={() => setSelectedToken(token)}
              className="glass-panel hover:glass-panel-glow rounded-2xl p-5 border border-cyan-500/20 hover:border-cyan-400/50 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-cyan-500/30 overflow-hidden flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
                    {token.imageUrl ? (
                      <img src={token.imageUrl} alt={token.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <span className="text-2xl">🐟</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                      <span>{token.name}</span>
                      <span className="text-xs font-mono text-cyan-400">(${token.symbol})</span>
                    </h3>
                    <span className="text-[11px] font-mono text-slate-400">
                      {token.species?.replace('_', ' ').toUpperCase()} • {token.strategy}
                    </span>
                  </div>
                </div>

                {token.faucet?.enabled && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-mono text-emerald-400 font-bold animate-pulse">
                    🚰 FAUCET LIVE
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                {token.description}
              </p>

              {/* Bonding Curve Progress */}
              <div className="space-y-1.5 mb-4 font-mono text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Bonding Curve</span>
                  <span className="text-cyan-400 font-bold">{token.bondingCurvePercent || 0}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(token.bondingCurvePercent || 0, 100)}%` }}
                  />
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800/80 font-mono text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">MARKET CAP</span>
                  <span className="font-bold text-white">${(token.marketCapUsd || 0).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">FAUCET VAULT</span>
                  <span className="font-bold text-emerald-400">
                    {token.faucet?.poolBalance ? `${token.faucet.poolBalance.toLocaleString()} $${token.symbol}` : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SELECTED TOKEN DETAIL & ACTION MODAL */}
      {selectedToken && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel-glow w-full max-w-lg rounded-3xl p-6 border border-cyan-400/50 shadow-[0_0_50px_rgba(0,245,255,0.3)] relative space-y-5 animate-in fade-in zoom-in duration-200">
            
            <button
              onClick={() => setSelectedToken(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 text-sm font-mono"
            >
              ✕
            </button>

            {/* Token Header */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-950 border-2 border-cyan-400/50 overflow-hidden p-1 shadow-[0_0_20px_rgba(0,245,255,0.3)]">
                <img src={selectedToken.imageUrl} alt={selectedToken.name} className="w-full h-full object-cover rounded-xl" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-extrabold text-white">{selectedToken.name}</h3>
                  <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-xs font-mono text-cyan-300 font-bold">
                    ${selectedToken.symbol}
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-400 mt-0.5">
                  {selectedToken.species?.replace('_', ' ').toUpperCase()} • Risk: {selectedToken.riskProfile || 'Balanced'}
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
              {selectedToken.description}
            </p>

            {/* Live Stats */}
            <div className="grid grid-cols-3 gap-3 font-mono text-xs">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">MARKET CAP</span>
                <span className="font-bold text-white text-sm">${(selectedToken.marketCapUsd || 0).toLocaleString()}</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">CURVE PROGRESS</span>
                <span className="font-bold text-cyan-400 text-sm">{selectedToken.bondingCurvePercent || 0}%</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">FAUCET POOL</span>
                <span className="font-bold text-emerald-400 text-sm">
                  {selectedToken.faucet?.poolBalance ? `${selectedToken.faucet.poolBalance.toLocaleString()}` : '0'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              {selectedToken.faucet?.enabled && (
                <button
                  onClick={() => {
                    const tokenToClaim = selectedToken;
                    setSelectedToken(null);
                    if (onSelectTokenForFaucet) onSelectTokenForFaucet(tokenToClaim);
                  }}
                  className="ocean-btn-emerald w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Droplets className="w-4 h-4" />
                  <span>Claim from Faucet Pool</span>
                </button>
              )}

              <a
                href={`https://pump.fun/coin/${selectedToken.mintPublicKey}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ocean-btn-primary w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
              >
                <span>Trade on Pump.fun</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
