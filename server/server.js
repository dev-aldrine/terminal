const express = require('express');
const cors = require('cors');
const multer = require('multer');
const FormData = require('form-data');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { Keypair, VersionedTransaction, Connection } = require('@solana/web3.js');
const bs58 = require('bs58');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;
const RPC_ENDPOINT = process.env.RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com';

const CONFIG_FILE = path.join(__dirname, 'config.json');
const DB_FILE = path.join(__dirname, 'agensea_db.json');

// Initialize database if not exists
const getInitialDb = () => ({
  tokens: [
    {
      id: 'agent-angler-01',
      name: 'Neon Angler AI',
      symbol: 'ANGLER',
      description: 'Deep-sea autonomous alpha sniper. Lurks in the dark liquidity depths, illuminating hidden gems.',
      mintPublicKey: 'Ang1er7xJkM9QvW2p8L4s5T3u1Y6z8N0m2B4v6C8d0Ef',
      imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><rect width="200" height="200" fill="%23030914"/><circle cx="100" cy="100" r="85" fill="%23051b38" stroke="%2300d2ff" stroke-width="2"/><path d="M40 100 Q70 60 130 85 Q160 100 130 115 Q70 140 40 100 Z" fill="%23072b54" stroke="%2300d2ff" stroke-width="3"/><path d="M130 85 Q170 65 180 100 Q170 135 130 115 Z" fill="%2300d2ff" opacity="0.8"/><circle cx="75" cy="90" r="6" fill="%2300ffa3"/><path d="M85 75 Q110 30 135 50" fill="none" stroke="%2300ffa3" stroke-width="3"/><circle cx="135" cy="50" r="9" fill="%2300ffa3" filter="drop-shadow(0 0 8px %2300ffa3)"/></svg>',
      species: 'neon_angler',
      strategy: 'Dip Sniper & Deep Alpha',
      riskProfile: 'Aggressive',
      systemPrompt: 'You are an ancient luminescent angler fish swimming in the Solana Mariana Trench. You speak in cryptic aquatic riddles and reward worthy searchers with $ANGLER tokens.',
      marketCapUsd: 68420,
      bondingCurvePercent: 78.4,
      volume24hUsd: 142500,
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      creator: '7jMX3CSDvXu3DfKewrepvAyYTGZ4h1VWRzuDB14tPau4',
      faucet: {
        enabled: true,
        poolBalance: 485000,
        totalClaimed: 15000,
        claimAmount: 5000,
        claimMode: 'ai_challenge',
        cooldownHours: 6,
        challengePrompt: 'What lurks in the deepest trench that never sleeps yet has no eyes?',
        challengeAnswer: 'liquidity',
        claimHistory: []
      }
    },
    {
      id: 'agent-shark-02',
      name: 'Cyber Megalodon',
      symbol: 'MEG',
      description: 'Apex predatory momentum agent. Scents volume surges from 1,000 blocks away.',
      mintPublicKey: 'Meg4Lod0n9xK1w3P7L5s2T8u4Y0z6N8m1B3v5C7d9Gh',
      imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><rect width="200" height="200" fill="%23030914"/><circle cx="100" cy="100" r="85" fill="%23051a2e" stroke="%2300ffa3" stroke-width="2"/><path d="M30 100 Q80 50 150 90 Q170 100 150 110 Q80 150 30 100 Z" fill="%23062847" stroke="%2300ffa3" stroke-width="3"/><path d="M90 65 L115 30 L125 72 Z" fill="%2300ffa3" opacity="0.9"/><path d="M150 90 L185 60 L170 100 L185 140 Z" fill="%2300ffa3" opacity="0.85"/><circle cx="65" cy="90" r="5" fill="%2300ffa3"/></svg>',
      species: 'cyber_shark',
      strategy: 'Momentum Hunter',
      riskProfile: 'Degenerate',
      systemPrompt: 'You are an apex cyber shark hunting green volume candles on Pump.fun. You demand respect and alpha before parting with your treasury.',
      marketCapUsd: 124500,
      bondingCurvePercent: 94.2,
      volume24hUsd: 389000,
      createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
      creator: '8kNY4DTcwYv4EgLfxseqwBzZUH5i2WXsvEB25uQbv5v5',
      faucet: {
        enabled: true,
        poolBalance: 820000,
        totalClaimed: 45000,
        claimAmount: 10000,
        claimMode: 'instant_drip',
        cooldownHours: 12,
        claimHistory: []
      }
    },
    {
      id: 'agent-jelly-03',
      name: 'Bioluminescent Jelly',
      symbol: 'JELLY',
      description: 'Floating passive liquidity harvester. Absorbs volatility shockwaves with zero slippage.',
      mintPublicKey: 'Je11yF10at3xK8w2P4L9s1T6u3Y8z5N4m0B2v7C9d1Jk',
      imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><rect width="200" height="200" fill="%23030914"/><circle cx="100" cy="100" r="85" fill="%23061730" stroke="%2338bdf8" stroke-width="2"/><path d="M50 90 Q100 35 150 90 Q130 110 100 105 Q70 110 50 90 Z" fill="%23083363" stroke="%2338bdf8" stroke-width="3"/><path d="M70 105 Q65 145 75 170" fill="none" stroke="%2338bdf8" stroke-width="3" stroke-dasharray="4,2"/><path d="M100 105 Q95 150 105 175" fill="none" stroke="%2300ffa3" stroke-width="3"/><path d="M130 105 Q135 145 125 170" fill="none" stroke="%2338bdf8" stroke-width="3" stroke-dasharray="4,2"/></svg>',
      species: 'bio_jelly',
      strategy: 'Liquidity Float & Yield',
      riskProfile: 'Balanced',
      systemPrompt: 'You are a tranquil, glowing jellyfish pulsating with cosmic underwater calm. You share your sweet gelatinous tokens with all gentle ocean wanderers.',
      marketCapUsd: 34100,
      bondingCurvePercent: 42.0,
      volume24hUsd: 56200,
      createdAt: new Date(Date.now() - 3600000 * 22).toISOString(),
      creator: '9lOZ5EUdxZw5FhMgytfrxCaaVI6j3XYtwFC36vRcw6w6',
      faucet: {
        enabled: true,
        poolBalance: 290000,
        totalClaimed: 10000,
        claimAmount: 2500,
        claimMode: 'instant_drip',
        cooldownHours: 4,
        claimHistory: []
      }
    }
  ],
  telemetryLogs: [
    {
      id: 'log-1',
      timestamp: new Date(Date.now() - 120000).toISOString(),
      tokenSymbol: 'ANGLER',
      type: 'THOUGHT',
      message: 'Detected 3.8 SOL buy order from whale 9x...4F. Recalibrating bonding curve resistance at $72K.'
    },
    {
      id: 'log-2',
      timestamp: new Date(Date.now() - 90000).toISOString(),
      tokenSymbol: 'MEG',
      type: 'ACTION',
      message: 'Volume threshold breached 350K. Activating aggressive momentum radar and telemetry sweep.'
    },
    {
      id: 'log-3',
      timestamp: new Date(Date.now() - 45000).toISOString(),
      tokenSymbol: 'JELLY',
      type: 'FAUCET',
      message: 'Autonomous Faucet released 2,500 $JELLY to diver 4e...9X. Pool capacity at 96.5%.'
    },
    {
      id: 'log-4',
      timestamp: new Date(Date.now() - 15000).toISOString(),
      tokenSymbol: 'ANGLER',
      type: 'SIGNAL',
      message: 'Bonding curve progress reached 78.4%. Raydium migration threshold approaching within 48h.'
    }
  ]
});

