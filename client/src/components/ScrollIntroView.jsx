import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Layers, 
  Droplets, 
  Terminal, 
  Shield, 
  ChevronRight, 
  Cpu, 
  Activity, 
  ArrowDown, 
  ArrowUp, 
  Sparkles, 
  Waves
} from 'lucide-react';
import RotatingText from './RotatingText';

const AGENT_PREVIEWS = [
  { name: 'Cyber Megalodon', symbol: 'MEG', role: 'Momentum Hunter', mcap: '$124.5K', curve: 94.2 },
  { name: 'Neon Angler Core', symbol: 'ANGLER', role: 'Alpha Dip Sniper', mcap: '$68.4K', curve: 78.4 },
  { name: 'Bioluminescent Jelly', symbol: 'JELLY', role: 'Liquidity Sentinel', mcap: '$34.1K', curve: 42.0 }
];

export const ScrollIntroView = ({ onLaunchNow, onExploreOcean }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const totalSlides = 5;
  const isTransitioningRef = useRef(false);
  const touchStartYRef = useRef(0);

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
    <div className="relative w-full h-[calc(100vh-190px)] min-h-[580px] max-h-[720px] overflow-hidden rounded-3xl border border-cyan-400/20 bg-[#070e1b]/70 backdrop-blur-2xl shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(0,210,255,0.06),inset_0_1px_1px_rgba(255,255,255,0.1)] flex flex-col justify-between p-6 md:p-10 select-none">
      
      {/* Water Light Sheen */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      {/* Main Slide Deck */}
      <div className="relative flex-1 w-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          
          {/* SLIDE 0: HERO INTRO */}
          {activeSlide === 0 && (
            <motion.div
              key="slide-0"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10"
            >
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-4 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#040914]/80 border border-cyan-500/30 text-[11px] font-mono text-cyan-300 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-[#00d2ff] shadow-[0_0_8px_#00d2ff]"></span>
                  <span>Solana Marine AI Protocol</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-200 font-semibold">~0.0001 SOL Gas</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white font-heading tracking-tight leading-[1.08]">
                  Spawn autonomous <br />
                  <span className="text-[#00d2ff]">
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
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={onLaunchNow}
                    className="btn-primary text-xs font-semibold px-5 py-2.5 shadow-[0_0_20px_rgba(0,210,255,0.25)]"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Spawn Agent Now</span>
                  </button>

                  <button
                    onClick={onExploreOcean}
                    className="btn-secondary text-xs font-medium px-5 py-2.5 bg-[#081326]/70 border-cyan-500/20 hover:border-cyan-400/50"
                  >
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Enter Ocean Ecosystem</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Live Data Pod */}
              <div className="lg:col-span-5 space-y-3">
                <div className="p-5 rounded-2xl bg-[#040812]/80 border border-cyan-500/20 backdrop-blur-xl space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-cyan-500/15 pb-2.5 text-xs font-mono">
                    <span className="text-slate-300 font-medium">GENESIS ENTITIES</span>
                    <span className="text-cyan-300 flex items-center gap-1.5 text-[11px]">
                      <Activity className="w-3.5 h-3.5 text-[#00d2ff]" /> LIVE ON PUMP.FUN
                    </span>
                  </div>

                  <div className="space-y-2">
                    {AGENT_PREVIEWS.map((agent, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-[#081224]/70 border border-cyan-500/15 hover:border-cyan-400/40 transition-all flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-[#040914] border border-cyan-500/25 flex items-center justify-center shrink-0 shadow-inner">
                            <Cpu className="w-4 h-4 text-[#00d2ff]" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <strong className="text-white text-xs font-heading truncate">{agent.name}</strong>
                              <span className="text-[10px] font-mono text-[#00d2ff] font-bold">${agent.symbol}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 block truncate">{agent.role}</span>
                          </div>
                        </div>

                        <div className="text-right font-mono text-xs shrink-0">
                          <span className="text-white font-semibold block text-[11px]">{agent.mcap}</span>
                          <span className="text-cyan-400 text-[10px]">{agent.curve}% Curve</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 text-[11px] font-mono text-slate-400 flex items-center justify-between border-t border-cyan-500/15">
                    <span>Deploy Gas Cost:</span>
                    <strong className="text-cyan-300 font-semibold">~0.0001 SOL (Almost Free)</strong>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* SLIDE 1: DNA FORGE */}
          {activeSlide === 1 && (
            <motion.div
              key="slide-1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full max-w-4xl text-left space-y-5 z-10"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#040914]/80 border border-cyan-500/30 text-xs font-mono text-[#00d2ff]">
                <span>01 / VISUAL DNA FORGE</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white font-heading tracking-tight">
                Design Your Creature with <br /><span className="text-[#00d2ff]">Live Swimming Physics</span>
              </h2>
              <p className="text-slate-300 max-w-2xl text-sm md:text-base leading-relaxed">
                Select from 6 distinct marine archetypes (Cyber Sharks, Deep-Sea Anglers, Bioluminescent Jellies). Calibrate emission colors, equip cybernetic implants, and watch the entity swim in real-time.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="p-4 rounded-xl bg-[#040812]/80 border border-cyan-500/20 backdrop-blur-md">
                  <Cpu className="w-5 h-5 text-[#00d2ff] mb-2" />
                  <h4 className="text-white font-semibold text-sm mb-1 font-heading">6 Species Archetypes</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">Tailored mathematical profiles for volume snipers, hedgers, and liquidity sentinels.</p>
                </div>
                <div className="p-4 rounded-xl bg-[#040812]/80 border border-cyan-500/20 backdrop-blur-md">
                  <Sparkles className="w-5 h-5 text-[#00ffa3] mb-2" />
                  <h4 className="text-white font-semibold text-sm mb-1 font-heading">Bioluminescent Aura</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">Procedural spectral shaders with customizable wavelength emission cores.</p>
                </div>
                <div className="p-4 rounded-xl bg-[#040812]/80 border border-cyan-500/20 backdrop-blur-md">
                  <Zap className="w-5 h-5 text-[#38bdf8] mb-2" />
                  <h4 className="text-white font-semibold text-sm mb-1 font-heading">Cybernetic Augments</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">Equip laser sensors, alpha radar antennas, and hydrodynamic armor.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* SLIDE 2: COMMUNITY TREASURY POOLS */}
          {activeSlide === 2 && (
            <motion.div
              key="slide-2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full max-w-4xl text-left space-y-5 z-10"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#040914]/80 border border-cyan-500/30 text-xs font-mono text-[#00d2ff]">
                <span>02 / COMMUNITY TREASURY PROTOCOL</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white font-heading tracking-tight">
                Self-Sustaining Pools with <br /><span className="text-[#00d2ff]">AI Cognitive Verification</span>
              </h2>
              <p className="text-slate-300 max-w-2xl text-sm md:text-base leading-relaxed">
                Launch with a community-governed treasury. Reward active holders via AI riddles, timed drip distributions, or allow community members to deposit tokens to keep the treasury flowing.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="p-4 rounded-xl bg-[#040812]/80 border border-cyan-500/20 backdrop-blur-md">
                  <Droplets className="w-5 h-5 text-[#00d2ff] mb-2" />
                  <h4 className="text-white font-semibold text-sm mb-1 font-heading">Instant Token Drip</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">Automated cooldown-governed payouts directly to connected Solana wallets.</p>
                </div>
                <div className="p-4 rounded-xl bg-[#040812]/80 border border-cyan-500/20 backdrop-blur-md">
                  <Zap className="w-5 h-5 text-[#00ffa3] mb-2" />
                  <h4 className="text-white font-semibold text-sm mb-1 font-heading">AI Riddle Gates</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">Marine agents verify natural language answers before unlocking tokens.</p>
                </div>
                <div className="p-4 rounded-xl bg-[#040812]/80 border border-cyan-500/20 backdrop-blur-md">
                  <Shield className="w-5 h-5 text-[#ffb703] mb-2" />
                  <h4 className="text-white font-semibold text-sm mb-1 font-heading">Sybil Defenses</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">On-chain cooldowns and balance thresholds to prevent bot depletion.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* SLIDE 3: LIVE OCEAN AQUARIUM */}
          {activeSlide === 3 && (
            <motion.div
              key="slide-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full max-w-4xl text-left space-y-5 z-10"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#040914]/80 border border-cyan-500/30 text-xs font-mono text-[#00d2ff]">
                <span>03 / THE LIVING AQUARIUM</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white font-heading tracking-tight">
                Watch Deployed Agents <br /><span className="text-[#00d2ff]">Co-Exist & Trade in Real-Time</span>
              </h2>
              <p className="text-slate-300 max-w-2xl text-sm md:text-base leading-relaxed">
                Step into the shared ocean where every spawned token swims autonomously. Their physical size scales dynamically with market cap, and creature telemetry reflects live on-chain volume.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="p-4 rounded-xl bg-[#040812]/80 border border-cyan-500/20 backdrop-blur-md">
                  <Waves className="w-5 h-5 text-[#00d2ff] mb-2" />
                  <h4 className="text-white font-semibold text-sm mb-1 font-heading">Market Cap Scaling</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">Creatures grow larger as volume pushes bonding curves toward Raydium.</p>
                </div>
                <div className="p-4 rounded-xl bg-[#040812]/80 border border-cyan-500/20 backdrop-blur-md">
                  <Terminal className="w-5 h-5 text-[#00ffa3] mb-2" />
                  <h4 className="text-white font-semibold text-sm mb-1 font-heading">Thought Telemetry</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">Live thought stream broadcasts trading intentions and whale alerts.</p>
                </div>
                <div className="p-4 rounded-xl bg-[#040812]/80 border border-cyan-500/20 backdrop-blur-md">
                  <Activity className="w-5 h-5 text-[#38bdf8] mb-2" />
                  <h4 className="text-white font-semibold text-sm mb-1 font-heading">Sonar Whale Radar</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">Detects large buy orders across Mariana trench liquidity pools.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* SLIDE 4: CALL TO ACTION */}
          {activeSlide === 4 && (
            <motion.div
              key="slide-4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full max-w-2xl mx-auto text-center space-y-6 z-10"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#040914]/80 border border-cyan-500/30 text-xs font-mono text-[#00d2ff]">
                <span>READY TO LAUNCH</span>
              </div>

              <h2 className="text-4xl md:text-6xl font-bold text-white font-heading tracking-tight leading-tight">
                Enter the Abyss. <br />
                <span className="text-[#00d2ff]">Deploy Your Agent.</span>
              </h2>

              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                Connect your wallet, configure your creature DNA, and broadcast directly to Pump.fun in seconds.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={onLaunchNow}
                  className="btn-primary text-sm font-semibold px-6 py-3 shadow-[0_0_25px_rgba(0,210,255,0.3)]"
                >
                  <Zap className="w-4 h-4" />
                  <span>Spawn Your Marine Agent</span>
                </button>

                <button
                  onClick={onExploreOcean}
                  className="btn-secondary text-sm font-medium px-6 py-3 bg-[#081326]/70 border-cyan-500/20 hover:border-cyan-400/50"
                >
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>Explore The Aquarium</span>
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Bottom Deck Navigation */}
      <div className="w-full flex items-center justify-between z-20 pt-3 border-t border-cyan-500/15 text-xs font-mono">
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`h-1.5 rounded-full transition-all ${
                activeSlide === idx ? 'w-6 bg-[#00d2ff] shadow-[0_0_8px_#00d2ff]' : 'w-2 bg-cyan-900/50 hover:bg-cyan-500/40'
              }`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-mono text-xs hidden sm:inline mr-2">0{activeSlide + 1} / 0{totalSlides}</span>
          <button
            onClick={prevSlide}
            disabled={activeSlide === 0}
            className={`p-1.5 rounded-lg border transition-all ${
              activeSlide === 0 ? 'opacity-30 cursor-not-allowed border-transparent text-slate-600' : 'bg-[#040914]/80 border-cyan-500/20 hover:border-cyan-400/50 text-slate-300'
            }`}
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={nextSlide}
            disabled={activeSlide === totalSlides - 1}
            className={`p-1.5 rounded-lg border transition-all ${
              activeSlide === totalSlides - 1 ? 'opacity-30 cursor-not-allowed border-transparent text-slate-600' : 'bg-[#040914]/80 border-cyan-500/20 hover:border-cyan-400/50 text-slate-300'
            }`}
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default ScrollIntroView;
