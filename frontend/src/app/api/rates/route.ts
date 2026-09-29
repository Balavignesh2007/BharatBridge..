import { NextResponse } from 'next/server';
import { FXService, DEMO_FX_RATES } from '../../../services/fxService';
import { Currency } from '../../../types';

/**
 * REST API: Financial Services & FX Engine
 * - FX Oracle rate lookup
 * - Multi-currency conversion
 * - Transparent sub-1% fee calculation
 */
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const from = (searchParams.get('from') || 'USD').toUpperCase() as Currency;
    const to = (searchParams.get('to') || 'INR').toUpperCase() as Currency;
    const amount = parseFloat(searchParams.get('amount') || '1000');

    try {
        const quote = FXService.convert(from, to, amount);

        return NextResponse.json({
            success: true,
            service: 'BharatBridge Financial Services & FX Engine',
            quote,
            allRates: DEMO_FX_RATES,
            pricingModel: {
                standardFeePercent: 0.30,
                guaranteedDurationMinutes: 15,
                engine: 'FXOracle Smart Contract & Local Indexer',
            },
        });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 400 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { from = 'USD', to = 'INR', amount = 1000 } = body;
        const quote = FXService.convert(from as Currency, to as Currency, parseFloat(amount));

        return NextResponse.json({
            success: true,
            quote,
            timestamp: new Date().toISOString(),
        });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 400 });
    }
}