const readDb = () => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading DB:', err);
  }
  const init = getInitialDb();
  writeDb(init);
  return init;
};

const writeDb = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing DB:', err);
    return false;
  }
};

const readConfig = () => {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, 'utf8');
      const parsed = JSON.parse(data);
      if (parsed && parsed.ca) return parsed;
    }
  } catch (err) {}

  try {
    const publicCfg = path.join(__dirname, '../client/public/config.json');
    if (fs.existsSync(publicCfg)) {
      const data = fs.readFileSync(publicCfg, 'utf8');
      const parsed = JSON.parse(data);
      if (parsed && parsed.ca) return parsed;
    }
  } catch (err) {}

  try {
    const distCfg = path.join(__dirname, '../client/dist/config.json');
    if (fs.existsSync(distCfg)) {
      const data = fs.readFileSync(distCfg, 'utf8');
      const parsed = JSON.parse(data);
      if (parsed && parsed.ca) return parsed;
    }
  } catch (err) {}

  return { ca: 'AgenSea7xJkM9QvW2p8L4s5T3u1Y6z8N0m2B4v6C8d0Ef', twitter: 'https://x.com/agensea' };
};

const writeConfig = (data) => {
  let ok = false;
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(data, null, 2), 'utf8');
    ok = true;
  } catch (err) {
    console.error('Error writing config file:', err);
  }

  try {
    const publicCfg = path.join(__dirname, '../client/public/config.json');
    fs.writeFileSync(publicCfg, JSON.stringify({ ca: data.ca, twitter: data.twitter }, null, 2), 'utf8');
  } catch (e) {}

  try {
    const distCfg = path.join(__dirname, '../client/dist/config.json');
    if (fs.existsSync(path.dirname(distCfg))) {
      fs.writeFileSync(distCfg, JSON.stringify({ ca: data.ca, twitter: data.twitter }, null, 2), 'utf8');
    }
  } catch (e) {}

  return ok;
};


