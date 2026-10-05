import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Droplets, Brain, Zap, Send, CheckCircle2, AlertCircle, Coins, MessageSquare, Waves, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import BorderGlow from './BorderGlow';

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
                <Droplets className="w-3 h-3 text-[#00ffa3]" />
                <span className="font-semibold">05 / DEEP-SEA TREASURY VAULTS</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-heading">
                Autonomous Marine Liquidity Faucets
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* Left Column: Pool List */}
            <div className="lg:col-span-4 space-y-2.5">
              <span className="text-xs font-mono text-slate-300 font-semibold block">
                ACTIVE TREASURY VAULTS ({pools.length})
              </span>

              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {pools.map((p) => {
                  const isSelected = selectedPool && (selectedPool.tokenId === p.tokenId || selectedPool.id === p.tokenId);
                  return (
                    <button
                      key={p.tokenId}
                      onClick={() => {
                        setSelectedPool(p);
                        setClaimStatus(null);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2.5 ${
                        isSelected
                          ? 'bg-[#08152b] border-[#00d2ff] shadow-[0_0_15px_rgba(0,210,255,0.25)]'
                          : 'bg-[#020712] border-cyan-500/20 hover:border-cyan-400/50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-[#01040a] border border-cyan-500/30 overflow-hidden shrink-0 p-0.5">
                          <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover rounded-md" />
                        </div>
                        <div className="min-w-0">
                          <strong className="text-white text-xs block font-heading truncate">{p.name}</strong>
                          <span className="text-[11px] font-mono text-[#00d2ff] font-bold">${p.symbol}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0 font-mono text-xs">
                        <span className="text-slate-400 block text-[10px]">VAULT</span>
                        <span className="text-[#00ffa3] font-bold">
                          {p.faucet?.poolBalance ? p.faucet.poolBalance.toLocaleString() : '0'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Claim & AI Riddle Terminal */}
            <div className="lg:col-span-8">
              {selectedPool ? (
                <div className="p-4 sm:p-5 rounded-2xl bg-[#020712] border border-cyan-400/30 space-y-4 shadow-lg">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-cyan-500/20">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-[#01040a] border border-cyan-500/40 overflow-hidden p-0.5">
                        <img src={selectedPool.imageUrl} alt={selectedPool.name} className="w-full h-full object-cover rounded-lg" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
                          <span>{selectedPool.name}</span>
                          <span className="text-[#00d2ff] text-xs font-mono font-bold">(${selectedPool.symbol})</span>
                        </h3>
                        <span className="text-[11px] font-mono text-slate-300">
                          Payout: <strong className="text-[#00ffa3]">{selectedPool.faucet?.claimAmount?.toLocaleString()}</strong> ${selectedPool.symbol}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsFeedModalOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-[#01040a] hover:bg-[#08152b] border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <Coins className="w-3.5 h-3.5 text-[#00d2ff]" />
                      <span>Deposit to Vault</span>
                    </button>
                  </div>

                  {/* Stats Bar */}
                  <div className="grid grid-cols-3 gap-2 font-mono text-xs text-center">
                    <div className="bg-[#01040a] p-2 rounded-xl border border-cyan-500/20">
                      <span className="text-slate-400 block text-[10px]">AVAILABLE POOL</span>
                      <span className="font-bold text-[#00ffa3] text-sm">
                        {selectedPool.faucet?.poolBalance?.toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-[#01040a] p-2 rounded-xl border border-cyan-500/20">
                      <span className="text-slate-400 block text-[10px]">DISPATCHED</span>
                      <span className="font-bold text-white text-sm">
                        {selectedPool.faucet?.totalClaimed?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div className="bg-[#01040a] p-2 rounded-xl border border-cyan-500/20">
                      <span className="text-slate-400 block text-[10px]">COOLDOWN</span>
                      <span className="font-bold text-white text-sm">
                        {selectedPool.faucet?.cooldownHours || 6}h
                      </span>
                    </div>
                  </div>

                  {/* AI Riddle Gate */}
                  {selectedPool.faucet?.claimMode === 'ai_challenge' ? (
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-200 font-semibold flex items-center gap-1.5">
                          <Brain className="w-3.5 h-3.5 text-[#00d2ff]" />
                          <span>Marine Telepathic Channel</span>
                        </span>
                        {challengePassed ? (
                          <span className="text-[#00ffa3] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Solve riddle to verify</span>
                        )}
                      </div>

                      {/* Chat Messages Log */}
                      <div className="bg-[#01040a] rounded-xl p-3 border border-cyan-500/20 max-h-[120px] overflow-y-auto space-y-2 font-mono text-xs">
                        {chatMessages.map((msg, idx) => (
                          <div
                            key={idx}
                            className={`p-2 rounded-lg leading-relaxed ${
                              msg.sender === 'agent'
                                ? 'bg-[#08152b]/80 border border-cyan-500/30 text-cyan-200'
                                : 'bg-[#030a16] border border-white/10 text-white ml-6'
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
                            placeholder="Answer the riddle..."
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            disabled={isAgentThinking}
                            className="flex-1 px-3 py-2 rounded-xl bg-[#01040a] border border-cyan-500/30 text-white text-xs font-mono focus:outline-none focus:border-[#00d2ff]"
                          />
                          <button
                            type="submit"
                            disabled={isAgentThinking || !chatInput.trim()}
                            className="px-4 py-2 rounded-xl bg-[#08152b] border border-cyan-500/40 text-[#00d2ff] hover:bg-[#0c2244] text-xs font-mono font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </form>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-[#01040a] border border-cyan-500/20 text-xs font-mono text-slate-300">
                      <span>Instant drip pool active. Connect Phantom wallet to claim directly.</span>
                    </div>
                  )}

                  {/* Status Banner */}
                  {claimStatus && (
                    <div
                      className={`p-2.5 rounded-xl border text-xs font-mono flex items-center gap-2 ${
                        claimStatus.type === 'success'
                          ? 'bg-[#00ffa3]/10 border-[#00ffa3]/30 text-[#00ffa3]'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
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

                  {/* Claim Button */}
                  <button
                    onClick={handleClaim}
                    disabled={loading || (selectedPool.faucet?.claimMode === 'ai_challenge' && !challengePassed)}
                    className="btn-primary w-full py-2.5 rounded-xl text-xs font-bold font-mono flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,210,255,0.3)] disabled:opacity-50"
                  >
                    <Droplets className="w-4 h-4" />
                    <span>{loading ? 'Dispatched from Deep Abyss...' : `Claim ${selectedPool.faucet?.claimAmount?.toLocaleString()} $${selectedPool.symbol}`}</span>
                  </button>

                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-[#020712] border border-cyan-500/25 text-center text-slate-400 font-mono text-xs">
                  Select a treasury vault from the left.
                </div>
              )}
            </div>

          </div>

          {/* Feed Modal */}
          {isFeedModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <div className="w-full max-w-sm p-5 rounded-2xl bg-[#030914] border border-cyan-400/40 relative space-y-3 shadow-2xl">
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
                    placeholder="Token quantity..."
                    value={feedAmount}
                    onChange={(e) => setFeedAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#01040a] border border-cyan-500/30 text-white focus:outline-none focus:border-[#00d2ff]"
                  />
                  {feedSuccessMsg && (
                    <span className="text-[#00ffa3] text-[11px] block">{feedSuccessMsg}</span>
                  )}
                  <button
                    type="submit"
                    className="btn-primary w-full py-2 rounded-xl font-bold"
                  >
                    Confirm Deposit
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      </BorderGlow>
    </div>
  );
}

export default FaucetView;
