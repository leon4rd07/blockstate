import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom"; // <--- ADDED Link HERE
import { useWallet } from "../context/WalletContext";
import Navbar from "../components/Navbar";
import { ShieldCheck, TrendingUp, ExternalLink } from "lucide-react";
import BackButton from "../components/BackButton";

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { properties, buyTokens, holdings, isConnected, connectWallet } =
    useWallet();
  const [amount, setAmount] = useState(1);

  const property = properties.find((p) => p.id === parseInt(id));
  const userBalance = holdings[property?.id] || 0;

  // Logic: You are "Maxed Out" if you hold 100 tokens
  const isMaxedOut = userBalance >= 100;

  if (!property)
    return (
      <div className="min-h-screen bg-brand-black text-white p-10">
        <Navbar />
        <div className="text-center mt-20">
          <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
          <button
            onClick={() => navigate("/marketplace")}
            className="text-brand-green hover:underline"
          >
            Return to Marketplace
          </button>
        </div>
      </div>
    );

  const handleBuy = () => {
    if (!isConnected) {
      connectWallet();
      return;
    }
    const success = buyTokens(property.id, parseInt(amount));
    if (success) alert(`Success! You bought ${amount} tokens.`);
  };

  return (
    <div className="min-h-screen bg-brand-black text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Navigation Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <BackButton />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Left: Image */}
          <div>
            <img
              src={property.image}
              alt={property.title}
              className="w-full rounded-2xl border border-brand-gray object-cover h-[400px]"
            />

            {/* Ownership Status Card */}
            <div className="mt-6 bg-brand-gray/20 p-6 rounded-xl border border-brand-gray">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <ShieldCheck className="text-brand-green" /> Your Ownership
              </h3>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Tokens Held:</span>
                <span className="font-bold text-white text-xl">
                  {userBalance} / 100
                </span>
              </div>
              <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-brand-green h-full"
                  style={{ width: `${(userBalance / 100) * 100}%` }}
                ></div>
              </div>
              {isMaxedOut && (
                <p className="text-brand-green text-xs mt-2 font-bold text-center">
                  MAX LIMIT REACHED
                </p>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div>
            <h1 className="text-4xl font-bold mb-2">{property.title}</h1>
            <p className="text-gray-400 text-lg mb-2">{property.location}</p>
            {property.description && (
              <p className="text-gray-300 mb-6">{property.description}</p>
            )}

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-brand-gray/30 p-4 rounded-lg">
                <div className="text-gray-400 text-sm">Token Price</div>
                <div className="text-2xl font-bold">
                  Rp {property.tokenPrice?.toLocaleString()}
                </div>
              </div>
              <div className="bg-brand-gray/30 p-4 rounded-lg">
                <div className="text-gray-400 text-sm">Projected APY</div>
                <div className="text-2xl font-bold text-brand-green">
                  {property.apy}
                </div>
              </div>
            </div>

            {/* ACTION BOX */}
            <div className="bg-[#111] border border-brand-gray p-6 rounded-2xl space-y-4">
              {/* 1. BUY SECTION (Only if not maxed) */}
              {!isMaxedOut ? (
                <>
                  <h3 className="text-xl font-bold">Buy Tokens</h3>

                  <div className="flex items-center gap-4 mb-3">
                    <div className="text-sm text-gray-400">Available: <span className="text-white font-semibold">{property.availableTokens}</span></div>
                    <div className="text-sm text-gray-400">Max per purchase: <span className="text-white font-semibold">{property.maxPerPurchase ?? 100}</span></div>
                  </div>

                  <div className="flex gap-4">
                    <input
                      type="number"
                      min={1}
                      max={Math.min(property.maxPerPurchase ?? 100, 100 - userBalance, property.availableTokens || 0)}
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="bg-brand-black border border-brand-gray rounded-lg px-4 py-3 w-full text-white focus:border-brand-green outline-none"
                    />
                    <div className="flex items-center text-gray-400 whitespace-nowrap">tokens</div>
                  </div>

                  <div className="flex justify-between text-sm text-gray-400 mt-2">
                    <span>Total Cost:</span>
                    <span className="text-white">Rp {(property.tokenPrice * (Number(amount) || 0)).toLocaleString()}</span>
                  </div>

                  <button
                    onClick={handleBuy}
                    disabled={
                      !isConnected ||
                      Number(amount) <= 0 ||
                      Number(amount) > Math.min(property.maxPerPurchase ?? 100, 100 - userBalance, property.availableTokens || 0)
                    }
                    className={`w-full font-bold py-4 rounded-xl transition ${
                      !isConnected
                        ? "bg-gray-700 text-gray-300"
                        : "bg-brand-green text-black hover:opacity-90"
                    }`}
                  >
                    {isConnected ? "Confirm Purchase" : "Connect Wallet to Buy"}
                  </button>
                </>
              ) : (
                <div className="bg-brand-green/10 border border-brand-green/30 p-4 rounded-xl text-center">
                  <TrendingUp className="mx-auto text-brand-green mb-2" />
                  <p className="text-white font-bold">Ownership Limit Reached</p>
                  <p className="text-sm text-gray-400">You hold the maximum allowed tokens for this asset.</p>
                </div>
              )}

              {/* 2. TRADING BUTTON (Visible to EVERYONE) */}
              <div className="pt-4 border-t border-gray-800">
                <Link
                  to={`/trading/${property.id}`}
                  className="flex items-center justify-center gap-2 w-full bg-brand-gray/50 hover:bg-brand-gray text-white font-bold py-3 rounded-xl transition"
                >
                  <ExternalLink size={18} />
                  View Order Book & Market
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
