import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Droplets, Sparkles, Brain, Zap, Send, CheckCircle2, AlertCircle, Clock, HeartHandshake, ShieldCheck, Terminal, Coins } from 'lucide-react';
import confetti from 'canvas-confetti';

export function FaucetView({ preselectedToken = null }) {
  const { publicKey, connected } = useWallet();
  const [faucets, setFaucets] = useState([]);
  const [selectedFaucet, setSelectedFaucet] = useState(preselectedToken || null);
  const [loading, setLoading] = useState(false);
  const [claimStatus, setClaimStatus] = useState(null); // { type: 'success'|'error', message: '' }
  
  // AI Riddle / Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isAgentThinking, setIsAgentThinking] = useState(false);
  const [challengePassed, setChallengePassed] = useState(false);

  // Feed Vault Modal State
  const [isFeedModalOpen, setIsFeedModalOpen] = useState(false);
  const [feedAmount, setFeedAmount] = useState('');
  const [feedSuccessMsg, setFeedSuccessMsg] = useState('');

  // Fetch all faucets
  const fetchFaucets = async () => {
    try {
      const res = await fetch('/api/faucets');
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.success) {
        setFaucets(data.faucets);
        if (!selectedFaucet && data.faucets.length > 0) {
          setSelectedFaucet(data.faucets[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch faucets:', err);
    }
  };

  useEffect(() => {
    fetchFaucets();
    const interval = setInterval(fetchFaucets, 5000);
    return () => clearInterval(interval);
  }, []);

  // Update selected faucet if preselectedToken changes
  useEffect(() => {
    if (preselectedToken) {
      setSelectedFaucet(preselectedToken);
    }
  }, [preselectedToken]);

  // Reset chat when switching faucet
  useEffect(() => {
    if (selectedFaucet && selectedFaucet.faucet?.claimMode === 'ai_challenge') {
      setChatMessages([
        {
          sender: 'agent',
          text: `*Bioluminescent signals activate* "Greetings diver. To claim from my treasury, you must answer my riddle: '${selectedFaucet.faucet.challengePrompt || 'What is the secret fuel of the Solana ocean depths?'}'"`
        }
      ]);
      setChallengePassed(false);
      setClaimStatus(null);
    }
  }, [selectedFaucet]);

  // Send message to Agent AI Mind
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
          tokenId: selectedFaucet.tokenId || selectedFaucet.id,
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
      setChatMessages((prev) => [...prev, { sender: 'agent', text: 'Connection to deep-sea core interrupted.' }]);
    } finally {
      setIsAgentThinking(false);
    }
  };

  // Execute Claim Request
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
          tokenId: selectedFaucet.tokenId || selectedFaucet.id,
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
        message: `Successfully claimed ${data.amountClaimed.toLocaleString()} $${selectedFaucet.symbol}! Tokens dispatched to your wallet.`
      });

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      fetchFaucets();
    } catch (err) {
      setClaimStatus({
        type: 'error',
        message: err.message || 'Failed to claim tokens'
      });
    } finally {
      setLoading(false);
    }
  };

  // Feed Vault (Community Deposit)
  const handleFeedVault = async (e) => {
    e.preventDefault();
    if (!feedAmount || Number(feedAmount) <= 0) return;

    try {
      const res = await fetch('/api/faucets/feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenId: selectedFaucet.tokenId || selectedFaucet.id,
          feederWallet: publicKey ? publicKey.toBase58() : 'Anonymous Diver',
          amount: Number(feedAmount)
        })
      });

      const data = await res.json();
      if (data && data.success) {
        setFeedSuccessMsg(`Fed ${Number(feedAmount).toLocaleString()} tokens to $${selectedFaucet.symbol} Faucet Vault!`);
        setFeedAmount('');
        fetchFaucets();
        setTimeout(() => {
          setIsFeedModalOpen(false);
          setFeedSuccessMsg('');
        }, 2000);
      }
    } catch (err) {
      alert('Failed to deposit tokens: ' + err.message);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-6 px-4">
      
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-mono text-xs mb-3">
          <Droplets className="w-3.5 h-3.5" />
          <span>AUTONOMOUS FAUCET PROTOCOL (FAUPAD TECH)</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-2">
          Ocean Treasury & <span className="text-gradient-cyan">Feeding Vaults</span>
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base">
          Community-powered token faucets. Complete AI cognitive challenges, solve deep-sea riddles, or claim instant drips.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Active Faucets List */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono mb-2">
            Active Faucet Vaults ({faucets.length})
          </h3>

          <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
            {faucets.map((f) => {
              const isSelected = selectedFaucet && (selectedFaucet.tokenId === f.tokenId || selectedFaucet.id === f.tokenId);
              return (
                <button
                  key={f.tokenId}
                  onClick={() => {
                    setSelectedFaucet(f);
                    setClaimStatus(null);
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_20px_rgba(0,245,255,0.2)]'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-cyan-500/30 overflow-hidden shrink-0">
                      <img src={f.imageUrl} alt={f.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-white text-sm truncate">{f.name}</h4>
                      <span className="text-xs font-mono text-cyan-400 font-semibold">${f.symbol}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 font-mono text-xs">
                    <span className="text-slate-400 block text-[10px]">VAULT POOL</span>
                    <span className="text-emerald-400 font-bold">
                      {f.faucet?.poolBalance ? f.faucet.poolBalance.toLocaleString() : '0'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Faucet Terminal & Claim Dashboard */}
        <div className="lg:col-span-8">
          {selectedFaucet ? (
            <div className="glass-panel rounded-3xl p-6 border border-cyan-500/30 space-y-6">
              
              {/* Selected Faucet Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-950 border-2 border-cyan-400 overflow-hidden shadow-[0_0_20px_rgba(0,245,255,0.3)]">
                    <img src={selectedFaucet.imageUrl} alt={selectedFaucet.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold text-white flex items-center gap-2">
                      <span>{selectedFaucet.name}</span>
                      <span className="text-cyan-400 text-sm font-mono font-bold">(${selectedFaucet.symbol})</span>
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
                        {selectedFaucet.faucet?.claimMode === 'ai_challenge' ? '🧠 AI RIDDLE CHALLENGE' : '⚡ INSTANT DRIP'}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        Drop: <strong className="text-white">{selectedFaucet.faucet?.claimAmount?.toLocaleString()}</strong> ${selectedFaucet.symbol}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsFeedModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-cyan-950 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 self-start sm:self-auto transition-all"
                >
                  <Coins className="w-4 h-4 text-cyan-400" />
                  <span>Feed Pool (Deposit)</span>
                </button>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-3 font-mono text-xs">
                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">AVAILABLE TREASURY</span>
                  <span className="text-lg font-bold text-emerald-400">
                    {selectedFaucet.faucet?.poolBalance?.toLocaleString()} <span className="text-xs">${selectedFaucet.symbol}</span>
                  </span>
                </div>
                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">TOTAL DISPATCHED</span>
                  <span className="text-lg font-bold text-cyan-400">
                    {selectedFaucet.faucet?.totalClaimed?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">COOLDOWN WINDOW</span>
                  <span className="text-lg font-bold text-white">
                    {selectedFaucet.faucet?.cooldownHours || 6}h
                  </span>
                </div>
              </div>

              {/* Interactive Claim Area */}
              {selectedFaucet.faucet?.claimMode === 'ai_challenge' ? (
                /* AI CHAT TERMINAL CHALLENGE */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                      <Brain className="w-4 h-4 text-cyan-400" />
                      <span>AI Creature Cognitive Gateway</span>
                    </span>
                    {challengePassed ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-400 text-emerald-300 font-mono text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>AI VIBE CHECK PASSED</span>
                      </span>
                    ) : (
                      <span className="text-xs font-mono text-amber-400">Answer the riddle to unlock claim</span>
                    )}
                  </div>

                  {/* Chat Box */}
                  <div className="terminal-window rounded-2xl p-4 h-52 overflow-y-auto space-y-3">
                    {chatMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex flex-col text-xs font-mono ${
                          msg.sender === 'user' ? 'items-end' : 'items-start'
                        }`}
                      >
                        <span className="text-[10px] text-slate-500 mb-0.5">
                          {msg.sender === 'user' ? 'DIVER' : selectedFaucet.name.toUpperCase()}
                        </span>
                        <div
                          className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${
                            msg.sender === 'user'
                              ? 'bg-cyan-950/80 border border-cyan-500/40 text-cyan-200'
                              : 'bg-slate-900 border border-slate-800 text-slate-200'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {isAgentThinking && (
                      <div className="text-xs font-mono text-cyan-400 animate-pulse">
                        *AI Creature evaluating resonance currents...*
                      </div>
                    )}
                  </div>

                  {/* Chat Input */}
                  <form onSubmit={handleSendChatMessage} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type your answer or converse with the AI..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-cyan-500/30 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      type="submit"
                      disabled={isAgentThinking}
                      className="ocean-btn-primary px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Transmit</span>
                    </button>
                  </form>
                </div>
              ) : (
                /* INSTANT DRIP MODE */
                <div className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800 text-center space-y-3">
                  <Droplets className="w-8 h-8 text-emerald-400 mx-auto animate-bounce" />
                  <h4 className="text-base font-bold text-white font-mono">Instant Deep-Sea Drip Ready</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Claim {selectedFaucet.faucet?.claimAmount?.toLocaleString()} ${selectedFaucet.symbol} directly to your connected Solana wallet once every {selectedFaucet.faucet?.cooldownHours || 6} hours.
                  </p>
                </div>
              )}

              {/* Status Alert */}
              {claimStatus && (
                <div
                  className={`p-4 rounded-xl border text-xs font-mono flex items-center gap-2.5 ${
                    claimStatus.type === 'success'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                      : 'bg-rose-950/80 border-rose-500 text-rose-300'
                  }`}
                >
                  {claimStatus.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  )}
                  <span>{claimStatus.message}</span>
                </div>
              )}

              {/* Main Claim Button */}
              <button
                onClick={handleClaim}
                disabled={loading || (selectedFaucet.faucet?.claimMode === 'ai_challenge' && !challengePassed)}
                className={`w-full py-4 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl transition-all ${
                  selectedFaucet.faucet?.claimMode === 'ai_challenge' && !challengePassed
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'ocean-btn-emerald'
                }`}
              >
                <Droplets className="w-5 h-5" />
                <span>
                  {loading ? 'Dispatched On-Chain...' : `Claim ${selectedFaucet.faucet?.claimAmount?.toLocaleString()} $${selectedFaucet.symbol}`}
                </span>
              </button>

            </div>
          ) : (
            <div className="glass-panel rounded-3xl p-12 text-center text-slate-400 font-mono text-sm">
              Select a faucet vault from the left to begin feeding.
            </div>
          )}
        </div>

      </div>

      {/* FEED / TOP-UP MODAL */}
      {isFeedModalOpen && selectedFaucet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel-glow w-full max-w-md rounded-3xl p-6 border border-cyan-400/50 shadow-2xl relative space-y-4">
            <button
              onClick={() => setIsFeedModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-mono"
            >
              ✕
            </button>

            <div className="flex items-center gap-3">
              <Coins className="w-6 h-6 text-cyan-400" />
              <h3 className="text-lg font-bold text-white font-mono">Feed ${selectedFaucet.symbol} Vault</h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Donate tokens to keep the autonomous faucet stocked for community members and active divers.
            </p>

            <form onSubmit={handleFeedVault} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 font-mono mb-1 block">Tokens to Deposit</label>
                <input
                  type="number"
                  placeholder="e.g. 50000"
                  value={feedAmount}
                  onChange={(e) => setFeedAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-cyan-500/30 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>

              {feedSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-400 text-emerald-300 text-xs font-mono">
                  {feedSuccessMsg}
                </div>
              )}

              <button
                type="submit"
                className="ocean-btn-primary w-full py-3 rounded-xl font-bold text-xs"
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
