import React, { useRef, useState, useEffect } from 'react';
import { Sparkles, Dices, RefreshCw, Zap, Activity, Shield, Waves, Cpu, Eye, Radio } from 'lucide-react';
import BorderGlow from './BorderGlow';

export const SPECIES_LIST = [
  {
    id: 'neon_angler',
    name: 'Neon Angler Core',
    role: 'Dip Sniper & Deep Alpha',
    icon: '🏮',
    color: '#00e5ff',
    desc: 'Lurks in dark liquidity depths. Uses its luminescent lure to detect stealth accumulation.'
  },
  {
    id: 'cyber_shark',
    name: 'Cyber Megalodon',
    role: 'Aggressive Momentum',
    icon: '🦈',
    color: '#00ffa3',
    desc: 'Apex predator armed with sub-millisecond hunting thrusters. Scents volume candles instantly.'
  },
  {
    id: 'bio_jelly',
    name: 'Bioluminescent Jelly',
    role: 'Liquidity Float & Yield',
    icon: '🪼',
    color: '#38bdf8',
    desc: 'Pulsates with cosmic underwater serenity. Absorbs massive volatility shocks with frictionless slip.'
  },
  {
    id: 'volt_ray',
    name: 'Volt Ray Arbitrage',
    role: 'High-Frequency Surge',
    icon: '⚡',
    color: '#ffb703',
    desc: 'Glides across the ocean floor, discharging micro-transactions on rapid pool imbalance.'
  },
  {
    id: 'mecha_puffer',
    name: 'Mecha Puffer',
    role: 'Anti-Dump Fortress',
    icon: '🐡',
    color: '#ff2a85',
    desc: 'Expands into an armored spike shield when sell pressure spikes, defending holders.'
  },
  {
    id: 'abyss_whale',
    name: 'Abyss Whale Sentinel',
    role: 'Treasury Accumulator',
    icon: '🐋',
    color: '#a855f7',
    desc: 'Colossal ancient entity. Absorbs liquidity depth to anchor long-term ecosystem floor.'
  }
];

