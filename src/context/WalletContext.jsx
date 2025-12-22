import React, { createContext, useContext, useState, useEffect } from "react";
import { properties as initialProperties } from "../data";

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  // Store properties in state so we can add new ones
  const [properties, setProperties] = useState(initialProperties);

  // Track user holdings: { propertyId: tokenAmount }
  const [holdings, setHoldings] = useState({});

  // Mock Login Function
  const connectWallet = () => {
    // In a real app, this would use window.ethereum.request
    setIsConnected(true);
    setWalletAddress("0x71C...9A23");
  };

  // Buy Logic
  const buyTokens = (propertyId, amount) => {
    const prop = properties.find((p) => String(p.id) === String(propertyId));
    const currentAmount = holdings[propertyId] || 0;

    // Basic validation
    if (!prop) {
      alert("Property not found.");
      return false;
    }

    const maxHold = 100; // per-user hard limit
    const maxPerPurchase = prop.maxPerPurchase ?? 100;

    if (amount <= 0) {
      alert("Enter a valid token amount.");
      return false;
    }

    if (amount > maxPerPurchase) {
      alert(`Purchase limit: You can only buy up to ${maxPerPurchase} tokens per transaction.`);
      return false;
    }

    if (prop.availableTokens < amount) {
      alert(`Not enough tokens available. Only ${prop.availableTokens} tokens remaining.`);
      return false;
    }

    if (currentAmount + amount > maxHold) {
      alert(
        "Limit Reached! You can only hold 100 tokens. Use the Trading feature."
      );
      return false;
    }

    // Deduct from available tokens
    setProperties((prev) =>
      prev.map((p) =>
        p.id === prop.id
          ? { ...p, availableTokens: Math.max(0, (p.availableTokens || 0) - amount) }
          : p
      )
    );

    setHoldings((prev) => ({
      ...prev,
      [propertyId]: currentAmount + amount,
    }));
    return true;
  }; 

  // Add Listing Logic
  const addProperty = (newProp) => {
    const normalized = {
      ...newProp,
      id: Date.now(),
      totalTokens: newProp.totalTokens || 1000,
      availableTokens: typeof newProp.availableTokens === "number" ? newProp.availableTokens : newProp.totalTokens || 1000,
      maxPerPurchase: typeof newProp.maxPerPurchase === "number" ? newProp.maxPerPurchase : 100,
      status: newProp.status || "Live",
    };
    setProperties([...properties, normalized]);
  }; 

  const sellTokens = (propertyId, amount) => {
    const currentAmount = holdings[propertyId] || 0;

    // Validation: Can't sell what you don't have
    if (currentAmount < amount) {
      alert(`Insufficient Balance! You only have ${currentAmount} tokens.`);
      return false;
    }

    // Increase available tokens back to the pool
    setProperties((prev) =>
      prev.map((p) =>
        String(p.id) === String(propertyId)
          ? { ...p, availableTokens: (p.availableTokens || 0) + amount }
          : p
      )
    );

    setHoldings((prev) => ({
      ...prev,
      [propertyId]: currentAmount - amount,
    }));
    return true;
  }; 

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        walletAddress,
        connectWallet,
        properties,
        holdings,
        buyTokens,
        sellTokens, // <--- Don't forget to export this!
        addProperty,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
  
}

export const useWallet = () => useContext(WalletContext);
