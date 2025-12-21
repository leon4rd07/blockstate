import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useWallet } from "../context/WalletContext";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
  const { addProperty } = useWallet();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    location: "",
    price: "",
    tokenPrice: "",
    apy: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addProperty({
      ...form,
      image:
        "https://images.unsplash.com/photo-1600596542815-e32870110029?auto=format&fit=crop&w=800&q=80", // Default image
      availableTokens: 1000,
      totalTokens: 1000,
      status: "New Listing",
    });
    alert("Property Listed Successfully!");
    navigate("/marketplace");
  };

  return (
    <div className="min-h-screen bg-brand-black text-white">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">List Your Property</h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-[#111] p-8 rounded-2xl border border-brand-gray"
        >
          <div>
            <label className="block text-gray-400 mb-2">Property Name</label>
            <input
              className="w-full bg-brand-black border border-brand-gray p-3 rounded-lg text-white focus:border-brand-green outline-none"
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Location</label>
            <input
              className="w-full bg-brand-black border border-brand-gray p-3 rounded-lg text-white focus:border-brand-green outline-none"
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-400 mb-2">
                Token Price (IDR)
              </label>
              <input
                type="number"
                className="w-full bg-brand-black border border-brand-gray p-3 rounded-lg text-white focus:border-brand-green outline-none"
                onChange={(e) =>
                  setForm({ ...form, tokenPrice: parseInt(e.target.value) })
                }
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">
                Expected APY (%)
              </label>
              <input
                className="w-full bg-brand-black border border-brand-gray p-3 rounded-lg text-white focus:border-brand-green outline-none"
                onChange={(e) => setForm({ ...form, apy: e.target.value })}
                required
              />
            </div>
          </div>

          <button className="w-full bg-brand-green text-black font-bold py-4 rounded-xl mt-4">
            Submit Listing
          </button>
        </form>
      </div>
    </div>
  );
}
