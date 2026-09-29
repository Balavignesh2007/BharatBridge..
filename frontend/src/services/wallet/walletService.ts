import { BrowserProvider, JsonRpcSigner, verifyMessage } from 'ethers';

export interface WalletInfo {
    address: string;
    chainId: number;
    isConnected: boolean;
    provider?: BrowserProvider;
    signer?: JsonRpcSigner;
}

export class WalletService {
    /**
     * Check if MetaMask or compatible EVM wallet is installed
     */
    static isMetaMaskInstalled(): boolean {
        return typeof window !== 'undefined' && Boolean((window as any).ethereum);
    }

    /**
     * Connect to MetaMask or injected EVM wallet
     */
    static async connectWallet(): Promise<WalletInfo> {
        if (!this.isMetaMaskInstalled()) {
            throw new Error('No EVM-compatible wallet detected. Please install MetaMask.');
        }

        const ethereum = (window as any).ethereum;
        const provider = new BrowserProvider(ethereum);

        const accounts = await provider.send('eth_requestAccounts', []);
        const network = await provider.getNetwork();
        const signer = await provider.getSigner();

        return {
            address: accounts[0],
            chainId: Number(network.chainId),
            isConnected: true,
            provider,
            signer,
        };
    }

    /**
     * Sign an EIP-4361 authentication message for backend verification
     */
    static async signAuthChallenge(signer: JsonRpcSigner, message: string): Promise<string> {
        return await signer.signMessage(message);
    }

    /**
     * Client-side signature verification helper
     */
    static verifySignature(message: string, signature: string): string {
        return verifyMessage(message, signature);
    }
}
