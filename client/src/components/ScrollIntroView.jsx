import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, 
  Droplets, 
  Terminal, 
  Shield, 
  Cpu, 
  ArrowDown, 
  ArrowUp, 
  Sparkles, 
  Waves
} from 'lucide-react';

const FishIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.46-3.44 6-7 6s-7.56-2.54-8.5-6Z"/>
    <path d="M18 12v.5"/>
    <path d="M16 10h.01"/>
    <path d="M2 8l4.5 4L2 16"/>
  </svg>
);

const ROTATING_TEXTS = [
  'predatory alpha sharks.',
  'deep trench sniper fish.',
  'liquidity hunting piranhas.',
  'bonding curve killer whales.',
  'bioluminescent degen jellies.',
  'toxic stealth barracudas.'
];

export const ScrollIntroView = ({ onLaunchNow, onExploreOcean }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [rotatingIndex, setRotatingIndex] = useState(0);
  const totalSlides = 5;
  const isTransitioningRef = useRef(false);
  const touchStartYRef = useRef(0);

  // Reliable, smooth text rotator
  useEffect(() => {
    const interval = setInterval(() => {
      setRotatingIndex((prev) => (prev + 1) % ROTATING_TEXTS.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setActiveSlide((prev) => Math.min(prev + 1, totalSlides - 1));
  };

  const prevSlide = () => {
    setActiveSlide((prev) => Math.max(prev - 1, 0));
  };

  const goToSlide = (idx) => {
    setActiveSlide(idx);
  };

  useEffect(() => {
    const handleWheel = (e) => {
      if (isTransitioningRef.current) return;
      if (Math.abs(e.deltaY) > 25) {
        isTransitioningRef.current = true;
        if (e.deltaY > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        setTimeout(() => {
          isTransitioningRef.current = false;
        }, 550);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        prevSlide();
      }
    };

    const handleTouchStart = (e) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      if (isTransitioningRef.current) return;
      const touchEndY = e.changedTouches[0].clientY;
      const diffY = touchStartYRef.current - touchEndY;

      if (Math.abs(diffY) > 30) {
        isTransitioningRef.current = true;
        if (diffY > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        setTimeout(() => {
          isTransitioningRef.current = false;
        }, 500);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeSlide]);

  return (
    <div className="w-full max-w-6xl mx-auto my-auto select-none px-4 py-4 flex flex-col items-center justify-center min-h-[540px]">
      
      {/* Main Floating Minimalist Hero Slide Deck */}
      <div className="relative w-full flex-1 flex flex-col items-center justify-center text-center">
        <AnimatePresence mode="wait">
          
          {/* SLIDE 0: GIGANTIC HERO INTRO */}
          {activeSlide === 0 && (
            <motion.div
              key="slide-0"
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full text-center space-y-6 z-10 flex flex-col items-center justify-center"
            >
              {/* Brand Logo */}
              <img
                src="/logo.png"
                alt="AgenSea"
                className="h-16 sm:h-22 md:h-24 w-auto object-contain mx-auto drop-shadow-[0_0_35px_rgba(0,210,255,0.6)]"
              />

              {/* Ultra-Gigantic Minimalist Headline */}
              <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white font-heading tracking-tight leading-[1.04] text-center flex flex-col items-center justify-center w-full drop-shadow-[0_12px_40px_rgba(0,0,0,0.85)]">
                <span>Spawn autonomous</span>
                <span className="relative flex items-center justify-center w-full min-h-[1.25em] mt-1 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={rotatingIndex}
                      initial={{ y: 60, opacity: 0, filter: 'blur(8px)' }}
                      animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                      exit={{ y: -60, opacity: 0, filter: 'blur(8px)' }}
                      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                      className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] via-[#00ffa3] to-[#38bdf8] drop-shadow-[0_0_45px_rgba(0,210,255,0.6)] inline-block select-none"
                    >
                      {ROTATING_TEXTS[rotatingIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </h1>

              {/* Minimalist Subtitle */}
              <p className="text-slate-200 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-sans font-medium text-center drop-shadow-md">
                Deploy autonomous marine trading entities on Solana with custom visual DNA, live swimming physics, on-chain thought telemetry, and community treasury faucets.
              </p>

              {/* Floating Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
                <button
                  onClick={onLaunchNow}
                  className="px-8 sm:px-10 py-4 sm:py-4.5 rounded-2xl bg-gradient-to-r from-[#00d2ff] via-[#00ffa3] to-[#38bdf8] text-[#020712] font-heading font-black text-sm sm:text-base tracking-wide flex items-center gap-2.5 shadow-[0_0_35px_rgba(0,210,255,0.5)] hover:shadow-[0_0_50px_rgba(0,255,163,0.7)] hover:scale-105 transition-all transform active:scale-95"
                >
                  <FishIcon className="w-5 h-5 fill-current" />
                  <span>Spawn Agent Now</span>
                </button>

                <button
                  onClick={onExploreOcean}
                  className="px-8 sm:px-10 py-4 sm:py-4.5 rounded-2xl bg-[#04162e]/60 hover:bg-[#07244e]/80 border border-cyan-400/40 text-cyan-200 font-heading font-bold text-sm sm:text-base tracking-wide flex items-center gap-2.5 backdrop-blur-xl shadow-[0_0_20px_rgba(0,210,255,0.15)] hover:border-cyan-300 hover:scale-105 transition-all transform active:scale-95"
                >
                  <Layers className="w-5 h-5 text-[#00d2ff]" />
                  <span>Enter Living Ocean</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* SLIDE 1: FISH DNA FORGE */}
          {activeSlide === 1 && (
            <motion.div
              key="slide-1"
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full text-center space-y-6 z-10 flex flex-col items-center justify-center"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#051833]/80 border border-cyan-400/40 text-xs font-mono text-cyan-300 backdrop-blur-md">
                <span>01 / PREDATORY FISH DNA FORGE</span>
              </div>

              <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white font-heading tracking-tight leading-tight drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
                Forge Degen Marine Fish with <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] to-[#00ffa3]">
                  Live Swimming Physics
                </span>
              </h2>

              <p className="text-slate-200 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-sans font-medium">
                Select from 6 ferocious marine archetypes. Calibrate neon emission cores, equip cybernetic implants, and watch them roam in real-time.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full pt-2">
                <div className="p-5 rounded-2xl bg-[#030d1e]/60 border border-cyan-500/25 backdrop-blur-xl text-left hover:border-cyan-400/60 transition-all shadow-lg">
                  <Cpu className="w-6 h-6 text-[#00d2ff] mb-2" />
                  <h4 className="text-white font-black text-base font-heading mb-1">6 Marine Archetypes</h4>
                  <p className="text-slate-300 text-xs leading-relaxed font-sans">Tailored mathematical vectors for volume snipers & alpha hunters.</p>
                </div>
                <div className="p-5 rounded-2xl bg-[#030d1e]/60 border border-cyan-500/25 backdrop-blur-xl text-left hover:border-cyan-400/60 transition-all shadow-lg">
                  <Sparkles className="w-6 h-6 text-[#00ffa3] mb-2" />
                  <h4 className="text-white font-black text-base font-heading mb-1">Neon Emission Aura</h4>
                  <p className="text-slate-300 text-xs leading-relaxed font-sans">Procedural spectral shaders with custom glowing dorsal fins.</p>
                </div>
                <div className="p-5 rounded-2xl bg-[#030d1e]/60 border border-cyan-500/25 backdrop-blur-xl text-left hover:border-cyan-400/60 transition-all shadow-lg">
                  <FishIcon className="w-6 h-6 text-[#38bdf8] mb-2" />
                  <h4 className="text-white font-black text-base font-heading mb-1">Cybernetic Implants</h4>
                  <p className="text-slate-300 text-xs leading-relaxed font-sans">Equip sonar radar, trench armor, and alpha dip snipers.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* SLIDE 2: COMMUNITY TREASURY POOLS */}
          {activeSlide === 2 && (
            <motion.div
              key="slide-2"
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full text-center space-y-6 z-10 flex flex-col items-center justify-center"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#051833]/80 border border-cyan-400/40 text-xs font-mono text-cyan-300 backdrop-blur-md">
                <span>02 / FISH COMMUNITY TREASURY PROTOCOL</span>
              </div>

              <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white font-heading tracking-tight leading-tight drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
                Autonomous Fish Vaults with <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] to-[#00ffa3]">
                  AI Cognitive Riddles
                </span>
              </h2>

              <p className="text-slate-200 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-sans font-medium">
                Equip your fish token with a community custody vault. Reward diamond hand holders with automated drip payouts, or protect liquidity with interactive AI riddles.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full pt-2">
                <div className="p-5 rounded-2xl bg-[#030d1e]/60 border border-cyan-500/25 backdrop-blur-xl text-left hover:border-cyan-400/60 transition-all shadow-lg">
                  <Droplets className="w-6 h-6 text-[#00d2ff] mb-2" />
                  <h4 className="text-white font-black text-base font-heading mb-1">Instant Token Drip</h4>
                  <p className="text-slate-300 text-xs leading-relaxed font-sans">Automated cooldown-governed payouts to connected fish holders.</p>
                </div>
                <div className="p-5 rounded-2xl bg-[#030d1e]/60 border border-cyan-500/25 backdrop-blur-xl text-left hover:border-cyan-400/60 transition-all shadow-lg">
                  <FishIcon className="w-6 h-6 text-[#00ffa3] mb-2" />
                  <h4 className="text-white font-black text-base font-heading mb-1">AI Fish Riddle Gates</h4>
                  <p className="text-slate-300 text-xs leading-relaxed font-sans">Marine agents verify natural language answers before release.</p>
                </div>
                <div className="p-5 rounded-2xl bg-[#030d1e]/60 border border-cyan-500/25 backdrop-blur-xl text-left hover:border-cyan-400/60 transition-all shadow-lg">
                  <Shield className="w-6 h-6 text-[#ffb703] mb-2" />
                  <h4 className="text-white font-black text-base font-heading mb-1">Anti-Bot Defenses</h4>
                  <p className="text-slate-300 text-xs leading-relaxed font-sans">Cooldown thresholds to prevent sniper bot extraction.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* SLIDE 3: LIVE OCEAN AQUARIUM */}
          {activeSlide === 3 && (
            <motion.div
              key="slide-3"
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full text-center space-y-6 z-10 flex flex-col items-center justify-center"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#051833]/80 border border-cyan-400/40 text-xs font-mono text-cyan-300 backdrop-blur-md">
                <span>03 / THE LIVING DEGEN AQUARIUM</span>
              </div>

              <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white font-heading tracking-tight leading-tight drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
                Watch Spawned Fish Co-Exist & <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] to-[#00ffa3]">
                  Scale with Market Cap
                </span>
              </h2>

              <p className="text-slate-200 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-sans font-medium">
                Step into the shared ocean where every spawned token swims autonomously. Fish size scales dynamically with Pump.fun market cap, and live thought telemetry broadcasts on-chain alpha.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full pt-2">
                <div className="p-5 rounded-2xl bg-[#030d1e]/60 border border-cyan-500/25 backdrop-blur-xl text-left hover:border-cyan-400/60 transition-all shadow-lg">
                  <Waves className="w-6 h-6 text-[#00d2ff] mb-2" />
                  <h4 className="text-white font-black text-base font-heading mb-1">Market Cap Scaling</h4>
                  <p className="text-slate-300 text-xs leading-relaxed font-sans">Fish grow into gigantic leviathans as bonding curves fill up.</p>
                </div>
                <div className="p-5 rounded-2xl bg-[#030d1e]/60 border border-cyan-500/25 backdrop-blur-xl text-left hover:border-cyan-400/60 transition-all shadow-lg">
                  <Terminal className="w-6 h-6 text-[#00ffa3] mb-2" />
                  <h4 className="text-white font-black text-base font-heading mb-1">Alpha Thought Streams</h4>
                  <p className="text-slate-300 text-xs leading-relaxed font-sans">Live telemetry feeds broadcast autonomous trading signals.</p>
                </div>
                <div className="p-5 rounded-2xl bg-[#030d1e]/60 border border-cyan-500/25 backdrop-blur-xl text-left hover:border-cyan-400/60 transition-all shadow-lg">
                  <Sparkles className="w-6 h-6 text-[#38bdf8] mb-2" />
                  <h4 className="text-white font-black text-base font-heading mb-1">Sonar Whale Radar</h4>
                  <p className="text-slate-300 text-xs leading-relaxed font-sans">Real-time alerts for massive SOL buys in the deep trench.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* SLIDE 4: CALL TO ACTION */}
          {activeSlide === 4 && (
            <motion.div
              key="slide-4"
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full text-center space-y-6 z-10 flex flex-col items-center justify-center"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#051833]/80 border border-cyan-400/40 text-xs font-mono text-cyan-300 backdrop-blur-md">
                <span>READY TO SPAWN</span>
              </div>

              <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white font-heading tracking-tight leading-tight drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
                Enter the Trench. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] to-[#00ffa3]">
                  Spawn Your Fish Agent.
                </span>
              </h2>

              <p className="text-slate-200 text-base sm:text-lg md:text-xl leading-relaxed max-w-xl mx-auto font-sans font-medium">
                Connect your Phantom wallet, configure your creature visual DNA, and broadcast directly to Pump.fun in seconds.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
                <button
                  onClick={onLaunchNow}
                  className="px-8 sm:px-10 py-4 sm:py-4.5 rounded-2xl bg-gradient-to-r from-[#00d2ff] via-[#00ffa3] to-[#38bdf8] text-[#020712] font-heading font-black text-sm sm:text-base tracking-wide flex items-center gap-2.5 shadow-[0_0_35px_rgba(0,210,255,0.5)] hover:shadow-[0_0_50px_rgba(0,255,163,0.7)] hover:scale-105 transition-all transform active:scale-95"
                >
                  <FishIcon className="w-5 h-5 fill-current" />
                  <span>Spawn Your Marine Fish Now</span>
                </button>

                <button
                  onClick={onExploreOcean}
                  className="px-8 sm:px-10 py-4 sm:py-4.5 rounded-2xl bg-[#04162e]/60 hover:bg-[#07244e]/80 border border-cyan-400/40 text-cyan-200 font-heading font-bold text-sm sm:text-base tracking-wide flex items-center gap-2.5 backdrop-blur-xl shadow-[0_0_20px_rgba(0,210,255,0.15)] hover:border-cyan-300 hover:scale-105 transition-all transform active:scale-95"
                >
                  <Layers className="w-5 h-5 text-[#00d2ff]" />
                  <span>Explore The Ocean Aquarium</span>
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Floating Minimalist Slide Navigation Controls */}
      <div className="w-full flex items-center justify-between z-20 pt-8 text-sm font-mono max-w-xl">
        <div className="flex items-center gap-3">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`h-2.5 rounded-full transition-all ${
                activeSlide === idx ? 'w-8 bg-[#00d2ff] shadow-[0_0_15px_#00d2ff]' : 'w-2.5 bg-cyan-900/60 hover:bg-cyan-500/50'
              }`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-cyan-300 font-mono text-xs font-bold mr-1">0{activeSlide + 1} / 0{totalSlides}</span>
          <button
            onClick={prevSlide}
            disabled={activeSlide === 0}
            className={`p-2.5 rounded-xl border transition-all ${
              activeSlide === 0 ? 'opacity-20 cursor-not-allowed border-transparent text-slate-600' : 'bg-[#04162e]/70 border-cyan-500/30 hover:border-cyan-300 text-slate-200 backdrop-blur-md'
            }`}
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <button
            onClick={nextSlide}
            disabled={activeSlide === totalSlides - 1}
            className={`p-2.5 rounded-xl border transition-all ${
              activeSlide === totalSlides - 1 ? 'opacity-20 cursor-not-allowed border-transparent text-slate-600' : 'bg-[#04162e]/70 border-cyan-500/30 hover:border-cyan-300 text-slate-200 backdrop-blur-md'
            }`}
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default ScrollIntroView;
