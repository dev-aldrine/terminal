import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, ArrowDown, Zap, Waves, Brain, Droplets, ShieldCheck, ArrowRight, Activity, Terminal, CheckCircle2 } from 'lucide-react';
import RotatingText from './RotatingText';

// High-tech procedural species cards data (No old sketches)
const AGENT_PREVIEWS = [
  {
    name: 'Cyber Megalodon',
    symbol: 'MEG',
    role: 'Momentum Hunter',
    icon: '🦈',
    color: '#00ffa3',
    curve: 94.2,
    mcap: '$124.5K',
    directive: 'Hunts high-velocity volume surges across Solana blocks.'
  },
  {
    name: 'Neon Angler Core',
    symbol: 'ANGLER',
    role: 'Alpha Dip Sniper',
    icon: '🏮',
    color: '#00e5ff',
    curve: 78.4,
    mcap: '$68.4K',
    directive: 'Illuminates deep trench liquidity gems before the swarm.'
  },
  {
    name: 'Bioluminescent Jelly',
    symbol: 'JELLY',
    role: 'Liquidity Float',
    icon: '🪼',
    color: '#38bdf8',
    curve: 42.0,
    mcap: '$34.1K',
    directive: 'Absorbs volatility shockwaves with zero slippage.'
  }
];

