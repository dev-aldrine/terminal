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
import BorderGlow from './BorderGlow';

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
      <BorderGlow
        edgeSensitivity={32}
        glowColor="190 100 65"
        backgroundColor="#050e1f"
        borderRadius={22}
        glowRadius={38}
        glowIntensity={1.2}
        coneSpread={28}
        animated={false}
        colors={['#00d2ff', '#00ffa3', '#38bdf8']}
        className="w-full shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(0,210,255,0.08)] border border-cyan-400/30"
      >
        <div className="relative w-full min-h-[350px] flex flex-col justify-between p-6 sm:p-7">
          
          {/* Main Slide Deck */}
          <div className="relative flex-1 w-full flex items-center justify-center py-2">
            <AnimatePresence mode="wait">
              
              {/* SLIDE 0: HERO INTRO */}
              {activeSlide === 0 && (
                <motion.div
                  key="slide-0"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="w-full text-center space-y-4 z-10 py-1 flex flex-col items-center justify-center"
                >
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white font-heading tracking-tight leading-[1.1] text-center flex flex-col items-center justify-center w-full">
                    <span>Spawn autonomous</span>
                    <span className="text-[#00d2ff] flex items-center justify-center w-full mt-0.5">
                      <RotatingText
                        texts={[
                          'predatory alpha sharks.',
                          'deep trench sniper fish.',
                          'liquidity hunting piranhas.',
                          'bonding curve killer whales.',
                          'bioluminescent degen jellies.',
                          'toxic stealth barracudas.'
                        ]}
                        mainClassName="inline-flex justify-center items-center text-center"
                        staggerFrom="last"
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "-120%" }}
                        staggerDuration={0.02}
                        splitLevelClassName="overflow-hidden pb-1 inline-flex justify-center"
                        transition={{ type: "spring", damping: 30, stiffness: 400 }}
                        rotationInterval={2400}
                      />
                    </span>
                  </h1>

                  <p className="text-slate-200 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-sans font-medium text-center">
                    Deploy autonomous fish trading agents on Pump.fun with custom visual DNA, live swimming physics, on-chain thought telemetry, and community treasury pools.
                  </p>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
                    <button
                      onClick={onLaunchNow}
                      className="btn-primary text-sm font-bold px-6 py-3 shadow-[0_0_25px_rgba(0,210,255,0.35)] rounded-xl"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Spawn Agent Now</span>
                    </button>

                    <button
                      onClick={onExploreOcean}
                      className="btn-secondary text-sm font-semibold px-6 py-3 bg-[#030d1d] border-cyan-500/40 hover:border-cyan-400 text-slate-100 rounded-xl"
                    >
                      <Layers className="w-4 h-4 text-cyan-400" />
                      <span>Enter Ocean Ecosystem</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* SLIDE 1: FISH DNA FORGE */}
              {activeSlide === 1 && (
                <motion.div
                  key="slide-1"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="w-full text-left space-y-3.5 z-10"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#020712] border border-cyan-400/50 text-xs font-mono text-[#00d2ff]">
                    <span>01 / PREDATORY FISH DNA FORGE</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight leading-tight">
                    Forge Degen Marine Fish with <br /><span className="text-[#00d2ff]">Live Swimming Physics</span>
                  </h2>
                  <p className="text-slate-200 text-sm leading-relaxed font-medium">
                    Select from 6 ferocious marine fish archetypes (Cyber Megalodons, Neon Anglers, Degen Jellies, Trench Whales). Calibrate neon emission cores, equip cybernetic implants, and watch them hunt.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
                    <div className="p-3.5 rounded-xl bg-[#020815] border border-cyan-400/30">
                      <Cpu className="w-4.5 h-4.5 text-[#00d2ff] mb-1.5" />
                      <h4 className="text-white font-bold text-sm mb-0.5 font-heading">6 Fish Archetypes</h4>
                      <p className="text-slate-300 text-xs leading-tight">Tailored mathematical profiles for volume snipers & alpha hunters.</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#020815] border border-cyan-400/30">
                      <Sparkles className="w-4.5 h-4.5 text-[#00ffa3] mb-1.5" />
                      <h4 className="text-white font-bold text-sm mb-0.5 font-heading">Neon Emission Aura</h4>
                      <p className="text-slate-300 text-xs leading-tight">Procedural spectral shaders with custom glowing dorsal fins.</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#020815] border border-cyan-400/30">
                      <Zap className="w-4.5 h-4.5 text-[#38bdf8] mb-1.5" />
                      <h4 className="text-white font-bold text-sm mb-0.5 font-heading">Cybernetic Augments</h4>
                      <p className="text-slate-300 text-xs leading-tight">Equip sonar radar, trench armor, and alpha dip snipers.</p>
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
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#020712] border border-cyan-400/50 text-xs font-mono text-[#00d2ff]">
                    <span>02 / FISH COMMUNITY TREASURY PROTOCOL</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight leading-tight">
                    Autonomous Fish Pools with <br /><span className="text-[#00d2ff]">AI Cognitive Verification</span>
                  </h2>
                  <p className="text-slate-200 text-sm leading-relaxed font-medium">
                    Equip your fish token with a community treasury pool. Reward diamond hand holders with automated drip payouts, or protect liquidity with interactive AI riddles.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
                    <div className="p-3.5 rounded-xl bg-[#020815] border border-cyan-400/30">
                      <Droplets className="w-4.5 h-4.5 text-[#00d2ff] mb-1.5" />
                      <h4 className="text-white font-bold text-sm mb-0.5 font-heading">Instant Token Drip</h4>
                      <p className="text-slate-300 text-xs leading-tight">Automated cooldown-governed payouts to connected fish holders.</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#020815] border border-cyan-400/30">
                      <Zap className="w-4.5 h-4.5 text-[#00ffa3] mb-1.5" />
                      <h4 className="text-white font-bold text-sm mb-0.5 font-heading">AI Fish Riddle Gates</h4>
                      <p className="text-slate-300 text-xs leading-tight">Marine agents verify natural language answers before release.</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#020815] border border-cyan-400/30">
                      <Shield className="w-4.5 h-4.5 text-[#ffb703] mb-1.5" />
                      <h4 className="text-white font-bold text-sm mb-0.5 font-heading">Anti-Bot Defenses</h4>
                      <p className="text-slate-300 text-xs leading-tight">Cooldown thresholds to prevent sniper bot extraction.</p>
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
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#020712] border border-cyan-400/50 text-xs font-mono text-[#00d2ff]">
                    <span>03 / THE LIVING DEGEN AQUARIUM</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight leading-tight">
                    Watch Spawned Fish Co-Exist & <br /><span className="text-[#00d2ff]">Scale with Market Cap</span>
                  </h2>
                  <p className="text-slate-200 text-sm leading-relaxed font-medium">
                    Step into the shared ocean where every spawned token swims autonomously. Fish size scales dynamically with Pump.fun market cap, and live thought telemetry broadcasts on-chain alpha.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
                    <div className="p-3.5 rounded-xl bg-[#020815] border border-cyan-400/30">
                      <Waves className="w-4.5 h-4.5 text-[#00d2ff] mb-1.5" />
                      <h4 className="text-white font-bold text-sm mb-0.5 font-heading">Market Cap Scaling</h4>
                      <p className="text-slate-300 text-xs leading-tight">Fish grow into gigantic leviathans as bonding curves fill up.</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#020815] border border-cyan-400/30">
                      <Terminal className="w-4.5 h-4.5 text-[#00ffa3] mb-1.5" />
                      <h4 className="text-white font-bold text-sm mb-0.5 font-heading">Alpha Thought Streams</h4>
                      <p className="text-slate-300 text-xs leading-tight">Live telemetry feeds broadcast autonomous trading signals.</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#020815] border border-cyan-400/30">
                      <Sparkles className="w-4.5 h-4.5 text-[#38bdf8] mb-1.5" />
                      <h4 className="text-white font-bold text-sm mb-0.5 font-heading">Sonar Whale Radar</h4>
                      <p className="text-slate-300 text-xs leading-tight">Real-time alerts for massive SOL buys in the deep trench.</p>
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
                  className="w-full text-center space-y-4 z-10 py-2 flex flex-col items-center justify-center"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#020712] border border-cyan-400/50 text-xs font-mono text-[#00d2ff]">
                    <span>READY TO SPAWN</span>
                  </div>

                  <h2 className="text-4xl sm:text-5xl font-black text-white font-heading tracking-tight leading-tight">
                    Enter the Trench. <br />
                    <span className="text-[#00d2ff]">Spawn Your Fish Agent.</span>
                  </h2>

                  <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-lg mx-auto font-medium">
                    Connect your wallet, configure your creature visual DNA, and broadcast directly to Pump.fun in seconds.
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
                    <button
                      onClick={onLaunchNow}
                      className="btn-primary text-sm font-bold px-7 py-3.5 shadow-[0_0_25px_rgba(0,210,255,0.35)] rounded-xl"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Spawn Your Marine Fish Now</span>
                    </button>

                    <button
                      onClick={onExploreOcean}
                      className="btn-secondary text-sm font-semibold px-7 py-3.5 bg-[#030d1d] border-cyan-500/40 hover:border-cyan-400 text-slate-100 rounded-xl"
                    >
                      <Layers className="w-4 h-4 text-cyan-400" />
                      <span>Explore The Ocean Aquarium</span>
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Bottom Deck Navigation */}
          <div className="w-full flex items-center justify-between z-20 pt-3 border-t border-cyan-500/25 text-sm font-mono">
            <div className="flex items-center gap-2.5">
              {Array.from({ length: totalSlides }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className={`h-2 rounded-full transition-all ${
                    activeSlide === idx ? 'w-7 bg-[#00d2ff] shadow-[0_0_10px_#00d2ff]' : 'w-2.5 bg-cyan-900/70 hover:bg-cyan-500/50'
                  }`}
                  title={`Slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-slate-200 font-mono text-xs sm:text-sm hidden sm:inline mr-2 font-bold">0{activeSlide + 1} / 0{totalSlides}</span>
              <button
                onClick={prevSlide}
                disabled={activeSlide === 0}
                className={`p-2 rounded-lg border transition-all ${
                  activeSlide === 0 ? 'opacity-30 cursor-not-allowed border-transparent text-slate-600' : 'bg-[#020712] border-cyan-500/40 hover:border-cyan-400 text-slate-200'
                }`}
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                disabled={activeSlide === totalSlides - 1}
                className={`p-2 rounded-lg border transition-all ${
                  activeSlide === totalSlides - 1 ? 'opacity-30 cursor-not-allowed border-transparent text-slate-600' : 'bg-[#020712] border-cyan-500/40 hover:border-cyan-400 text-slate-200'
                }`}
              >
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </BorderGlow>
    </div>
  );
};

export default ScrollIntroView;
