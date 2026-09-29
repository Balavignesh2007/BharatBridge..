import { PaymentRailResult, RecipientDetails, Currency } from '../types';

/**
 * PaymentRailAdapter interface
 * Abstraction layer for fiat payout rails (IMPS, UPI, NEFT, Fedwire, SEPA)
 */
export interface PaymentRailAdapter {
    createPayment(params: {
        recipient: RecipientDetails;
        amount: number;
        currency: Currency;
        remittanceId: string;
    }): Promise<PaymentRailResult>;

    checkPaymentStatus(paymentId: string): Promise<PaymentRailResult>;

    processPayout(paymentId: string): Promise<PaymentRailResult>;

    getPaymentStatus(paymentId: string): PaymentRailResult | null;
}

/**
 * MockPaymentRailAdapter
 * Simulates real-time domestic fiat banking rails for the hackathon demonstration.
 * NOTE: Clearly labeled as SIMULATED PAYMENT RAIL.
 */
export class MockPaymentRailAdapter implements PaymentRailAdapter {
    private payments: Map<string, PaymentRailResult> = new Map();

    async createPayment(params: {
        recipient: RecipientDetails;
        amount: number;
        currency: Currency;
        remittanceId: string;
    }): Promise<PaymentRailResult> {
        const paymentId = `PAY-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const rail = params.currency === 'INR' ? (params.recipient.payoutType === 'UPI' ? 'UPI_SIMULATED' : 'IMPS_SIMULATED') : 'DOMESTIC_ACH_SIMULATED';
        const referenceNumber = `REF-RBI-${Math.floor(100000000000 + Math.random() * 900000000000)}`;

        const result: PaymentRailResult = {
            paymentId,
            rail,
            status: 'READY',
            payoutTimestamp: new Date().toISOString(),
            referenceNumber,
            isSimulated: true,
        };

        this.payments.set(paymentId, result);
        return result;
    }

    async checkPaymentStatus(paymentId: string): Promise<PaymentRailResult> {
        const payment = this.payments.get(paymentId);
        if (!payment) {
            throw new Error(`Payment with ID ${paymentId} not found`);
        }
        return payment;
    }

    async processPayout(paymentId: string): Promise<PaymentRailResult> {
        const payment = this.payments.get(paymentId);
        if (!payment) {
            throw new Error(`Payment with ID ${paymentId} not found`);
        }

        // Simulate instant payout processing
        const completedPayment: PaymentRailResult = {
            ...payment,
            status: 'COMPLETED',
            payoutTimestamp: new Date().toISOString(),
        };

        this.payments.set(paymentId, completedPayment);
        return completedPayment;
    }

    getPaymentStatus(paymentId: string): PaymentRailResult | null {
        return this.payments.get(paymentId) || null;
    }
}

// Global singleton instance for app-wide use
export const paymentRailService = new MockPaymentRailAdapter();
