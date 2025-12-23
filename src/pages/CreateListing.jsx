import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useWallet } from "../context/WalletContext";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    location: "",
    price: "",
    tokenPrice: "",
    apy: "",
    image: "",
    totalTokens: 1000,
    maxPerPurchase: 100,
    description: "",
  });
  const [error, setError] = useState("");

  const { addProperty, isAuthenticated, user } = useWallet();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setError("You must be signed in to list a property.");
      return navigate("/login");
    }

    // Basic validation
    if (!form.image) {
      setError("Please provide an image URL for the property.");
      return;
    }

    if (!form.totalTokens || parseInt(form.totalTokens) <= 0) {
      setError("Total tokens must be greater than 0.");
      return;
    }

    if (form.maxPerPurchase > form.totalTokens) {
      setError("Max per purchase cannot exceed total tokens.");
      return;
    }

    addProperty({
      ...form,
      tokenPrice: parseInt(form.tokenPrice) || 0,
      totalTokens: parseInt(form.totalTokens) || 1000,
      availableTokens: parseInt(form.totalTokens) || 1000,
      maxPerPurchase: parseInt(form.maxPerPurchase) || 100,
      status: "Live",
      createdBy: user?.username || user?.id || null,
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
          {error && <div className="text-sm text-red-400">{error}</div>}

          <div>
            <label className="block text-gray-400 mb-2">Property Name</label>
            <input
              value={form.title}
              className="w-full bg-brand-black border border-brand-gray p-3 rounded-lg text-white focus:border-brand-green outline-none"
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Location</label>
            <input
              value={form.location}
              className="w-full bg-brand-black border border-brand-gray p-3 rounded-lg text-white focus:border-brand-green outline-none"
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Image URL</label>
            <input
              value={form.image}
              className="w-full bg-brand-black border border-brand-gray p-3 rounded-lg text-white focus:border-brand-green outline-none"
              placeholder="https://..."
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Description</label>
            <textarea
              value={form.description}
              rows={4}
              className="w-full bg-brand-black border border-brand-gray p-3 rounded-lg text-white focus:border-brand-green outline-none"
              placeholder="Short description of the property and highlights..."
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-400 mb-2">Total Tokens</label>
              <input
                type="number"
                value={form.totalTokens}
                min={1}
                className="w-full bg-brand-black border border-brand-gray p-3 rounded-lg text-white focus:border-brand-green outline-none"
                onChange={(e) => setForm({ ...form, totalTokens: parseInt(e.target.value) })}
                required
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Max Per Purchase</label>
              <input
                type="number"
                value={form.maxPerPurchase}
                min={1}
                className="w-full bg-brand-black border border-brand-gray p-3 rounded-lg text-white focus:border-brand-green outline-none"
                onChange={(e) => setForm({ ...form, maxPerPurchase: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-400 mb-2">Token Price (IDR)</label>
              <input
                type="number"
                value={form.tokenPrice}
                className="w-full bg-brand-black border border-brand-gray p-3 rounded-lg text-white focus:border-brand-green outline-none"
                onChange={(e) =>
                  setForm({ ...form, tokenPrice: parseInt(e.target.value) })
                }
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Expected APY (%)</label>
              <input
                value={form.apy}
                className="w-full bg-brand-black border border-brand-gray p-3 rounded-lg text-white focus:border-brand-green outline-none"
                onChange={(e) => setForm({ ...form, apy: e.target.value })}
                required
              />
            </div>
          </div>

          <button className="w-full bg-brand-green text-black font-bold py-4 rounded-xl mt-4">Submit Listing</button>

          {/* Preview */}
          <div className="mt-6 p-4 bg-[#0b0b0b] rounded-lg border border-brand-gray">
            <h4 className="font-bold mb-2">Preview</h4>
            <div className="flex gap-4 items-center">
              <img src={form.image || "https://images.unsplash.com/photo-1600596542815-e32870110029?auto=format&fit=crop&w=800&q=80"} alt="preview" className="w-28 h-20 object-cover rounded" />
              <div>
                <div className="font-bold">{form.title || "Property title"}</div>
                <div className="text-sm text-gray-400">{form.location || "Location"}</div>
                <div className="text-sm text-gray-400 mt-2">Token Price: Rp {form.tokenPrice?.toLocaleString?.() || "-"}</div>
                <div className="text-sm text-gray-400">Tokens: {form.totalTokens}</div>
                <div className="text-sm text-gray-400">Max per purchase: {form.maxPerPurchase}</div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
