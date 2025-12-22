import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import Proposal from "./models/Proposal.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

if (!MONGO_URI) {
  console.warn("MONGO_URI not set — database will not connect until you add it to .env");
}

mongoose
  .connect(MONGO_URI, { autoIndex: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

function signToken(user) {
  return jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
}

async function getUserSafe(user) {
  if (!user) return null;
  return {
    id: user._id,
    username: user.username,
    walletAddress: user.walletAddress,
    createdAt: user.createdAt,
  };
}

// Register (optional)
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Missing username/password" });
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: "Username already exists" });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, passwordHash: hash });
    const token = signToken(user);
    res.json({ token, user: await getUserSafe(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Missing username/password" });
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const valid = await bcrypt.compare(password, user.passwordHash || "");
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });
    const token = signToken(user);
    res.json({ token, user: await getUserSafe(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Wallet Connect: create or find user by wallet address
app.post("/api/auth/wallet-connect", async (req, res) => {
  try {
    const { address } = req.body;
    if (!address) return res.status(400).json({ message: "Missing wallet address" });
    const normalized = String(address).toLowerCase();
    let user = await User.findOne({ walletAddress: normalized });
    if (!user) {
      user = await User.create({ walletAddress: normalized });
    }
    const token = signToken(user);
    res.json({ token, user: await getUserSafe(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Simple auth middleware for API endpoints that need a user
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "Missing token" });
  const parts = auth.split(" ");
  if (parts.length !== 2) return res.status(401).json({ message: "Invalid token" });
  const token = parts[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// Proposals: create, list, vote
app.post("/api/proposals", authMiddleware, async (req, res) => {
  try {
    const { propertyId, title, description, options, ownerId } = req.body;
    if (!propertyId || !title || !options || !Array.isArray(options) || options.length < 2)
      return res.status(400).json({ message: "Missing required fields (propertyId, title, options>=2)" });

    // Only the property owner (ownerId) may create proposals for it
    if (!ownerId || String(ownerId) !== String(req.userId)) {
      return res.status(403).json({ message: "Only the property owner can create proposals for this property" });
    }

    const proposal = await Proposal.create({
      propertyId: String(propertyId),
      title,
      description,
      options,
      proposer: req.userId,
    });
    res.json({ proposal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/proposals/:propertyId", async (req, res) => {
  try {
    const { propertyId } = req.params;
    const proposals = await Proposal.find({ propertyId: String(propertyId) })
      .populate("proposer", "username walletAddress")
      .populate("votes.voter", "username walletAddress")
      .sort({ createdAt: -1 });
    res.json({ proposals });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/proposals/:id/vote", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { option } = req.body;
    const proposal = await Proposal.findById(id);
    if (!proposal) return res.status(404).json({ message: "Proposal not found" });
    if (proposal.status !== "active") return res.status(400).json({ message: "Proposal is not active" });
    if (!proposal.options.includes(option)) return res.status(400).json({ message: "Invalid option" });

    // Prevent double-vote: simple check by voter id
    const existing = proposal.votes.find((v) => String(v.voter) === String(req.userId));
    if (existing) {
      // allow changing vote
      existing.option = option;
    } else {
      proposal.votes.push({ voter: req.userId, option });
    }
    await proposal.save();
    res.json({ proposal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Close a proposal (only proposer can close)
app.post("/api/proposals/:id/close", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const proposal = await Proposal.findById(id);
    if (!proposal) return res.status(404).json({ message: "Proposal not found" });
    if (String(proposal.proposer) !== String(req.userId)) return res.status(403).json({ message: "Only proposer can close the proposal" });
    if (proposal.status === "closed") return res.status(400).json({ message: "Proposal already closed" });
    proposal.status = "closed";
    await proposal.save();
    res.json({ proposal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Me
app.get("/api/auth/me", async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ message: "Missing token" });
    const parts = auth.split(" ");
    if (parts.length !== 2) return res.status(401).json({ message: "Invalid token" });
    const token = parts[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });
    res.json({ user: await getUserSafe(user) });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid token" });
  }
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));