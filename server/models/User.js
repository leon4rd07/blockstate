import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, sparse: true },
    passwordHash: String,
    walletAddress: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);