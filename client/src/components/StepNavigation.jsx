import React from 'react';
import { BookOpen, Sparkles, Brain, Waves, Droplets, Terminal } from 'lucide-react';

export function StepNavigation({ currentStep, onStepChange }) {
  const steps = [
    { id: 1, label: 'Overview', icon: BookOpen, num: '01' },
    { id: 2, label: 'DNA Studio', icon: Sparkles, num: '02' },
    { id: 3, label: 'Strategy & Deploy', icon: Brain, num: '03' },
    { id: 4, label: 'The Ocean', icon: Waves, num: '04' },
    { id: 5, label: 'Treasury Pools', icon: Droplets, num: '05' },
    { id: 6, label: 'Radar Telemetry', icon: Terminal, num: '06' }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-2.5">
      <div className="p-1 rounded-xl bg-[#080d17] border border-white/[0.08] flex items-center justify-between gap-1 overflow-x-auto">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;

          return (
            <button
              key={step.id}
              onClick={() => onStepChange(step.id)}
              className={`flex-1 min-w-[110px] py-1.5 px-2.5 rounded-lg font-mono text-xs transition-all flex items-center justify-center gap-2 ${
                isActive
                  ? 'bg-[#0c1322] border border-[#00e5ff] text-[#00e5ff] font-bold shadow-[0_0_15px_rgba(0,229,255,0.15)]'
                  : 'text-slate-400 hover:text-white hover:bg-[#0c1322]/50'
              }`}
            >
              <span className="text-[10px] text-slate-500">{step.num}</span>
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{step.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
