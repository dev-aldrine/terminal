import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Droplets, Brain, Zap, Send, CheckCircle2, AlertCircle, Coins, MessageSquare } from 'lucide-react';
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
    const interval = setInterval(fetchPools, 5000);
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
          text: `*Signals active* "Greetings diver. To verify your claim from my treasury, solve this riddle: '${selectedPool.faucet.challengePrompt || 'What is the secret fuel of the Solana ocean depths?'}'"`
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
      setChatMessages((prev) => [...prev, { sender: 'agent', text: 'Telemetry connection interrupted.' }]);
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
        message: `Claimed ${data.amountClaimed.toLocaleString()} $${selectedPool.symbol}! Tokens dispatched.`
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
    <div className="w-full max-w-6xl mx-auto py-6">
      
      {/* Header */}
      <div className="text-left mb-6 space-y-1">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-[#00e5ff]">
          <span>05 / COMMUNITY TREASURY POOLS</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white font-heading">
          Autonomous Drips & AI Verification
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm">
          Claim from community-funded custody vaults by passing the AI creature's riddle or claiming timed drip drops.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Pool List */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-mono text-slate-400 font-semibold block">ACTIVE TREASURY VAULTS ({pools.length})</span>

          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {pools.map((p) => {
              const isSelected = selectedPool && (selectedPool.tokenId === p.tokenId || selectedPool.id === p.tokenId);
              return (
                <button
                  key={p.tokenId}
                  onClick={() => {
                    setSelectedPool(p);
                    setClaimStatus(null);
                  }}
                  className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#0c1322] border-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.15)]'
                      : 'bg-[#080d17] border-white/[0.06] hover:border-white/[0.2]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded bg-[#05080f] border border-white/[0.1] overflow-hidden shrink-0 p-0.5">
                      <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover rounded" />
                    </div>
                    <div className="min-w-0">
                      <strong className="text-white text-xs block font-heading truncate">{p.name}</strong>
                      <span className="text-[11px] font-mono text-[#00e5ff] font-bold">${p.symbol}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 font-mono text-xs">
                    <span className="text-slate-500 block text-[10px]">VAULT</span>
                    <span className="text-[#00ffa3] font-bold">
                      {p.faucet?.poolBalance ? p.faucet.poolBalance.toLocaleString() : '0'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Claim Terminal */}
        <div className="lg:col-span-8">
          {selectedPool ? (
            <div className="editorial-card p-5 space-y-5">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded bg-[#05080f] border border-white/[0.12] overflow-hidden p-0.5">
                    <img src={selectedPool.imageUrl} alt={selectedPool.name} className="w-full h-full object-cover rounded" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white font-heading flex items-center gap-2">
                      <span>{selectedPool.name}</span>
                      <span className="text-[#00e5ff] text-xs font-mono font-bold">(${selectedPool.symbol})</span>
                    </h3>
                    <span className="text-[11px] font-mono text-slate-400">
                      Claim Payout: <strong className="text-white">{selectedPool.faucet?.claimAmount?.toLocaleString()}</strong> ${selectedPool.symbol}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsFeedModalOpen(true)}
                  className="btn-secondary text-xs font-mono"
                >
                  <Coins className="w-3.5 h-3.5 text-[#00e5ff]" />
                  <span>Deposit to Pool</span>
                </button>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2 font-mono text-xs text-center">
                <div className="bg-[#05080f] p-2.5 rounded border border-white/[0.06]">
                  <span className="text-slate-500 block text-[10px]">AVAILABLE POOL</span>
                  <span className="font-bold text-[#00ffa3] text-sm">
                    {selectedPool.faucet?.poolBalance?.toLocaleString()}
                  </span>
                </div>
                <div className="bg-[#05080f] p-2.5 rounded border border-white/[0.06]">
                  <span className="text-slate-500 block text-[10px]">TOTAL DISPATCHED</span>
                  <span className="font-bold text-white text-sm">
                    {selectedPool.faucet?.totalClaimed?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="bg-[#05080f] p-2.5 rounded border border-white/[0.06]">
                  <span className="text-slate-500 block text-[10px]">COOLDOWN</span>
                  <span className="font-bold text-white text-sm">
                    {selectedPool.faucet?.cooldownHours || 6}h
                  </span>
                </div>
              </div>

              {/* Claim Terminal */}
              {selectedPool.faucet?.claimMode === 'ai_challenge' ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                      <Brain className="w-3.5 h-3.5 text-[#00e5ff]" />
                      <span>AI Cognitive Gate</span>
                    </span>
                    {challengePassed ? (
                      <span className="text-[#00ffa3] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> PASSED
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Solve riddle to verify</span>
                    )}
                  </div>

                  <div className="terminal-window p-3.5 h-44 overflow-y-auto space-y-2.5 text-xs">
                    {chatMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex flex-col ${
                          msg.sender === 'user' ? 'items-end' : 'items-start'
                        }`}
                      >
                        <span className="text-[10px] text-slate-500 mb-0.5">
                          {msg.sender === 'user' ? 'YOU' : selectedPool.name.toUpperCase()}
                        </span>
                        <div
                          className={`p-2 rounded max-w-[85%] leading-relaxed ${
                            msg.sender === 'user'
                              ? 'bg-[#0c1322] border border-[#00e5ff]/30 text-[#00e5ff]'
                              : 'bg-[#080d17] border border-white/[0.06] text-slate-200'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {isAgentThinking && (
                      <div className="text-[11px] font-mono text-[#00e5ff] animate-pulse">
                        *Evaluating response currents...*
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleSendChatMessage} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type your answer..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="flex-1 px-3 py-2 rounded bg-[#05080f] border border-white/[0.1] text-white font-mono text-xs focus:outline-none focus:border-[#00e5ff]"
                    />
                    <button
                      type="submit"
                      disabled={isAgentThinking}
                      className="btn-secondary text-xs font-bold"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send</span>
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-[#05080f] p-4 rounded border border-white/[0.08] text-center space-y-1 font-mono">
                  <span className="text-white text-xs font-bold block">Instant Timed Drip Drop</span>
                  <span className="text-slate-400 text-[11px] block">
                    Claim {selectedPool.faucet?.claimAmount?.toLocaleString()} ${selectedPool.symbol} directly to your wallet.
                  </span>
                </div>
              )}

              {claimStatus && (
                <div
                  className={`p-3 rounded text-xs font-mono flex items-center gap-2 ${
                    claimStatus.type === 'success'
                      ? 'bg-[#00ffa3]/10 border border-[#00ffa3]/30 text-[#00ffa3]'
                      : 'bg-rose-950 border border-rose-500/40 text-rose-300'
                  }`}
                >
                  {claimStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{claimStatus.message}</span>
                </div>
              )}

              <button
                onClick={handleClaim}
                disabled={loading || (selectedPool.faucet?.claimMode === 'ai_challenge' && !challengePassed)}
                className={`w-full py-2.5 text-xs font-bold rounded ${
                  selectedPool.faucet?.claimMode === 'ai_challenge' && !challengePassed
                    ? 'bg-[#0c1322] text-slate-600 cursor-not-allowed border border-white/[0.06]'
                    : 'btn-primary'
                }`}
              >
                <Droplets className="w-4 h-4" />
                <span>
                  {loading ? 'Dispatched...' : `Claim ${selectedPool.faucet?.claimAmount?.toLocaleString()} $${selectedPool.symbol}`}
                </span>
              </button>

            </div>
          ) : (
            <div className="editorial-card p-10 text-center text-slate-500 font-mono text-xs">
              Select a treasury vault from the list.
            </div>
          )}
        </div>

      </div>

      {/* Top Up Modal */}
      {isFeedModalOpen && selectedPool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="editorial-card-highlight w-full max-w-md p-6 relative space-y-4">
            <button
              onClick={() => setIsFeedModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-mono text-xs"
            >
              ✕
            </button>

            <h3 className="text-base font-bold text-white font-heading">
              Deposit to ${selectedPool.symbol} Pool
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              Donate tokens to keep the community treasury funded.
            </p>

            <form onSubmit={handleFeedVault} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-mono mb-1 block">Tokens to Deposit</label>
                <input
                  type="number"
                  placeholder="50000"
                  value={feedAmount}
                  onChange={(e) => setFeedAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#05080f] border border-white/[0.1] text-white font-mono text-xs focus:outline-none focus:border-[#00e5ff]"
                />
              </div>

              {feedSuccessMsg && (
                <div className="p-2 rounded bg-[#00ffa3]/10 border border-[#00ffa3]/30 text-[#00ffa3] text-xs font-mono">
                  {feedSuccessMsg}
                </div>
              )}

              <button
                type="submit"
                className="btn-primary w-full py-2.5 text-xs font-bold"
              >
                Confirm Deposit
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
