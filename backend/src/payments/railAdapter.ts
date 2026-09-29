export interface PayoutRequest {
    rail: 'UPI' | 'IMPS' | 'NEFT';
    beneficiaryName: string;
    accountOrVpa: string;
    bankName: string;
    amountINR: number;
}

export interface PayoutResponse {
    success: boolean;
    referenceNumber: string;
    railUsed: string;
    payoutTimestamp: string;
    status: 'COMPLETED' | 'PROCESSING' | 'FAILED';
    simulated: boolean;
}

export class PaymentRailAdapter {
    static async disburse(request: PayoutRequest): Promise<PayoutResponse> {
        const referenceNumber = `REF-RBI-${Math.floor(100000000000 + Math.random() * 900000000000)}`;

        return {
            success: true,
            referenceNumber,
            railUsed: request.rail === 'UPI' ? 'UPI Instant Rail (Simulated)' : 'IMPS Core Rail (Simulated)',
            payoutTimestamp: new Date().toISOString(),
            status: 'COMPLETED',
            simulated: true,
        };
    }
}
