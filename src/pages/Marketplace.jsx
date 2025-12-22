import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useWallet } from "../context/WalletContext";
import { MapPin, TrendingUp, Lock, Wallet } from "lucide-react";

export default function Marketplace() {
  const { properties, isConnected, connectWallet } = useWallet();

  return (
    <div className="min-h-screen bg-brand-black">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-brand-black to-[#0f0f0f] py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-4">
            Own Real Estate from{" "}
            <span className="text-brand-green">IDR 50.000</span>
          </h2>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            The world's first fractional real estate marketplace.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* --- LOCKED STATE LOGIC --- */}
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[#111] border border-brand-gray rounded-2xl text-center">
            <div className="bg-brand-gray/50 p-6 rounded-full mb-6">
              <Lock size={48} className="text-brand-green" />
            </div>
            <h3 className="text-3xl font-bold mb-4">Marketplace Locked</h3>
            <p className="text-gray-400 max-w-md mb-8">
              You must connect your wallet to view live property listings,
              prices, and APY data.
            </p>
            <button
              onClick={connectWallet}
              className="bg-brand-green text-black text-lg font-bold px-8 py-4 rounded-full flex items-center gap-2 hover:scale-105 transition"
            >
              <Wallet size={24} />
              Connect Wallet to Unlock
            </button>
          </div>
        ) : (
          /* --- UNLOCKED STATE (GRID) --- */
          <>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="text-brand-green" /> Trending Properties
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((prop) => (
                <Link to={`/property/${prop.id}`} key={prop.id}>
                  <div className="bg-brand-black border border-brand-gray rounded-xl overflow-hidden hover:border-brand-green transition group cursor-pointer h-full">
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={prop.image}
                        alt={prop.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      />
                      <span className="absolute top-2 right-2 bg-brand-green text-black text-xs font-bold px-2 py-1 rounded">
                        {prop.status || "Live"}
                      </span>
                    </div>

                    <div className="p-5">
                      <h4 className="text-xl font-bold mb-1">{prop.title}</h4>
                      <div className="flex items-center text-gray-400 text-sm mb-4">
                        <MapPin size={14} className="mr-1" /> {prop.location}
                      </div>

                      {prop.description && (
                        <p className="text-sm text-gray-400 mb-4">{prop.description.length > 120 ? `${prop.description.slice(0,120)}...` : prop.description}</p>
                      )}

                      <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-brand-gray/30 rounded-lg">
                        <div>
                          <p className="text-gray-500 text-xs">Projected APY</p>
                          <p className="text-brand-green font-bold">
                            {prop.apy}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Token Price</p>
                          <p className="text-white font-bold">
                            Rp {prop.tokenPrice?.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="w-full bg-white text-center text-black font-bold py-3 rounded-lg group-hover:bg-brand-green transition">
                        View Details
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
