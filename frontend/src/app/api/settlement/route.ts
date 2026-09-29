import { NextResponse } from 'next/server';
import { SettlementService } from '../../../services/settlementService';
import { Currency } from '../../../types';

/**
 * REST API: Blockchain Settlement Engine
 * - Stablecoin settlement (USDT / USDC)
 * - Polkadot Asset Hub / Westend execution
 * - XCM Cross-chain messaging & MockStablecoin support
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            tokenSymbol = 'USDT',
            amount = 1000,
            destCurrency = 'INR',
            destChainId = 0,
            recipientAddress = '0x71C2a839B310F0d27E6A9318b87e221087413697',
        } = body;

        const settlementResult = await SettlementService.executeSettlement({
            tokenSymbol: tokenSymbol === 'USDC' ? 'USDC' : 'USDT',
            amount: parseFloat(amount),
            recipientAddress,
            destChainId: parseInt(destChainId, 10),
            destCurrency: destCurrency as Currency,
            isSimulated: true,
        });

        return NextResponse.json({
            success: true,
            service: 'BharatBridge Polkadot PVM Settlement Engine',
            settlement: settlementResult,
            executedAt: new Date().toISOString(),
        });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 400 });
    }
}

export async function GET() {
    return NextResponse.json({
        success: true,
        service: 'BharatBridge Polkadot PVM Settlement Engine',
        networks: [
            {
                name: 'Polkadot Asset Hub',
                chainId: 3338,
                rpc: 'https://polkadot-asset-hub-eth-rpc.polkadot.io',
                currency: 'DOT / USDT Native',
            },
            {
                name: 'Westend Asset Hub (Testnet)',
                chainId: 420420421,
                rpc: 'https://westend-asset-hub-eth-rpc.polkadot.io',
                currency: 'WND / Test USDT',
            },
        ],
        supportedStablecoins: [
            { symbol: 'USDT', decimals: 6, network: 'Polkadot Asset Hub / Westend', standard: 'ERC-20 / Native Asset' },
            { symbol: 'USDC', decimals: 6, network: 'Polkadot Asset Hub / Westend', standard: 'ERC-20 / Native Asset' },
            { symbol: 'MockUSD', decimals: 6, network: 'Local Hardhat & Westend Dev', standard: 'MockStablecoin' },
        ],
        xcmPrecompile: '0x0000000000000000000000000000000000000803',
    });
}
