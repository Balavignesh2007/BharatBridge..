/**
 * Polkadot Asset Hub & Westend Native Assets Configuration
 */

export interface AssetHubToken {
    symbol: string;
    assetId: number;
    name: string;
    decimals: number;
    isSufficient: boolean;
    minBalance: string;
}

export const ASSET_HUB_TOKENS: Record<string, AssetHubToken> = {
    USDT: {
        symbol: 'USDT',
        assetId: 1984,
        name: 'Tether USD (Polkadot Asset Hub)',
        decimals: 6,
        isSufficient: true,
        minBalance: '10000', // 0.01 USDT
    },
    USDC: {
        symbol: 'USDC',
        assetId: 1337,
        name: 'USD Coin (Polkadot Asset Hub)',
        decimals: 6,
        isSufficient: true,
        minBalance: '10000',
    },
    WND_USDT: {
        symbol: 'USDT',
        assetId: 1984,
        name: 'Test USDT (Westend Asset Hub)',
        decimals: 6,
        isSufficient: true,
        minBalance: '1000',
    },
};
