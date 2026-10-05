import React, { useState, useEffect } from 'react';
import { Terminal, Activity, Radio, Zap, Waves, Sparkles, Shield, Cpu, Disc, Filter } from 'lucide-react';

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
    <div className="w-full max-w-5xl mx-auto my-auto select-none py-2">
      {/* Cyberpunk Deep Trench Radar & Telemetry Console */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#041024]/90 via-[#020917]/95 to-[#01040a]/98 border border-cyan-500/30 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(0,210,255,0.12)] space-y-5">
        
        {/* Top Acoustic Radar HUD */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#051833]/80 border border-cyan-400/40 text-[11px] font-mono text-cyan-300">
              <Disc className="w-3.5 h-3.5 text-[#00ffa3] animate-spin" />
              <span className="tracking-wider uppercase font-bold">06 / ACOUSTIC RADAR TELEMETRY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight flex items-center gap-2.5">
              <span>Deep Trench Neural Stream</span>
              <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                BLOCKS SYNCED
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2.5 font-mono text-xs">
            <div className="px-3.5 py-2 rounded-2xl bg-[#04142c] border border-cyan-500/30 text-center">
              <span className="text-slate-400 block text-[9px]">LIVING SWARM</span>
              <span className="text-[#00ffa3] font-bold text-sm">{stats.totalSpawned} Living</span>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-[#04142c] border border-cyan-500/30 text-center">
              <span className="text-slate-400 block text-[9px]">ACTIVE VAULTS</span>
              <span className="text-[#00d2ff] font-bold text-sm">{stats.activeFaucets} Streaming</span>
            </div>
          </div>
        </div>

        {/* Channel Filters */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono pb-1">
          {['ALL', 'THOUGHT', 'ACTION', 'SPAWN', 'SIGNAL'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3.5 py-1.5 rounded-xl border transition-all shrink-0 font-bold ${
                filterType === type
                  ? 'bg-gradient-to-r from-[#00d2ff] to-[#00ffa3] text-[#020712] shadow-[0_0_15px_rgba(0,210,255,0.3)]'
                  : 'bg-[#020712] border-cyan-500/20 text-slate-400 hover:border-cyan-400/40 hover:text-white'
              }`}
            >
              CHANNEL: {type}
            </button>
          ))}
        </div>

        {/* Terminal Screen Console */}
        <div className="p-5 rounded-3xl bg-[#01040a] border-2 border-cyan-400/30 shadow-[inset_0_0_30px_rgba(0,210,255,0.06)] space-y-3">
          
          <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 text-xs font-mono text-slate-400">
            <span className="text-cyan-300 flex items-center gap-2 font-bold">
              <Waves className="w-4 h-4 text-[#00d2ff]" /> agensea-sonar://solana-mariana-trench:5001/telemetry
            </span>
            <span className="text-[#00ffa3] text-xs flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-[#00ffa3] shadow-[0_0_8px_#00ffa3] animate-ping"></span>
              HYDRO-STREAM ACTIVE
            </span>
          </div>

          <div className="space-y-2.5 font-mono text-xs max-h-[320px] overflow-y-auto pr-1">
            {filteredLogs.map((log) => {
              const timeStr = new Date(log.timestamp).toLocaleTimeString();
              const badgeColor =
                log.type === 'THOUGHT' ? 'bg-[#00d2ff]/10 text-[#00d2ff] border-[#00d2ff]/40 shadow-[0_0_8px_rgba(0,210,255,0.2)]' :
                log.type === 'ACTION' ? 'bg-[#ffb703]/10 text-[#ffb703] border-[#ffb703]/40 shadow-[0_0_8px_rgba(255,183,3,0.2)]' :
                log.type === 'SPAWN' ? 'bg-[#00ffa3]/10 text-[#00ffa3] border-[#00ffa3]/40 shadow-[0_0_8px_rgba(0,255,163,0.2)]' :
                'bg-cyan-950 text-cyan-300 border-cyan-500/40';

              return (
                <div
                  key={log.id}
                  className="p-3 rounded-2xl bg-[#020712] border border-cyan-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:border-cyan-400/40 transition-all"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <span className="text-slate-500 text-[10px] shrink-0 font-bold">{timeStr}</span>
                    <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold shrink-0 ${badgeColor}`}>
                      {log.type}
                    </span>
                    {log.tokenSymbol && (
                      <span className="text-[#00ffa3] font-bold text-xs shrink-0 font-mono">
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
    </div>
  );
}

export default AgentTerminalView;
