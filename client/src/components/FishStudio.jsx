import React, { useRef, useState, useEffect } from 'react';
import { Sparkles, Dices, RefreshCw, Brush, Eraser, Palette, Eye, Shield, Zap, Activity } from 'lucide-react';

export const SPECIES_LIST = [
  {
    id: 'neon_angler',
    name: 'Neon Angler',
    role: 'Alpha Sniper',
    icon: '🏮',
    color: '#00f5ff',
    desc: 'Deep Mariana Trench predator. Uses its blinding bioluminescent lure to discover hidden gems before the crowd.'
  },
  {
    id: 'cyber_shark',
    name: 'Cyber Shark',
    role: 'Momentum Hunter',
    icon: '🦈',
    color: '#05ffa1',
    desc: 'Apex predator armed with sub-millisecond hunting thrusters. Scents volume candles from miles away.'
  },
  {
    id: 'bio_jelly',
    name: 'Bioluminescent Jelly',
    role: 'Liquidity Float',
    icon: '🪼',
    color: '#a855f7',
    desc: 'Pulsates with cosmic underwater serenity. Absorbs massive volatility shocks with frictionless slip.'
  },
  {
    id: 'volt_ray',
    name: 'Volt Ray',
    role: 'Arbitrage Surge',
    icon: '⚡',
    color: '#ffb703',
    desc: 'Glides across the ocean floor, discharging high-voltage micro-transactions on rapid pool shifts.'
  },
  {
    id: 'mecha_puffer',
    name: 'Mecha Puffer',
    role: 'Anti-Dump Shield',
    icon: '🐡',
    color: '#ff2a85',
    desc: 'Expands into an armored spike fortress when whales attempt to dump, defending holders with steel scales.'
  },
  {
    id: 'abyss_whale',
    name: 'Abyss Whale',
    role: 'Treasury Accumulator',
    icon: '🐋',
    color: '#38bdf8',
    desc: 'Colossal ancient sentinel of the deep. Absorbs millions in liquidity to anchor the ecosystem.'
  }
];

