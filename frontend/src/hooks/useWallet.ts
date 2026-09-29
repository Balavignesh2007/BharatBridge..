import { useState, useEffect, useCallback } from 'react';
import { BrowserProvider, JsonRpcSigner } from 'ethers';
import { NETWORKS } from '../constants';

declare global {
    interface Window {
        ethereum?: any;
    }
}

export const DEMO_WALLET_ADDRESS = '0x71C2a839B310F0d27E6A9318b87e221087413697';
export const DEMO_CHAIN_ID = 420420421; // Westend Asset Hub

export interface WalletState {
    account: string | null;
    shortAddress: string;
    provider: BrowserProvider | null;
    signer: JsonRpcSigner | null;
    chainId: number | null;
    networkName: string;
    isConnecting: boolean;
    isDemoWallet: boolean;
    error: string | null;
    connectWallet: () => Promise<void>;
    connectDemoWallet: () => void;
    disconnectWallet: () => void;
    switchNetwork: (networkKey: string) => Promise<void>;
    clearError: () => void;
    isConnected: boolean;
}

export function useWallet(): WalletState {
    const [account, setAccount] = useState<string | null>(null);
    const [provider, setProvider] = useState<BrowserProvider | null>(null);
    const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
    const [chainId, setChainId] = useState<number | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isDemoWallet, setIsDemoWallet] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load initial connection from localStorage on mount
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const savedWallet = localStorage.getItem('bb_connected_wallet');
        const savedType = localStorage.getItem('bb_wallet_type');

        if (savedWallet) {
            setAccount(savedWallet);
            if (savedType === 'demo') {
                setIsDemoWallet(true);
                setChainId(DEMO_CHAIN_ID);
            } else if (window.ethereum) {
                // Restore MetaMask provider if still unlocked
                try {
                    const browserProvider = new BrowserProvider(window.ethereum);
                    browserProvider.getSigner().then((s) => {
                        setProvider(browserProvider);
                        setSigner(s);
                        browserProvider.getNetwork().then((net) => {
                            setChainId(Number(net.chainId));
                        });
                    }).catch(() => {
                        // Extension locked or disconnected
                    });
                } catch {
                    // Ignore
                }
            }
        }
    }, []);

    // Connect Demo Testnet Wallet (1-Click, instant, 100% reliable)
    const connectDemoWallet = useCallback(() => {
        setIsConnecting(true);
        setError(null);

        setTimeout(() => {
            setAccount(DEMO_WALLET_ADDRESS);
            setChainId(DEMO_CHAIN_ID);
            setIsDemoWallet(true);
            setIsConnecting(false);

            if (typeof window !== 'undefined') {
                localStorage.setItem('bb_connected_wallet', DEMO_WALLET_ADDRESS);
                localStorage.setItem('bb_wallet_type', 'demo');
            }
        }, 150);
    }, []);

    // Connect Real MetaMask / EVM Wallet (with auto-fallback to Demo if not installed)
    const connectWallet = useCallback(async () => {
        setIsConnecting(true);
        setError(null);

        // Check if MetaMask / injected EVM provider exists
        if (typeof window === 'undefined' || !window.ethereum) {
            // Auto fallback to Demo Testnet Wallet for seamless hackathon testing
            connectDemoWallet();
            return;
        }

        try {
            const browserProvider = new BrowserProvider(window.ethereum);
            const accounts = await browserProvider.send('eth_requestAccounts', []);
            const network = await browserProvider.getNetwork();
            const walletSigner = await browserProvider.getSigner();

            setProvider(browserProvider);
            setSigner(walletSigner);
            setAccount(accounts[0]);
            setChainId(Number(network.chainId));
            setIsDemoWallet(false);

            if (typeof window !== 'undefined') {
                localStorage.setItem('bb_connected_wallet', accounts[0]);
                localStorage.setItem('bb_wallet_type', 'metamask');
            }
        } catch (err: any) {
            console.error('Wallet connection error:', err);
            // If user rejects or error occurs, fall back to Demo Wallet so the user is never blocked
            if (err.code === 4001) {
                setError('Connection request cancelled in MetaMask.');
            } else {
                setError(err.message || 'Failed to connect MetaMask');
            }
        } finally {
            setIsConnecting(false);
        }
    }, [connectDemoWallet]);

    const disconnectWallet = useCallback(() => {
        setAccount(null);
        setProvider(null);
        setSigner(null);
        setChainId(null);
        setIsDemoWallet(false);
        setError(null);

        if (typeof window !== 'undefined') {
            localStorage.removeItem('bb_connected_wallet');
            localStorage.removeItem('bb_wallet_type');
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const switchNetwork = useCallback(async (networkKey: string) => {
        if (isDemoWallet) {
            setChainId(networkKey === 'polkadotHub' ? 3338 : 420420421);
            return;
        }

        if (typeof window === 'undefined' || !window.ethereum) return;

        const network = NETWORKS[networkKey];
        if (!network) return;

        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: network.chainId }],
            });
        } catch (switchError: any) {
            if (switchError.code === 4902) {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: network.chainId,
                        chainName: network.chainName,
                        rpcUrls: network.rpcUrls,
                        nativeCurrency: network.nativeCurrency,
                        blockExplorerUrls: network.blockExplorerUrls || [],
                    }],
                });
            }
        }
    }, [isDemoWallet]);

    // Listen for real MetaMask account/chain changes
    useEffect(() => {
        if (typeof window === 'undefined' || !window.ethereum || isDemoWallet) return;

        const handleAccountsChanged = (accounts: string[]) => {
            if (accounts.length === 0) {
                disconnectWallet();
            } else {
                setAccount(accounts[0]);
                localStorage.setItem('bb_connected_wallet', accounts[0]);
            }
        };

        const handleChainChanged = (chainIdHex: string) => {
            setChainId(Number(chainIdHex));
        };

        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);

        return () => {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            window.ethereum.removeListener('chainChanged', handleChainChanged);
        };
    }, [disconnectWallet, isDemoWallet]);

    const shortAddress = account
        ? `${account.slice(0, 6)}...${account.slice(-4)}`
        : '';

    const networkName = chainId === 3338
        ? 'Polkadot Asset Hub'
        : chainId === 420420421
            ? 'Westend Asset Hub'
            : chainId === 31337
                ? 'Hardhat Local'
                : 'Asset Hub';

    return {
        account,
        shortAddress,
        provider,
        signer,
        chainId,
        networkName,
        isConnecting,
        isDemoWallet,
        error,
        connectWallet,
        connectDemoWallet,
        disconnectWallet,
        switchNetwork,
        clearError,
        isConnected: Boolean(account),
    };
}
