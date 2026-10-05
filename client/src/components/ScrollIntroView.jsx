import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Waves, Brain, Droplets, Rocket, ArrowDown, ArrowUp, ChevronDown, CheckCircle2, Shield, Zap } from 'lucide-react';
import RotatingText from './RotatingText';
import BounceCards from './BounceCards';

import pompfonImg from '../../draw/pompfon.png';
import stoankImg from '../../draw/stoank.png';
import dimondImg from '../../draw/dimond.png';
import raketImg from '../../draw/raket.png';
import solonoImg from '../../draw/solono.png';

const BOUNCE_IMAGES = [
  pompfonImg,
  stoankImg,
  dimondImg,
  raketImg,
  solonoImg
];

const BOUNCE_TRANSFORMS = [
  'rotate(10deg) translate(-140px)',
  'rotate(5deg) translate(-70px)',
  'rotate(-3deg)',
  'rotate(-10deg) translate(70px)',
  'rotate(2deg) translate(140px)'
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

  // Wheel listener with debounce
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
        }, 550);
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
    <div className="relative w-full h-[calc(100vh-140px)] min-h-[580px] max-h-[820px] overflow-hidden rounded-3xl border border-cyan-500/20 bg-[#030917] shadow-2xl flex flex-col justify-between p-6 md:p-10 select-none">
      
      {/* Background Water Particles & Rays */}
      <div className="absolute inset-0 pointer-events-none scanline-overlay opacity-20"></div>

      {/* Main Slide Carousel Container */}
      <div className="relative flex-1 w-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          
          {/* SLIDE 0: HERO INTRO */}
          {activeSlide === 0 && (
            <motion.div
              key="slide-0"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-8 z-10"
            >
              <div className="flex-1 text-center md:text-left space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 font-mono text-xs font-bold shadow-[0_0_15px_rgba(0,245,255,0.2)]">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>AUTONOMOUS MARINE LAUNCHPAD ON SOLANA</span>
                </div>

                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight font-heading leading-tight">
                  Spawn Living <br />
                  <span className="text-gradient-cyan">
                    <RotatingText
                      texts={['AI Marine Agents', 'Predatory Sharks', 'Deep Alpha Snipers', 'Yield Floats', 'Autonomous Faucets']}
                      mainClassName="inline-block"
                      staggerFrom="last"
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "-120%" }}
                      staggerDuration={0.025}
                      splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                      transition={{ type: "spring", damping: 30, stiffness: 400 }}
                      rotationInterval={2800}
                    />
                  </span>
                </h2>

                <p className="text-slate-300 text-sm md:text-base max-w-lg leading-relaxed">
                  Every coin launched on Pump.fun is an autonomous marine entity swimming in a living ocean, powered by real-time thought telemetry and community Faucet Vaults.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                  <button
                    onClick={onLaunchNow}
                    className="ocean-btn-primary px-7 py-3.5 rounded-2xl text-sm font-extrabold flex items-center gap-2 shadow-2xl"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Spawn Creature Now</span>
                  </button>

                  <button
                    onClick={onExploreOcean}
                    className="px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold flex items-center gap-2 transition-all"
                  >
                    <Waves className="w-4 h-4 text-cyan-400" />
                    <span>Enter The Aquarium</span>
                  </button>
                </div>
              </div>

              {/* Right: Bounce Cards Visual */}
              <div className="flex-1 flex items-center justify-center">
                <BounceCards
                  images={BOUNCE_IMAGES}
                  containerWidth={340}
                  containerHeight={340}
                  animationDelay={0.1}
                  animationStagger={0.07}
                  transformStyles={BOUNCE_TRANSFORMS}
                  enableHover={true}
                />
              </div>
            </motion.div>
          )}

          {/* SLIDE 1: FISH STUDIO */}
          {activeSlide === 1 && (
            <motion.div
              key="slide-1"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="w-full max-w-4xl text-center space-y-6 z-10"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-400 text-cyan-400 font-mono text-xs font-bold">
                <span>01 • CYBER-AQUATIC DNA FORGE</span>
              </div>
              <h3 className="text-3xl md:text-5xl font-extrabold text-white font-heading">
                Design Your <span className="text-gradient-cyan">Autonomous Creature</span>
              </h3>
              <p className="text-slate-300 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
                Choose from 6 predatory and liquidity archetypes (Cyber Sharks, Neon Anglers, Bio Jellies). Tweak bioluminescence, equip laser augments, and paint custom neon decals on an interactive live swim simulator.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-3xl mx-auto font-mono text-xs">
                <div className="glass-panel p-4 rounded-2xl border border-cyan-500/20">
                  <span className="text-xl mb-1 block">🦈</span>
                  <strong className="text-cyan-300 block mb-1">6 Species Archetypes</strong>
                  <span className="text-slate-400 text-[11px]">From aggressive volume snipers to passive liquidity floaters.</span>
                </div>
                <div className="glass-panel p-4 rounded-2xl border border-cyan-500/20">
                  <span className="text-xl mb-1 block">🎨</span>
                  <strong className="text-cyan-300 block mb-1">Live Paint & Decals</strong>
                  <span className="text-slate-400 text-[11px]">Hand-paint glowing markings or stickers over your 2D model.</span>
                </div>
                <div className="glass-panel p-4 rounded-2xl border border-cyan-500/20">
                  <span className="text-xl mb-1 block">🌊</span>
                  <strong className="text-cyan-300 block mb-1">Live Swim Simulator</strong>
                  <span className="text-slate-400 text-[11px]">Creature responds to physics and swims dynamically in real-time.</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* SLIDE 2: AGENT BRAIN & PUMP.FUN */}
          {activeSlide === 2 && (
            <motion.div
              key="slide-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="w-full max-w-4xl text-center space-y-6 z-10"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-400 text-emerald-400 font-mono text-xs font-bold">
                <span>02 • BRAIN MATRIX & PUMP.FUN DEPLOYMENT</span>
              </div>
              <h3 className="text-3xl md:text-5xl font-extrabold text-white font-heading">
                Bonding Curve <span className="text-gradient-cyan">Instant Mint</span>
              </h3>
              <p className="text-slate-300 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
                Connect your Phantom wallet, configure dev buy amount, risk parameters, and system prompts. Your token and IPFS metadata are signed and deployed directly to Pump.fun via PumpPortal.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-3xl mx-auto font-mono text-xs">
                <div className="glass-panel p-4 rounded-2xl border border-emerald-500/20">
                  <span className="text-xl mb-1 block">🧠</span>
                  <strong className="text-emerald-300 block mb-1">Trading Personality</strong>
                  <span className="text-slate-400 text-[11px]">Define strategy (Momentum, Dip Sniper, Fortress) & AI prompt.</span>
                </div>
                <div className="glass-panel p-4 rounded-2xl border border-emerald-500/20">
                  <span className="text-xl mb-1 block">⚡</span>
                  <strong className="text-emerald-300 block mb-1">Instant Genesis Buy</strong>
                  <span className="text-slate-400 text-[11px]">Optionally snipe your own bonding curve at block 0.</span>
                </div>
                <div className="glass-panel p-4 rounded-2xl border border-emerald-500/20">
                  <span className="text-xl mb-1 block">🛡️</span>
                  <strong className="text-emerald-300 block mb-1">0.02 SOL Protocol Fee</strong>
                  <span className="text-slate-400 text-[11px]">Funds the buyback treasury & ocean liquidity reserves.</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* SLIDE 3: FAUCET PROTOCOL */}
          {activeSlide === 3 && (
            <motion.div
              key="slide-3"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="w-full max-w-4xl text-center space-y-6 z-10"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950 border border-purple-400 text-purple-300 font-mono text-xs font-bold">
                <span>03 • AUTONOMOUS FAUCET PROTOCOL (FAUPAD)</span>
              </div>
              <h3 className="text-3xl md:text-5xl font-extrabold text-white font-heading">
                Community <span className="text-gradient-pink">Feeding Vaults</span>
              </h3>
              <p className="text-slate-300 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
                Deploy community faucets locked in custody. Holders solve deep-sea AI riddles or claim instant timed drips to distribute supply autonomously.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-3xl mx-auto font-mono text-xs">
                <div className="glass-panel p-4 rounded-2xl border border-purple-500/20">
                  <span className="text-xl mb-1 block">🧩</span>
                  <strong className="text-purple-300 block mb-1">AI Riddle Gateway</strong>
                  <span className="text-slate-400 text-[11px]">Chat with the creature in a cyber terminal to earn tokens.</span>
                </div>
                <div className="glass-panel p-4 rounded-2xl border border-purple-500/20">
                  <span className="text-xl mb-1 block">💧</span>
                  <strong className="text-purple-300 block mb-1">Instant Drip Cooldown</strong>
                  <span className="text-slate-400 text-[11px]">Fair timed drip claims with sybil protection.</span>
                </div>
                <div className="glass-panel p-4 rounded-2xl border border-purple-500/20">
                  <span className="text-xl mb-1 block">🐟</span>
                  <strong className="text-purple-300 block mb-1">Feed the Pool</strong>
                  <span className="text-slate-400 text-[11px]">Anyone can donate tokens to boost the fish's feeding pool.</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* SLIDE 4: LIVING AQUARIUM & FINAL CTA */}
          {activeSlide === 4 && (
            <motion.div
              key="slide-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="w-full max-w-4xl text-center space-y-6 z-10"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-400 text-cyan-300 font-mono text-xs font-bold">
                <span>04 • THE LIVING AQUARIUM</span>
              </div>
              <h3 className="text-3xl md:text-5xl font-extrabold text-white font-heading">
                Join the <span className="text-gradient-cyan">Deep-Sea Ocean</span>
              </h3>
              <p className="text-slate-300 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
                Watch your fish grow as its Pump.fun bonding curve climbs. Hover or tap to inspect live radar telemetry, trade, or claim tokens.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <button
                  onClick={onLaunchNow}
                  className="ocean-btn-primary px-8 py-4 rounded-2xl text-base font-extrabold flex items-center gap-2 shadow-2xl"
                >
                  <Zap className="w-5 h-5" />
                  <span>Spawn Your Creature Now</span>
                </button>

                <button
                  onClick={onExploreOcean}
                  className="px-7 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold flex items-center gap-2"
                >
                  <Waves className="w-4 h-4 text-cyan-400" />
                  <span>Explore The Aquarium</span>
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Bottom Controls & Navigation Dots */}
      <div className="w-full flex items-center justify-between z-20 pt-4 border-t border-cyan-500/10 text-xs font-mono">
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                activeSlide === idx ? 'w-8 bg-cyan-400 shadow-[0_0_10px_rgba(0,245,255,0.6)]' : 'w-2 bg-slate-700 hover:bg-slate-500'
              }`}
              title={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={prevSlide}
            disabled={activeSlide === 0}
            className={`p-2 rounded-xl border transition-all ${
              activeSlide === 0 ? 'opacity-30 cursor-not-allowed border-slate-800' : 'bg-slate-900 border-cyan-500/30 hover:border-cyan-400 text-cyan-300'
            }`}
            title="Previous slide"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <button
            onClick={nextSlide}
            disabled={activeSlide === totalSlides - 1}
            className={`p-2 rounded-xl border transition-all ${
              activeSlide === totalSlides - 1 ? 'opacity-30 cursor-not-allowed border-slate-800' : 'bg-slate-900 border-cyan-500/30 hover:border-cyan-400 text-cyan-300'
            }`}
            title="Next slide"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default ScrollIntroView;
