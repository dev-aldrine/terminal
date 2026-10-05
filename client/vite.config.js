import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import fs from 'fs';
import path from 'path';

function configApiPlugin() {
  const baseDir = typeof import.meta.dirname !== 'undefined' ? import.meta.dirname : path.resolve('');
  const configFile = path.resolve(baseDir, '../server/config.json');
  const dbFile = path.resolve(baseDir, '../server/agensea_db.json');

  const getDb = () => {
    try {
      if (fs.existsSync(dbFile)) {
        return JSON.parse(fs.readFileSync(dbFile, 'utf8'));
      }
    } catch (e) {}
    return {
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
          marketCapUsd: 68420,
          bondingCurvePercent: 78.4,
          volume24hUsd: 142500,
          faucet: { enabled: true, poolBalance: 485000, totalClaimed: 15000, claimAmount: 5000, claimMode: 'ai_challenge', challengeAnswer: 'liquidity' }
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
          marketCapUsd: 124500,
          bondingCurvePercent: 94.2,
          volume24hUsd: 389000,
          faucet: { enabled: true, poolBalance: 820000, totalClaimed: 45000, claimAmount: 10000, claimMode: 'instant_drip' }
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
          marketCapUsd: 34100,
          bondingCurvePercent: 42.0,
          volume24hUsd: 56200,
          faucet: { enabled: true, poolBalance: 290000, totalClaimed: 10000, claimAmount: 2500, claimMode: 'instant_drip' }
        }
      ]
    };
  };

  return {
    name: 'config-api-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const pathname = (req.url || '').split('?')[0];

        if (pathname === '/api/config' && req.method === 'GET') {
          try {
            if (fs.existsSync(configFile)) {
              const data = fs.readFileSync(configFile, 'utf8');
              res.setHeader('Content-Type', 'application/json');
              res.end(data);
              return;
            }
          } catch (e) {}
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, ca: 'AgenSea7xJkM9QvW2p8L4s5T3u1Y6z8N0m2B4v6C8d0Ef', twitter: 'https://x.com/agensea' }));
          return;
        }

        if (pathname === '/api/config' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body);
              if (parsed.password !== '!123!123!') {
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Unauthorized: Invalid password.' }));
                return;
              }
              if (parsed.adminWallet && parsed.adminWallet !== '7jMX3CSDvXu3DfKewrepvAyYTGZ4h1VWRzuDB14tPau4') {
                res.statusCode = 403;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Forbidden: Unauthorized wallet address.' }));
                return;
              }
              let current = { ca: '', twitter: '' };
              if (fs.existsSync(configFile)) {
                try {
                  current = JSON.parse(fs.readFileSync(configFile, 'utf8'));
                } catch (e) {}
              }
              const updated = {
                ...current,
                ca: typeof parsed.ca === 'string' ? parsed.ca.trim() : (current.ca || ''),
                twitter: typeof parsed.twitter === 'string' ? parsed.twitter.trim() : (current.twitter || ''),
                ...(typeof parsed.pinataJwt === 'string' ? { pinataJwt: parsed.pinataJwt.trim() } : {}),
                updatedAt: new Date().toISOString()
              };
              const clientPublicConfigFile = path.resolve(baseDir, 'public/config.json');
              fs.writeFileSync(configFile, JSON.stringify(updated, null, 2), 'utf8');
              try {
                fs.writeFileSync(clientPublicConfigFile, JSON.stringify({ ca: updated.ca, twitter: updated.twitter }, null, 2), 'utf8');
              } catch (e) {}

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, ...updated }));
              return;
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
              return;
            }
          });
          return;
        }

        if (pathname === '/api/launched-coins' && req.method === 'GET') {
          const db = getDb();
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, tokens: db.tokens, coins: db.tokens }));
          return;
        }

        if (pathname === '/api/faucets' && req.method === 'GET') {
          const db = getDb();
          const faucets = (db.tokens || []).filter(t => t.faucet && t.faucet.enabled).map(t => ({
            tokenId: t.id,
            name: t.name,
            symbol: t.symbol,
            mintPublicKey: t.mintPublicKey,
            imageUrl: t.imageUrl,
            species: t.species,
            faucet: t.faucet
          }));
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, faucets }));
          return;
        }

        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    configApiPlugin(),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
  ],
  define: {
    'process.env': {},
  },
  optimizeDeps: {
    include: [
      '@solana/web3.js',
      '@solana/wallet-adapter-react',
      '@solana/wallet-adapter-react-ui',
      'buffer',
      'framer-motion',
      'gsap',
      'canvas-confetti',
      'clsx',
      'tailwind-merge'
    ]
  },
  server: {
    port: 5173,
    host: true,
    hmr: {
      clientPort: 5173,
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5001',
        changeOrigin: true,
        secure: false,
        timeout: 10000,
        configure: (proxy) => {
          proxy.on('error', (err, req, res) => {
            // Gracefully handle offline backend in dev mode
            if (!res.headersSent && res.writeHead) {
              res.writeHead(502, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Backend offline, using fallback.' }));
            }
          });
        }
      },
      '/uploads': {
        target: 'http://127.0.0.1:5001',
        changeOrigin: true,
        secure: false,
        timeout: 10000,
        configure: (proxy) => {
          proxy.on('error', () => {});
        }
      }
    }
  }
});

