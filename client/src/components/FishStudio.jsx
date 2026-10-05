import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, Dices, Zap, Activity, Waves, Cpu, Eye, Radio, 
  Shield, Droplets, Sliders, Play, RefreshCw, Compass, Anchor, Disc
} from 'lucide-react';

export const SPECIES_LIST = [
  {
    id: 'neon_angler',
    name: 'Neon Angler Core',
    role: 'Dip Sniper & Deep Alpha',
    icon: '🏮',
    color: '#00e5ff',
    stats: { stealth: 96, speed: 78, bite: 88, depth: '11,000m' },
    desc: 'Lurks in pitch-black liquidity trenches. Luminescent lure baits and detects stealth whale accumulation.'
  },
  {
    id: 'cyber_shark',
    name: 'Cyber Megalodon',
    role: 'Aggressive Momentum',
    icon: '🦈',
    color: '#00ffa3',
    stats: { stealth: 64, speed: 98, bite: 99, depth: '4,500m' },
    desc: 'Apex trench predator with sub-millisecond hunting thrusters. Scents volume surges across blocks.'
  },
  {
    id: 'bio_jelly',
    name: 'Bioluminescent Jelly',
    role: 'Liquidity Float & Yield',
    icon: '🪼',
    color: '#38bdf8',
    stats: { stealth: 92, speed: 45, bite: 52, depth: '8,200m' },
    desc: 'Pulsates with cosmic underwater serenity. Absorbs massive volatility shocks with zero slippage.'
  },
  {
    id: 'volt_ray',
    name: 'Volt Ray Arbitrage',
    role: 'High-Frequency Surge',
    icon: '⚡',
    color: '#ffb703',
    stats: { stealth: 82, speed: 94, bite: 76, depth: '6,000m' },
    desc: 'Glides across the ocean floor, discharging micro-transactions on rapid pool imbalance.'
  },
  {
    id: 'mecha_puffer',
    name: 'Mecha Puffer',
    role: 'Anti-Dump Fortress',
    icon: '🐡',
    color: '#ff2a85',
    stats: { stealth: 70, speed: 50, bite: 85, depth: '3,200m' },
    desc: 'Expands into an armored spike shield when sell pressure spikes, defending ecosystem floor.'
  },
  {
    id: 'abyss_whale',
    name: 'Abyss Whale Sentinel',
    role: 'Treasury Accumulator',
    icon: '🐋',
    color: '#a855f7',
    stats: { stealth: 88, speed: 60, bite: 94, depth: '10,500m' },
    desc: 'Colossal ancient entity. Absorbs liquidity depth to anchor long-term ecosystem stability.'
  }
];

