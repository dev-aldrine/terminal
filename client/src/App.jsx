import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PhantomWalletButton } from './components/PhantomWalletButton';
import { VersionedTransaction, Transaction, SystemProgram, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import confetti from 'canvas-confetti';
import { ContractBar } from './components/ContractBar';
import { StepNavigation } from './components/StepNavigation';
import { ScrollIntroView } from './components/ScrollIntroView';
import { FishStudio } from './components/FishStudio';
import { TokenForm } from './components/TokenForm';
import { OceanAquarium } from './components/OceanAquarium';
import { FaucetView } from './components/FaucetView';
import { AgentTerminalView } from './components/AgentTerminalView';
import { SuccessModal } from './components/SuccessModal';
import { Waves, Sparkles, Droplets, Terminal, Shield } from 'lucide-react';

const PROTOCOL_FEE_SOL = 0.02;
const TREASURY_WALLET = '7jMX3CSDvXu3DfKewrepvAyYTGZ4h1VWRzuDB14tPau4';

export function App() {
  const { publicKey, signTransaction, sendTransaction, connected } = useWallet();
  const { connection } = useConnection();

  // Navigation steps: 1 = Intro/How it works, 2 = Fish Studio, 3 = Agent/Faucet Form, 4 = Aquarium, 5 = Faucets, 6 = Telemetry
  const [currentStep, setCurrentStep] = useState(1);
  const [siteConfig, setSiteConfig] = useState({ ca: '', twitter: '' });
  const [tokens, setTokens] = useState([]);
  const [selectedSpecies, setSelectedSpecies] = useState('neon_angler');
  const [imageDataUrl, setImageDataUrl] = useState(null);
  const [preselectedFaucetToken, setPreselectedFaucetToken] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    description: '',
    species: 'neon_angler',
    strategy: 'Dip Sniper & Deep Alpha',
    riskProfile: 'Aggressive',
    initialBuySol: '0',
    slippage: '10',
    twitter: '',
    telegram: '',
    website: '',
    faucetEnabled: true,
    faucetClaimAmount: '5000',
    faucetClaimMode: 'ai_challenge',
    faucetChallengePrompt: 'What is the lifeblood of the Solana deep-sea trench?',
    faucetChallengeAnswer: 'liquidity'
  });

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [successData, setSuccessData] = useState(null);

  // Fetch launched tokens
  const fetchLaunchedTokens = async () => {
    try {
      const res = await fetch('/api/launched-coins');
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.tokens) {
        setTokens(data.tokens);
      }
    } catch (err) {
      console.error('Error fetching launched tokens:', err);
    }
  };

  // Fetch site config
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/config');
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.success) {
          setSiteConfig({
            ca: data.ca || '',
            twitter: data.twitter || ''
          });
        }
      } catch (err) {}
    };

    fetchConfig();
    fetchLaunchedTokens();
    const interval = setInterval(fetchLaunchedTokens, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveFish = (dataUrl, species) => {
    setImageDataUrl(dataUrl);
    setSelectedSpecies(species);
    handleFormChange('species', species);
    setCurrentStep(3); // Proceed to Token Form
  };

  const handleLaunch = async () => {
    if (!connected || !publicKey) {
      alert('Please connect your Phantom or Solana wallet first!');
      return;
    }

    if (!imageDataUrl) {
      alert('Please design your fish in Step 2 before launching!');
      setCurrentStep(2);
      return;
    }

    if (!formData.name || !formData.symbol) {
      alert('Please fill in the Agent Name and Ticker Symbol.');
      return;
    }

    try {
      setLoading(true);

      // Step 1: Protocol Fee
      setStatusMessage('1/4 Confirming 0.02 SOL AgenSea protocol fee in Phantom...');
      const feeTx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(TREASURY_WALLET),
          lamports: Math.round(PROTOCOL_FEE_SOL * LAMPORTS_PER_SOL)
        })
      );

      let blockhash, lastValidBlockHeight;
      try {
        const bhRes = await fetch('/api/latest-blockhash');
        if (bhRes.ok) {
          const bhData = await bhRes.json();
          if (bhData.blockhash) {
            blockhash = bhData.blockhash;
            lastValidBlockHeight = bhData.lastValidBlockHeight;
          }
        }
      } catch (e) {}

      if (!blockhash) {
        const latest = await connection.getLatestBlockhash('confirmed');
        blockhash = latest.blockhash;
        lastValidBlockHeight = latest.lastValidBlockHeight;
      }

      feeTx.recentBlockhash = blockhash;
      feeTx.feePayer = publicKey;

      const feeSignature = await sendTransaction(feeTx, connection);
      setStatusMessage('Verifying protocol fee on Solana...');
      try {
        await connection.confirmTransaction({ signature: feeSignature, blockhash, lastValidBlockHeight }, 'confirmed');
      } catch (confirmErr) {
        console.warn('Confirmation proceed:', confirmErr.message);
      }

      // Step 2: Upload metadata & artwork to IPFS
      setStatusMessage('2/4 Uploading AI Fish metadata to IPFS...');

      const res = await fetch(imageDataUrl);
      const blob = await res.blob();

      const metaPayload = new FormData();
      metaPayload.append('file', blob, 'agensea-fish.png');
      metaPayload.append('name', formData.name);
      metaPayload.append('symbol', formData.symbol);
      metaPayload.append('description', formData.description || `Autonomous Marine AI Creature on AgenSea 🌊`);
      metaPayload.append('species', formData.species);
      metaPayload.append('strategy', formData.strategy);
      metaPayload.append('riskProfile', formData.riskProfile);
      if (formData.twitter) metaPayload.append('twitter', formData.twitter);
      if (formData.telegram) metaPayload.append('telegram', formData.telegram);
      if (formData.website) metaPayload.append('website', formData.website);

      const ipfsRes = await fetch('/api/upload-metadata', {
        method: 'POST',
        body: metaPayload
      });

      const ipfsData = await ipfsRes.json();
      if (!ipfsRes.ok || !ipfsData.metadataUri) {
        throw new Error(ipfsData.details || ipfsData.error || 'Failed to upload metadata to IPFS');
      }

      // Step 3: Generate PumpPortal Transaction
      setStatusMessage('3/4 Generating PumpPortal bonding curve transaction...');

      const launchTxRes = await fetch('/api/create-launch-tx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicKey: publicKey.toBase58(),
          tokenMetadata: {
            name: formData.name,
            symbol: formData.symbol,
            uri: ipfsData.metadataUri
          },
          initialBuySol: Number(formData.initialBuySol) || 0,
          slippage: Number(formData.slippage) || 10,
          priorityFee: 0.0005
        })
      });

      const launchTxData = await launchTxRes.json();
      if (!launchTxRes.ok || !launchTxData.transactionBase64) {
        throw new Error(launchTxData.details || launchTxData.error || 'Failed to construct token transaction');
      }

      // Step 4: Sign & Broadcast
      setStatusMessage('4/4 Sign transaction in your Phantom wallet...');

      const txBuffer = Buffer.from(launchTxData.transactionBase64, 'base64');
      const transaction = VersionedTransaction.deserialize(txBuffer);
      const signedTransaction = await signTransaction(transaction);
      const signedTxBase64 = Buffer.from(signedTransaction.serialize()).toString('base64');

      setStatusMessage('Broadcasting Marine Agent launch to Solana...');

      const broadcastRes = await fetch('/api/broadcast-tx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signedTxBase64,
          tokenInfo: {
            name: formData.name,
            symbol: formData.symbol,
            description: formData.description,
            mintPublicKey: launchTxData.mintPublicKey,
            imageUrl: ipfsData.imageUrl || imageDataUrl,
            species: formData.species,
            strategy: formData.strategy,
            riskProfile: formData.riskProfile,
            initialBuySol: Number(formData.initialBuySol) || 0,
            creator: publicKey.toBase58(),
            faucet: {
              enabled: formData.faucetEnabled !== false,
              poolBalance: formData.faucetEnabled ? 500000 : 0,
              totalClaimed: 0,
              claimAmount: Number(formData.faucetClaimAmount) || 5000,
              claimMode: formData.faucetClaimMode || 'ai_challenge',
              challengePrompt: formData.faucetChallengePrompt || 'What is the lifeblood of the Solana deep-sea trench?',
              challengeAnswer: formData.faucetChallengeAnswer || 'liquidity',
              cooldownHours: 6,
              claimHistory: []
            }
          }
        })
      });

      const broadcastData = await broadcastRes.json();
      if (!broadcastRes.ok) {
        throw new Error(broadcastData.details || broadcastData.error || 'Broadcast failed');
      }

      setSuccessData({
        name: formData.name,
        symbol: formData.symbol,
        mintPublicKey: launchTxData.mintPublicKey,
        signature: broadcastData.signature,
        imageUrl: imageDataUrl
      });

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });

      fetchLaunchedTokens();
    } catch (err) {
      console.error('Launch Error:', err);
      alert('Launch Failed: ' + err.message);
    } finally {
      setLoading(false);
      setStatusMessage('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#030712] text-slate-100 relative">
      
      {/* Top Banner */}
      <ContractBar
        siteConfig={siteConfig}
        totalSpawned={tokens.length}
        activeFaucets={tokens.filter((t) => t.faucet?.enabled).length}
      />

      {/* Main Navbar */}
      <header className="w-full border-b border-cyan-500/20 bg-[#061226]/80 backdrop-blur-xl py-3 px-6 sticky top-[41px] z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div
            onClick={() => setCurrentStep(1)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-cyan-950 border border-cyan-400/50 flex items-center justify-center shadow-[0_0_20px_rgba(0,245,255,0.4)] group-hover:scale-105 transition-transform">
              <span className="text-2xl">🌊</span>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight font-heading flex items-center gap-1.5">
                <span className="text-white">Agen</span>
                <span className="text-gradient-cyan">Sea</span>
              </h1>
              <span className="text-[10px] font-mono tracking-widest text-cyan-400 block -mt-1 font-semibold">
                AUTONOMOUS MARINE LAUNCHPAD
              </span>
            </div>
          </div>

          {/* Wallet Button */}
          <div className="flex items-center gap-3">
            <PhantomWalletButton />
          </div>

        </div>
      </header>

      {/* Navigation Sub-bar */}
      <StepNavigation
        currentStep={currentStep}
        onStepChange={(step) => setCurrentStep(step)}
        canNavigateToLaunch={!!imageDataUrl}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 pb-16">
        
        {/* Step 1: Scrollable Interactive Intro */}
        {currentStep === 1 && (
          <ScrollIntroView
            onLaunchNow={() => setCurrentStep(2)}
            onExploreOcean={() => setCurrentStep(4)}
          />
        )}

        {/* Step 2: Fish DNA Studio */}
        {currentStep === 2 && (
          <FishStudio
            onSaveFish={handleSaveFish}
            selectedSpecies={selectedSpecies}
            setSelectedSpecies={setSelectedSpecies}
          />
        )}

        {/* Step 3: Agent & Faucet Form */}
        {currentStep === 3 && (
          <TokenForm
            formData={formData}
            onFormChange={handleFormChange}
            onLaunch={handleLaunch}
            loading={loading}
            statusMessage={statusMessage}
            imageDataUrl={imageDataUrl}
            selectedSpecies={selectedSpecies}
            onBackToStudio={() => setCurrentStep(2)}
          />
        )}

        {/* Step 4: The Ocean Aquarium */}
        {currentStep === 4 && (
          <OceanAquarium
            tokens={tokens}
            onSelectTokenForFaucet={(token) => {
              setPreselectedFaucetToken(token);
              setCurrentStep(5);
            }}
            onOpenTerminal={() => setCurrentStep(6)}
            onSpawnNew={() => setCurrentStep(2)}
          />
        )}

        {/* Step 5: Autonomous Faucet Protocol (Faucet Pad) */}
        {currentStep === 5 && (
          <FaucetView preselectedToken={preselectedFaucetToken} />
        )}

        {/* Step 6: Live Telemetry & Thought Stream */}
        {currentStep === 6 && (
          <AgentTerminalView />
        )}

      </main>

      {/* Launch Success Modal */}
      {successData && (
        <SuccessModal
          data={successData}
          onClose={() => {
            setSuccessData(null);
            setCurrentStep(4);
          }}
        />
      )}

      {/* Footer */}
      <footer className="w-full border-t border-cyan-500/20 py-6 px-4 bg-[#030814] text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 AgenSea Protocol. Autonomous Marine Entities on Solana Pump.fun.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="hover:text-cyan-400 cursor-pointer" onClick={() => setCurrentStep(1)}>How It Works</span>
            <span className="hover:text-cyan-400 cursor-pointer" onClick={() => setCurrentStep(4)}>The Ocean</span>
            <span className="hover:text-cyan-400 cursor-pointer" onClick={() => setCurrentStep(5)}>Faucet Vaults</span>
            <span className="hover:text-cyan-400 cursor-pointer" onClick={() => setCurrentStep(6)}>Telemetry Radar</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
