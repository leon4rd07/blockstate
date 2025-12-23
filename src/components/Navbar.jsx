import React from "react";
import { LayoutGrid, Wallet, PlusCircle, User } from "lucide-react";
import { useWallet } from "../context/WalletContext";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const { isConnected, connectWallet, walletAddress, isAuthenticated, logout } = useWallet();
  const navigate = useNavigate();

  const truncateAddress = (addr) => {
    if (!addr) return "Connected";
    const raw = String(addr);
    if (raw.includes("...")) return raw; // already short
    if (raw.length <= 12) return raw;
    return `${raw.slice(0,6)}...${raw.slice(-4)}`;
  };

  const handleConnect = async () => {
    const ok = await connectWallet();
    if (ok) navigate("/marketplace"); // Auto-redirect on success
  }; 

  return (
    <nav className="border-b border-brand-gray bg-brand-black p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-brand-green p-1 rounded">
            <LayoutGrid size={24} className="text-black" />
          </div>
          <h1 className="text-2xl font-bold tracking-tighter text-white">
            BLOCKSTATE<span className="text-brand-green">_</span>
          </h1>
        </Link>

        <div className="flex gap-4">
          {isConnected && (
            <Link
              to="/create"
              className="flex items-center gap-2 text-sm font-bold text-gray-300 hover:text-white transition"
            >
              <PlusCircle size={18} /> List Property
            </Link>
          )}

          <button
            onClick={handleConnect}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition ${
              isConnected
                ? "bg-brand-green text-black"
                : "bg-brand-gray text-white hover:bg-gray-700"
            }`}
          >
            <Wallet size={18} />
            {isConnected ? truncateAddress(walletAddress) : "Connect"}
          </button>

          {/* Profile Button (to the right of wallet button) */}
          {!isAuthenticated && (
            <Link to="/register" className="px-3 py-2 rounded-lg bg-transparent text-brand-green hover:underline flex items-center gap-2 transition">
              Register
            </Link>
          )}

          <Link to={isAuthenticated ? "/profile" : "/login"} className="px-3 py-2 rounded-lg bg-brand-gray text-white hover:bg-gray-700 flex items-center gap-2 transition">
            <User size={18} /> {isAuthenticated ? 'Profile' : 'Sign In'}
          </Link>

          {isAuthenticated && (
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center gap-2 transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
