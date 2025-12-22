import mongoose from "mongoose";

const VoteSchema = new mongoose.Schema({
  voter: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  option: String,
  createdAt: { type: Date, default: Date.now },
});

const ProposalSchema = new mongoose.Schema(
  {
    propertyId: { type: String, required: true },
    title: { type: String, required: true },
    description: String,
    options: [String], // options to vote on
    votes: [VoteSchema],
    proposer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["active", "closed"], default: "active" },
  },
  { timestamps: true }
);

export default mongoose.model("Proposal", ProposalSchema);