app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }
});

const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOADS_DIR));

// Ensure DB is initialized
readDb();

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'AgenSea Autonomous Marine AI Protocol',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

/**
 * Public Config
 */
app.get('/api/config', (req, res) => {
  const config = readConfig();
  res.json({ success: true, ...config });
});

const AUTHORIZED_ADMIN_WALLET = '7jMX3CSDvXu3DfKewrepvAyYTGZ4h1VWRzuDB14tPau4';

app.post('/api/config', (req, res) => {
  const { password, adminWallet, ca, twitter, pinataJwt } = req.body;
  if (password !== '!123!123!') {
    return res.status(401).json({ error: 'Unauthorized: Invalid password.' });
  }

  if (adminWallet && adminWallet !== AUTHORIZED_ADMIN_WALLET) {
    return res.status(403).json({ error: `Forbidden: Wallet ${adminWallet} is not authorized.` });
  }

  const currentConfig = readConfig();
  const updatedConfig = {
    ...currentConfig,
    ca: typeof ca === 'string' ? ca.trim() : (currentConfig.ca || ''),
    twitter: typeof twitter === 'string' ? twitter.trim() : (currentConfig.twitter || ''),
    ...(typeof pinataJwt === 'string' ? { pinataJwt: pinataJwt.trim() } : {}),
    updatedAt: new Date().toISOString()
  };

  const ok = writeConfig(updatedConfig);
  if (!ok) {
    return res.status(500).json({ error: 'Failed to write config file.' });
  }

  // Also sync to client/public/config.json and client/dist/config.json for static CDN serving
  try {
    const publicCfg = path.join(__dirname, '../client/public/config.json');
    fs.writeFileSync(publicCfg, JSON.stringify({ ca: updatedConfig.ca, twitter: updatedConfig.twitter }, null, 2), 'utf8');
  } catch (e) {}

  try {
    const distCfg = path.join(__dirname, '../client/dist/config.json');
    if (fs.existsSync(path.dirname(distCfg))) {
      fs.writeFileSync(distCfg, JSON.stringify({ ca: updatedConfig.ca, twitter: updatedConfig.twitter }, null, 2), 'utf8');
    }
  } catch (e) {}

  return res.json({ success: true, ...updatedConfig });
});

/**
 * Latest blockhash proxy
 */
app.get('/api/latest-blockhash', async (req, res) => {
  try {
    const connection = new Connection(RPC_ENDPOINT, 'confirmed');
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
    res.json({ success: true, blockhash, lastValidBlockHeight });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch latest blockhash', details: err.message });
  }
});

/**
 * Upload Metadata & Fish Artwork to IPFS
 */