export function FishStudio({ onSaveFish, selectedSpecies = 'neon_angler', setSelectedSpecies }) {
  const canvasRef = useRef(null);

  const [activeSpecies, setActiveSpecies] = useState(selectedSpecies || 'neon_angler');
  const [bioColor, setBioColor] = useState('#00e5ff');
  const [secondaryColor, setSecondaryColor] = useState('#071326');
  const [glowIntensity, setGlowIntensity] = useState(85);
  const [cyberMod, setCyberMod] = useState('sonar_radar');
  const [swimSpeed, setSwimSpeed] = useState(1.2);

  const handleSpeciesChange = (speciesId) => {
    setActiveSpecies(speciesId);
    if (setSelectedSpecies) setSelectedSpecies(speciesId);
    const spec = SPECIES_LIST.find(s => s.id === speciesId);
    if (spec) setBioColor(spec.color);
  };

  const randomizeDNA = () => {
    const randomSpec = SPECIES_LIST[Math.floor(Math.random() * SPECIES_LIST.length)];
    handleSpeciesChange(randomSpec.id);
    const colors = ['#00e5ff', '#00ffa3', '#38bdf8', '#ffb703', '#ff2a85', '#3b82f6'];
    setBioColor(colors[Math.floor(Math.random() * colors.length)]);
    const mods = ['sonar_radar', 'laser_sensor', 'plasma_fins', 'neural_core'];
    setCyberMod(mods[Math.floor(Math.random() * mods.length)]);
  };

  const renderFishToCanvas = (targetCtx, width, height, time = 0) => {
    targetCtx.clearRect(0, 0, width, height);

    // Deep abyss water gradient
    const bgGradient = targetCtx.createRadialGradient(width / 2, height / 2, 40, width / 2, height / 2, width / 1.3);
    bgGradient.addColorStop(0, '#0a1526');
    bgGradient.addColorStop(0.7, '#050b16');
    bgGradient.addColorStop(1, '#02060d');
    targetCtx.fillStyle = bgGradient;
    targetCtx.fillRect(0, 0, width, height);

    // Subtle water sonar concentric rings
    targetCtx.strokeStyle = 'rgba(0, 210, 255, 0.05)';
    targetCtx.lineWidth = 1;
    for (let r = 50; r < width; r += 70) {
      targetCtx.beginPath();
      targetCtx.arc(width / 2, height / 2, r, 0, Math.PI * 2);
      targetCtx.stroke();
    }

    // Ambient floating bioluminescent particles & bubbles
    for (let i = 0; i < 20; i++) {
      const px = (Math.sin(i * 99 + time * 0.01) * 0.5 + 0.5) * width;
      const py = ((i * 37 + time * (0.3 + (i % 3) * 0.2)) % height);
      const pr = (i % 3) + 1;
      targetCtx.beginPath();
      targetCtx.arc(px, height - py, pr, 0, Math.PI * 2);
      targetCtx.fillStyle = `rgba(0, 210, 255, ${0.15 + (i % 5) * 0.05})`;
      targetCtx.fill();
    }

    const cx = width / 2;
    const cy = height / 2 + Math.sin(time * 0.04 * swimSpeed) * 8;

    targetCtx.save();
    targetCtx.translate(cx, cy);

    targetCtx.shadowColor = bioColor;
    targetCtx.shadowBlur = (glowIntensity / 100) * 25;

    const bodyGrad = targetCtx.createLinearGradient(-120, -60, 120, 60);
    bodyGrad.addColorStop(0, bioColor);
    bodyGrad.addColorStop(0.6, secondaryColor);
    bodyGrad.addColorStop(1, '#02060d');

    targetCtx.fillStyle = bodyGrad;
    targetCtx.strokeStyle = bioColor;
    targetCtx.lineWidth = 2.5;

    const tailWiggle = Math.sin(time * 0.08 * swimSpeed) * 14;

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
      targetCtx.lineTo(-30, -95);
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
          t + Math.sin(time * 0.05 + t) * 25, 135
        );
        targetCtx.strokeStyle = bioColor;
        targetCtx.lineWidth = 2.5;
        targetCtx.stroke();
      }

    } else if (activeSpecies === 'volt_ray') {
      targetCtx.beginPath();
      targetCtx.moveTo(110, 0);
      targetCtx.lineTo(0, -95);
      targetCtx.lineTo(-100, 0);
      targetCtx.lineTo(0, 95);
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
        const ex = Math.cos(a) * 110;
        const ey = Math.sin(a) * 110;
        targetCtx.beginPath();
        targetCtx.moveTo(sx, sy);
        targetCtx.lineTo(ex, ey);
        targetCtx.strokeStyle = bioColor;
        targetCtx.lineWidth = 3;
        targetCtx.stroke();
      }

    } else {
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

    if (cyberMod === 'sonar_radar') {
      targetCtx.beginPath();
      targetCtx.arc(55, -20, 8, 0, Math.PI * 2);
      targetCtx.fillStyle = '#00d2ff';
      targetCtx.fill();
      targetCtx.beginPath();
      targetCtx.arc(55, -20, 16 + (Math.sin(time * 0.1) * 4), 0, Math.PI * 2);
      targetCtx.strokeStyle = 'rgba(0, 210, 255, 0.6)';
      targetCtx.lineWidth = 1.5;
      targetCtx.stroke();
    } else if (cyberMod === 'laser_sensor') {
      targetCtx.beginPath();
      targetCtx.arc(60, -15, 6, 0, Math.PI * 2);
      targetCtx.fillStyle = '#ff0055';
      targetCtx.shadowColor = '#ff0055';
      targetCtx.shadowBlur = 20;
      targetCtx.fill();
      targetCtx.beginPath();
      targetCtx.moveTo(60, -15);
      targetCtx.lineTo(160, -15);
      targetCtx.strokeStyle = 'rgba(255, 0, 85, 0.4)';
      targetCtx.lineWidth = 2;
      targetCtx.stroke();
    } else if (cyberMod === 'plasma_fins') {
      targetCtx.beginPath();
      targetCtx.moveTo(0, 30);
      targetCtx.lineTo(-40, 75);
      targetCtx.lineTo(20, 45);
      targetCtx.closePath();
      targetCtx.fillStyle = '#00ffa3';
      targetCtx.fill();
    } else if (cyberMod === 'neural_core') {
      targetCtx.beginPath();
      targetCtx.arc(0, 0, 14, 0, Math.PI * 2);
      targetCtx.fillStyle = '#ffffff';
      targetCtx.shadowColor = bioColor;
      targetCtx.shadowBlur = 25;
      targetCtx.fill();
    }

    targetCtx.restore();
  };

  useEffect(() => {
    let animId;
    let t = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const render = () => {
      t += 1;
      renderFishToCanvas(ctx, 600, 600, t);
      animId = requestAnimationFrame(render);
    };
    render();

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [activeSpecies, bioColor, secondaryColor, glowIntensity, cyberMod, swimSpeed]);

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
    <div className="w-full max-w-4xl mx-auto my-auto select-none">
      <div className="w-full rounded-2xl bg-[#061224]/50 backdrop-blur-xl border border-cyan-400/25 shadow-[0_15px_35px_rgba(0,0,0,0.5),0_0_20px_rgba(0,210,255,0.06)] p-6 space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#040a16]/80 border border-cyan-400/40 text-[10px] font-mono text-cyan-300 mb-1">
              <Waves className="w-3 h-3 text-[#00d2ff]" />
              <span>02 / CYBER-AQUATIC DNA STUDIO</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-heading">
              Configure Creature DNA & Visuals
            </h2>
          </div>

          <button
            onClick={randomizeDNA}
            className="px-3 py-1.5 rounded-xl bg-[#040a16]/80 hover:bg-[#08152b] border border-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Dices className="w-3.5 h-3.5" /> Randomize
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          
          {/* Left Column: Archetype List */}
          <div className="lg:col-span-5 space-y-3">
            <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
              {SPECIES_LIST.map((species) => {
                const isSelected = activeSpecies === species.id;
                return (
                  <button
                    key={species.id}
                    onClick={() => handleSpeciesChange(species.id)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-[#08152b]/90 border-[#00d2ff] shadow-[0_0_15px_rgba(0,210,255,0.2)]'
                        : 'bg-[#040812]/75 border-cyan-500/15 hover:border-cyan-400/40'
                    }`}
                  >
                    <span className="text-lg p-1.5 rounded-lg bg-[#020610] border border-cyan-500/25 shrink-0">
                      {species.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <strong className="text-white text-xs font-heading">{species.name}</strong>
                        <span className="text-[10px] font-mono text-[#00d2ff] font-semibold">{species.role.split(' ')[0]}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1 leading-tight font-sans mt-0.5">
                        {species.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Controls */}
            <div className="p-3.5 rounded-xl bg-[#030914]/75 border border-cyan-400/25 backdrop-blur-md space-y-3 font-mono text-xs">
              <div>
                <span className="text-slate-300 font-semibold block text-[11px] mb-1.5">
                  EMISSION AURA
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {['#00d2ff', '#00ffa3', '#38bdf8', '#ffb703', '#ff2a85', '#3b82f6'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setBioColor(c)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${
                        bioColor === c ? 'scale-125 border-white shadow-[0_0_10px_currentColor]' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c, color: c }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] block mb-1.5">AUGMENTATION</span>
                <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                  {[
                    { id: 'sonar_radar', label: 'Sonar Radar', icon: <Radio className="w-3 h-3" /> },
                    { id: 'laser_sensor', label: 'Laser Sensor', icon: <Eye className="w-3 h-3" /> },
                    { id: 'plasma_fins', label: 'Plasma Fins', icon: <Zap className="w-3 h-3" /> },
                    { id: 'neural_core', label: 'Neural Core', icon: <Cpu className="w-3 h-3" /> }
                  ].map((mod) => (
                    <button
                      key={mod.id}
                      onClick={() => setCyberMod(mod.id)}
                      className={`p-1.5 rounded-lg border text-left transition-all flex items-center gap-1.5 ${
                        cyberMod === mod.id
                          ? 'bg-[#08152b] border-[#00d2ff] text-[#00d2ff] font-bold'
                          : 'bg-[#040812]/80 border-cyan-500/15 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {mod.icon}
                      <span>{mod.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Live Viewport & Action */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="relative w-full aspect-square max-h-[320px] rounded-2xl overflow-hidden border border-cyan-400/25 bg-[#02060d] shadow-[0_15px_40px_rgba(0,0,0,0.8),inset_0_0_30px_rgba(0,210,255,0.08)] flex items-center justify-center mx-auto">
              <canvas
                ref={canvasRef}
                width={600}
                height={600}
                className="w-full h-full object-contain"
              />

              <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#02060d]/80 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ffa3] shadow-[0_0_6px_#00ffa3]"></span>
                <span>LIVE ORGANISM</span>
              </div>
            </div>

            {/* Action */}
            <div className="p-3 rounded-xl bg-[#030914]/75 border border-cyan-400/25 flex items-center justify-between gap-3">
              <div className="font-mono text-xs">
                <span className="text-slate-400 block text-[10px]">Active Entity:</span>
                <strong className="text-white text-xs font-heading">
                  {SPECIES_LIST.find(s => s.id === activeSpecies)?.name}
                </strong>
              </div>

              <button
                onClick={() => exportFishImage()}
                className="btn-primary text-xs font-bold px-5 py-2.5 shadow-[0_0_20px_rgba(0,210,255,0.25)] rounded-xl"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Lock DNA & Configure Strategy</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default FishStudio;
