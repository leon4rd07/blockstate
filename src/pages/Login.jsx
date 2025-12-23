import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useWallet } from "../context/WalletContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login, connectWallet, isAuthenticated } = useWallet();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const ok = await login(username || "guest", password);
    if (ok) {
      navigate("/profile");
    }
  };

  const handleConnectWallet = async () => {
    const ok = await connectWallet();
    if (ok) navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-brand-black text-white selection:bg-brand-green selection:text-black">
      <Navbar />

      <div className="max-w-md mx-auto p-8 mt-12 bg-[#0b0b0b] rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Welcome back</h1>
        <p className="text-sm text-gray-400 mb-6">Sign in with your account or connect your wallet</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs text-gray-300">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded bg-[#0b0b0b] border border-white/5 outline-none"
              placeholder="Your username"
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

          <div className="flex gap-2">
            <button type="submit" className="flex-1 px-4 py-2 bg-brand-green text-black rounded font-bold">Login</button>
            <button type="button" onClick={handleConnectWallet} className="flex-1 px-4 py-2 bg-gray-700 rounded">Connect Wallet</button>
          </div>
        </form>

        {isAuthenticated && <div className="mt-4 text-sm text-green-400">You're signed in — redirecting to profile...</div>}

        <div className="mt-4 text-sm text-gray-400">Don't have an account? <a href="/register" className="text-brand-green">Register</a></div>
      </div>
    </div>
  );
}