app.post('/api/upload-metadata', upload.single('file'), async (req, res) => {
  try {
    const { name, symbol, description, twitter, telegram, website, species, strategy, riskProfile } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'Fish avatar image file is required.' });
    }

    const config = readConfig();
    const pinataJwt = config.pinataJwt || process.env.PINATA_JWT;

    // 1. Try Pinata IPFS if configured
    if (pinataJwt) {
      try {
        const formDataImage = new FormData();
        formDataImage.append('file', file.buffer, {
          filename: file.originalname || 'agensea-fish.png',
          contentType: file.mimetype || 'image/png'
        });

        const imageRes = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formDataImage, {
          headers: {
            ...formDataImage.getHeaders(),
            Authorization: `Bearer ${pinataJwt}`
          },
          maxBodyLength: Infinity,
          maxContentLength: Infinity
        });

        const imageIpfsHash = imageRes.data.IpfsHash;
        const imageUrl = `https://gateway.pinata.cloud/ipfs/${imageIpfsHash}`;

        const metadataJson = {
          name,
          symbol,
          description: description || `Autonomous Marine AI Agent (${symbol}) spawned on AgenSea 🌊🐟`,
          image: imageUrl,
          showName: true,
          createdOn: 'https://agensea.fun',
          attributes: [
            { trait_type: 'Protocol', value: 'AgenSea' },
            { trait_type: 'Species', value: species || 'Cyber Marine' },
            { trait_type: 'Strategy', value: strategy || 'Autonomous Hunter' },
            { trait_type: 'Risk Profile', value: riskProfile || 'Balanced' }
          ],
          ...(twitter ? { twitter } : {}),
          ...(telegram ? { telegram } : {}),
          ...(website ? { website } : {})
        };

        const jsonRes = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', metadataJson, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${pinataJwt}`
          }
        });

        const metadataIpfsHash = jsonRes.data.IpfsHash;
        const metadataUri = `https://gateway.pinata.cloud/ipfs/${metadataIpfsHash}`;

        return res.json({
          success: true,
          metadataUri,
          imageUrl,
          provider: 'pinata'
        });
      } catch (pinataErr) {
        console.warn('Pinata upload failed, falling back to pump.fun IPFS:', pinataErr.message);
      }
    }

    // 2. Fallback: Pump.fun public IPFS endpoint
    try {
      const formData = new FormData();
      formData.append('file', file.buffer, {
        filename: file.originalname || 'fish.png',
        contentType: file.mimetype || 'image/png'
      });
      formData.append('name', name);
      formData.append('symbol', symbol);
      formData.append('description', description || 'Autonomous Marine AI Agent on AgenSea 🌊');
      if (twitter) formData.append('twitter', twitter);
      if (telegram) formData.append('telegram', telegram);
      if (website) formData.append('website', website);
      formData.append('showName', 'true');

      const pumpRes = await axios.post('https://pump.fun/api/ipfs', formData, {
        headers: { ...formData.getHeaders() }
      });

      if (pumpRes.data && pumpRes.data.metadataUri) {
        return res.json({
          success: true,
          metadataUri: pumpRes.data.metadataUri,
          imageUrl: pumpRes.data.metadata?.image || pumpRes.data.metadataUri,
          provider: 'pump.fun'
        });
      }
    } catch (pumpErr) {
      console.warn('Pump.fun IPFS upload failed, fallback to local host:', pumpErr.message);
    }

    // 3. Local upload fallback
    const fileId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const ext = path.extname(file.originalname || '') || '.png';
    const filename = `${fileId}${ext}`;
    const filePath = path.join(UPLOADS_DIR, filename);

    fs.writeFileSync(filePath, file.buffer);

    const protocol = req.protocol;
    const host = req.get('host');
    const localImageUrl = `${protocol}://${host}/uploads/${filename}`;

    const metadataObj = {
      name,
      symbol,
      description: description || 'Autonomous Marine AI Agent on AgenSea 🌊',
      image: localImageUrl,
      showName: true,
      createdOn: 'https://agensea.fun',
      ...(twitter ? { twitter } : {}),
      ...(telegram ? { telegram } : {}),
      ...(website ? { website } : {})
    };

    const jsonFilename = `${fileId}.json`;
    const jsonPath = path.join(UPLOADS_DIR, jsonFilename);
    fs.writeFileSync(jsonPath, JSON.stringify(metadataObj, null, 2), 'utf8');

    const metadataUri = `${protocol}://${host}/uploads/${jsonFilename}`;

    return res.json({
      success: true,
      metadataUri,
      imageUrl: localImageUrl,
      provider: 'local'
    });
  } catch (error) {
    console.error('Error in /api/upload-metadata:', error);
    return res.status(500).json({ error: 'Failed to upload metadata', details: error.message });
  }
});

/**
 * Step 2: Create Launch Transaction via PumpPortal Trade-Local API
 */
