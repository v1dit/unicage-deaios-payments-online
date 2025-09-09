import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createPublicClient, http } from 'viem';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS || '*';
const RPC_URL_TESTNET = process.env.RPC_URL_TESTNET!;
const CHAIN_ID_TESTNET = Number(process.env.CHAIN_ID_TESTNET || 0);
const VERSION = process.env.npm_package_version || '0.0.0';

if (!RPC_URL_TESTNET) {
  console.error('Missing RPC_URL_TESTNET in env');
  process.exit(1);
}

const app = express();
app.use(cors({ origin: ALLOWED_ORIGINS === '*' ? true : ALLOWED_ORIGINS.split(',') }));
app.use(express.json());

const client = createPublicClient({
  transport: http(RPC_URL_TESTNET, { retryCount: 2 })
});

app.get('/health', (_req, res) => {
  res.json({ ok: true, version: VERSION, chainId: CHAIN_ID_TESTNET });
});

app.get('/chain/ping', async (_req, res) => {
  try {
    const blockNumber = await client.getBlockNumber();
    res.json({ ok: true, blockNumber: blockNumber.toString() });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err?.message || 'RPC error' });
  }
});

app.get('/', (_req, res) => {
  res.json({ ok: true, service: 'deaios-api' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API listening on http://0.0.0.0:${PORT}`);
});
