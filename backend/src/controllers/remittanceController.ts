import { FXService } from '../services/fx';
import { FeeEngine } from '../services/fees/feeEngine';
import { FraudDetector } from '../fraud/detector';
import { WalletScreening } from '../compliance/screening';
import { CorridorControls } from '../compliance/limits';
import { PaymentRailAdapter } from '../payments/railAdapter';
import { BackendSettlementService } from '../services/settlementService';

export class RemittanceController {
    static async handleRemittance(payload: any) {
        const {
            amount = 1000,
            from = 'USD',
            to = 'INR',
            senderAddress = '0x71C2a839B310F0d27E6A9318b87e221087413697',
            recipientName = 'Priya Sharma',
            payoutRail = 'UPI',
            vpaOrAccount = 'priya.sharma@okaxis',
            bankName = 'State Bank of India',
            corridorId = 'USA_IND',
        } = payload;

        // 1. Corridor & Limit Check
        const limitCheck = CorridorControls.validateLimits(corridorId, amount);
        if (!limitCheck.allowed) {
            return { success: false, error: limitCheck.reason };
        }

        // 2. Sanctions Screening
        const screening = WalletScreening.screenWallet(senderAddress);
        if (!screening.clean) {
            return { success: false, error: screening.reason };
        }

        // 3. Fraud Detection
        const fraudResult = FraudDetector.evaluate({
            amountUSD: amount,
            consecutiveTxCount24h: 1,
            dailyVolumeUSD: amount,
            monthlyVolumeUSD: amount * 2.5,
        });

        if (!fraudResult.passed) {
            return { success: false, error: 'Transaction flagged by rule-based fraud detection' };
        }

        // 4. FX & Fee Calculation
        const quote = FXService.convert(from, to, amount);
        const feeBreakdown = FeeEngine.calculateFee(amount);

        // 5. Blockchain Settlement
        const settlement = await BackendSettlementService.executeSettlement({
            token: 'USDT',
            amount,
            recipient: senderAddress,
            destChainId: 0,
        });

        // 6. Domestic Payout Rail Disbursement
        const payout = await PaymentRailAdapter.disburse({
            rail: payoutRail === 'UPI' ? 'UPI' : 'IMPS',
            beneficiaryName: recipientName,
            accountOrVpa: vpaOrAccount,
            bankName,
            amountINR: quote.recipientAmount,
        });

        // 7. Generate Official Receipt
        const receipt = {
            receiptNumber: `REC-BB-IND-${Math.floor(10000 + Math.random() * 90000)}`,
            transactionId: `BB-IND-${Math.floor(10000 + Math.random() * 90000)}`,
            issuedAt: new Date().toLocaleString(),
            sourceAmount: amount,
            sourceCurrency: from,
            feeCharged: quote.feeAmount,
            feePercent: quote.feePercent,
            exchangeRate: quote.exchangeRate,
            recipientAmount: quote.recipientAmount,
            destCurrency: to,
            beneficiary: recipientName,
            bankName,
            payoutRail: payout.railUsed,
            referenceNumber: payout.referenceNumber,
            txHash: settlement.txHash,
            status: 'COMPLETED',
        };

        return {
            success: true,
            receipt,
            quote,
            feeBreakdown,
            settlement,
        };
    }
}