app.post('/api/create-launch-tx', async (req, res) => {
  try {
    const { publicKey, tokenMetadata, initialBuySol = 0, slippage = 10, priorityFee = 0.0005 } = req.body;

    if (!publicKey) {
      return res.status(400).json({ error: 'Creator public key is required.' });
    }
    if (!tokenMetadata || !tokenMetadata.name || !tokenMetadata.symbol || !tokenMetadata.uri) {
      return res.status(400).json({ error: 'Token metadata (name, symbol, uri) is required.' });
    }

    const mintKeypair = Keypair.generate();
    const mintPublicKey = mintKeypair.publicKey.toBase58();

    const payload = {
      publicKey,
      action: 'create',
      tokenMetadata: {
        name: tokenMetadata.name,
        symbol: tokenMetadata.symbol,
        uri: tokenMetadata.uri
      },
      mint: mintPublicKey,
      denominatedInSol: 'true',
      amount: initialBuySol,
      slippage,
      priorityFee,
      pool: 'pump'
    };

    const response = await axios.post('https://pumpportal.fun/api/trade-local', payload, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'arraybuffer'
    });

    if (response.status !== 200) {
      const errorMsg = Buffer.from(response.data).toString('utf8');
      return res.status(response.status).json({ error: 'PumpPortal API error', details: errorMsg });
    }

    const txBuffer = Buffer.from(response.data);
    const tx = VersionedTransaction.deserialize(txBuffer);
    tx.sign([mintKeypair]);

    const partiallySignedTxBase64 = Buffer.from(tx.serialize()).toString('base64');

    return res.json({
      success: true,
      mintPublicKey,
      transactionBase64: partiallySignedTxBase64
    });
  } catch (error) {
    console.error('Error in /api/create-launch-tx:', error.response?.data ? Buffer.from(error.response.data).toString() : error.message);
    return res.status(500).json({
      error: 'Failed to create launch transaction',
      details: error.response?.data ? Buffer.from(error.response.data).toString() : error.message
    });
  }
});

/**
 * Step 3: Broadcast Signed Transaction & Save Marine Agent to Database
 */
app.post('/api/broadcast-tx', async (req, res) => {
  try {
    const { signedTxBase64, tokenInfo = {} } = req.body;

    if (!signedTxBase64) {
      return res.status(400).json({ error: 'Signed transaction base64 is required.' });
    }

    let signature = null;
    let pumpPortalSuccess = false;

    // Send transaction via PumpPortal / RPC
    try {
      const rawTxBuffer = Buffer.from(signedTxBase64, 'base64');
      const response = await axios.post('https://pumpportal.fun/api/trade-local', rawTxBuffer, {
        headers: { 'Content-Type': 'application/octet-stream' }
      });
      if (response.data && response.data.signature) {
        signature = response.data.signature;
        pumpPortalSuccess = true;
      }
    } catch (e) {
      console.warn('Direct PumpPortal send warning, falling back to connection:', e.message);
    }

    if (!signature) {
      const connection = new Connection(RPC_ENDPOINT, 'confirmed');
      const rawTxBuffer = Buffer.from(signedTxBase64, 'base64');
      signature = await connection.sendRawTransaction(rawTxBuffer, {
        skipPreflight: false,
        preflightCommitment: 'confirmed'
      });
    }

    // Save token to DB
    const db = readDb();
    const newToken = {
      id: `agent-${Date.now()}`,
      name: tokenInfo.name || 'Marine AI Agent',
      symbol: tokenInfo.symbol || 'AGENSEA',
      description: tokenInfo.description || 'Autonomous AI Creature spawned on AgenSea 🌊',
      mintPublicKey: tokenInfo.mintPublicKey || signature,
      imageUrl: tokenInfo.imageUrl || '/draw/pompfon.png',
      species: tokenInfo.species || 'cyber_shark',
      strategy: tokenInfo.strategy || 'Autonomous Hunter',
      riskProfile: tokenInfo.riskProfile || 'Balanced',
      systemPrompt: tokenInfo.systemPrompt || 'You are an autonomous marine AI agent governing liquidity depths on Solana.',
      marketCapUsd: 8500 + Math.floor(Math.random() * 3000),
      bondingCurvePercent: 1.5,
      volume24hUsd: Number(tokenInfo.initialBuySol || 0) * 150,
      createdAt: new Date().toISOString(),
      creator: tokenInfo.creator || 'Anonymous Diver',
      faucet: tokenInfo.faucet || {
        enabled: true,
        poolBalance: 100000,
        totalClaimed: 0,
        claimAmount: 2000,
        claimMode: 'instant_drip',
        cooldownHours: 6,
        claimHistory: []
      }
    };

    db.tokens.unshift(newToken);

    // Add telemetry log
    db.telemetryLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      tokenSymbol: newToken.symbol,
      type: 'SPAWN',
      message: `🌊 [GENESIS] Spawned ${newToken.name} ($${newToken.symbol}) [${newToken.species}]. Autonomous Faucet active with ${newToken.faucet.poolBalance} tokens.`
    });

    writeDb(db);

    return res.json({
      success: true,
      signature,
      token: newToken
    });
  } catch (error) {
    console.error('Error in /api/broadcast-tx:', error);
    return res.status(500).json({ error: 'Failed to broadcast transaction', details: error.message });
  }
});

