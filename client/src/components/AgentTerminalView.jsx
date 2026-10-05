import React, { useState, useEffect } from 'react';
import { Terminal, Activity, Radio, Zap, Waves, Sparkles, Shield, Cpu } from 'lucide-react';
import BorderGlow from './BorderGlow';

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
    <div className="w-full max-w-5xl mx-auto my-auto select-none">
      <BorderGlow
        edgeSensitivity={32}
        glowColor="190 100 65"
        backgroundColor="rgba(3, 14, 33, 0.65)"
        borderRadius={24}
        glowRadius={40}
        glowIntensity={1.2}
        coneSpread={28}
        animated={false}
        colors={['#00d2ff', '#00ffa3', '#38bdf8']}
        className="w-full shadow-[0_20px_50px_rgba(0,5,20,0.7),0_0_30px_rgba(0,210,255,0.08)] border border-cyan-400/30"
      >
        <div className="w-full p-5 sm:p-6 space-y-4">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/25 pb-3">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#020712] border border-cyan-400/50 text-[10px] font-mono text-cyan-300 mb-1">
                <Radio className="w-3 h-3 text-[#00ffa3]" />
                <span className="font-semibold">06 / LIVE ON-CHAIN RADAR TELEMETRY</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-heading">
                Autonomous Marine Sensory Stream
              </h2>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <div className="px-3 py-1 rounded-xl bg-[#020712] border border-cyan-500/30 text-center">
                <span className="text-slate-400 block text-[9px]">ACTIVE SWARM</span>
                <span className="text-[#00ffa3] font-bold">{stats.totalSpawned} Living</span>
              </div>
              <div className="px-3 py-1 rounded-xl bg-[#020712] border border-cyan-500/30 text-center">
                <span className="text-slate-400 block text-[9px]">TREASURIES</span>
                <span className="text-[#00d2ff] font-bold">{stats.activeFaucets} Streaming</span>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono pb-1">
            {['ALL', 'THOUGHT', 'ACTION', 'SPAWN', 'SIGNAL'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-xl border transition-all ${
                  filterType === type
                    ? 'bg-[#08152b] border-[#00d2ff] text-[#00d2ff] font-bold shadow-[0_0_10px_rgba(0,210,255,0.2)]'
                    : 'bg-[#020712] border-cyan-500/20 text-slate-300 hover:border-cyan-400/40'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Terminal Logs Window */}
          <div className="p-4 rounded-2xl bg-[#01040a] border border-cyan-400/30 shadow-inner">
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-cyan-500/20 text-xs font-mono text-slate-400">
              <span className="text-cyan-300 flex items-center gap-1.5">
                <Waves className="w-3.5 h-3.5 text-[#00d2ff]" /> agensea-radar-daemon://solana-mariana-trench
              </span>
              <span className="text-[#00ffa3] text-[11px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ffa3] shadow-[0_0_6px_#00ffa3]"></span> FEED SYNCED
              </span>
            </div>

            <div className="space-y-2 font-mono text-xs max-h-[300px] overflow-y-auto pr-1">
              {filteredLogs.map((log) => {
                const timeStr = new Date(log.timestamp).toLocaleTimeString();
                const badgeColor =
                  log.type === 'THOUGHT' ? 'bg-[#00d2ff]/10 text-[#00d2ff] border-[#00d2ff]/30' :
                  log.type === 'ACTION' ? 'bg-[#ffb703]/10 text-[#ffb703] border-[#ffb703]/30' :
                  log.type === 'SPAWN' ? 'bg-[#00ffa3]/10 text-[#00ffa3] border-[#00ffa3]/30' :
                  'bg-cyan-950 text-cyan-300 border-cyan-500/40';

                return (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-xl bg-[#020712] border border-cyan-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-cyan-500/30 transition-all"
                  >
                    <div className="flex items-start sm:items-center gap-2.5">
                      <span className="text-slate-500 text-[10px] shrink-0 pt-0.5 sm:pt-0">{timeStr}</span>
                      <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold shrink-0 ${badgeColor}`}>
                        {log.type}
                      </span>
                      {log.tokenSymbol && (
                        <span className="text-[#00ffa3] font-bold text-xs shrink-0">
                          ${log.tokenSymbol}
                        </span>
                      )}
                      <span className="text-slate-200 text-xs leading-relaxed">
                        {log.message}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </BorderGlow>
    </div>
  );
}

export default AgentTerminalView;
