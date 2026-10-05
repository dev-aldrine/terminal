import React, { useState, useEffect } from 'react';
import { Terminal, Activity, Radio, Zap, Shield, Waves, Filter, ArrowUpRight, Cpu } from 'lucide-react';

export function AgentTerminalView() {
  const [logs, setLogs] = useState([]);
  const [filterType, setFilterType] = useState('ALL');
  const [stats, setStats] = useState({ totalSpawned: 3, activeFaucets: 3 });

  const fetchTelemetry = async () => {
    try {
      const res = await fetch('/api/telemetry');
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.success) {
        setLogs(data.logs || []);
        setStats({
          totalSpawned: data.totalSpawned || 3,
          activeFaucets: data.activeFaucets || 3
        });
      }
    } catch (err) {
      console.error('Failed to fetch telemetry:', err);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (filterType === 'ALL') return true;
    return log.type === filterType;
  });

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 font-mono text-xs mb-2">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-ping" />
            <span>LIVE AUTONOMOUS TELEMETRY</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            Agent <span className="text-gradient-cyan">Cyber Radar</span>
          </h2>
          <p className="text-slate-400 text-sm">
            Real-time on-chain sensory stream of autonomous marine AI entities, thought reflections, and trading signals.
          </p>
        </div>

        {/* Quick Protocol Telemetry Metrics */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="glass-panel px-4 py-2 rounded-xl border border-cyan-500/30">
            <span className="text-slate-500 block text-[10px]">ACTIVE ENTITIES</span>
            <span className="text-cyan-400 font-bold text-sm">{stats.totalSpawned} Living</span>
          </div>
          <div className="glass-panel px-4 py-2 rounded-xl border border-emerald-500/30">
            <span className="text-slate-500 block text-[10px]">FAUCET VAULTS</span>
            <span className="text-emerald-400 font-bold text-sm">{stats.activeFaucets} Streaming</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto text-xs font-mono">
        {['ALL', 'THOUGHT', 'ACTION', 'FAUCET', 'SPAWN', 'SIGNAL'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1 rounded-lg border transition-all ${
              filterType === type
                ? 'bg-cyan-950 border-cyan-400 text-cyan-300 font-bold shadow-[0_0_10px_rgba(0,245,255,0.2)]'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Cyber Terminal Window */}
      <div className="terminal-window rounded-3xl p-5 border border-cyan-500/30 min-h-[480px] relative overflow-hidden shadow-2xl">
        
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-cyan-500/20 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
            <span className="ml-2 text-cyan-400 font-semibold font-mono">agensea-telemetry-daemon://solana-mariana-trench</span>
          </div>
          <span className="font-mono text-[11px] text-emerald-400 animate-pulse">● FEED SYNCED</span>
        </div>

        {/* Stream Content */}
        <div className="space-y-3 font-mono text-xs max-h-[420px] overflow-y-auto pr-2">
          {filteredLogs.map((log) => {
            const timeStr = new Date(log.timestamp).toLocaleTimeString();
            const badgeColor =
              log.type === 'THOUGHT' ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40' :
              log.type === 'ACTION' ? 'bg-amber-950 text-amber-300 border-amber-500/40' :
              log.type === 'FAUCET' ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40' :
              log.type === 'SPAWN' ? 'bg-purple-950 text-purple-300 border-purple-500/40' :
              'bg-blue-950 text-blue-300 border-blue-500/40';

            return (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/30 transition-colors flex items-start gap-3"
              >
                <span className="text-slate-500 shrink-0 text-[11px] pt-0.5">{timeStr}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 ${badgeColor}`}>
                  {log.type}
                </span>
                <span className="text-cyan-400 font-bold shrink-0">${log.tokenSymbol}:</span>
                <p className="text-slate-300 leading-relaxed break-words">{log.message}</p>
              </div>
            );
          })}

          {filteredLogs.length === 0 && (
            <div className="text-center py-12 text-slate-500 font-mono">
              No telemetry packets found for this filter.
            </div>
          )}
        </div>

        {/* Scanlines */}
        <div className="absolute inset-0 pointer-events-none scanline-overlay opacity-25"></div>
      </div>
    </div>
  );
}
