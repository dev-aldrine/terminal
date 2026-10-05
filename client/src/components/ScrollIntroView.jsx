import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
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
import RotatingText from './RotatingText';

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
    <div className="w-full max-w-2xl mx-auto my-auto select-none">
      <div className="relative w-full min-h-[340px] rounded-2xl bg-[#061224]/50 backdrop-blur-xl border border-cyan-400/25 shadow-[0_15px_35px_rgba(0,0,0,0.5),0_0_20px_rgba(0,210,255,0.06)] flex flex-col justify-between p-5 sm:p-6">
        
        {/* Main Slide Deck */}
        <div className="relative flex-1 w-full flex items-center justify-center py-1">
          <AnimatePresence mode="wait">
            
            {/* SLIDE 0: HERO INTRO (Centered & Compact) */}
            {activeSlide === 0 && (
              <motion.div
                key="slide-0"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="w-full text-center space-y-3 z-10 py-1"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#040a16]/80 border border-cyan-400/40 text-[11px] font-mono text-cyan-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff] shadow-[0_0_8px_#00d2ff]"></span>
                  <span>Solana Marine AI Protocol</span>
                  <span className="text-cyan-700">•</span>
                  <span className="text-slate-200 font-semibold">~0.0001 SOL Gas</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-heading tracking-tight leading-[1.15]">
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

                <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed font-sans">
                  Deploy live trading agents on Pump.fun with custom visual DNA, real-time autonomous thought streams, and community treasury pools. Launching requires only <strong>~0.0001 SOL</strong> network gas.
                </p>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                  <button
                    onClick={onLaunchNow}
                    className="btn-primary text-xs font-semibold px-5 py-2.5 shadow-[0_0_20px_rgba(0,210,255,0.25)] rounded-xl"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Spawn Agent Now</span>
                  </button>

                  <button
                    onClick={onExploreOcean}
                    className="btn-secondary text-xs font-medium px-5 py-2.5 bg-[#051124]/70 border-cyan-500/30 hover:border-cyan-400/60 rounded-xl"
                  >
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Enter Ocean Ecosystem</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* SLIDE 1: DNA FORGE */}
            {activeSlide === 1 && (
              <motion.div
                key="slide-1"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="w-full text-left space-y-3.5 z-10"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#040a16]/80 border border-cyan-400/40 text-xs font-mono text-[#00d2ff]">
                  <span>01 / VISUAL DNA FORGE</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white font-heading tracking-tight">
                  Design Your Creature with <br /><span className="text-[#00d2ff]">Live Swimming Physics</span>
                </h2>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Select from 6 distinct marine archetypes (Cyber Sharks, Deep-Sea Anglers, Bioluminescent Jellies). Calibrate emission colors, equip cybernetic implants, and watch the entity swim in real-time.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
                  <div className="p-3 rounded-xl bg-[#030914]/75 border border-cyan-400/25">
                    <Cpu className="w-4 h-4 text-[#00d2ff] mb-1" />
                    <h4 className="text-white font-semibold text-xs mb-0.5 font-heading">6 Species Archetypes</h4>
                    <p className="text-slate-400 text-[11px] leading-tight">Tailored mathematical profiles for volume snipers & hedgers.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#030914]/75 border border-cyan-400/25">
                    <Sparkles className="w-4 h-4 text-[#00ffa3] mb-1" />
                    <h4 className="text-white font-semibold text-xs mb-0.5 font-heading">Bioluminescent Aura</h4>
                    <p className="text-slate-400 text-[11px] leading-tight">Procedural spectral shaders with custom emission cores.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#030914]/75 border border-cyan-400/25">
                    <Zap className="w-4 h-4 text-[#38bdf8] mb-1" />
                    <h4 className="text-white font-semibold text-xs mb-0.5 font-heading">Cybernetic Augments</h4>
                    <p className="text-slate-400 text-[11px] leading-tight">Equip laser sensors, alpha radar, and hydro armor.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SLIDE 2: COMMUNITY TREASURY POOLS */}
            {activeSlide === 2 && (
              <motion.div
                key="slide-2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="w-full text-left space-y-3.5 z-10"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#040a16]/80 border border-cyan-400/40 text-xs font-mono text-[#00d2ff]">
                  <span>02 / COMMUNITY TREASURY PROTOCOL</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white font-heading tracking-tight">
                  Self-Sustaining Pools with <br /><span className="text-[#00d2ff]">AI Cognitive Verification</span>
                </h2>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Launch with a community-governed treasury. Reward active holders via AI riddles, timed drip distributions, or allow community members to deposit tokens to keep the treasury flowing.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
                  <div className="p-3 rounded-xl bg-[#030914]/75 border border-cyan-400/25">
                    <Droplets className="w-4 h-4 text-[#00d2ff] mb-1" />
                    <h4 className="text-white font-semibold text-xs mb-0.5 font-heading">Instant Token Drip</h4>
                    <p className="text-slate-400 text-[11px] leading-tight">Automated cooldown-governed payouts to connected wallets.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#030914]/75 border border-cyan-400/25">
                    <Zap className="w-4 h-4 text-[#00ffa3] mb-1" />
                    <h4 className="text-white font-semibold text-xs mb-0.5 font-heading">AI Riddle Gates</h4>
                    <p className="text-slate-400 text-[11px] leading-tight">Marine agents verify natural language answers before release.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#030914]/75 border border-cyan-400/25">
                    <Shield className="w-4 h-4 text-[#ffb703] mb-1" />
                    <h4 className="text-white font-semibold text-xs mb-0.5 font-heading">Sybil Defenses</h4>
                    <p className="text-slate-400 text-[11px] leading-tight">Cooldown thresholds to prevent bot extraction.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SLIDE 3: LIVE OCEAN AQUARIUM */}
            {activeSlide === 3 && (
              <motion.div
                key="slide-3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="w-full text-left space-y-3.5 z-10"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#040a16]/80 border border-cyan-400/40 text-xs font-mono text-[#00d2ff]">
                  <span>03 / THE LIVING AQUARIUM</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white font-heading tracking-tight">
                  Watch Deployed Agents <br /><span className="text-[#00d2ff]">Co-Exist & Trade in Real-Time</span>
                </h2>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Step into the shared ocean where every spawned token swims autonomously. Their physical size scales dynamically with market cap, and creature telemetry reflects live on-chain volume.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
                  <div className="p-3 rounded-xl bg-[#030914]/75 border border-cyan-400/25">
                    <Waves className="w-4 h-4 text-[#00d2ff] mb-1" />
                    <h4 className="text-white font-semibold text-xs mb-0.5 font-heading">Market Cap Scaling</h4>
                    <p className="text-slate-400 text-[11px] leading-tight">Creatures grow larger as volume pushes bonding curves.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#030914]/75 border border-cyan-400/25">
                    <Terminal className="w-4 h-4 text-[#00ffa3] mb-1" />
                    <h4 className="text-white font-semibold text-xs mb-0.5 font-heading">Thought Telemetry</h4>
                    <p className="text-slate-400 text-[11px] leading-tight">Live thought stream broadcasts trading signals.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#030914]/75 border border-cyan-400/25">
                    <Sparkles className="w-4 h-4 text-[#38bdf8] mb-1" />
                    <h4 className="text-white font-semibold text-xs mb-0.5 font-heading">Sonar Whale Radar</h4>
                    <p className="text-slate-400 text-[11px] leading-tight">Detects large buy orders across trench liquidity pools.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SLIDE 4: CALL TO ACTION */}
            {activeSlide === 4 && (
              <motion.div
                key="slide-4"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="w-full text-center space-y-4 z-10 py-2"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#040a16]/80 border border-cyan-400/40 text-xs font-mono text-[#00d2ff]">
                  <span>READY TO LAUNCH</span>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-heading tracking-tight leading-tight">
                  Enter the Abyss. <br />
                  <span className="text-[#00d2ff]">Deploy Your Agent.</span>
                </h2>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
                  Connect your wallet, configure your creature DNA, and broadcast directly to Pump.fun in seconds.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                  <button
                    onClick={onLaunchNow}
                    className="btn-primary text-xs font-semibold px-6 py-2.5 shadow-[0_0_25px_rgba(0,210,255,0.3)] rounded-xl"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Spawn Your Marine Agent</span>
                  </button>

                  <button
                    onClick={onExploreOcean}
                    className="btn-secondary text-xs font-medium px-6 py-2.5 bg-[#051124]/70 border-cyan-500/30 hover:border-cyan-400/60 rounded-xl"
                  >
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Explore The Aquarium</span>
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Bottom Deck Navigation */}
        <div className="w-full flex items-center justify-between z-20 pt-2.5 border-t border-cyan-500/20 text-xs font-mono">
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
                activeSlide === 0 ? 'opacity-30 cursor-not-allowed border-transparent text-slate-600' : 'bg-[#040a16]/80 border-cyan-500/30 hover:border-cyan-400/60 text-slate-300'
              }`}
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={nextSlide}
              disabled={activeSlide === totalSlides - 1}
              className={`p-1.5 rounded-lg border transition-all ${
                activeSlide === totalSlides - 1 ? 'opacity-30 cursor-not-allowed border-transparent text-slate-600' : 'bg-[#040a16]/80 border-cyan-500/30 hover:border-cyan-400/60 text-slate-300'
              }`}
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ScrollIntroView;
