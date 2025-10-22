import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ---- Mock endpoints for demo ---- //

app.get("/health", (req, res) => {
  res.json({ status: "ok", network: "0g Galileo (mocked)" });
});

app.get("/wallet/balance", (req, res) => {
  res.json({
    address: "0xABBF82740C567974610B09B57d749b2045C7F74e",
    balance: "8.00",
    symbol: "OG",
    usdValue: "8.00",
  });
});

app.post("/pay/initiate", (req, res) => {
  const { to, amount } = req.body;
  res.json({
    txHash: "0xDEMO1234567890ABCDEF",
    from: "0xABBF82740C567974610B09B57d749b2045C7F74e",
    to,
    amount,
    status: "confirmed",
    message: "Mock payment successful ✅",
  });
});

app.get("/pay/status", (req, res) => {
  res.json({
    txHash: "0xDEMO1234567890ABCDEF",
    status: "confirmed",
    blockNumber: 123456,
  });
});

// ---- Start server ---- //
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Mock API running on port ${PORT}`));