export function FishStudio({ onSaveFish, initialImageData = null, selectedSpecies = 'neon_angler', setSelectedSpecies }) {
  const canvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const previewCanvasRef = useRef(null);

  const [activeSpecies, setActiveSpecies] = useState(selectedSpecies || 'neon_angler');
  const [bioColor, setBioColor] = useState('#00f5ff');
  const [secondaryColor, setSecondaryColor] = useState('#0b1f3b');
  const [glowIntensity, setGlowIntensity] = useState(80);
  const [finStyle, setFinStyle] = useState('streamlined'); // 'streamlined', 'cyber_plates', 'serrated'
  const [cyberMod, setCyberMod] = useState('laser_eye'); // 'laser_eye', 'antenna_radar', 'plasma_core', 'none'
  
  // Hand-drawing overlay state
  const [brushMode, setBrushMode] = useState('brush'); // 'brush', 'eraser'
  const [brushColor, setBrushColor] = useState('#00f5ff');
  const [brushSize, setBrushSize] = useState(4);
  const [isDrawing, setIsDrawing] = useState(false);

  // Sync species
  const handleSpeciesChange = (speciesId) => {
    setActiveSpecies(speciesId);
    if (setSelectedSpecies) setSelectedSpecies(speciesId);
    const spec = SPECIES_LIST.find(s => s.id === speciesId);
    if (spec) setBioColor(spec.color);
  };

  // Render SVG base fish directly to canvas
  const renderFishToCanvas = (targetCtx, width, height, time = 0) => {
    targetCtx.clearRect(0, 0, width, height);

    // Deep ocean background
    const bgGradient = targetCtx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, width / 1.5);
    bgGradient.addColorStop(0, '#071830');
    bgGradient.addColorStop(1, '#020611');
    targetCtx.fillStyle = bgGradient;
    targetCtx.fillRect(0, 0, width, height);

    // Subtle background grid
    targetCtx.strokeStyle = 'rgba(0, 245, 255, 0.05)';
    targetCtx.lineWidth = 1;
    for (let x = 0; x < width; x += 25) {
      targetCtx.beginPath();
      targetCtx.moveTo(x, 0);
      targetCtx.lineTo(x, height);
      targetCtx.stroke();
    }
    for (let y = 0; y < height; y += 25) {
      targetCtx.beginPath();
      targetCtx.moveTo(0, y);
      targetCtx.lineTo(width, y);
      targetCtx.stroke();
    }

    const cx = width / 2;
    const cy = height / 2 + Math.sin(time * 0.05) * 6;

    targetCtx.save();
    targetCtx.translate(cx, cy);

    // Glow setup
    targetCtx.shadowColor = bioColor;
    targetCtx.shadowBlur = (glowIntensity / 100) * 25;

    // Body Gradient
    const bodyGrad = targetCtx.createLinearGradient(-100, -50, 100, 50);
    bodyGrad.addColorStop(0, bioColor);
    bodyGrad.addColorStop(0.6, secondaryColor);
    bodyGrad.addColorStop(1, '#020917');

    targetCtx.fillStyle = bodyGrad;
    targetCtx.strokeStyle = bioColor;
    targetCtx.lineWidth = 3;

    // Draw Fish by Species Archetype
    if (activeSpecies === 'neon_angler') {
      // Body
      targetCtx.beginPath();
      targetCtx.ellipse(0, 0, 90, 65, 0, 0, Math.PI * 2);
      targetCtx.fill();
      targetCtx.stroke();

      // Tail with swim wave
      const tailWiggle = Math.sin(time * 0.08) * 12;
      targetCtx.beginPath();
      targetCtx.moveTo(-75, 0);
      targetCtx.lineTo(-135, -45 + tailWiggle);
      targetCtx.lineTo(-115, tailWiggle);
      targetCtx.lineTo(-135, 45 + tailWiggle);
      targetCtx.closePath();
      targetCtx.fill();
      targetCtx.stroke();

      // Angler Lure Stalk & Glowing Bulb
      targetCtx.beginPath();
      targetCtx.moveTo(40, -55);
      targetCtx.quadraticCurveTo(70, -105, 95, -85);
      targetCtx.strokeStyle = bioColor;
      targetCtx.lineWidth = 3;
      targetCtx.stroke();

      // Glowing Lure Bulb
      targetCtx.beginPath();
      targetCtx.arc(95, -85, 12, 0, Math.PI * 2);
      targetCtx.fillStyle = '#ffffff';
      targetCtx.shadowColor = '#ffffff';
      targetCtx.shadowBlur = 35;
      targetCtx.fill();

    } else if (activeSpecies === 'cyber_shark') {
      // Sleek Torpedo Shark Body
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

      // Dorsal Fin
      targetCtx.beginPath();
      targetCtx.moveTo(0, -42);
      targetCtx.lineTo(-25, -95);
      targetCtx.lineTo(35, -40);
      targetCtx.closePath();
      targetCtx.fill();
      targetCtx.stroke();

    } else if (activeSpecies === 'bio_jelly') {
      // Umbrella Bell
      targetCtx.beginPath();
      targetCtx.arc(0, -20, 80, Math.PI, 0, false);
      targetCtx.quadraticCurveTo(40, 0, 0, 10);
      targetCtx.quadraticCurveTo(-40, 0, -80, -20);
      targetCtx.closePath();
      targetCtx.fill();
      targetCtx.stroke();

      // Tentacles with wave motion
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
      // General Cyber Aquatic Creature
      targetCtx.beginPath();
      targetCtx.ellipse(0, 0, 95, 55, 0, 0, Math.PI * 2);
      targetCtx.fill();
      targetCtx.stroke();

      // Fins
      targetCtx.beginPath();
      targetCtx.moveTo(-80, 0);
      targetCtx.lineTo(-135, -40);
      targetCtx.lineTo(-110, 0);
      targetCtx.lineTo(-135, 40);
      targetCtx.closePath();
      targetCtx.fill();
      targetCtx.stroke();
    }

    // Cyber Eye
    targetCtx.beginPath();
    targetCtx.arc(45, -12, 10, 0, Math.PI * 2);
    targetCtx.fillStyle = '#020917';
    targetCtx.fill();
    targetCtx.beginPath();
    targetCtx.arc(47, -12, 5, 0, Math.PI * 2);
    targetCtx.fillStyle = bioColor;
    targetCtx.shadowBlur = 15;
    targetCtx.fill();

    // Cyber Mod Additions
    if (cyberMod === 'laser_eye') {
      targetCtx.beginPath();
      targetCtx.moveTo(52, -12);
      targetCtx.lineTo(160, -12);
      targetCtx.strokeStyle = 'rgba(255, 42, 133, 0.7)';
      targetCtx.lineWidth = 2;
      targetCtx.shadowColor = '#ff2a85';
      targetCtx.shadowBlur = 15;
      targetCtx.stroke();
    } else if (cyberMod === 'antenna_radar') {
      targetCtx.beginPath();
      targetCtx.moveTo(10, -50);
      targetCtx.lineTo(25, -85);
      targetCtx.strokeStyle = '#05ffa1';
      targetCtx.lineWidth = 3;
      targetCtx.stroke();
      targetCtx.beginPath();
      targetCtx.arc(25, -85, 6, 0, Math.PI * 2);
      targetCtx.fillStyle = '#05ffa1';
      targetCtx.fill();
    }

    targetCtx.restore();
  };

  // Animation Loop for live canvas
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
  }, [activeSpecies, bioColor, secondaryColor, glowIntensity, finStyle, cyberMod]);

  // Hand-drawing interaction on overlay canvas
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
      ctx.shadowBlur = 10;
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
    const colors = ['#00f5ff', '#05ffa1', '#a855f7', '#ff2a85', '#ffb703', '#38bdf8'];
    setBioColor(colors[Math.floor(Math.random() * colors.length)]);
    setGlowIntensity(60 + Math.floor(Math.random() * 40));
    const mods = ['laser_eye', 'antenna_radar', 'plasma_core', 'none'];
    setCyberMod(mods[Math.floor(Math.random() * mods.length)]);
  };

  // Export merged high-res fish to Data URL
  const exportFishImage = () => {
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = 600;
    exportCanvas.height = 600;
    const ctx = exportCanvas.getContext('2d');

    // 1. Render Base Fish
    renderFishToCanvas(ctx, 600, 600, 45);

    // 2. Draw user overlay
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
    <div className="w-full max-w-6xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 font-mono text-xs mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>CYBER-AQUATIC DNA FORGE</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-2">
          Design Your <span className="text-gradient-cyan">AI Marine Creature</span>
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base">
          Choose a predatory or liquidity species, configure its cybernetic bioluminescence, and paint custom neon decals.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Species & Archetype Selector */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel rounded-2xl p-5 border border-cyan-500/20">
            <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 font-mono mb-3 flex items-center justify-between">
              <span>Select Species Archetype</span>
              <button
                onClick={randomizeDNA}
                className="flex items-center gap-1 text-xs text-slate-300 hover:text-cyan-300 transition-colors"
                title="Randomize DNA"
              >
                <Dices className="w-3.5 h-3.5 text-cyan-400" />
                <span>Randomize</span>
              </button>
            </h3>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {SPECIES_LIST.map((species) => {
                const isSelected = activeSpecies === species.id;
                return (
                  <button
                    key={species.id}
                    onClick={() => handleSpeciesChange(species.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_15px_rgba(0,245,255,0.2)]'
                        : 'bg-slate-900/50 border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900/80'
                    }`}
                  >
                    <span className="text-2xl p-2 rounded-lg bg-slate-950/80 border border-slate-800 shrink-0">
                      {species.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-white text-sm truncate">{species.name}</h4>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-900/40 text-cyan-300 border border-cyan-500/30">
                          {species.role}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {species.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DNA Customizer Controls */}
          <div className="glass-panel rounded-2xl p-5 border border-cyan-500/20 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 font-mono">
              Bioluminescence & Mods
            </h3>

            <div>
              <label className="text-xs text-slate-400 mb-2 block font-medium">Bioluminescent Aura Color</label>
              <div className="flex items-center gap-2 flex-wrap">
                {['#00f5ff', '#05ffa1', '#a855f7', '#ff2a85', '#ffb703', '#38bdf8', '#ffffff'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setBioColor(c)}
                    className={`w-7 h-7 rounded-full transition-transform border ${
                      bioColor === c ? 'scale-125 border-white shadow-[0_0_10px_currentColor]' : 'border-transparent hover:scale-110'
                    }`}
                    style={{ backgroundColor: c, color: c }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-2 block font-medium">Cybernetic Augmentation</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'laser_eye', label: '🔴 Laser Sniper' },
                  { id: 'antenna_radar', label: '📡 Alpha Radar' },
                  { id: 'plasma_core', label: '⚡ Plasma Core' },
                  { id: 'none', label: '🛡️ Pure Marine' }
                ].map((mod) => (
                  <button
                    key={mod.id}
                    onClick={() => setCyberMod(mod.id)}
                    className={`p-2 rounded-lg border text-left font-mono transition-all ${
                      cyberMod === mod.id
                        ? 'bg-cyan-950/70 border-cyan-400 text-cyan-300'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {mod.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Live Interactive Canvas & Drawing Tools */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          
          {/* Main Visual Viewport */}
          <div className="relative w-full aspect-square max-h-[480px] rounded-3xl overflow-hidden border-2 border-cyan-500/30 shadow-[0_0_40px_rgba(0,245,255,0.15)] bg-[#020611] flex items-center justify-center">
            
            {/* Base Animated Canvas */}
            <canvas
              ref={canvasRef}
              width={500}
              height={500}
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            />

            {/* Hand-Drawing Overlay Canvas */}
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

            {/* Live Water Reflection & HUD Scanlines */}
            <div className="absolute inset-0 pointer-events-none scanline-overlay opacity-30"></div>

            {/* Top HUD Badge */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-xs font-mono text-cyan-300">
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>LIVE SWIM SIMULATOR</span>
            </div>

            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              <button
                onClick={clearDrawing}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-500/50 text-slate-300 hover:text-rose-300 text-xs transition-all font-mono"
              >
                Clear Ink
              </button>
            </div>
          </div>

          {/* Paint & Drawing Toolbar */}
          <div className="glass-panel rounded-2xl p-4 border border-cyan-500/20 flex flex-wrap items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setBrushMode('brush')}
                  className={`p-2 rounded-lg transition-all ${
                    brushMode === 'brush' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Neon Brush"
                >
                  <Brush className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setBrushMode('eraser')}
                  className={`p-2 rounded-lg transition-all ${
                    brushMode === 'eraser' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Eraser"
                >
                  <Eraser className="w-4 h-4" />
                </button>
              </div>

              {/* Brush Color Picker */}
              <div className="flex items-center gap-1.5">
                {['#00f5ff', '#05ffa1', '#ff2a85', '#ffb703', '#ffffff'].map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setBrushColor(c);
                      setBrushMode('brush');
                    }}
                    className={`w-6 h-6 rounded-full border transition-transform ${
                      brushColor === c && brushMode === 'brush' ? 'scale-125 border-white' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>

              {/* Brush Size */}
              <div className="hidden sm:flex items-center gap-2 ml-2">
                <span className="text-xs text-slate-400 font-mono">Size:</span>
                <input
                  type="range"
                  min="2"
                  max="16"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-20 accent-cyan-400"
                />
              </div>
            </div>

            {/* Confirm & Next Action */}
            <button
              onClick={() => exportFishImage()}
              className="ocean-btn-primary px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg"
            >
              <Zap className="w-4 h-4" />
              <span>Lock DNA & Configure Brain</span>
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}
