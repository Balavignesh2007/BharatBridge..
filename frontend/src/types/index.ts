export type Currency = 'USD' | 'INR' | 'GBP' | 'EUR' | 'AED' | 'SGD' | 'CAD' | 'AUD' | 'JPY';

export type Direction = 'GLOBAL_TO_INDIA' | 'INDIA_TO_GLOBAL';

export interface Corridor {
    id: string;
    name: string;
    sourceCurrency: Currency;
    destCurrency: Currency;
    country: string;
    countryCode: string;
    flag: string;
    demoRate: number;
    feePercent: number; // 0.30%
    settlementMethods: string[];
    speed: string;
    isPrimaryDemo?: boolean;
}

export interface FXQuote {
    sourceAmount: number;
    sourceCurrency: Currency;
    destCurrency: Currency;
    rate: number;
    fee: number;
    feePercent: number;
    recipientAmount: number;
    effectiveRate: number;
    isDemoRate: boolean;
    timestamp: number;
}

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface RiskCheckResult {
    level: RiskLevel;
    score: number;
    reasons: string[];
    isBlocked: boolean;
    requiresReview: boolean;
    engineType: 'RULE_BASED';
}

export type ComplianceStatus = 'PASSED' | 'REVIEW REQUIRED' | 'BLOCKED';

export interface ComplianceCheckItem {
    name: string;
    status: 'PASSED' | 'WARNING' | 'FAILED';
    detail: string;
}

export interface ComplianceCheckResult {
    status: ComplianceStatus;
    checks: ComplianceCheckItem[];
    reasons: string[];
    isSimulated: boolean;
    thresholdUSD: number;
}

export type StageId =
    | 'INITIATED'
    | 'FRAUD_CHECK'
    | 'COMPLIANCE_CHECK'
    | 'FX_QUOTE'
    | 'STABLECOIN_TRANSFER'
    | 'CROSS_CHAIN_SETTLEMENT'
    | 'CURRENCY_CONVERSION'
    | 'PAYMENT_PROCESSING'
    | 'RECIPIENT_PAYOUT';

export type StageStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REVIEW' | 'BLOCKED';

export interface TransactionLifecycleStage {
    id: StageId;
    label: string;
    status: StageStatus;
    timestamp?: string;
    description: string;
    metadata?: Record<string, string | number | boolean>;
}

export interface RecipientDetails {
    name: string;
    payoutType: 'UPI' | 'BANK_TRANSFER' | 'CRYPTO_WALLET';
    identifier: string; // e.g. "rahul@oksbi", IFSC/Account, or 0x address
    bankName?: string;
    country: string;
}

export interface SenderDetails {
    name: string;
    address?: string;
    country: string;
}

export interface Transaction {
    id: string; // e.g. "BB-IN-84246"
    date: string;
    timestamp: number;
    direction: Direction;
    sender: SenderDetails;
    recipient: RecipientDetails;
    sourceCurrency: Currency;
    destCurrency: Currency;
    sourceAmount: number;
    destAmount: number;
    fxRate: number;
    fee: number;
    feePercent: number;
    risk: RiskCheckResult;
    compliance: ComplianceCheckResult;
    settlementStatus: 'COMPLETED' | 'PENDING' | 'FAILED' | 'SIMULATED';
    paymentStatus: 'READY' | 'PROCESSING' | 'COMPLETED';
    payoutStatus: 'SIMULATED' | 'COMPLETED' | 'PENDING';
    status: 'COMPLETED' | 'PROCESSING' | 'PENDING' | 'REVIEW' | 'BLOCKED';
    currentStageIndex: number;
    stages: TransactionLifecycleStage[];
    txHash?: string;
    network: string;
    isDemo: boolean;
}

export interface PaymentRailResult {
    paymentId: string;
    rail: string; // 'IMPS_MOCK' | 'UPI_MOCK' | 'ACH_MOCK'
    status: 'READY' | 'PROCESSING' | 'COMPLETED';
    payoutTimestamp: string;
    referenceNumber: string;
    isSimulated: boolean;
}

export const getCurrencySymbol = (currency?: string): string => {
    switch (currency) {
        case 'INR': return '₹';
        case 'USD': return '$';
        case 'EUR': return '€';
        case 'GBP': return '£';
        case 'AED': return 'AED ';
        case 'SGD': return 'S$';
        case 'CAD': return 'CA$';
        case 'AUD': return 'A$';
        case 'JPY': return '¥';
        default: return '$';
    }
};

