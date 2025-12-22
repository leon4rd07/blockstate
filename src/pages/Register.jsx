import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useWallet } from "../context/WalletContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const { register } = useWallet();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username || !password) return setError("Please provide username and password.");
    if (password !== confirm) return setError("Passwords do not match.");
    const ok = await register(username, password);
    if (ok) navigate("/marketplace");
  };

  return (
    <div className="min-h-screen bg-brand-black text-white selection:bg-brand-green selection:text-black">
      <Navbar />
      <div className="max-w-md mx-auto p-8 mt-12 bg-[#0b0b0b] rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Create an account</h1>
        <p className="text-sm text-gray-400 mb-6">Register with a username and password</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-300">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded bg-[#0b0b0b] border border-white/5 outline-none"
              placeholder="Choose a username"
            />
          </div>

          <div>
            <label className="text-xs text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded bg-[#0b0b0b] border border-white/5 outline-none"
              placeholder="Password"
            />
          </div>

          <div>
            <label className="text-xs text-gray-300">Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded bg-[#0b0b0b] border border-white/5 outline-none"
              placeholder="Confirm password"
            />
          </div>

          {error && <div className="text-sm text-red-400">{error}</div>}

          <div className="flex gap-2">
            <button type="submit" className="flex-1 px-4 py-2 bg-brand-green text-black rounded font-bold">Register</button>
          </div>
        </form>

        <div className="mt-4 text-sm text-gray-400">
          Already have an account? <Link to="/login" className="text-brand-green">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
