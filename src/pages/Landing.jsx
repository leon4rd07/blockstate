import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Building2, ShieldCheck, Wallet } from "lucide-react";
import Navbar from "../components/Navbar";

export default function Landing() {
  return (
    <div className="min-h-screen bg-brand-black text-white selection:bg-brand-green selection:text-black">
      <Navbar />

      {/* HERO SECTION */}
      <header className="relative py-20 px-4 overflow-hidden">
        {/* Background Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-green/20 rounded-full blur-[120px] -z-10"></div>

        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-block border border-brand-green/30 bg-brand-green/10 px-4 py-1 rounded-full text-brand-green text-sm font-bold tracking-wide animate-pulse">
            🚀 WEB3 REAL ESTATE IS HERE
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-tight">
            OWN A PIECE OF <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-white">
              THE FUTURE
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Blockstate allows you to invest in premium real estate with as
            little as
            <span className="text-white font-bold"> IDR 50.000</span>. Powered
            by blockchain, secured by law.
          </p>

          <div className="flex justify-center gap-4 pt-4">
            <Link
              to="/marketplace"
              className="bg-brand-green text-black px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition flex items-center gap-2"
            >
              Start Investing <ArrowRight size={20} />
            </Link>
            <Link to="/how-it-works" className="border border-white/20 px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition">
            How it Works
            </Link>
          </div>
        </div>
      </header>

      {/* FEATURES SECTION */}
      <section className="py-20 bg-[#111]">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Building2 size={32} />}
            title="Premium Assets"
            desc="Curated high-yield properties in Bali and Jakarta, verified by legal experts."
          />
          <FeatureCard
            icon={<Wallet size={32} />}
            title="Instant Liquidity"
            desc="Buy and sell your property tokens instantly. No more waiting months for a buyer."
          />
          <FeatureCard
            icon={<ShieldCheck size={32} />}
            title="Legally Compliant"
            desc="Our SPV structure ensures your digital tokens represent real legal ownership."
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-8 border border-white/10 rounded-2xl hover:border-brand-green/50 transition bg-brand-black/50 group">
      <div className="mb-4 text-brand-green group-hover:scale-110 transition duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}