export function FishStudio({ onSaveFish, selectedSpecies = 'neon_angler', setSelectedSpecies }) {
  const canvasRef = useRef(null);

  const [activeSpecies, setActiveSpecies] = useState(selectedSpecies || 'neon_angler');
  const [bioColor, setBioColor] = useState('#00e5ff');
  const [secondaryColor, setSecondaryColor] = useState('#071326');
  const [glowIntensity, setGlowIntensity] = useState(88);
  const [cyberMod, setCyberMod] = useState('sonar_radar');
  const [swimSpeed, setSwimSpeed] = useState(1.4);
  const [finScale, setFinScale] = useState(1.0);

  const activeData = SPECIES_LIST.find((s) => s.id === activeSpecies) || SPECIES_LIST[0];

  const handleSpeciesChange = (speciesId) => {
    setActiveSpecies(speciesId);
    if (setSelectedSpecies) setSelectedSpecies(speciesId);
    const spec = SPECIES_LIST.find((s) => s.id === speciesId);
    if (spec) setBioColor(spec.color);
  };

  const randomizeDNA = () => {
    const randomSpec = SPECIES_LIST[Math.floor(Math.random() * SPECIES_LIST.length)];
    handleSpeciesChange(randomSpec.id);
    const colors = ['#00e5ff', '#00ffa3', '#38bdf8', '#ffb703', '#ff2a85', '#a855f7'];
    setBioColor(colors[Math.floor(Math.random() * colors.length)]);
    const mods = ['sonar_radar', 'laser_sensor', 'plasma_fins', 'neural_core'];
    setCyberMod(mods[Math.floor(Math.random() * mods.length)]);
    setGlowIntensity(70 + Math.floor(Math.random() * 30));
    setSwimSpeed(1.0 + Math.random() * 0.8);
  };

  const renderFishToCanvas = (targetCtx, width, height, time = 0) => {
    targetCtx.clearRect(0, 0, width, height);

    // Deep abyss water gradient
    const bgGradient = targetCtx.createRadialGradient(width / 2, height / 2, 40, width / 2, height / 2, width / 1.2);
    bgGradient.addColorStop(0, '#0a1628');
    bgGradient.addColorStop(0.6, '#040b17');
    bgGradient.addColorStop(1, '#01040a');
    targetCtx.fillStyle = bgGradient;
    targetCtx.fillRect(0, 0, width, height);

    // Sonar concentric rings
    targetCtx.strokeStyle = 'rgba(0, 210, 255, 0.08)';
    targetCtx.lineWidth = 1;
    for (let r = 50; r < width; r += 65) {
      targetCtx.beginPath();
      targetCtx.arc(width / 2, height / 2, r, 0, Math.PI * 2);
      targetCtx.stroke();
    }

    // Ambient floating bioluminescent particles
    for (let i = 0; i < 24; i++) {
      const px = (Math.sin(i * 99 + time * 0.01) * 0.5 + 0.5) * width;
      const py = ((i * 37 + time * (0.3 + (i % 3) * 0.2)) % height);
      const pr = (i % 3) + 1.2;
      targetCtx.beginPath();
      targetCtx.arc(px, height - py, pr, 0, Math.PI * 2);
      targetCtx.fillStyle = `rgba(0, 210, 255, ${0.15 + (i % 5) * 0.06})`;
      targetCtx.fill();
    }

    const cx = width / 2;
    const cy = height / 2 + Math.sin(time * 0.04 * swimSpeed) * 8;

    targetCtx.save();
    targetCtx.translate(cx, cy);

    targetCtx.shadowColor = bioColor;
    targetCtx.shadowBlur = (glowIntensity / 100) * 28;

    const bodyGrad = targetCtx.createLinearGradient(-120, -60, 120, 60);
    bodyGrad.addColorStop(0, bioColor);
    bodyGrad.addColorStop(0.5, secondaryColor);
    bodyGrad.addColorStop(1, '#02060d');

    targetCtx.fillStyle = bodyGrad;
    targetCtx.strokeStyle = bioColor;
    targetCtx.lineWidth = 2.5;

    const tailWiggle = Math.sin(time * 0.08 * swimSpeed) * 14 * finScale;

    if (activeSpecies === 'neon_angler') {
      targetCtx.beginPath();
      targetCtx.ellipse(0, 0, 95, 70, 0, 0, Math.PI * 2);
      targetCtx.fill();
      targetCtx.stroke();

      targetCtx.beginPath();
      targetCtx.moveTo(-80, 0);
      targetCtx.lineTo(-145, -50 + tailWiggle);
      targetCtx.lineTo(-120, tailWiggle);
      targetCtx.lineTo(-145, 50 + tailWiggle);
      targetCtx.closePath();
      targetCtx.fill();
      targetCtx.stroke();

      targetCtx.beginPath();
      targetCtx.moveTo(40, -60);
      targetCtx.quadraticCurveTo(75, -110, 105, -90);
      targetCtx.strokeStyle = bioColor;
      targetCtx.lineWidth = 3;
      targetCtx.stroke();

      targetCtx.beginPath();
      targetCtx.arc(105, -90, 12, 0, Math.PI * 2);
      targetCtx.fillStyle = '#ffffff';
      targetCtx.shadowColor = bioColor;
      targetCtx.shadowBlur = 35;
      targetCtx.fill();

    } else if (activeSpecies === 'cyber_shark') {
      targetCtx.beginPath();
      targetCtx.moveTo(120, 0);
      targetCtx.quadraticCurveTo(40, -60, -100, -25);
      targetCtx.lineTo(-150, -55 + tailWiggle);
      targetCtx.lineTo(-120, 0);
      targetCtx.lineTo(-150, 55 + tailWiggle);
      targetCtx.lineTo(-100, 25);
      targetCtx.quadraticCurveTo(40, 60, 120, 0);
      targetCtx.closePath();
      targetCtx.fill();
      targetCtx.stroke();

      targetCtx.beginPath();
      targetCtx.moveTo(-10, -50);
      targetCtx.lineTo(-30, -95 * finScale);
      targetCtx.lineTo(25, -45);
      targetCtx.closePath();
      targetCtx.fillStyle = bioColor;
      targetCtx.fill();
      targetCtx.stroke();

    } else if (activeSpecies === 'bio_jelly') {
      targetCtx.beginPath();
      targetCtx.arc(0, -30, 85, Math.PI, 0, false);
      targetCtx.quadraticCurveTo(40, 0, 0, 5);
      targetCtx.quadraticCurveTo(-40, 0, -85, -30);
      targetCtx.closePath();
      targetCtx.fill();
      targetCtx.stroke();

      for (let t = -60; t <= 60; t += 20) {
        targetCtx.beginPath();
        targetCtx.moveTo(t, 0);
        targetCtx.bezierCurveTo(
          t + Math.sin(time * 0.05 + t) * 20, 40,
          t - Math.sin(time * 0.05 + t) * 20, 90,
          t + Math.sin(time * 0.05 + t) * 25, 135 * finScale
        );
        targetCtx.strokeStyle = bioColor;
        targetCtx.lineWidth = 2.5;
        targetCtx.stroke();
      }

    } else if (activeSpecies === 'volt_ray') {
      targetCtx.beginPath();
      targetCtx.moveTo(110, 0);
      targetCtx.lineTo(0, -95 * finScale);
      targetCtx.lineTo(-100, 0);
      targetCtx.lineTo(0, 95 * finScale);
      targetCtx.closePath();
      targetCtx.fill();
      targetCtx.stroke();

      targetCtx.beginPath();
      targetCtx.moveTo(-100, 0);
      targetCtx.quadraticCurveTo(-140, tailWiggle * 1.5, -190, tailWiggle);
      targetCtx.strokeStyle = bioColor;
      targetCtx.lineWidth = 3;
      targetCtx.stroke();

    } else if (activeSpecies === 'mecha_puffer') {
      targetCtx.beginPath();
      targetCtx.arc(0, 0, 80, 0, Math.PI * 2);
      targetCtx.fill();
      targetCtx.stroke();

      for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
        const sx = Math.cos(a) * 80;
        const sy = Math.sin(a) * 80;
        const ex = Math.cos(a) * (110 * finScale);
        const ey = Math.sin(a) * (110 * finScale);
        targetCtx.beginPath();
        targetCtx.moveTo(sx, sy);
        targetCtx.lineTo(ex, ey);
        targetCtx.strokeStyle = bioColor;
        targetCtx.lineWidth = 3;
        targetCtx.stroke();
      }

    } else {
      // Abyss Whale
      targetCtx.beginPath();
      targetCtx.moveTo(130, -10);
      targetCtx.quadraticCurveTo(40, -70, -110, -35);
      targetCtx.lineTo(-160, -60 + tailWiggle);
      targetCtx.lineTo(-135, 0);
      targetCtx.lineTo(-160, 60 + tailWiggle);
      targetCtx.lineTo(-110, 35);
      targetCtx.quadraticCurveTo(40, 70, 130, 20);
      targetCtx.closePath();
      targetCtx.fill();
      targetCtx.stroke();
    }

    // Glowing Eye
    targetCtx.beginPath();
    targetCtx.arc(activeSpecies === 'bio_jelly' ? 0 : 50, activeSpecies === 'bio_jelly' ? -35 : -15, 7, 0, Math.PI * 2);
    targetCtx.fillStyle = '#ffffff';
    targetCtx.shadowColor = '#00ffa3';
    targetCtx.shadowBlur = 20;
    targetCtx.fill();

    // Cyber Mod Visual Overlay
    if (cyberMod === 'sonar_radar') {
      targetCtx.strokeStyle = '#00d2ff';
      targetCtx.lineWidth = 1.5;
      for (let r = 20; r <= 60; r += 20) {
        targetCtx.beginPath();
        targetCtx.arc(60, 0, r, -Math.PI / 4, Math.PI / 4);
        targetCtx.stroke();
      }
    } else if (cyberMod === 'laser_sensor') {
      targetCtx.strokeStyle = '#00ffa3';
      targetCtx.lineWidth = 2;
      targetCtx.beginPath();
      targetCtx.moveTo(55, -15);
      targetCtx.lineTo(160, -15);
      targetCtx.stroke();
    }

    targetCtx.restore();
  };

  useEffect(() => {
    let animationFrameId;
    let time = 0;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const animate = () => {
      time += 1;
      renderFishToCanvas(ctx, canvas.width, canvas.height, time);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [activeSpecies, bioColor, secondaryColor, glowIntensity, cyberMod, swimSpeed, finScale]);

  const exportFishImage = () => {
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = 600;
    exportCanvas.height = 600;
    const ctx = exportCanvas.getContext('2d');

    renderFishToCanvas(ctx, 600, 600, 45);

    const dataUrl = exportCanvas.toDataURL('image/png');
    if (onSaveFish) {
      onSaveFish(dataUrl, activeSpecies);
    }
    return dataUrl;
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-auto select-none py-2">
      {/* Glassmorphic Cyber-Aquatic Bio-Chamber */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#041024]/90 via-[#020917]/95 to-[#01040a]/98 border border-cyan-500/30 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(0,210,255,0.12)]">
        
        {/* Top Sonar HUD Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-cyan-500/20">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#051833]/80 border border-cyan-400/40 text-[11px] font-mono text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-[#00ffa3] animate-pulse"></span>
              <span className="tracking-wider uppercase font-bold">02 / BIOMARINE GENOME FORGE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight flex items-center gap-2.5">
              <span>Synthesize Alpha Organism</span>
              <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                DEPTH: {activeData.stats.depth}
              </span>
            </h2>
          </div>

          <button
            onClick={randomizeDNA}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#072448] to-[#04142c] hover:from-[#0b3466] hover:to-[#072248] border border-cyan-400/40 text-cyan-200 text-xs font-mono font-bold transition-all shadow-[0_0_15px_rgba(0,210,255,0.15)] hover:shadow-[0_0_20px_rgba(0,210,255,0.3)] shrink-0"
          >
            <Dices className="w-4 h-4 text-[#00ffa3]" />
            <span>MUTATE DNA</span>
          </button>
        </div>

        {/* 3-Column Bio-Deck Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-stretch">
          
          {/* Left Orbital: Species Matrix Selection */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider block mb-2">
                Trench Archetype Matrix
              </span>
              
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {SPECIES_LIST.map((spec) => {
                  const isSelected = activeSpecies === spec.id;
                  return (
                    <div
                      key={spec.id}
                      onClick={() => handleSpeciesChange(spec.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex items-center gap-3 ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#092b52]/90 to-[#04162e]/90 border-cyan-400 shadow-[0_0_20px_rgba(0,210,255,0.25)]'
                          : 'bg-[#030b18]/70 border-cyan-500/15 hover:border-cyan-400/40 hover:bg-[#051329]/60'
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 border"
                        style={{
                          backgroundColor: `${spec.color}15`,
                          borderColor: `${spec.color}40`
                        }}
                      >
                        {spec.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-white text-xs font-heading font-bold truncate">{spec.name}</h4>
                          <span
                            className="text-[10px] font-mono font-bold"
                            style={{ color: spec.color }}
                          >
                            {spec.role.split(' ')[0]}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 truncate mt-0.5">{spec.desc}</p>
                      </div>

                      {isSelected && (
                        <div
                          className="absolute right-0 top-0 bottom-0 w-1 shadow-[0_0_10px_currentColor]"
                          style={{ backgroundColor: spec.color, color: spec.color }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tactical Specimen Stats */}
            <div className="p-3.5 rounded-2xl bg-[#020712]/90 border border-cyan-500/20 font-mono text-xs space-y-2">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Specimen Biometrics</span>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-1.5 rounded-lg bg-[#04142c] border border-cyan-500/20">
                  <span className="text-[9px] text-slate-400 block">STEALTH</span>
                  <span className="text-[#00ffa3] font-bold text-xs">{activeData.stats.stealth}%</span>
                </div>
                <div className="p-1.5 rounded-lg bg-[#04142c] border border-cyan-500/20">
                  <span className="text-[9px] text-slate-400 block">SPEED</span>
                  <span className="text-[#00d2ff] font-bold text-xs">{activeData.stats.speed}kn</span>
                </div>
                <div className="p-1.5 rounded-lg bg-[#04142c] border border-cyan-500/20">
                  <span className="text-[9px] text-slate-400 block">ALPHA BITE</span>
                  <span className="text-[#ffb703] font-bold text-xs">{activeData.stats.bite}/100</span>
                </div>
              </div>
            </div>
          </div>

          {/* Centerpiece: Holographic Living Bio-Chamber */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-full aspect-square max-w-[340px] rounded-3xl overflow-hidden border-2 border-cyan-400/40 bg-[#01040a] shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_0_40px_rgba(0,210,255,0.15)] flex items-center justify-center group">
              <canvas
                ref={canvasRef}
                width={600}
                height={600}
                className="w-full h-full object-contain"
              />

              {/* Holographic HUD Overlays */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#02060d]/90 border border-cyan-400/40 text-[10px] font-mono text-cyan-300 backdrop-blur-md">
                <Disc className="w-3 h-3 text-[#00ffa3] animate-spin" />
                <span className="font-bold">LIVE TELEMETRY</span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#02060d]/90 border border-cyan-500/30 text-[11px] font-mono text-slate-300 backdrop-blur-md">
                <span className="text-white font-bold">{activeData.name}</span>
                <span className="text-[#00ffa3] font-bold">${activeData.role.split(' ')[0].toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Right Orbital: Cybernetic Controls & Synthesize Button */}
          <div className="lg:col-span-3 flex flex-col justify-between space-y-3">
            <div className="space-y-3">
              <span className="text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider block">
                Bioluminescent Aura
              </span>

              {/* Color Swatches */}
              <div className="grid grid-cols-3 gap-2">
                {['#00d2ff', '#00ffa3', '#38bdf8', '#ffb703', '#ff2a85', '#a855f7'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setBioColor(c)}
                    className={`h-9 rounded-xl border-2 transition-all flex items-center justify-center font-mono text-[10px] font-bold ${
                      bioColor === c ? 'scale-105 border-white shadow-[0_0_15px_currentColor]' : 'border-cyan-500/20 opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: `${c}20`, color: c }}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* Cybernetic Implants */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider block">
                  Cyber Implants
                </span>
                <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
                  {[
                    { id: 'sonar_radar', label: 'Sonar Array', icon: <Radio className="w-3 h-3 text-[#00d2ff]" /> },
                    { id: 'laser_sensor', label: 'Laser Target', icon: <Eye className="w-3 h-3 text-[#00ffa3]" /> },
                    { id: 'plasma_fins', label: 'Plasma Fins', icon: <Zap className="w-3 h-3 text-[#38bdf8]" /> },
                    { id: 'neural_core', label: 'Neural Core', icon: <Cpu className="w-3 h-3 text-[#ffb703]" /> }
                  ].map((mod) => (
                    <button
                      key={mod.id}
                      onClick={() => setCyberMod(mod.id)}
                      className={`p-2 rounded-xl border text-left transition-all flex items-center gap-1.5 ${
                        cyberMod === mod.id
                          ? 'bg-[#09264c] border-cyan-400 text-cyan-300 font-bold shadow-[0_0_10px_rgba(0,210,255,0.2)]'
                          : 'bg-[#020712] border-cyan-500/20 text-slate-400 hover:text-white'
                      }`}
                    >
                      {mod.icon}
                      <span className="truncate">{mod.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Big Action Button */}
            <button
              onClick={() => exportFishImage()}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#00d2ff] to-[#00ffa3] hover:from-[#38bdf8] hover:to-[#5eead4] text-[#020712] font-heading font-black text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(0,210,255,0.4)] hover:shadow-[0_0_40px_rgba(0,255,163,0.6)] transition-all transform active:scale-95 shrink-0"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>LOCK DNA & DEPLOY STRATEGY</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

export default FishStudio;
