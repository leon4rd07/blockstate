import React from "react";
import Navbar from "../components/Navbar";
import { UserCheck, Search, Coins, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-brand-black text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold mb-6">
          How <span className="text-brand-green">Blockstate</span> Works
        </h1>
        <p className="text-gray-400 text-xl mb-16">
          We democratize real estate investing by splitting property ownership
          into digital tokens.
        </p>

        <div className="grid md:grid-cols-2 gap-8 text-left">
          <StepCard
            number="01"
            icon={<UserCheck size={32} />}
            title="Connect & Verify"
            desc="Connect your wallet. For compliance, we verify your identity (KYC) to ensure legally enforceable ownership."
          />
          <StepCard
            number="02"
            icon={<Search size={32} />}
            title="Browse Properties"
            desc="Explore our curated list of high-yield properties. Review legal documents, location, and financial projections."
          />
          <StepCard
            number="03"
            icon={<Coins size={32} />}
            title="Buy Fractional Tokens"
            desc="Purchase tokens representing shares of the property. Minimum investment starts from IDR 10.000."
          />
          <StepCard
            number="04"
            icon={<TrendingUp size={32} />}
            title="Earn & Trade"
            desc="Earn rental yield dividends directly to your wallet. Trade your tokens on our secondary market for instant liquidity."
          />
        </div>

        <div className="mt-16 p-8 bg-[#111] border border-brand-green/30 rounded-2xl">
          <h3 className="text-2xl font-bold mb-4">Ready to start?</h3>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 bg-brand-green text-black px-8 py-4 rounded-full font-bold hover:scale-105 transition"
          >
            Go to Marketplace <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function StepCard({ number, icon, title, desc }) {
  return (
    <div className="bg-[#111] p-8 rounded-2xl border border-white/10 hover:border-brand-green transition group">
      <div className="flex justify-between items-start mb-6">
        <div className="text-brand-green group-hover:scale-110 transition duration-300 bg-brand-green/10 p-3 rounded-lg">
          {icon}
        </div>
        <span className="text-4xl font-black text-gray-800">{number}</span>
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}
