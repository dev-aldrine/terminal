import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Droplets, Brain, Zap, Send, CheckCircle2, AlertCircle, Coins, MessageSquare, Waves, Lock, ShieldCheck, Radio } from 'lucide-react';
import confetti from 'canvas-confetti';

export function FaucetView({ preselectedToken = null }) {
  const { publicKey, connected } = useWallet();
  const [pools, setPools] = useState([]);
  const [selectedPool, setSelectedPool] = useState(preselectedToken || null);
  const [loading, setLoading] = useState(false);
  const [claimStatus, setClaimStatus] = useState(null);
  
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isAgentThinking, setIsAgentThinking] = useState(false);
  const [challengePassed, setChallengePassed] = useState(false);

  const [isFeedModalOpen, setIsFeedModalOpen] = useState(false);
  const [feedAmount, setFeedAmount] = useState('');
  const [feedSuccessMsg, setFeedSuccessMsg] = useState('');

  const fetchPools = async () => {
    try {
      const res = await fetch('/api/faucets');
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.success) {
        setPools(data.faucets);
        if (!selectedPool && data.faucets.length > 0) {
          setSelectedPool(data.faucets[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch pools:', err);
    }
  };

  useEffect(() => {
    fetchPools();
    const interval = setInterval(fetchPools, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (preselectedToken) {
      setSelectedPool(preselectedToken);
    }
  }, [preselectedToken]);

  useEffect(() => {
    if (selectedPool && selectedPool.faucet?.claimMode === 'ai_challenge') {
      setChatMessages([
        {
          sender: 'agent',
          text: `*Sonar signal active* "Greetings deep-sea diver. To verify your claim from my trench treasury, solve this riddle: '${selectedPool.faucet.challengePrompt || 'What is the secret fuel of the Solana ocean depths?'}'"`
        }
      ]);
      setChallengePassed(false);
      setClaimStatus(null);
    }
  }, [selectedPool]);

  const handleSendChatMessage = async (e) => {
    e?.preventDefault();
    if (!chatInput.trim() || isAgentThinking) return;

    const userText = chatInput.trim();
    setChatInput('');
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setIsAgentThinking(true);

    try {
      const res = await fetch('/api/agent-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenId: selectedPool.tokenId || selectedPool.id,
          message: userText
        })
      });

      const data = await res.json();
      if (data && data.success) {
        setChatMessages((prev) => [...prev, { sender: 'agent', text: data.agentReply }]);
        if (data.isApproved) {
          setChallengePassed(true);
        }
      }
    } catch (err) {
      setChatMessages((prev) => [...prev, { sender: 'agent', text: 'Trench signal connection interrupted.' }]);
    } finally {
      setIsAgentThinking(false);
    }
  };

  const handleClaim = async () => {
    if (!connected || !publicKey) {
      alert('Please connect your Phantom / Solana wallet first!');
      return;
    }

    try {
      setLoading(true);
      setClaimStatus(null);

      const res = await fetch('/api/faucets/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenId: selectedPool.tokenId || selectedPool.id,
          claimerWallet: publicKey.toBase58(),
          challengeAnswer: challengePassed ? 'liquidity' : chatInput
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Claim failed');
      }

      setClaimStatus({
        type: 'success',
        message: `Claimed ${data.amountClaimed.toLocaleString()} $${selectedPool.symbol}! Dispatched from treasury.`
      });

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });

      fetchPools();
    } catch (err) {
      setClaimStatus({
        type: 'error',
        message: err.message || 'Failed to claim tokens'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFeedVault = async (e) => {
    e.preventDefault();
    if (!feedAmount || Number(feedAmount) <= 0) return;

    try {
      const res = await fetch('/api/faucets/feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenId: selectedPool.tokenId || selectedPool.id,
          feederWallet: publicKey ? publicKey.toBase58() : 'Anonymous Diver',
          amount: Number(feedAmount)
        })
      });

      const data = await res.json();
      if (data && data.success) {
        setFeedSuccessMsg(`Deposited ${Number(feedAmount).toLocaleString()} tokens into $${selectedPool.symbol} Treasury!`);
        setFeedAmount('');
        fetchPools();
        setTimeout(() => {
          setIsFeedModalOpen(false);
          setFeedSuccessMsg('');
        }, 2000);
      }
    } catch (err) {
      alert('Deposit failed: ' + err.message);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-auto select-none py-2">
      {/* Abyssal Vault Chamber & Telepathic Neural Link */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#041024]/90 via-[#020917]/95 to-[#01040a]/98 border border-cyan-500/30 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(0,210,255,0.12)] space-y-5">
        
        {/* Top Vault Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#051833]/80 border border-cyan-400/40 text-[11px] font-mono text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-[#00d2ff] animate-pulse"></span>
              <span className="tracking-wider uppercase font-bold">05 / ABYSSAL TREASURY VAULTS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight flex items-center gap-2.5">
              <span>Deep-Sea Liquidity Faucets</span>
              <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                {pools.length} VAULTS ONLINE
              </span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Active Vault List */}
          <div className="lg:col-span-4 space-y-2.5">
            <span className="text-xs font-mono text-cyan-300 font-bold uppercase tracking-wider block">
              Active Trench Vaults ({pools.length})
            </span>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {pools.map((p) => {
                const isSelected = selectedPool && (selectedPool.tokenId === p.tokenId || selectedPool.id === p.tokenId);
                return (
                  <div
                    key={p.tokenId}
                    onClick={() => {
                      setSelectedPool(p);
                      setClaimStatus(null);
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#092b52]/90 to-[#04162e]/90 border-cyan-400 shadow-[0_0_20px_rgba(0,210,255,0.25)]'
                        : 'bg-[#020712] border-cyan-500/20 hover:border-cyan-400/50 hover:bg-[#051329]/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#01040a] border border-cyan-500/30 overflow-hidden shrink-0 p-0.5">
                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover rounded-lg" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-white text-xs font-heading font-bold truncate">{p.name}</h4>
                        <span className="text-[11px] font-mono text-[#00d2ff] font-bold">${p.symbol}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0 font-mono text-xs">
                      <span className="text-slate-400 block text-[10px]">VAULT</span>
                      <span className="text-[#00ffa3] font-bold">
                        {p.faucet?.poolBalance ? p.faucet.poolBalance.toLocaleString() : '0'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Telepathic Marine Terminal */}
          <div className="lg:col-span-8">
            {selectedPool ? (
              <div className="p-5 sm:p-6 rounded-3xl bg-[#020712] border border-cyan-400/30 space-y-4 shadow-xl">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-cyan-500/20">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#01040a] border-2 border-cyan-500/40 overflow-hidden p-0.5 shadow-md">
                      <img src={selectedPool.imageUrl} alt={selectedPool.name} className="w-full h-full object-cover rounded-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white font-heading flex items-center gap-2">
                        <span>{selectedPool.name}</span>
                        <span className="text-[#00d2ff] text-xs font-mono font-bold">(${selectedPool.symbol})</span>
                      </h3>
                      <span className="text-xs font-mono text-slate-300">
                        Drop Payout: <strong className="text-[#00ffa3]">{selectedPool.faucet?.claimAmount?.toLocaleString()}</strong> ${selectedPool.symbol}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsFeedModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-[#04142c] hover:bg-[#07244e] border border-cyan-500/40 text-cyan-200 text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-sm shrink-0"
                  >
                    <Coins className="w-3.5 h-3.5 text-[#00d2ff]" />
                    <span>Deposit to Vault</span>
                  </button>
                </div>

                {/* Vault Capacity Meters */}
                <div className="grid grid-cols-3 gap-2.5 font-mono text-xs text-center">
                  <div className="bg-[#01040a] p-3 rounded-2xl border border-cyan-500/20">
                    <span className="text-slate-400 block text-[10px]">AVAILABLE DRIP</span>
                    <span className="font-bold text-[#00ffa3] text-sm">
                      {selectedPool.faucet?.poolBalance?.toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-[#01040a] p-3 rounded-2xl border border-cyan-500/20">
                    <span className="text-slate-400 block text-[10px]">TOTAL DISPATCHED</span>
                    <span className="font-bold text-white text-sm">
                      {selectedPool.faucet?.totalClaimed?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="bg-[#01040a] p-3 rounded-2xl border border-cyan-500/20">
                    <span className="text-slate-400 block text-[10px]">INTERVAL</span>
                    <span className="font-bold text-white text-sm">
                      {selectedPool.faucet?.cooldownHours || 6}h
                    </span>
                  </div>
                </div>

                {/* Telepathic Riddle Terminal */}
                {selectedPool.faucet?.claimMode === 'ai_challenge' ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-cyan-300 font-bold flex items-center gap-2">
                        <Radio className="w-3.5 h-3.5 text-[#00ffa3] animate-pulse" />
                        <span>Telepathic Riddle Transceiver</span>
                      </span>
                      {challengePassed ? (
                        <span className="text-[#00ffa3] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> VERIFIED
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">Solve riddle to unlock payout</span>
                      )}
                    </div>

                    {/* Chat Messages */}
                    <div className="bg-[#01040a] rounded-2xl p-3.5 border border-cyan-500/25 max-h-[130px] overflow-y-auto space-y-2 font-mono text-xs">
                      {chatMessages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-xl leading-relaxed ${
                            msg.sender === 'agent'
                              ? 'bg-[#08152b] border border-cyan-500/30 text-cyan-200'
                              : 'bg-[#030e20] border border-white/10 text-white ml-6'
                          }`}
                        >
                          <span className="text-[10px] text-[#00ffa3] block font-bold mb-0.5">
                            {msg.sender === 'agent' ? `$${selectedPool.symbol} Entity:` : 'You:'}
                          </span>
                          {msg.text}
                        </div>
                      ))}
                    </div>

                    {/* Chat Input */}
                    {!challengePassed && (
                      <form onSubmit={handleSendChatMessage} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Transmit riddle answer..."
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          disabled={isAgentThinking}
                          className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#01040a] border border-cyan-500/30 text-white text-xs font-mono focus:outline-none focus:border-[#00d2ff]"
                        />
                        <button
                          type="submit"
                          disabled={isAgentThinking || !chatInput.trim()}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00d2ff] to-[#00ffa3] text-[#020712] text-xs font-mono font-black flex items-center gap-2 transition-all disabled:opacity-50 shadow-md"
                        >
                          <Send className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </form>
                    )}
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-[#01040a] border border-cyan-500/20 text-xs font-mono text-slate-300">
                    <span>Instant drip vault active. Connect Phantom wallet to claim directly.</span>
                  </div>
                )}

                {/* Status Banner */}
                {claimStatus && (
                  <div
                    className={`p-3 rounded-2xl border text-xs font-mono flex items-center gap-2.5 ${
                      claimStatus.type === 'success'
                        ? 'bg-[#00ffa3]/10 border-[#00ffa3]/40 text-[#00ffa3]'
                        : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                    }`}
                  >
                    {claimStatus.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0" />
                    )}
                    <span>{claimStatus.message}</span>
                  </div>
                )}

                {/* Claim Action Button */}
                <button
                  onClick={handleClaim}
                  disabled={loading || (selectedPool.faucet?.claimMode === 'ai_challenge' && !challengePassed)}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#00d2ff] to-[#00ffa3] text-[#020712] font-heading font-black text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,210,255,0.4)] disabled:opacity-50 transition-all active:scale-95"
                >
                  <Droplets className="w-4 h-4 fill-current" />
                  <span>{loading ? 'DISPATCHING FROM ABYSS...' : `CLAIM ${selectedPool.faucet?.claimAmount?.toLocaleString()} $${selectedPool.symbol}`}</span>
                </button>

              </div>
            ) : (
              <div className="p-12 rounded-3xl bg-[#020712] border border-cyan-500/25 text-center text-slate-400 font-mono text-xs">
                Select an active vault from the list.
              </div>
            )}
          </div>

        </div>

        {/* Feed Modal */}
        {isFeedModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="w-full max-w-sm p-6 rounded-3xl bg-[#030b18] border-2 border-cyan-400/50 relative space-y-4 shadow-2xl">
              <button
                onClick={() => setIsFeedModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white font-mono text-xs"
              >
                ✕
              </button>
              <h3 className="text-base font-bold text-white font-heading">
                Deposit to ${selectedPool?.symbol} Vault
              </h3>
              <form onSubmit={handleFeedVault} className="space-y-3 font-mono text-xs">
                <input
                  type="number"
                  placeholder="Token amount..."
                  value={feedAmount}
                  onChange={(e) => setFeedAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#01040a] border border-cyan-500/30 text-white focus:outline-none focus:border-[#00d2ff]"
                />
                {feedSuccessMsg && (
                  <span className="text-[#00ffa3] text-xs block">{feedSuccessMsg}</span>
                )}
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00d2ff] to-[#00ffa3] text-[#020712] font-heading font-black text-xs"
                >
                  Confirm Deposit
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default FaucetView;
