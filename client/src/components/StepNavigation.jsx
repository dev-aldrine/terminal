import React from 'react';
import { BookOpen, Sparkles, Brain, Waves, Droplets, Terminal } from 'lucide-react';

export function StepNavigation({ currentStep, onStepChange, canNavigateToLaunch = false }) {
  const steps = [
    { id: 1, label: 'How It Works', icon: BookOpen, badge: 'INTRO' },
    { id: 2, label: 'Fish Studio', icon: Sparkles, badge: 'DESIGN' },
    { id: 3, label: 'Agent & Faucet', icon: Brain, badge: 'CONFIG' },
    { id: 4, label: 'The Ocean', icon: Waves, badge: 'AQUARIUM' },
    { id: 5, label: 'Feed & Claim', icon: Droplets, badge: 'FAUPAD' },
    { id: 6, label: 'Cyber Radar', icon: Terminal, badge: 'TELEMETRY' }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-3">
      <div className="glass-panel p-1.5 rounded-2xl border border-cyan-500/20 flex items-center justify-between gap-2 overflow-x-auto shadow-xl">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;

          return (
            <button
              key={step.id}
              onClick={() => onStepChange(step.id)}
              className={`flex-1 min-w-[110px] py-2 px-2.5 rounded-xl font-mono text-xs transition-all flex flex-col sm:flex-row items-center justify-center gap-2 ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-[0_0_20px_rgba(0,245,255,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <div className="text-center sm:text-left">
                <span className="block leading-tight text-[11px] sm:text-xs">{step.label}</span>
                <span className={`text-[8px] font-bold block sm:hidden ${isActive ? 'text-slate-900' : 'text-cyan-400'}`}>
                  {step.badge}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
