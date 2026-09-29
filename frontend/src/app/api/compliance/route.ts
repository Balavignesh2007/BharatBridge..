import { NextResponse } from 'next/server';
import { ComplianceService } from '../../../services/complianceService';

/**
 * REST API: Compliance & Sanctions Screening
 * - OFAC / FATF watchlist screening
 * - FATF Travel Rule validation
 * - Regulatory jurisdiction check
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            recipientName = 'Priya Sharma',
            senderCountry = 'USA',
            destCountry = 'India',
            amountUSD = 1000,
            walletAddress = '',
            corridorCode = 'IN',
        } = body;

        const compliance = ComplianceService.checkCompliance({
            amountUSD: parseFloat(amountUSD),
            walletAddress,
            corridorCode,
            recipientName,
            senderCountry,
            destCountry,
        });

        return NextResponse.json({
            success: true,
            service: 'BharatBridge Compliance & Regulatory Engine',
            compliance,
            timestamp: new Date().toISOString(),
        });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 400 });
    }
}
