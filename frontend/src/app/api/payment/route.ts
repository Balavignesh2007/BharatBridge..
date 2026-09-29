import { NextResponse } from 'next/server';
import { paymentRailService } from '../../../services/paymentService';

/**
 * REST API: Payment Rail Adapter Layer
 * - Simulated Banking & Payment API Integration
 * - UPI Instant Rail Adapter (VPA verification, instant credit)
 * - IMPS / NEFT Domestic Account Clearing
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            railType = 'UPI',
            recipientIdentifier = 'priya.sharma@okaxis',
            recipientName = 'Priya Sharma',
            amountINR = 84246.5,
            bankName = 'State Bank of India',
            country = 'India',
            remittanceId = 'BB-REM-TEST',
        } = body;

        const initialPayment = await paymentRailService.createPayment({
            recipient: {
                name: recipientName,
                identifier: recipientIdentifier,
                bankName,
                country,
                payoutType: railType === 'UPI' ? 'UPI' : 'BANK_TRANSFER',
            },
            amount: parseFloat(amountINR),
            currency: 'INR',
            remittanceId,
        });

        const payout = await paymentRailService.processPayout(initialPayment.paymentId);

        return NextResponse.json({
            success: true,
            service: 'BharatBridge Domestic Payment Rail Adapter Layer',
            payout,
            disbursedAt: new Date().toISOString(),
        });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 400 });
    }
}

export async function GET() {
    return NextResponse.json({
        success: true,
        supportedRails: [
            { id: 'UPI', name: 'Unified Payments Interface (UPI)', instant: true, maxLimitINR: 100000 },
            { id: 'IMPS', name: 'Immediate Payment Service (IMPS)', instant: true, maxLimitINR: 500000 },
            { id: 'NEFT', name: 'National Electronic Funds Transfer (NEFT)', instant: false, maxLimitINR: 5000000 },
        ],
        settlementStatus: 'OPERATIONAL',
        environment: 'SIMULATED_TESTNET',
    });
}
