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
import LightPillar from './components/LightPillar';

import { Waves } from 'lucide-react';

const GAS_FEE_SOL = 0.0001; // ~0.0001 SOL network gas
const TREASURY_WALLET = '7jMX3CSDvXu3DfKewrepvAyYTGZ4h1VWRzuDB14tPau4';

export function App() {
  const { publicKey, signTransaction, sendTransaction, connected } = useWallet();
  const { connection } = useConnection();

  const [currentStep, setCurrentStep] = useState(1);
  const [siteConfig, setSiteConfig] = useState({ ca: '', twitter: '' });
  const [tokens, setTokens] = useState([]);
  const [selectedSpecies, setSelectedSpecies] = useState('neon_angler');
  const [imageDataUrl, setImageDataUrl] = useState(null);
  const [preselectedToken, setPreselectedToken] = useState(null);

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

  const fetchLaunchedTokens = async () => {
    try {
      const res = await fetch('/api/launched-coins');
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.tokens) {
        setTokens(data.tokens);
      }
    } catch (err) {
      console.error('Error fetching tokens:', err);
    }
  };

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
    setCurrentStep(3);
  };

  const handleLaunch = async () => {
    if (!connected || !publicKey) {
      alert('Please connect your Phantom or Solana wallet first!');
      return;
    }

    if (!imageDataUrl) {
      alert('Please configure creature visuals in Step 2 before launching!');
      setCurrentStep(2);
      return;
    }

    if (!formData.name || !formData.symbol) {
      alert('Please fill in the Agent Name and Ticker Symbol.');
      return;
    }

    try {
      setLoading(true);

      // 1. Gas fee confirmation (~0.0001 SOL)
      setStatusMessage('1/3 Verifying ~0.0001 SOL network gas in wallet...');
      const feeTx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(TREASURY_WALLET),
          lamports: Math.round(GAS_FEE_SOL * LAMPORTS_PER_SOL)
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
      try {
        await connection.confirmTransaction({ signature: feeSignature, blockhash, lastValidBlockHeight }, 'confirmed');
      } catch (confirmErr) {
        console.warn('Confirmation proceed:', confirmErr.message);
      }

      // 2. Upload metadata to IPFS
      setStatusMessage('2/3 Packaging entity artwork & metadata to IPFS...');

      const res = await fetch(imageDataUrl);
      const blob = await res.blob();

      const metaPayload = new FormData();
      metaPayload.append('file', blob, 'agensea-entity.png');
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

      // 3. Create & Broadcast Launch
      setStatusMessage('3/3 Sign token launch in Phantom wallet...');

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
          priorityFee: 0.0001
        })
      });

      const launchTxData = await launchTxRes.json();
      if (!launchTxRes.ok || !launchTxData.transactionBase64) {
        throw new Error(launchTxData.details || launchTxData.error || 'Failed to construct token transaction');
      }

      const txBuffer = Buffer.from(launchTxData.transactionBase64, 'base64');
      const transaction = VersionedTransaction.deserialize(txBuffer);
      const signedTransaction = await signTransaction(transaction);
      const signedTxBase64 = Buffer.from(signedTransaction.serialize()).toString('base64');

      setStatusMessage('Broadcasting token launch to Solana Mainnet...');

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
        particleCount: 100,
        spread: 70,
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
    <div className="min-h-screen flex flex-col bg-[#05080f] text-[#e2e8f0] relative">
      
      {/* Background Light Pillar */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <LightPillar
          topColor="#64b5ff"
          bottomColor="#000184"
          intensity={0.7}
          rotationSpeed={0.3}
          glowAmount={0.006}
          pillarWidth={10}
          pillarHeight={0.1}
          noiseIntensity={0}
          pillarRotation={176}
          interactive={false}
          mixBlendMode="normal"
        />
      </div>

      {/* Top Banner */}
      <ContractBar
        siteConfig={siteConfig}
        totalSpawned={tokens.length}
        activePools={tokens.filter((t) => t.faucet?.enabled).length}
      />

      {/* Main Navbar */}
      <header className="w-full border-b border-cyan-500/15 bg-[#030712]/70 backdrop-blur-xl py-3 px-6 sticky top-[33px] z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          
          <div
            onClick={() => setCurrentStep(1)}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <Waves className="w-5 h-5 text-[#00d2ff]" />
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold tracking-tight font-heading text-white">AGEN</span>
              <span className="text-base font-extrabold tracking-tight font-heading text-[#00d2ff]">SEA</span>
              <span className="text-[10px] font-mono text-cyan-300 ml-1.5 px-2 py-0.5 rounded-full bg-[#071326]/80 border border-cyan-500/30">
                v2.0
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <PhantomWalletButton />
          </div>

        </div>
      </header>

      {/* Step Navigation */}
      <StepNavigation
        currentStep={currentStep}
        onStepChange={(step) => setCurrentStep(step)}
      />

      {/* Main Container - Centered Vertically */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-4 flex flex-col justify-center items-center relative z-10">
        
        {currentStep === 1 && (
          <ScrollIntroView
            onLaunchNow={() => setCurrentStep(2)}
            onExploreOcean={() => setCurrentStep(4)}
          />
        )}

        {currentStep === 2 && (
          <FishStudio
            onSaveFish={handleSaveFish}
            selectedSpecies={selectedSpecies}
            setSelectedSpecies={setSelectedSpecies}
          />
        )}

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

        {currentStep === 4 && (
          <OceanAquarium
            tokens={tokens}
            onSelectTokenForPool={(token) => {
              setPreselectedToken(token);
              setCurrentStep(5);
            }}
            onOpenTerminal={() => setCurrentStep(6)}
            onSpawnNew={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 5 && (
          <FaucetView preselectedToken={preselectedToken} />
        )}

        {currentStep === 6 && (
          <AgentTerminalView />
        )}

      </main>

      {/* Launch Modal */}
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
      <footer className="w-full border-t border-cyan-500/15 py-3.5 px-4 bg-[#030712]/70 backdrop-blur-xl text-xs font-mono text-slate-400 relative z-20">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 AgenSea. Autonomous Marine Intelligence on Solana Pump.fun.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="hover:text-[#00d2ff] cursor-pointer" onClick={() => setCurrentStep(1)}>Overview</span>
            <span className="hover:text-[#00d2ff] cursor-pointer" onClick={() => setCurrentStep(4)}>The Ocean</span>
            <span className="hover:text-[#00e5ff] cursor-pointer" onClick={() => setCurrentStep(5)}>Treasury</span>
            <span className="hover:text-[#00e5ff] cursor-pointer" onClick={() => setCurrentStep(6)}>Radar</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
