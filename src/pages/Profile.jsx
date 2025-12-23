import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useWallet } from "../context/WalletContext";
import {
  User,
  Copy,
  Edit2,
  Clock,
  Image as ImgIcon,
  Mail,
} from "lucide-react";
import BackButton from "../components/BackButton";

export default function Profile() {
  const { walletAddress, holdings, properties, user } = useWallet();
  const [copied, setCopied] = useState(false);

  const truncate = (addr = "") => {
    if (!addr) return "Not connected";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Use username initials if available, otherwise derive from wallet
  const initials = (addr = "") => {
    if (user?.username) return String(user.username).slice(0, 2).toUpperCase();
    if (!addr) return "?";
    // Use first two non-0x chars
    const clean = addr.replace(/^0x/i, "");
    return clean.slice(0, 2).toUpperCase();
  };

  const displayName = user?.username || 'Investor';

  // Email state (persisted locally)
  const [email, setEmail] = useState(() => localStorage.getItem("profile_email") || "");
  const [editingEmail, setEditingEmail] = useState(false);
  const [emailInput, setEmailInput] = useState(email);
  const [emailError, setEmailError] = useState("");

  const handleSaveEmail = () => {
    const val = emailInput.trim();
    if (val && !/^\S+@\S+\.\S+$/.test(val)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmail(val);
    localStorage.setItem("profile_email", val);
    setEditingEmail(false);
    setEmailError("");
  }; 

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch (e) {
      console.warn("Copy failed", e);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black text-white selection:bg-brand-green selection:text-black">
      <Navbar />

      <div className="max-w-6xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="mb-4">
          {/* Back Button */}
          <div className="mb-4">
            <BackButton />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-green to-white flex items-center justify-center text-black text-xl font-extrabold shadow-lg">
              {initials(walletAddress)}
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-bold">{displayName}</h2>
              <div className="flex items-center gap-3 mt-1 text-gray-400">
                <span className="font-mono">{truncate(walletAddress)}</span>
                {walletAddress && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 text-sm text-gray-300 bg-[#0b0b0b] px-2 py-1 rounded hover:bg-white/5 transition"
                  >
                    <Copy size={14} /> {copied ? "Copied" : "Copy"}
                  </button>
                )}
              </div>

              <div className="mt-2">
                {editingEmail ? (
                  <div className="flex items-center gap-2">
                    <input
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="bg-[#0b0b0b] px-3 py-1 rounded text-sm text-white outline-none"
                      placeholder="you@example.com"
                    />
                    <button onClick={handleSaveEmail} className="px-3 py-1 bg-brand-green text-black rounded text-sm">Save</button>
                    <button onClick={() => { setEditingEmail(false); setEmailInput(email); setEmailError(''); }} className="text-sm text-gray-400">Cancel</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-gray-400">
                    <span className="text-sm"><span className="font-bold text-white">Email:</span> {email || 'Not set'}</span>
                    <button onClick={() => { setEditingEmail(true); setEmailInput(email); }} className="flex items-center gap-2 text-sm text-gray-300 bg-[#0b0b0b] px-2 py-1 rounded hover:bg-white/5 transition">
                      <Mail size={14} /> {email ? 'Edit' : 'Add'}
                    </button>
                  </div>
                )}
                {emailError && <div className="text-xs text-red-400 mt-1">{emailError}</div>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-[#111] px-4 py-2 rounded-lg border border-white/10 hover:border-brand-green transition">
              <Edit2 size={16} /> Edit Profile
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Properties */}
          <div className="lg:col-span-2 p-6 bg-[#0b0b0b] rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Your Properties</h3>
              <div className="text-sm text-gray-400">{Object.keys(holdings).length} entries</div>
            </div>

            {Object.keys(holdings).length === 0 ? (
              <div className="text-gray-400">You don't own any tokens yet. Explore the marketplace to start investing.</div>
            ) : (
              <ul className="space-y-4">
                {Object.entries(holdings).map(([propId, amount]) => {
                  const prop = properties.find((p) => String(p.id) === String(propId));
                  const percent = prop ? Math.min(100, Math.round((amount / (prop.totalTokens || 1)) * 100)) : 0;

                  return (
                    <li key={propId} className="flex gap-4 items-center">
                      <img src={prop?.image} alt={prop?.title} className="w-20 h-14 rounded-lg object-cover border border-white/10" />

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold">{prop?.title || `Property ${propId}`}</div>
                            <div className="text-sm text-gray-400">{prop?.location}</div>
                          </div>

                          <div className="text-right">
                            <div className="font-semibold text-brand-green">{amount} tokens</div>
                            <div className="text-xs text-gray-400">{percent}% owned</div>
                          </div>
                        </div>

                        <div className="w-full bg-white/5 h-2 rounded mt-3 overflow-hidden">
                          <div
                            className="h-2 bg-brand-green"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            {/* User's Listings */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Your Listings</h3>
                <div className="text-sm text-gray-400">{properties.filter((p) => String(p.ownerId) === String(user?.id)).length} entries</div>
              </div>

              {properties.filter((p) => String(p.ownerId) === String(user?.id)).length === 0 ? (
                <div className="text-gray-400">You haven't listed any properties yet. Use "List Property" to add one.</div>
              ) : (
                <ul className="space-y-4">
                  {properties.filter((p) => String(p.ownerId) === String(user?.id)).map((prop) => (
                    <li key={prop.id} className="flex gap-4 items-center">
                      <img src={prop?.image} alt={prop?.title} className="w-20 h-14 rounded-lg object-cover border border-white/10" />

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold">{prop?.title}</div>
                            <div className="text-sm text-gray-400">{prop?.location}</div>
                          </div>

                          <div className="text-right">
                            <div className="font-semibold text-brand-green">{prop.availableTokens} available</div>
                            <div className="text-xs text-gray-400">{((prop.availableTokens / (prop.totalTokens || 1)) * 100).toFixed(0)}% available</div>

                            <div className="mt-2">
                              <button onClick={() => { /* no-op for now */ }} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                                Related Documents
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Recent Activity / Actions */}
          <div className="p-6 bg-[#0b0b0b] rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold">Recent Activity</h4>
              <div className="text-sm text-gray-400">Last 30 days</div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded bg-white/5">
                  <Clock size={16} />
                </div>
                <div>
                  <div className="text-sm">No recent activity</div>
                  <div className="text-xs text-gray-400">Buy or sell tokens and transactions will appear here.</div>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
