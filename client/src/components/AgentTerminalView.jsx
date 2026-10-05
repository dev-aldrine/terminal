import React, { useState, useEffect } from 'react';
import { Terminal, Activity, Radio, Zap, Waves } from 'lucide-react';

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
    <div className="w-full max-w-6xl mx-auto py-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="text-left space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#00ffa3]">
            <span>06 / LIVE ON-CHAIN RADAR</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-heading">
            Autonomous Thought Telemetry
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Real-time on-chain sensory stream of autonomous marine AI entities, thought reflections, and trading signals.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="editorial-card px-3.5 py-1.5 border border-white/[0.08]">
            <span className="text-slate-500 block text-[10px]">ACTIVE ENTITIES</span>
            <span className="text-white font-bold">{stats.totalSpawned} Living</span>
          </div>
          <div className="editorial-card px-3.5 py-1.5 border border-white/[0.08]">
            <span className="text-slate-500 block text-[10px]">TREASURY POOLS</span>
            <span className="text-[#00ffa3] font-bold">{stats.activeFaucets} Streaming</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-3 overflow-x-auto text-xs font-mono">
        {['ALL', 'THOUGHT', 'ACTION', 'SPAWN', 'SIGNAL'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1 rounded border transition-all ${
              filterType === type
                ? 'bg-[#0c1322] border-[#00e5ff] text-[#00e5ff] font-bold'
                : 'bg-[#080d17] border-white/[0.08] text-slate-400 hover:border-white/[0.2]'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Terminal Window */}
      <div className="terminal-window p-4 border border-white/[0.1] min-h-[440px]">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.08] text-xs text-slate-400">
          <span className="text-[#00e5ff] font-mono">agensea-radar-daemon://solana-mariana-trench</span>
          <span className="text-[#00ffa3] font-mono text-[11px]">● FEED SYNCED</span>
        </div>

        <div className="space-y-2.5 font-mono text-xs max-h-[400px] overflow-y-auto pr-1">
          {filteredLogs.map((log) => {
            const timeStr = new Date(log.timestamp).toLocaleTimeString();
            const badgeColor =
              log.type === 'THOUGHT' ? 'bg-[#00e5ff]/10 text-[#00e5ff] border-[#00e5ff]/30' :
              log.type === 'ACTION' ? 'bg-[#ffb703]/10 text-[#ffb703] border-[#ffb703]/30' :
              log.type === 'SPAWN' ? 'bg-[#00ffa3]/10 text-[#00ffa3] border-[#00ffa3]/30' :
              'bg-blue-950 text-blue-300 border-blue-500/40';

            return (
              <div
                key={log.id}
                className="p-2.5 rounded bg-[#080d17] border border-white/[0.04] hover:border-white/[0.12] transition-colors flex items-start gap-2.5"
              >
                <span className="text-slate-500 shrink-0 text-[11px] pt-0.5">{timeStr}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border shrink-0 ${badgeColor}`}>
                  {log.type}
                </span>
                <span className="text-white font-bold shrink-0">${log.tokenSymbol}:</span>
                <p className="text-slate-300 leading-relaxed break-words">{log.message}</p>
              </div>
            );
          })}

          {filteredLogs.length === 0 && (
            <div className="text-center py-10 text-slate-500 font-mono">
              No telemetry packets found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
