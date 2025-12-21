import React from "react";
import { LayoutGrid, Wallet, PlusCircle } from "lucide-react";
import { useWallet } from "../context/WalletContext";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const { isConnected, connectWallet, walletAddress } = useWallet();
  const navigate = useNavigate();

  const handleConnect = () => {
    connectWallet();
    navigate("/marketplace"); // Auto-redirect after login
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
            {isConnected ? walletAddress : "Connect Wallet"}
          </button>
        </div>
      </div>
    </nav>
  );
}
