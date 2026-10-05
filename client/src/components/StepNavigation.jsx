import React from 'react';
import { BookOpen, Sparkles, Brain, Waves, Droplets, Terminal } from 'lucide-react';
import JellyRadio from './JellyRadio';

export function StepNavigation({ currentStep, onStepChange }) {
  const steps = [
    { value: 1, label: '01 Overview', icon: <BookOpen className="w-4 h-4" /> },
    { value: 2, label: '02 DNA Studio', icon: <Sparkles className="w-4 h-4" /> },
    { value: 3, label: '03 Strategy & Deploy', icon: <Brain className="w-4 h-4" /> },
    { value: 4, label: '04 The Ocean', icon: <Waves className="w-4 h-4" /> },
    { value: 5, label: '05 Treasury Pools', icon: <Droplets className="w-4 h-4" /> },
    { value: 6, label: '06 Radar Telemetry', icon: <Terminal className="w-4 h-4" /> }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-3 flex justify-center overflow-x-auto">
      <div className="inline-flex min-w-max p-1.5 rounded-2xl bg-[#090a0d] border border-[#202430]/80 shadow-sm">
        <JellyRadio
          items={steps}
          value={currentStep}
          onChange={(val) => onStepChange(Number(val))}
          chipColor="#141720"
          activeColor="#00d2ff"
          textColor="#94a3b8"
          activeTextColor="#090a0d"
          size="md"
          gap={12}
          radius={16}
          swell={0.2}
          barge={6}
          shrink={0.05}
          jelly={1.5}
          bounce={0.25}
          stagger={22}
          stiffness={580}
        />
      </div>
    </div>
  );
}
