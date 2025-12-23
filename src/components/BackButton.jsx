import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ to = "/marketplace", label = "Back to Marketplace", className = "" }) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-2 text-gray-400 hover:text-white transition ${className}`}
    >
      <ArrowLeft size={16} />
      <span className="text-sm">{label}</span>
    </Link>
  );
}
