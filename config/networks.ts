/**
 * BharatBridge Network Configurations
 * Polkadot Asset Hub, Westend Asset Hub, and Hardhat Local
 */

export interface NetworkConfig {
    name: string;
    chainId: number;
    rpcUrl: string;
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    blockExplorerUrl?: string;
    isTestnet: boolean;
    xcmPrecompileAddress?: string;
    contracts: {
        BharatBridge?: string;
        Remittance?: string;
        Settlement?: string;
        FXOracle?: string;
        MockUSDT?: string;
        MockUSDC?: string;
    };
}

export const NETWORKS: Record<string, NetworkConfig> = {
    polkadotHub: {
        name: 'Polkadot Asset Hub',
        chainId: 3338,
        rpcUrl: process.env.POLKADOT_HUB_RPC_URL || 'https://polkadot-asset-hub-eth-rpc.polkadot.io',
        nativeCurrency: {
            name: 'Polkadot',
            symbol: 'DOT',
            decimals: 10,
        },
        blockExplorerUrl: 'https://assethub-polkadot.subscan.io',
        isTestnet: false,
        xcmPrecompileAddress: '0x0000000000000000000000000000000000000803',
        contracts: {
            BharatBridge: '0x1234567890123456789012345678901234567890',
            Remittance: '0x1234567890123456789012345678901234567890',
            Settlement: '0x2345678901234567890123456789012345678901',
            FXOracle: '0x3456789012345678901234567890123456789012',
        },
    },
    westend: {
        name: 'Westend Asset Hub (Testnet)',
        chainId: 420420421,
        rpcUrl: process.env.WESTEND_RPC_URL || 'https://westend-asset-hub-eth-rpc.polkadot.io',
        nativeCurrency: {
            name: 'Westend',
            symbol: 'WND',
            decimals: 12,
        },
        blockExplorerUrl: 'https://assethub-westend.subscan.io',
        isTestnet: true,
        xcmPrecompileAddress: '0x0000000000000000000000000000000000000803',
        contracts: {
            BharatBridge: '0x3234567890123456789012345678901234567890',
            Remittance: '0x3234567890123456789012345678901234567890',
            Settlement: '0x4345678901234567890123456789012345678901',
            FXOracle: '0x5456789012345678901234567890123456789012',
            MockUSDT: '0x6545678901234567890123456789012345678901',
            MockUSDC: '0x7654567890123456789012345678901234567890',
        },
    },
    hardhat: {
        name: 'Hardhat Localhost',
        chainId: 31337,
        rpcUrl: 'http://127.0.0.1:8545',
        nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18,
        },
        isTestnet: true,
        contracts: {
            BharatBridge: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
            Remittance: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
            Settlement: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
            FXOracle: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
            MockUSDT: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
            MockUSDC: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
        },
    },
};

export const DEFAULT_NETWORK = NETWORKS.westend;
