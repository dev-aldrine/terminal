import React from 'react';
import { Waves, Sparkles, Brain, Droplets, Terminal, Info } from 'lucide-react';

export function StepNavigation({ currentStep, onStepChange, canNavigateToLaunch = false }) {
  const steps = [
    { id: 1, label: 'The Ocean', icon: Waves, badge: 'AQUARIUM' },
    { id: 2, label: 'Fish Studio', icon: Sparkles, badge: 'DESIGN' },
    { id: 3, label: 'Agent & Faucet', icon: Brain, badge: 'CONFIG' },
    { id: 4, label: 'Feed & Faucets', icon: Droplets, badge: 'FAUPAD' },
    { id: 5, label: 'Telemetry Radar', icon: Terminal, badge: 'RADAR' }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4">
      <div className="glass-panel p-2 rounded-2xl border border-cyan-500/20 flex items-center justify-between gap-2 overflow-x-auto shadow-xl">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;

          return (
            <button
              key={step.id}
              onClick={() => onStepChange(step.id)}
              className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl font-mono text-xs transition-all flex flex-col sm:flex-row items-center justify-center gap-2 ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-[0_0_20px_rgba(0,245,255,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <div className="text-center sm:text-left">
                <span className="block leading-tight">{step.label}</span>
                <span className={`text-[9px] font-bold block sm:hidden ${isActive ? 'text-slate-900' : 'text-cyan-400'}`}>
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