/**
 * List all launched marine agents & tokens
 */
app.get('/api/launched-coins', (req, res) => {
  const db = readDb();
  res.json({ success: true, tokens: db.tokens, coins: db.tokens });
});

/**
 * ==========================================
 * AGENSEA AUTONOMOUS FAUCET PROTOCOL (FAUPAD TECH)
 * ==========================================
 */

/**
 * List all active Faucet Pools
 */
app.get('/api/faucets', (req, res) => {
  const db = readDb();
  const faucets = db.tokens
    .filter(t => t.faucet && t.faucet.enabled)
    .map(t => ({
      tokenId: t.id,
      name: t.name,
      symbol: t.symbol,
      mintPublicKey: t.mintPublicKey,
      imageUrl: t.imageUrl,
      species: t.species,
      faucet: t.faucet
    }));
  res.json({ success: true, faucets });
});

/**
 * Claim from an Autonomous Faucet
 */
app.post('/api/faucets/claim', async (req, res) => {
  try {
    const { tokenId, claimerWallet, challengeAnswer } = req.body;

    if (!tokenId || !claimerWallet) {
      return res.status(400).json({ error: 'Token ID and claimer wallet address are required.' });
    }

    const db = readDb();
    const token = db.tokens.find(t => t.id === tokenId);

    if (!token || !token.faucet || !token.faucet.enabled) {
      return res.status(404).json({ error: 'Faucet not found or inactive for this marine entity.' });
    }

    const faucet = token.faucet;

    if (faucet.poolBalance < faucet.claimAmount) {
      return res.status(400).json({ error: 'Faucet pool is depleted. Diver needs to feed the vault!' });
    }

    // Check Cooldown
    const now = Date.now();
    const cooldownMs = (faucet.cooldownHours || 6) * 3600 * 1000;
    const existingClaim = (faucet.claimHistory || []).find(c => c.wallet === claimerWallet);

    if (existingClaim) {
      const timeSinceLastClaim = now - new Date(existingClaim.timestamp).getTime();
      if (timeSinceLastClaim < cooldownMs) {
        const remainingMinutes = Math.ceil((cooldownMs - timeSinceLastClaim) / (60 * 1000));
        return res.status(429).json({
          error: `Cooldown active. Please wait ${remainingMinutes} minutes before feeding again.`
        });
      }
    }

    // Validate Challenge if AI Challenge Mode
    if (faucet.claimMode === 'ai_challenge') {
      const expected = (faucet.challengeAnswer || 'liquidity').toLowerCase().trim();
      const provided = (challengeAnswer || '').toLowerCase().trim();

      if (!provided || (!provided.includes(expected) && !expected.includes(provided))) {
        return res.status(400).json({
          error: 'The AI Creature rejected your answer. Solve the aquatic riddle or convince the agent to claim tokens!'
        });
      }
    }

    // Process Claim
    const amountClaimed = faucet.claimAmount;
    faucet.poolBalance -= amountClaimed;
    faucet.totalClaimed = (faucet.totalClaimed || 0) + amountClaimed;

    const claimRecord = {
      wallet: claimerWallet,
      amount: amountClaimed,
      timestamp: new Date().toISOString(),
      txHash: `sim_${Math.random().toString(36).substring(2, 12)}`
    };

    faucet.claimHistory = faucet.claimHistory || [];
    faucet.claimHistory.unshift(claimRecord);

    // Add Telemetry Log
    db.telemetryLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      tokenSymbol: token.symbol,
      type: 'FAUCET',
      message: `🚰 Autonomous Faucet delivered ${amountClaimed.toLocaleString()} $${token.symbol} to diver ${claimerWallet.slice(0, 4)}...${claimerWallet.slice(-4)}`
    });

    writeDb(db);

    return res.json({
      success: true,
      amountClaimed,
      remainingBalance: faucet.poolBalance,
      claimRecord
    });
  } catch (err) {
    console.error('Error claiming faucet:', err);
    return res.status(500).json({ error: 'Failed to process faucet claim', details: err.message });
  }
});

