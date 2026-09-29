import { NextResponse } from 'next/server';
import { RiskService } from '../../../services/riskService';
import { Currency } from '../../../types';

/**
 * REST API: Risk & Fraud Prevention Engine
 * - Deterministic rule-based fraud detection
 * - Transaction limits & velocity thresholds
 * - High-risk wallet screening
 * - Corridor sanction controls
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            amountUSD = 1000,
            walletAddress = '0x71C2a839B310F0d27E6A9318b87e221087413697',
            corridorCode = 'US',
            consecutiveTxCount24h = 1,
            dailyVolumeUSD = 1000,
            monthlyVolumeUSD = 2500,
            sourceCurrency = 'USD' as Currency,
            destCurrency = 'INR' as Currency,
        } = body;

        const assessment = RiskService.evaluateRisk({
            amountUSD: parseFloat(amountUSD),
            walletAddress,
            corridorCode,
            consecutiveTxCount24h: parseInt(consecutiveTxCount24h, 10),
            dailyVolumeUSD: parseFloat(dailyVolumeUSD),
            monthlyVolumeUSD: parseFloat(monthlyVolumeUSD),
            sourceCurrency,
            destCurrency,
        });

        return NextResponse.json({
            success: true,
            service: 'BharatBridge Deterministic Risk Engine',
            assessment,
            evaluatedAt: new Date().toISOString(),
        });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 400 });
    }
}
