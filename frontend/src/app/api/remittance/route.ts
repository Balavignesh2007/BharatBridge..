import { NextResponse } from 'next/server';
import { FXService } from '../../../services/fxService';
import { RiskService } from '../../../services/riskService';
import { ComplianceService } from '../../../services/complianceService';
import { CorridorService } from '../../../services/corridorService';
import { paymentRailService } from '../../../services/paymentService';
import { LIFECYCLE_STAGES_CONFIG } from '../../../services/transactionService';
import { Currency, Direction, Transaction, TransactionLifecycleStage } from '../../../types';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            direction = 'GLOBAL_TO_INDIA',
            corridorId = 'USA_IND',
            amount = 1000,
            recipientName = 'Priya Sharma',
            payoutType = 'UPI',
            recipientIdentifier = 'priya.sharma@okaxis',
            bankName = 'State Bank of India',
            senderAddress = '0x71C2a839B310F0d27E6A9318b87e221087413697',
            senderName = 'Johnathan Miller',
            destChainId = 0,
        } = body;

        const corridor = CorridorService.getCorridorById(corridorId) || CorridorService.getAllCorridors()[0];
        const sourceCurrency: Currency = direction === 'GLOBAL_TO_INDIA' ? corridor.sourceCurrency : 'INR';
        const destCurrency: Currency = direction === 'GLOBAL_TO_INDIA' ? 'INR' : corridor.sourceCurrency;
        const numAmount = parseFloat(amount) || 0;

        if (numAmount <= 0) {
            return NextResponse.json({ success: false, error: 'Invalid transfer amount' }, { status: 400 });
        }

        // 1. Backend FX Quote Calculation
        const fxQuote = FXService.convert(sourceCurrency, destCurrency, numAmount);

        // 2. Backend Rule-Based Risk Engine Check
        const amountUSD = sourceCurrency === 'USD' ? numAmount : numAmount * 0.012;
        const riskResult = RiskService.evaluateRisk({
            amountUSD,
            walletAddress: senderAddress,
            corridorCode: corridor.countryCode,
            consecutiveTxCount24h: 1,
            dailyVolumeUSD: 1000,
            monthlyVolumeUSD: 2500,
            sourceCurrency,
            destCurrency,
        });

        if (riskResult.isBlocked) {
            return NextResponse.json({
                success: false,
                error: 'Transfer blocked by rule-based risk policy',
                reasons: riskResult.reasons,
            }, { status: 403 });
        }

        // 3. Backend Compliance Engine Screening
        const complianceResult = ComplianceService.checkCompliance({
            amountUSD,
            walletAddress: senderAddress,
            corridorCode: corridor.countryCode,
            recipientName,
            senderCountry: direction === 'GLOBAL_TO_INDIA' ? corridor.country : 'India',
            destCountry: direction === 'GLOBAL_TO_INDIA' ? 'India' : corridor.country,
        });

        if (complianceResult.status === 'BLOCKED') {
            return NextResponse.json({
                success: false,
                error: 'Transfer failed compliance screening',
                reasons: complianceResult.reasons,
            }, { status: 403 });
        }

        // 4. Backend Settlement & Payment Rail Processing
        const txId = `BB-IND-${Math.floor(10000 + Math.random() * 90000)}`;
        const paymentResult = await paymentRailService.createPayment({
            recipient: {
                name: recipientName,
                payoutType,
                identifier: recipientIdentifier,
                bankName,
                country: direction === 'GLOBAL_TO_INDIA' ? 'India' : corridor.country,
            },
            amount: fxQuote.recipientAmount,
            currency: destCurrency,
            remittanceId: txId,
        });
        await paymentRailService.processPayout(paymentResult.paymentId);

        // 5. Construct 9-Stage Transaction History Record
        const timestamp = Date.now();
        const stages: TransactionLifecycleStage[] = LIFECYCLE_STAGES_CONFIG.map((s, idx) => ({
            id: s.id,
            label: s.label,
            status: 'COMPLETED',
            timestamp: new Date(timestamp - (8 - idx) * 1000).toLocaleTimeString(),
            description: s.defaultDesc,
        }));

        const transaction: Transaction = {
            id: txId,
            date: new Date().toLocaleString(),
            timestamp,
            direction,
            sender: {
                name: senderName,
                address: senderAddress,
                country: direction === 'GLOBAL_TO_INDIA' ? corridor.country : 'India',
            },
            recipient: {
                name: recipientName,
                payoutType,
                identifier: recipientIdentifier,
                bankName,
                country: direction === 'GLOBAL_TO_INDIA' ? 'India' : corridor.country,
            },
            sourceCurrency,
            destCurrency,
            sourceAmount: numAmount,
            destAmount: fxQuote.recipientAmount,
            fxRate: fxQuote.rate,
            fee: fxQuote.fee,
            feePercent: fxQuote.feePercent,
            risk: riskResult,
            compliance: complianceResult,
            settlementStatus: 'COMPLETED',
            paymentStatus: 'COMPLETED',
            payoutStatus: 'COMPLETED',
            status: 'COMPLETED',
            currentStageIndex: 8,
            stages,
            txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
            network: destChainId > 0 ? 'Polkadot XCM Parachain' : 'Polkadot Asset Hub',
            isDemo: true,
        };

        // Construct Official Receipt Object
        const receipt = {
            receiptNumber: `REC-${txId}`,
            transactionId: txId,
            issuedAt: new Date().toLocaleString(),
            senderName,
            senderCountry: direction === 'GLOBAL_TO_INDIA' ? corridor.country : 'India',
            recipientName,
            recipientAccountOrUpi: recipientIdentifier,
            bankName,
            payoutRail: payoutType === 'UPI' ? 'UPI Instant Rail' : 'IMPS Direct',
            payoutReferenceNumber: paymentResult.referenceNumber,
            sourceAmount: numAmount,
            sourceCurrency,
            feeCharged: fxQuote.fee,
            feePercent: fxQuote.feePercent,
            exchangeRate: fxQuote.rate,
            recipientAmount: fxQuote.recipientAmount,
            destCurrency,
            status: 'PAYMENT_CREDITED',
            settlementNetwork: destChainId > 0 ? 'Polkadot XCM Parachain' : 'Polkadot Asset Hub',
        };

        return NextResponse.json({
            success: true,
            transaction,
            receipt,
        });

    } catch (err: any) {
        console.error('Backend remittance error:', err);
        return NextResponse.json({ success: false, error: err.message || 'Internal processing error' }, { status: 500 });
    }
}
