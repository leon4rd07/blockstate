import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "./context/WalletContext";
import Landing from "./pages/Landing";
import Marketplace from "./pages/Marketplace";
import PropertyDetail from "./pages/PropertyDetail";
import CreateListing from "./pages/CreateListing";
import HowItWorks from "./pages/HowItWorks"; // Import
import Trading from "./pages/Trading"; // Import
import Profile from "./pages/Profile"; // Import Profile
import Login from "./pages/Login"; // Import Login
import Register from "./pages/Register"; // Import Register

function App() {
  return (
    <WalletProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/create" element={<CreateListing />} />
          <Route path="/how-it-works" element={<HowItWorks />} />{" "}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/trading/:id" element={<Trading />} /> {/* Add Route */}
        </Routes>
      </BrowserRouter>
    </WalletProvider>
  );
}

export default App;
