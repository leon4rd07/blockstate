import React, { createContext, useContext, useState, useEffect } from "react";
import { properties as initialProperties } from "../data";

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  // Basic auth state (mock)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Store properties in state so we can add new ones
  const [properties, setProperties] = useState(initialProperties);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  // Login via backend
  const login = async (username = "guest", password = "") => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Login failed");
        return false;
      }
      const { token, user: fetchedUser } = data;
      localStorage.setItem("token", token);
      setIsAuthenticated(true);
      setUser(fetchedUser);
      return true;
    } catch (err) {
      console.error("Login error", err);
      alert("Login error");
      return false;
    }
  };

  // Register via backend
  const register = async (username = "", password = "") => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Registration failed");
        return false;
      }
      const { token, user: fetchedUser } = data;
      localStorage.setItem("token", token);
      setIsAuthenticated(true);
      setUser(fetchedUser);
      return true;
    } catch (err) {
      console.error("Register error", err);
      alert("Registration error");
      return false;
    }
  };

  // Track user holdings: { propertyId: tokenAmount }
  const [holdings, setHoldings] = useState({});

  // Wallet Connect (backed by API)
  const connectWallet = async () => {
    try {
      let address = "";
      if (typeof window !== "undefined" && window.ethereum && window.ethereum.request) {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        address = accounts?.[0];
      } else {
        // Fallback mock address for dev
        address = "0x71C...9A23";
      }

      const res = await fetch(`${API_URL}/api/auth/wallet-connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Wallet connect failed");
        return false;
      }

      localStorage.setItem("token", data.token);
      setIsConnected(true);
      setWalletAddress(address);
      setIsAuthenticated(true);
      setUser(data.user);
      return true;
    } catch (err) {
      console.error("Wallet connect error", err);
      alert("Wallet connection failed");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setIsConnected(false);
    setWalletAddress("");
    setUser(null);
  };

  // Expose register function in context value

  // Rehydrate user from token (if present)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          localStorage.removeItem("token");
          return;
        }
        const data = await res.json();
        setIsAuthenticated(true);
        setUser(data.user);
        if (data.user?.walletAddress) {
          setIsConnected(true);
          setWalletAddress(data.user.walletAddress);
        }
      } catch (err) {
        console.error("me fetch error", err);
      }
    })();
  }, []);

  // Proposals API
  const fetchProposals = async (propertyId) => {
    try {
      const res = await fetch(`${API_URL}/api/proposals/${propertyId}`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.proposals || [];
    } catch (err) {
      console.error("fetchProposals error", err);
      return [];
    }
  };

  const createProposal = async (propertyId, title, description, options = [], ownerId = null) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/proposals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ propertyId, title, description, options, ownerId }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to create proposal");
        return null;
      }
      return data.proposal;
    } catch (err) {
      console.error("createProposal error", err);
      alert("Failed to create proposal");
      return null;
    }
  };

  const voteProposal = async (proposalId, option) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to vote.");
        return null;
      }
      const res = await fetch(`${API_URL}/api/proposals/${proposalId}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ option }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Vote failed");
        return null;
      }
      return data.proposal;
    } catch (err) {
      console.error("voteProposal error", err);
      alert("Vote failed");
      return null;
    }
  };

  const closeProposal = async (proposalId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to close proposals.");
        return null;
      }
      const res = await fetch(`${API_URL}/api/proposals/${proposalId}/close`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Close failed");
        return null;
      }
      return data.proposal;
    } catch (err) {
      console.error("closeProposal error", err);
      alert("Close failed");
      return null;
    }
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

  // Add Listing Logic (attach owner info when possible)
  const addProperty = (newProp) => {
    const normalized = {
      ...newProp,
      id: Date.now(),
      totalTokens: newProp.totalTokens || 1000,
      availableTokens: typeof newProp.availableTokens === "number" ? newProp.availableTokens : newProp.totalTokens || 1000,
      maxPerPurchase: typeof newProp.maxPerPurchase === "number" ? newProp.maxPerPurchase : 100,
      status: newProp.status || "Live",
      // Owner metadata (if user is signed in)
      ownerId: user?.id || null,
      ownerName: user?.username || user?.walletAddress || null,
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
        isAuthenticated,
        user,
        login,
        register,
        logout,
        properties,
        holdings,
        buyTokens,
        sellTokens, // <--- Don't forget to export this!
        addProperty,
        // Proposals API
        fetchProposals,
        createProposal,
        voteProposal,
        closeProposal,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
  
}

export const useWallet = () => useContext(WalletContext);
