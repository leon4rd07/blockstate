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
    const currentAmount = holdings[propertyId] || 0;

    if (currentAmount + amount > 100) {
      alert(
        "Limit Reached! You can only hold 100 tokens. Use the Trading feature."
      );
      return false;
    }

    setHoldings((prev) => ({
      ...prev,
      [propertyId]: currentAmount + amount,
    }));
    return true;
  };

  // Add Listing Logic
  const addProperty = (newProp) => {
    setProperties([...properties, { ...newProp, id: Date.now() }]);
  };

  const sellTokens = (propertyId, amount) => {
    const currentAmount = holdings[propertyId] || 0;

    // Validation: Can't sell what you don't have
    if (currentAmount < amount) {
      alert(`Insufficient Balance! You only have ${currentAmount} tokens.`);
      return false;
    }

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
