import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ethers } from 'ethers';

const WalletContext = createContext(undefined);

export function WalletProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      setError('No wallet extension found. Please install MetaMask or a compatible wallet.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      setAccount(accounts[0] || null);
    } catch (err) {
      if (err.code === 4001) {
        setError('Connection request was rejected.');
      } else {
        setError('Failed to connect wallet. Please try again.');
      }
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setError(null);
  }, []);

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      setAccount(accounts[0] || null);
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, []);

  return (
    <WalletContext.Provider
      value={{ account, connectWallet, disconnectWallet, isConnecting, error }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
