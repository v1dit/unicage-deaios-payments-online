import express from "express";
import cors from "cors";

const app = express();

console.log("Running server file:", __filename);
app.use((req, _res, next) => { console.log(req.method, req.url); next(); });

function listRoutes() {
  // @ts-ignore
  const stack = (app as any)._router?.stack || [];
  const out: string[] = [];
  for (const layer of stack) {
    if (layer.route?.path) {
      const methods = Object.keys(layer.route.methods).join(',').toUpperCase();
      out.push(`${methods.padEnd(6)} ${layer.route.path}`);
    }
  }
  console.log("Registered routes:\n" + out.map(r => " - " + r).join("\n"));
}
app.use(express.json());
app.use(cors({ origin: "*"}));
listRoutes();

const PORT = process.env.PORT || 3000;

// --- demo constants ---
const DEMO_ADDRESS =
  process.env.DEMO_ADDRESS || "0xDEMO000000000000000000000000000000000001";

// --- health + chain ping (you already had these) ---
app.get("/health", (_req, res) => {
  res.json({ ok: true, version: "1.0.0", chainId: 9000 });
});

app.get("/chain/ping", (_req, res) => {
  res.json({ ok: true, blockNumber: "6173177" });
});

// --- wallet routes ---
app.get("/wallet/demo", (_req, res) => {
  res.json({ address: DEMO_ADDRESS, network: "0g-testnet" });
});

app.get("/wallet/balance", (_req, res) => {
  res.json({ address: DEMO_ADDRESS, balance: "0", currency: "OGTEST" });
});

app.get("/wallet/history", (_req, res) => {
  res.json([
    {
      txHash: "0xaaa111",
      type: "send",
      amount: "5.00",
      currency: "OGTEST",
      status: "confirmed",
      timestamp: "2025-09-10T06:10:00Z",
      from: DEMO_ADDRESS,
      to: "0x00000000000000000000000000000000000000A1",
      network: "0g-testnet",
      fee: "0.00010",
      note: "Invoice #1001",
    },
    {
      txHash: "0xbbb222",
      type: "receive",
      amount: "2.75",
      currency: "OGTEST",
      status: "confirmed",
      timestamp: "2025-09-09T18:32:19Z",
      from: "0x00000000000000000000000000000000000000B2",
      to: DEMO_ADDRESS,
      network: "0g-testnet",
      fee: "0.00000",
      note: "Refund",
    },
    {
      txHash: "0xccc333",
      type: "send",
      amount: "1.00",
      currency: "OGTEST",
      status: "pending",
      timestamp: "2025-09-09T16:05:44Z",
      from: DEMO_ADDRESS,
      to: "0x00000000000000000000000000000000000000C3",
      network: "0g-testnet",
      fee: "0.00005",
      note: "Pending demo",
    },
    {
      txHash: "0xddd444",
      type: "send",
      amount: "0.50",
      currency: "OGTEST",
      status: "failed",
      timestamp: "2025-09-08T23:01:12Z",
      from: DEMO_ADDRESS,
      to: "0x00000000000000000000000000000000000000D4",
      network: "0g-testnet",
      fee: "0.00002",
      note: "Insufficient funds (mock)",
    },
    {
      txHash: "0xeee555",
      type: "receive",
      amount: "9.99",
      currency: "OGTEST",
      status: "confirmed",
      timestamp: "2025-09-08T10:20:55Z",
      from: "0x00000000000000000000000000000000000000E5",
      to: DEMO_ADDRESS,
      network: "0g-testnet",
      fee: "0.00000",
      note: "Airdrop (mock)",
    },
  ]);
});

// --- payments routes ---
app.post("/pay/initiate", (req, res) => {
  // you can read req.body.to / req.body.amount here if you want
  res.json({ txHash: "0xtest123...", status: "pending" });
});

app.get("/pay/status", (_req, res) => {
  res.json({ txHash: "0xtest123...", status: "confirmed" });
});

// --- start server ---
app.listen(PORT, () => {
  console.log(`API listening on http://0.0.0.0:${PORT}`);
});