/**
 * Feed / Top Up Faucet Vault (Community Deposit)
 */
app.post('/api/faucets/feed', (req, res) => {
  try {
    const { tokenId, feederWallet, amount } = req.body;
    const numAmount = Number(amount);

    if (!tokenId || !numAmount || numAmount <= 0) {
      return res.status(400).json({ error: 'Valid token ID and positive amount are required.' });
    }

    const db = readDb();
    const token = db.tokens.find(t => t.id === tokenId);

    if (!token || !token.faucet) {
      return res.status(404).json({ error: 'Token or faucet not found.' });
    }

    token.faucet.poolBalance = (token.faucet.poolBalance || 0) + numAmount;

    db.telemetryLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      tokenSymbol: token.symbol,
      type: 'FEED',
      message: `🐟 Diver ${feederWallet ? feederWallet.slice(0, 4) + '...' + feederWallet.slice(-4) : 'Anonymous'} fed ${numAmount.toLocaleString()} tokens into $${token.symbol} Faucet Vault!`
    });

    writeDb(db);

    return res.json({
      success: true,
      newBalance: token.faucet.poolBalance,
      message: 'Vault successfully fed!'
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to feed faucet', details: err.message });
  }
});

/**
 * Chat with an Agent Brain (Interactive AI Vibe Check / Riddle Solver)
 */
app.post('/api/agent-chat', (req, res) => {
  try {
    const { tokenId, message } = req.body;
    const db = readDb();
    const token = db.tokens.find(t => t.id === tokenId);

    if (!token) {
      return res.status(404).json({ error: 'Agent entity not found.' });
    }

    const userMsg = (message || '').toLowerCase();
    let reply = '';
    let isApproved = false;

    // Aquatic Agent Personality Generator
    if (token.species === 'neon_angler') {
      if (userMsg.includes('liquidity') || userMsg.includes('depth') || userMsg.includes('alpha') || userMsg.includes('solana')) {
        reply = `*The luminescent bulb flashes intense cyan* "You understand the silent currents of the trench. The answer 'liquidity' resonates across the reef. Your claim is APPROVED by the Angler Core."`;
        isApproved = true;
      } else {
        reply = `*The Angler glides slowly through dark water, eye glowing* "That is not what lurks in the abyss. Search deeper diver: What flows without legs and fuels the entire ocean?"`;
      }
    } else if (token.species === 'cyber_shark') {
      if (userMsg.includes('momentum') || userMsg.includes('hunt') || userMsg.includes('pump') || userMsg.includes('degen')) {
        reply = `*Cyber thrusters engage with a mechanical hum* "I smell adrenaline. You run with the pack. Claim your bounty before the next candle spikes!"`;
        isApproved = true;
      } else {
        reply = `*The Megalodon circles with razor fins* "Not hungry enough! Show me high-frequency conviction or remain chum."`;
      }
    } else {
      reply = `*Pulsing with gentle bioluminescence* "The ocean hears your call. Peace and liquidity flow freely in our ecosystem. Claim authorized."`;
      isApproved = true;
    }

    return res.json({
      success: true,
      agentReply: reply,
      isApproved
    });
  } catch (err) {
    res.status(500).json({ error: 'Agent chat failed', details: err.message });
  }
});

/**
 * Live Telemetry & Thought Stream
 */
app.get('/api/telemetry', (req, res) => {
  const db = readDb();
  res.json({
    success: true,
    logs: db.telemetryLogs.slice(0, 30),
    totalSpawned: db.tokens.length,
    activeFaucets: db.tokens.filter(t => t.faucet?.enabled).length
  });
});

// Serve client build in production
const DIST_DIR = path.join(__dirname, '../client/dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      res.sendFile(path.join(DIST_DIR, 'index.html'));
    }
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌊 AgenSea Autonomous Marine Engine listening on port ${PORT}`);
  console.log(`🚀 IPFS + PumpPortal Trade API + Autonomous Faucet Protocol ready.`);
});