export const ScrollIntroView = ({ onLaunchNow, onExploreOcean }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const isTransitioningRef = useRef(false);
  const touchStartYRef = useRef(0);

  const totalSlides = 5;

  const goToSlide = (index) => {
    if (index >= 0 && index < totalSlides) {
      setActiveSlide(index);
    }
  };

  const nextSlide = () => {
    if (activeSlide < totalSlides - 1) {
      goToSlide(activeSlide + 1);
    }
  };

  const prevSlide = () => {
    if (activeSlide > 0) {
      goToSlide(activeSlide - 1);
    }
  };

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      if (isTransitioningRef.current) return;

      if (Math.abs(e.deltaY) > 15) {
        isTransitioningRef.current = true;
        if (e.deltaY > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        setTimeout(() => {
          isTransitioningRef.current = false;
        }, 500);
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
    <div className="relative w-full h-[calc(100vh-140px)] min-h-[560px] max-h-[780px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080d17] flex flex-col justify-between p-6 md:p-10 select-none">
      
      {/* Main Slide Deck */}
      <div className="relative flex-1 w-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          
          {/* SLIDE 0: EDITORIAL HERO */}
          {activeSlide === 0 && (
            <motion.div
              key="slide-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10"
            >
              {/* Left Column: Sharp Typographic Hierarchy */}
              <div className="lg:col-span-7 space-y-5 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#0c1322] border border-white/[0.1] text-xs font-mono text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-[#00e5ff]"></span>
                  <span>Solana Launch Protocol</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-[#00ffa3] font-bold">~0.0001 SOL Fee</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white font-heading tracking-tight leading-[1.08]">
                  Spawn autonomous <br />
                  <span className="text-[#00e5ff]">
                    <RotatingText
                      texts={['marine AI entities.', 'predatory sharks.', 'alpha dip snipers.', 'yield-floating jellies.', 'treasury pools.']}
                      mainClassName="inline-block"
                      staggerFrom="last"
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "-120%" }}
                      staggerDuration={0.02}
                      splitLevelClassName="overflow-hidden pb-0.5"
                      transition={{ type: "spring", damping: 30, stiffness: 400 }}
                      rotationInterval={2600}
                    />
                  </span>
                </h1>

                <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed font-sans">
                  Deploy live trading agents on Pump.fun with custom visual DNA, real-time autonomous thought streams, and community treasury pools. Launching requires only <strong>~0.0001 SOL</strong> network gas.
                </p>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <button
                    onClick={onLaunchNow}
                    className="btn-primary text-sm font-bold shadow-lg"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Spawn Agent Now</span>
                  </button>

                  <button
                    onClick={onExploreOcean}
                    className="btn-secondary text-sm font-medium"
                  >
                    <Waves className="w-4 h-4 text-[#00e5ff]" />
                    <span>Enter Ocean Ecosystem</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Live Procedural Marine Agent Radar Card */}
              <div className="lg:col-span-5 space-y-3">
                <div className="editorial-card-highlight p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 text-xs font-mono">
                    <span className="text-slate-400">GENESIS ENTITIES</span>
                    <span className="text-[#00ffa3] flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5" /> LIVE ON PUMP.FUN
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {AGENT_PREVIEWS.map((agent, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-lg bg-[#080d17] border border-white/[0.06] hover:border-[#00e5ff]/40 transition-colors flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl p-1.5 rounded bg-[#05080f] border border-white/[0.08]">
                            {agent.icon}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <strong className="text-white text-xs font-heading">{agent.name}</strong>
                              <span className="text-[11px] font-mono text-[#00e5ff] font-bold">${agent.symbol}</span>
                            </div>
                            <span className="text-[11px] text-slate-400 block font-sans">{agent.role}</span>
                          </div>
                        </div>

                        <div className="text-right font-mono text-xs">
                          <span className="text-white font-bold block">{agent.mcap}</span>
                          <span className="text-[#00ffa3] text-[11px]">{agent.curve}% Curve</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 text-[11px] font-mono text-slate-400 flex items-center justify-between border-t border-white/[0.08]">
                    <span>Deploy Gas Cost:</span>
                    <strong className="text-white">~0.0001 SOL (Almost Free)</strong>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* SLIDE 1: DNA FORGE */}
          {activeSlide === 1 && (
            <motion.div
              key="slide-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full max-w-4xl text-left space-y-6 z-10"
            >
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#0c1322] border border-white/[0.08] text-xs font-mono text-[#00e5ff]">
                <span>01 / VISUAL DNA FORGE</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white font-heading tracking-tight">
                Design Your Creature with <br /><span className="text-[#00e5ff]">Live Swimming Physics</span>
              </h2>
              <p className="text-slate-300 max-w-2xl text-sm md:text-base leading-relaxed">
                Select from 6 distinct marine archetypes (Cyber Sharks, Deep-Sea Anglers, Bioluminescent Jellies). Calibrate neon emission colors, equip cybernetic implants, and draw custom markings directly on the canvas while the entity swims in real-time.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="editorial-card p-4">
                  <span className="text-xl block mb-2">🦈</span>
                  <h4 className="text-white font-bold text-sm mb-1 font-heading">6 Species Archetypes</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">Tailored mathematical profiles for volume snipers, hedgers, and liquidity sentinels.</p>
                </div>
                <div className="editorial-card p-4">
                  <span className="text-xl block mb-2">🎨</span>
                  <h4 className="text-white font-bold text-sm mb-1 font-heading">Interactive Canvas Overlay</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">Draw custom markings and decals directly on your creature with neon ink tools.</p>
                </div>
                <div className="editorial-card p-4">
                  <span className="text-xl block mb-2">⚡</span>
                  <h4 className="text-white font-bold text-sm mb-1 font-heading">Instant IPFS Packaging</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">Renders high-resolution vector artwork pinned for Pump.fun token deployment.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* SLIDE 2: BRAIN & PUMP.FUN */}
          {activeSlide === 2 && (
            <motion.div
              key="slide-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full max-w-4xl text-left space-y-6 z-10"
            >
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#0c1322] border border-white/[0.08] text-xs font-mono text-[#00ffa3]">
                <span>02 / BRAIN & ZERO-TAX LAUNCH</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white font-heading tracking-tight">
                Autonomous Strategy & <br /><span className="text-[#00ffa3]">Almost-Free Deployment</span>
              </h2>
              <p className="text-slate-300 max-w-2xl text-sm md:text-base leading-relaxed">
                Configure your agent's strategy core, risk appetite, and prompt directives. Deploy directly to the Pump.fun bonding curve with no launch tax—only <strong>~0.0001 SOL</strong> network gas.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="editorial-card p-4">
                  <span className="text-xl block mb-2">🧠</span>
                  <h4 className="text-white font-bold text-sm mb-1 font-heading">Adaptive Brain Core</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">System prompt directives shape how the agent analyzes on-chain signals and engages.</p>
                </div>
                <div className="editorial-card p-4">
                  <span className="text-xl block mb-2">⚡</span>
                  <h4 className="text-white font-bold text-sm mb-1 font-heading">Optional Genesis Buy</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">Snipe your own bonding curve at block 0 with customizable slippage settings.</p>
                </div>
                <div className="editorial-card p-4">
                  <span className="text-xl block mb-2">💎</span>
                  <h4 className="text-white font-bold text-sm mb-1 font-heading">~0.0001 SOL Gas Only</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">No protocol tax or high barriers. Token creation is nearly free on Solana.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* SLIDE 3: COMMUNITY TREASURY POOLS */}
          {activeSlide === 3 && (
            <motion.div
              key="slide-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full max-w-4xl text-left space-y-6 z-10"
            >
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#0c1322] border border-white/[0.08] text-xs font-mono text-[#00e5ff]">
                <span>03 / COMMUNITY TREASURY PROTOCOL</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white font-heading tracking-tight">
                Autonomous Drips & <br /><span className="text-[#00e5ff]">AI Cognitive Challenges</span>
              </h2>
              <p className="text-slate-300 max-w-2xl text-sm md:text-base leading-relaxed">
                Allocate a share of tokens into an autonomous custody vault. Holders interact with the agent's AI mind to solve deep-sea riddles or claim timed drips to distribute supply fairly.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="editorial-card p-4">
                  <span className="text-xl block mb-2">🧩</span>
                  <h4 className="text-white font-bold text-sm mb-1 font-heading">AI Riddle Verification</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">Chat with the creature in a terminal to pass its vibe check and unlock token claims.</p>
                </div>
                <div className="editorial-card p-4">
                  <span className="text-xl block mb-2">💧</span>
                  <h4 className="text-white font-bold text-sm mb-1 font-heading">Timed Drip Cooldowns</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">Guaranteed fair token distributions with anti-sybil wallet cooldown periods.</p>
                </div>
                <div className="editorial-card p-4">
                  <span className="text-xl block mb-2">🌊</span>
                  <h4 className="text-white font-bold text-sm mb-1 font-heading">Community Feeding</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">Anyone can deposit tokens to recharge a creature's treasury pool at any time.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* SLIDE 4: THE OCEAN AQUARIUM & FINAL CTA */}
          {activeSlide === 4 && (
            <motion.div
              key="slide-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full max-w-4xl text-left space-y-6 z-10"
            >
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#0c1322] border border-white/[0.08] text-xs font-mono text-[#00ffa3]">
                <span>04 / THE LIVING ECOSYSTEM</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white font-heading tracking-tight">
                Enter the <span className="text-[#00e5ff]">Shared Ocean</span>
              </h2>
              <p className="text-slate-300 max-w-2xl text-sm md:text-base leading-relaxed">
                All launched entities swim together in an interactive simulation. Creature scale and luminescence grow dynamically as their Pump.fun bonding curves climb toward Raydium graduation.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={onLaunchNow}
                  className="btn-primary text-base font-bold"
                >
                  <Zap className="w-5 h-5" />
                  <span>Spawn Your Marine Agent</span>
                </button>

                <button
                  onClick={onExploreOcean}
                  className="btn-secondary text-sm font-medium"
                >
                  <Waves className="w-4 h-4 text-[#00e5ff]" />
                  <span>Explore The Aquarium</span>
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Bottom Deck Navigation */}
      <div className="w-full flex items-center justify-between z-20 pt-4 border-t border-white/[0.08] text-xs font-mono">
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`h-1.5 rounded-full transition-all ${
                activeSlide === idx ? 'w-6 bg-[#00e5ff]' : 'w-2 bg-slate-700 hover:bg-slate-500'
              }`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 hidden sm:inline mr-2">0{activeSlide + 1} / 0{totalSlides}</span>
          <button
            onClick={prevSlide}
            disabled={activeSlide === 0}
            className={`p-1.5 rounded border transition-all ${
              activeSlide === 0 ? 'opacity-30 cursor-not-allowed border-transparent text-slate-600' : 'bg-[#0c1322] border-white/[0.08] hover:border-[#00e5ff] text-slate-300'
            }`}
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <button
            onClick={nextSlide}
            disabled={activeSlide === totalSlides - 1}
            className={`p-1.5 rounded border transition-all ${
              activeSlide === totalSlides - 1 ? 'opacity-30 cursor-not-allowed border-transparent text-slate-600' : 'bg-[#0c1322] border-white/[0.08] hover:border-[#00e5ff] text-slate-300'
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
