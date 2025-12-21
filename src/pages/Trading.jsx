import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useWallet } from "../context/WalletContext"; // Import Context
import Navbar from "../components/Navbar";
import { ArrowLeft, ArrowUp } from "lucide-react";

export default function Trading() {
  const { id } = useParams();
  const { properties, holdings, sellTokens } = useWallet(); // Get sellTokens
  const property = properties.find((p) => p.id === parseInt(id));

  // State for tabs (Buy vs Sell)
  const [activeTab, setActiveTab] = useState("buy");

  // Form State
  const [orderPrice, setOrderPrice] = useState(53800);
  const [orderAmount, setOrderAmount] = useState(1);

  // Dynamic Order Books (So we can add to them!)
  const [sellOrders, setSellOrders] = useState([
    { price: 55000, amount: 20, total: 1100000 },
    { price: 54500, amount: 50, total: 2725000 },
    { price: 54000, amount: 10, total: 540000 },
  ]);

  const [buyOrders, setBuyOrders] = useState([
    { price: 53500, amount: 100, total: 5350000 },
    { price: 53000, amount: 45, total: 2385000 },
  ]);

  if (!property) return <div className="text-white">Loading...</div>;

  // --- HANDLERS ---

  const handleSell = () => {
    // 1. Call Context to deduct tokens
    const success = sellTokens(property.id, parseInt(orderAmount));

    if (success) {
      // 2. Add to the Visual Order Book (Red List)
      const newOrder = {
        price: parseInt(orderPrice),
        amount: parseInt(orderAmount),
        total: orderPrice * orderAmount,
      };

      // Add to TOP of list and sort by price descending
      const updatedOrders = [newOrder, ...sellOrders].sort(
        (a, b) => b.price - a.price
      );
      setSellOrders(updatedOrders);

      alert("Sell Order Placed! Check the Order Book.");
    }
  };

  const handleBuy = () => {
    alert(
      "This is a simulation. In a real app, this would match with a seller."
    );
  };

  return (
    <div className="min-h-screen bg-brand-black text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-end mb-6 border-b border-brand-gray pb-6">
          <div>
            <Link
              to={`/property/${id}`}
              className="flex items-center text-gray-400 mb-2 hover:text-white"
            >
              <ArrowLeft size={16} className="mr-2" /> Back to Asset Details
            </Link>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              {property.title}{" "}
              <span className="text-sm bg-brand-gray px-2 py-1 rounded text-gray-300">
                TRADING LIVE
              </span>
            </h1>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm">Last Price</p>
            <p className="text-3xl font-bold text-brand-green">Rp 53,800</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT: CHART */}
          <div className="lg:col-span-2 bg-[#111] border border-brand-gray rounded-xl p-6 flex flex-col justify-between h-[500px]">
            <div className="flex justify-between mb-4">
              <h3 className="font-bold text-gray-400">Price Chart</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-brand-gray rounded text-xs">
                  1D
                </button>
                <button className="px-3 py-1 bg-brand-green text-black rounded text-xs font-bold">
                  1W
                </button>
              </div>
            </div>
            <div className="flex-1 flex items-end justify-between gap-1 px-4 relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-700 text-6xl font-black opacity-20 select-none">
                BLOCKSTATE
              </div>
              {[40, 60, 45, 70, 65, 80, 50, 90, 75, 60, 85, 100].map((h, i) => (
                <div
                  key={i}
                  className="w-full bg-brand-green/20 hover:bg-brand-green transition duration-300 rounded-t"
                  style={{ height: `${h}%` }}
                ></div>
              ))}
            </div>
          </div>

          {/* RIGHT: INTERACTIVE TRADING PANEL */}
          <div className="space-y-6">
            {/* 1. Order Book */}
            <div className="bg-[#111] border border-brand-gray rounded-xl p-4 h-[300px] overflow-y-auto custom-scrollbar">
              <h3 className="font-bold mb-3 text-sm text-gray-400">
                Order Book
              </h3>

              {/* Sells (Red) */}
              <div className="space-y-1 mb-2">
                {sellOrders.map((order, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-xs cursor-pointer hover:bg-white/5 p-1 rounded animate-pulse-once"
                  >
                    <span className="text-red-500">
                      {order.price.toLocaleString()}
                    </span>
                    <span className="text-gray-400">{order.amount}</span>
                    <span className="text-gray-500">
                      {order.total.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-y border-brand-gray py-2 text-center text-lg font-bold my-2">
                53,800
              </div>

              {/* Buys (Green) */}
              <div className="space-y-1">
                {buyOrders.map((order, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-xs cursor-pointer hover:bg-white/5 p-1 rounded"
                  >
                    <span className="text-green-500">
                      {order.price.toLocaleString()}
                    </span>
                    <span className="text-gray-400">{order.amount}</span>
                    <span className="text-gray-500">
                      {order.total.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Trading Form (Tabs) */}
            <div className="bg-brand-black border border-brand-green/50 rounded-xl p-5 shadow-[0_0_20px_rgba(204,255,0,0.1)]">
              {/* TABS */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setActiveTab("buy")}
                  className={`flex-1 py-2 rounded font-bold border transition ${
                    activeTab === "buy"
                      ? "bg-green-500/20 text-green-500 border-green-500/50"
                      : "bg-transparent text-gray-500 border-transparent hover:bg-gray-800"
                  }`}
                >
                  Buy
                </button>
                <button
                  onClick={() => setActiveTab("sell")}
                  className={`flex-1 py-2 rounded font-bold border transition ${
                    activeTab === "sell"
                      ? "bg-red-500/20 text-red-500 border-red-500/50"
                      : "bg-transparent text-gray-500 border-transparent hover:bg-gray-800"
                  }`}
                >
                  Sell
                </button>
              </div>

              {/* INPUTS */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500">
                    Limit Price (IDR)
                  </label>
                  <input
                    type="number"
                    value={orderPrice}
                    onChange={(e) => setOrderPrice(e.target.value)}
                    className="w-full bg-[#111] border border-brand-gray rounded p-2 text-white text-right focus:border-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">
                    Amount (Tokens)
                  </label>
                  <input
                    type="number"
                    value={orderAmount}
                    onChange={(e) => setOrderAmount(e.target.value)}
                    className="w-full bg-[#111] border border-brand-gray rounded p-2 text-white text-right focus:border-white outline-none"
                  />
                </div>

                <div className="flex justify-between text-xs text-gray-400 pt-2">
                  <span>Your Balance:</span>
                  <span>{holdings[property.id] || 0} Tokens</span>
                </div>

                {/* ACTION BUTTON */}
                {activeTab === "buy" ? (
                  <button
                    onClick={handleBuy}
                    className="w-full bg-green-500 text-black font-bold py-3 rounded mt-2 hover:bg-green-400"
                  >
                    Place Buy Order
                  </button>
                ) : (
                  <button
                    onClick={handleSell}
                    className="w-full bg-red-500 text-white font-bold py-3 rounded mt-2 hover:bg-red-600"
                  >
                    Place Sell Order
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
