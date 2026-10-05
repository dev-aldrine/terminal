import React, { useRef, useState, useEffect } from 'react';
import { Sparkles, Dices, RefreshCw, Brush, Eraser, Zap, Activity, Shield } from 'lucide-react';

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
  const overlayCanvasRef = useRef(null);

  const [activeSpecies, setActiveSpecies] = useState(selectedSpecies || 'neon_angler');
  const [bioColor, setBioColor] = useState('#00e5ff');
  const [secondaryColor, setSecondaryColor] = useState('#080d17');
  const [glowIntensity, setGlowIntensity] = useState(80);
  const [cyberMod, setCyberMod] = useState('laser_eye');
  
  const [brushMode, setBrushMode] = useState('brush');
  const [brushColor, setBrushColor] = useState('#00e5ff');
  const [brushSize, setBrushSize] = useState(4);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleSpeciesChange = (speciesId) => {
    setActiveSpecies(speciesId);
    if (setSelectedSpecies) setSelectedSpecies(speciesId);
    const spec = SPECIES_LIST.find(s => s.id === speciesId);
    if (spec) setBioColor(spec.color);
  };

  const renderFishToCanvas = (targetCtx, width, height, time = 0) => {
    targetCtx.clearRect(0, 0, width, height);

    // Flat deep charcoal background
    const bgGradient = targetCtx.createRadialGradient(width / 2, height / 2, 30, width / 2, height / 2, width / 1.4);
    bgGradient.addColorStop(0, '#0a101d');
    bgGradient.addColorStop(1, '#05080f');
    targetCtx.fillStyle = bgGradient;
    targetCtx.fillRect(0, 0, width, height);

    // Subtle technical grid
    targetCtx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    targetCtx.lineWidth = 1;
    for (let x = 0; x < width; x += 30) {
      targetCtx.beginPath();
      targetCtx.moveTo(x, 0);
      targetCtx.lineTo(x, height);
      targetCtx.stroke();
    }
    for (let y = 0; y < height; y += 30) {
      targetCtx.beginPath();
      targetCtx.moveTo(0, y);
      targetCtx.lineTo(width, y);
      targetCtx.stroke();
    }

    const cx = width / 2;
    const cy = height / 2 + Math.sin(time * 0.05) * 6;

    targetCtx.save();
    targetCtx.translate(cx, cy);

    targetCtx.shadowColor = bioColor;
    targetCtx.shadowBlur = (glowIntensity / 100) * 22;

    const bodyGrad = targetCtx.createLinearGradient(-100, -50, 100, 50);
    bodyGrad.addColorStop(0, bioColor);
    bodyGrad.addColorStop(0.7, secondaryColor);
    bodyGrad.addColorStop(1, '#05080f');

    targetCtx.fillStyle = bodyGrad;
    targetCtx.strokeStyle = bioColor;
    targetCtx.lineWidth = 2.5;

    if (activeSpecies === 'neon_angler') {
      targetCtx.beginPath();
      targetCtx.ellipse(0, 0, 90, 65, 0, 0, Math.PI * 2);
      targetCtx.fill();
      targetCtx.stroke();

      const tailWiggle = Math.sin(time * 0.08) * 12;
      targetCtx.beginPath();
      targetCtx.moveTo(-75, 0);
      targetCtx.lineTo(-135, -45 + tailWiggle);
      targetCtx.lineTo(-115, tailWiggle);
      targetCtx.lineTo(-135, 45 + tailWiggle);
      targetCtx.closePath();
      targetCtx.fill();
      targetCtx.stroke();

      targetCtx.beginPath();
      targetCtx.moveTo(40, -55);
      targetCtx.quadraticCurveTo(70, -105, 95, -85);
      targetCtx.strokeStyle = bioColor;
      targetCtx.lineWidth = 2.5;
      targetCtx.stroke();

      targetCtx.beginPath();
      targetCtx.arc(95, -85, 10, 0, Math.PI * 2);
      targetCtx.fillStyle = '#ffffff';
      targetCtx.shadowColor = '#ffffff';
      targetCtx.shadowBlur = 30;
      targetCtx.fill();

    } else if (activeSpecies === 'cyber_shark') {
      targetCtx.beginPath();
      targetCtx.moveTo(110, 0);
      targetCtx.quadraticCurveTo(30, -55, -90, -25);
      targetCtx.lineTo(-140, -50 + Math.sin(time * 0.08) * 10);
      targetCtx.lineTo(-115, 0);
      targetCtx.lineTo(-140, 50 + Math.sin(time * 0.08) * 10);
      targetCtx.lineTo(-90, 25);
      targetCtx.quadraticCurveTo(30, 55, 110, 0);
      targetCtx.closePath();
      targetCtx.fill();
      targetCtx.stroke();

      targetCtx.beginPath();
      targetCtx.moveTo(0, -42);
      targetCtx.lineTo(-25, -95);
      targetCtx.lineTo(35, -40);
      targetCtx.closePath();
      targetCtx.fill();
      targetCtx.stroke();

    } else if (activeSpecies === 'bio_jelly') {
      targetCtx.beginPath();
      targetCtx.arc(0, -20, 80, Math.PI, 0, false);
      targetCtx.quadraticCurveTo(40, 0, 0, 10);
      targetCtx.quadraticCurveTo(-40, 0, -80, -20);
      targetCtx.closePath();
      targetCtx.fill();
      targetCtx.stroke();

      for (let i = -3; i <= 3; i++) {
        targetCtx.beginPath();
        targetCtx.moveTo(i * 18, 10);
        const wave = Math.sin(time * 0.06 + i) * 15;
        targetCtx.bezierCurveTo(i * 22 + wave, 60, i * 15 - wave, 110, i * 20 + wave, 140);
        targetCtx.strokeStyle = bioColor;
        targetCtx.lineWidth = 2.5;
        targetCtx.stroke();
      }
    } else {
      targetCtx.beginPath();
      targetCtx.ellipse(0, 0, 95, 55, 0, 0, Math.PI * 2);
      targetCtx.fill();
      targetCtx.stroke();

      targetCtx.beginPath();
      targetCtx.moveTo(-80, 0);
      targetCtx.lineTo(-135, -40);
      targetCtx.lineTo(-110, 0);
      targetCtx.lineTo(-135, 40);
      targetCtx.closePath();
      targetCtx.fill();
      targetCtx.stroke();
    }

    // Eye
    targetCtx.beginPath();
    targetCtx.arc(45, -12, 10, 0, Math.PI * 2);
    targetCtx.fillStyle = '#05080f';
    targetCtx.fill();
    targetCtx.beginPath();
    targetCtx.arc(47, -12, 4.5, 0, Math.PI * 2);
    targetCtx.fillStyle = bioColor;
    targetCtx.shadowBlur = 12;
    targetCtx.fill();

    // Cyber Mod
    if (cyberMod === 'laser_eye') {
      targetCtx.beginPath();
      targetCtx.moveTo(52, -12);
      targetCtx.lineTo(160, -12);
      targetCtx.strokeStyle = '#00ffa3';
      targetCtx.lineWidth = 1.5;
      targetCtx.shadowColor = '#00ffa3';
      targetCtx.shadowBlur = 10;
      targetCtx.stroke();
    } else if (cyberMod === 'antenna_radar') {
      targetCtx.beginPath();
      targetCtx.moveTo(10, -50);
      targetCtx.lineTo(25, -85);
      targetCtx.strokeStyle = '#00e5ff';
      targetCtx.lineWidth = 2;
      targetCtx.stroke();
      targetCtx.beginPath();
      targetCtx.arc(25, -85, 5, 0, Math.PI * 2);
      targetCtx.fillStyle = '#00e5ff';
      targetCtx.fill();
    }

    targetCtx.restore();
  };

  useEffect(() => {
    let frameId;
    let time = 0;

    const renderLoop = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        renderFishToCanvas(ctx, canvas.width, canvas.height, time);
      }
      time++;
      frameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();
    return () => cancelAnimationFrame(frameId);
  }, [activeSpecies, bioColor, secondaryColor, glowIntensity, cyberMod]);

  const handleStartDraw = (e) => {
    setIsDrawing(true);
    draw(e);
  };

  const handleEndDraw = () => {
    setIsDrawing(false);
    const overlay = overlayCanvasRef.current;
    if (overlay) {
      const ctx = overlay.getContext('2d');
      ctx.beginPath();
    }
  };

  const draw = (e) => {
    if (!isDrawing && e.type !== 'mousedown') return;
    const overlay = overlayCanvasRef.current;
    if (!overlay) return;
    const ctx = overlay.getContext('2d');
    const rect = overlay.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (brushMode === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.arc(x, y, brushSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = brushColor;
      ctx.shadowColor = brushColor;
      ctx.shadowBlur = 8;
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const clearDrawing = () => {
    const overlay = overlayCanvasRef.current;
    if (overlay) {
      const ctx = overlay.getContext('2d');
      ctx.clearRect(0, 0, overlay.width, overlay.height);
    }
  };

  const randomizeDNA = () => {
    const randomSpec = SPECIES_LIST[Math.floor(Math.random() * SPECIES_LIST.length)];
    handleSpeciesChange(randomSpec.id);
    const colors = ['#00e5ff', '#00ffa3', '#38bdf8', '#ffb703', '#ff2a85', '#ffffff'];
    setBioColor(colors[Math.floor(Math.random() * colors.length)]);
  };

  const exportFishImage = () => {
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = 600;
    exportCanvas.height = 600;
    const ctx = exportCanvas.getContext('2d');

    renderFishToCanvas(ctx, 600, 600, 45);

    const overlay = overlayCanvasRef.current;
    if (overlay) {
      ctx.drawImage(overlay, 0, 0, 600, 600);
    }

    const dataUrl = exportCanvas.toDataURL('image/png');
    if (onSaveFish) {
      onSaveFish(dataUrl, activeSpecies);
    }
    return dataUrl;
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-6">
      
      {/* Header */}
      <div className="text-left mb-6 space-y-1.5">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-[#00e5ff]">
          <span>02 / CYBER-AQUATIC DNA STUDIO</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-heading">
          Configure Creature DNA & Visuals
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm">
          Select an archetype, adjust bioluminescent emissions, and draw custom markings directly on the canvas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Archetype List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="editorial-card p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 text-xs font-mono">
              <span className="text-slate-300 font-semibold">SPECIES ARCHETYPE</span>
              <button
                onClick={randomizeDNA}
                className="text-[#00e5ff] hover:underline flex items-center gap-1"
              >
                <Dices className="w-3.5 h-3.5" /> Randomize
              </button>
            </div>

            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
              {SPECIES_LIST.map((species) => {
                const isSelected = activeSpecies === species.id;
                return (
                  <button
                    key={species.id}
                    onClick={() => handleSpeciesChange(species.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-[#0c1322] border-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.15)]'
                        : 'bg-[#080d17] border-white/[0.06] hover:border-white/[0.2]'
                    }`}
                  >
                    <span className="text-xl p-1.5 rounded bg-[#05080f] border border-white/[0.08] shrink-0">
                      {species.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <strong className="text-white text-xs font-heading">{species.name}</strong>
                        <span className="text-[10px] font-mono text-[#00e5ff]">{species.role.split(' ')[0]}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed font-sans">
                        {species.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Controls */}
          <div className="editorial-card p-4 space-y-3 font-mono text-xs">
            <span className="text-slate-300 font-semibold block border-b border-white/[0.08] pb-2">EMISSION AURA</span>
            <div className="flex items-center gap-2 flex-wrap">
              {['#00e5ff', '#00ffa3', '#38bdf8', '#ffb703', '#ff2a85', '#ffffff'].map((c) => (
                <button
                  key={c}
                  onClick={() => setBioColor(c)}
                  className={`w-6 h-6 rounded-full border transition-transform ${
                    bioColor === c ? 'scale-125 border-white shadow-[0_0_8px_currentColor]' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c, color: c }}
                />
              ))}
            </div>

            <div className="pt-2">
              <span className="text-slate-400 text-[11px] block mb-1.5">AUGMENTATION</span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                {[
                  { id: 'laser_eye', label: 'Laser Sensor' },
                  { id: 'antenna_radar', label: 'Alpha Radar' },
                  { id: 'none', label: 'Pure Hydro' }
                ].map((mod) => (
                  <button
                    key={mod.id}
                    onClick={() => setCyberMod(mod.id)}
                    className={`p-2 rounded border text-left transition-all ${
                      cyberMod === mod.id
                        ? 'bg-[#0c1322] border-[#00e5ff] text-[#00e5ff] font-bold'
                        : 'bg-[#080d17] border-white/[0.08] text-slate-400'
                    }`}
                  >
                    {mod.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Live Viewport & Drawing Tools */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          
          <div className="relative w-full aspect-square max-h-[460px] rounded-xl overflow-hidden border border-white/[0.12] bg-[#05080f] flex items-center justify-center">
            
            <canvas
              ref={canvasRef}
              width={500}
              height={500}
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            />

            <canvas
              ref={overlayCanvasRef}
              width={500}
              height={500}
              onMouseDown={handleStartDraw}
              onMouseUp={handleEndDraw}
              onMouseMove={draw}
              onMouseLeave={handleEndDraw}
              className="absolute inset-0 w-full h-full object-contain cursor-crosshair z-10"
            />

            <div className="absolute top-3 left-3 z-20 flex items-center gap-2 px-2.5 py-1 rounded bg-[#05080f]/90 border border-white/[0.1] text-[11px] font-mono text-slate-300">
              <Activity className="w-3.5 h-3.5 text-[#00e5ff]" />
              <span>LIVE PHYSICS VIEWPORT</span>
            </div>

            <div className="absolute top-3 right-3 z-20">
              <button
                onClick={clearDrawing}
                className="px-2.5 py-1 rounded bg-[#0c1322] hover:bg-[#111b2e] border border-white/[0.08] text-slate-400 hover:text-white text-xs font-mono"
              >
                Clear Ink
              </button>
            </div>
          </div>

          {/* Paint Toolbar */}
          <div className="editorial-card p-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-[#05080f] p-1 rounded border border-white/[0.08]">
                <button
                  onClick={() => setBrushMode('brush')}
                  className={`p-1.5 rounded text-xs transition-all ${
                    brushMode === 'brush' ? 'bg-[#00e5ff] text-black font-bold' : 'text-slate-400'
                  }`}
                  title="Neon Brush"
                >
                  <Brush className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setBrushMode('eraser')}
                  className={`p-1.5 rounded text-xs transition-all ${
                    brushMode === 'eraser' ? 'bg-[#00e5ff] text-black font-bold' : 'text-slate-400'
                  }`}
                  title="Eraser"
                >
                  <Eraser className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                {['#00e5ff', '#00ffa3', '#ffb703', '#ffffff'].map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setBrushColor(c);
                      setBrushMode('brush');
                    }}
                    className={`w-5 h-5 rounded-full border transition-transform ${
                      brushColor === c && brushMode === 'brush' ? 'scale-125 border-white' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={() => exportFishImage()}
              className="btn-primary text-xs font-bold"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Lock DNA & Configure Strategy</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
