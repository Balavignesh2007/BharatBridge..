import { Transaction, TransactionLifecycleStage, StageId } from '../types';

export const LIFECYCLE_STAGES_CONFIG: Array<{ id: StageId; label: string; defaultDesc: string }> = [
    { id: 'INITIATED', label: 'Initiated', defaultDesc: 'Remittance intent registered on BharatBridge platform' },
    { id: 'FRAUD_CHECK', label: 'Fraud Risk Check', defaultDesc: 'Rule-based risk verification engine evaluated parameters' },
    { id: 'COMPLIANCE_CHECK', label: 'Compliance Check', defaultDesc: 'Simulated AML and sanctions watchlist screening completed' },
    { id: 'FX_QUOTE', label: 'FX Quote Locked', defaultDesc: 'Guaranteed exchange rate locked with transparent 0.30% fee' },
    { id: 'STABLECOIN_TRANSFER', label: 'Stablecoin Transfer', defaultDesc: 'Asset Hub native token transfer initiated by sender' },
    { id: 'CROSS_CHAIN_SETTLEMENT', label: 'Cross-Chain Settlement', defaultDesc: 'Polkadot XCM message dispatched and confirmed on settlement chain' },
    { id: 'CURRENCY_CONVERSION', label: 'Currency Conversion', defaultDesc: 'Treasury liquidity pool converted stablecoin to destination fiat' },
    { id: 'PAYMENT_PROCESSING', label: 'Payment Processing', defaultDesc: 'Domestic banking rail received instruction for instant credit' },
    { id: 'RECIPIENT_PAYOUT', label: 'Recipient Payout', defaultDesc: 'Simulated domestic IMPS/UPI credit confirmed to recipient' },
];

export function buildDefaultStages(): TransactionLifecycleStage[] {
    return LIFECYCLE_STAGES_CONFIG.map((s, index) => ({
        id: s.id,
        label: s.label,
        status: index === 0 ? 'COMPLETED' : 'PENDING',
        description: s.defaultDesc,
    }));
}

// Initial realistic demo transactions (including the primary hackathon demo)
const SEED_TRANSACTIONS: Transaction[] = [
    {
        id: 'BB-IND-84246',
        date: new Date(Date.now() - 1000 * 60 * 18).toLocaleString(),
        timestamp: Date.now() - 1000 * 60 * 18,
        direction: 'GLOBAL_TO_INDIA',
        sender: {
            name: 'Johnathan Miller',
            address: '0x71C...39Ac',
            country: 'United States',
        },
        recipient: {
            name: 'Priya Sharma',
            payoutType: 'UPI',
            identifier: 'priya.sharma@okaxis',
            bankName: 'State Bank of India',
            country: 'India',
        },
        sourceCurrency: 'USD',
        destCurrency: 'INR',
        sourceAmount: 1000,
        destAmount: 84246.50,
        fxRate: 84.50,
        fee: 3.00,
        feePercent: 0.30,
        risk: {
            level: 'LOW',
            score: 5,
            reasons: [
                'Transaction within limits ($1,000 <= $10,000)',
                'Normal transaction frequency (1 transfer in 24h)',
                'Approved bilateral corridor (USA ↔ India)',
                'Wallet not on sanctions blacklist',
            ],
            isBlocked: false,
            requiresReview: false,
            engineType: 'RULE_BASED',
        },
        compliance: {
            status: 'PASSED',
            checks: [
                { name: 'Sanctions Screening (OFAC/UN)', status: 'PASSED', detail: 'Clean check against sanctions registry' },
                { name: 'Bilateral Corridor Authorization', status: 'PASSED', detail: 'Authorized USD ↔ INR corridor' },
                { name: 'Travel Rule / AML Threshold', status: 'PASSED', detail: 'Below $10,000 threshold' },
                { name: 'Beneficiary Verification', status: 'PASSED', detail: 'Verified UPI ID (Priya Sharma)' },
            ],
            reasons: ['Simulated OFAC/UN sanctions check cleared', 'Approved corridor', 'Below AML reporting cap'],
            isSimulated: true,
            thresholdUSD: 10000,
        },
        settlementStatus: 'COMPLETED',
        paymentStatus: 'READY',
        payoutStatus: 'SIMULATED',
        status: 'COMPLETED',
        currentStageIndex: 8,
        stages: LIFECYCLE_STAGES_CONFIG.map((s, idx) => ({
            id: s.id,
            label: s.label,
            status: 'COMPLETED',
            timestamp: new Date(Date.now() - 1000 * 60 * (18 - idx * 2)).toLocaleTimeString(),
            description: s.defaultDesc,
        })),
        txHash: '0x9a8f27b401d89e52718cbf8345229046c87e221087413697a54b391e48f72a6b',
        network: 'Polkadot Asset Hub (Westend / Mainnet Compatible)',
        isDemo: true,
    },
    {
        id: 'BB-IND-73910',
        date: new Date(Date.now() - 1000 * 60 * 75).toLocaleString(),
        timestamp: Date.now() - 1000 * 60 * 75,
        direction: 'GLOBAL_TO_INDIA',
        sender: {
            name: 'Oliver Smith',
            address: '0x32A...84E1',
            country: 'United Kingdom',
        },
        recipient: {
            name: 'Rajesh Verma',
            payoutType: 'BANK_TRANSFER',
            identifier: 'HDFC0001234 / A/C 5010049281',
            bankName: 'HDFC Bank',
            country: 'India',
        },
        sourceCurrency: 'GBP',
        destCurrency: 'INR',
        sourceAmount: 500,
        destAmount: 53439.40,
        fxRate: 107.20,
        fee: 1.50,
        feePercent: 0.30,
        risk: {
            level: 'LOW',
            score: 8,
            reasons: [
                'Transaction within limits (£500)',
                'Approved UK ↔ India corridor',
                'No sanctions match',
            ],
            isBlocked: false,
            requiresReview: false,
            engineType: 'RULE_BASED',
        },
        compliance: {
            status: 'PASSED',
            checks: [
                { name: 'Sanctions Screening (UK HMT/OFAC)', status: 'PASSED', detail: 'Clean screening' },
                { name: 'Corridor Authorization', status: 'PASSED', detail: 'GBP ↔ INR corridor approved' },
                { name: 'Beneficiary Verification', status: 'PASSED', detail: 'IFSC & Account validated' },
            ],
            reasons: ['Simulated HMT check passed'],
            isSimulated: true,
            thresholdUSD: 10000,
        },
        settlementStatus: 'COMPLETED',
        paymentStatus: 'COMPLETED',
        payoutStatus: 'SIMULATED',
        status: 'COMPLETED',
        currentStageIndex: 8,
        stages: LIFECYCLE_STAGES_CONFIG.map(s => ({
            id: s.id,
            label: s.label,
            status: 'COMPLETED',
            description: s.defaultDesc,
        })),
        txHash: '0x43b91a78e4726ef39082341908bc741890ef267104b291a9237648109bf43210',
        network: 'Polkadot XCM Parachain',
        isDemo: true,
    },
    {
        id: 'BB-IND-55201',
        date: new Date(Date.now() - 1000 * 60 * 140).toLocaleString(),
        timestamp: Date.now() - 1000 * 60 * 140,
        direction: 'GLOBAL_TO_INDIA',
        sender: {
            name: 'Farhan Al-Maktoum',
            address: '0x99B...12C0',
            country: 'United Arab Emirates',
        },
        recipient: {
            name: 'Kavita Patel',
            payoutType: 'UPI',
            identifier: 'kavita@ybl',
            bankName: 'ICICI Bank',
            country: 'India',
        },
        sourceCurrency: 'AED',
        destCurrency: 'INR',
        sourceAmount: 2500,
        destAmount: 57352.42,
        fxRate: 23.01,
        fee: 7.50,
        feePercent: 0.30,
        risk: {
            level: 'LOW',
            score: 10,
            reasons: ['Within standard limits', 'Verified bilateral corridor'],
            isBlocked: false,
            requiresReview: false,
            engineType: 'RULE_BASED',
        },
        compliance: {
            status: 'PASSED',
            checks: [
                { name: 'Sanctions Screening', status: 'PASSED', detail: 'Clean check' },
                { name: 'Corridor Authorization', status: 'PASSED', detail: 'AED ↔ INR active' },
            ],
            reasons: ['Sanctions clear', 'Below travel rule threshold'],
            isSimulated: true,
            thresholdUSD: 10000,
        },
        settlementStatus: 'COMPLETED',
        paymentStatus: 'COMPLETED',
        payoutStatus: 'SIMULATED',
        status: 'COMPLETED',
        currentStageIndex: 8,
        stages: LIFECYCLE_STAGES_CONFIG.map(s => ({
            id: s.id,
            label: s.label,
            status: 'COMPLETED',
            description: s.defaultDesc,
        })),
        network: 'Polkadot Asset Hub',
        isDemo: true,
    },
    {
        id: 'BB-IND-42199',
        date: new Date(Date.now() - 1000 * 60 * 220).toLocaleString(),
        timestamp: Date.now() - 1000 * 60 * 220,
        direction: 'INDIA_TO_GLOBAL',
        sender: {
            name: 'Ananya Deshmukh',
            address: '0x55E...99A1',
            country: 'India',
        },
        recipient: {
            name: 'Alexander Weber',
            payoutType: 'BANK_TRANSFER',
            identifier: 'DE89370400440532013000',
            bankName: 'Deutsche Bank',
            country: 'Germany',
        },
        sourceCurrency: 'INR',
        destCurrency: 'EUR',
        sourceAmount: 150000,
        destAmount: 1629.00,
        fxRate: 0.010893,
        fee: 450,
        feePercent: 0.30,
        risk: {
            level: 'LOW',
            score: 12,
            reasons: ['Liberalised Remittance Scheme (LRS) within $250k cap', 'Approved corridor'],
            isBlocked: false,
            requiresReview: false,
            engineType: 'RULE_BASED',
        },
        compliance: {
            status: 'PASSED',
            checks: [
                { name: 'RBI LRS Simulated Compliance', status: 'PASSED', detail: 'Within individual outward limit' },
                { name: 'EU Sanctions Screening', status: 'PASSED', detail: 'Clean check' },
            ],
            reasons: ['LRS compliance simulated: PASSED'],
            isSimulated: true,
            thresholdUSD: 10000,
        },
        settlementStatus: 'COMPLETED',
        paymentStatus: 'COMPLETED',
        payoutStatus: 'SIMULATED',
        status: 'COMPLETED',
        currentStageIndex: 8,
        stages: LIFECYCLE_STAGES_CONFIG.map(s => ({
            id: s.id,
            label: s.label,
            status: 'COMPLETED',
            description: s.defaultDesc,
        })),
        network: 'Polkadot Asset Hub',
        isDemo: true,
    },
];

const STORAGE_KEY = 'bharatbridge_transactions_v1';

export class TransactionService {
    static getTransactions(): Transaction[] {
        if (typeof window === 'undefined') return SEED_TRANSACTIONS;
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (!stored) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_TRANSACTIONS));
                return SEED_TRANSACTIONS;
            }
            return JSON.parse(stored);
        } catch {
            return SEED_TRANSACTIONS;
        }
    }

    static getTransactionById(id: string): Transaction | undefined {
        const all = this.getTransactions();
        return all.find(t => t.id === id || t.id.toLowerCase() === id.toLowerCase());
    }

    static saveTransaction(tx: Transaction): void {
        if (typeof window === 'undefined') return;
        try {
            const all = this.getTransactions();
            const index = all.findIndex(t => t.id === tx.id);
            if (index >= 0) {
                all[index] = tx;
            } else {
                all.unshift(tx);
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
        } catch (e) {
            console.error('Failed to save transaction to localStorage:', e);
        }
    }

    static createTransaction(data: Omit<Transaction, 'stages' | 'currentStageIndex'>): Transaction {
        const stages: TransactionLifecycleStage[] = LIFECYCLE_STAGES_CONFIG.map((s, index) => {
            const isCompleted = index <= 3; // First 4 stages (Initiated, Fraud, Compliance, FX) are completed
            return {
                id: s.id,
                label: s.label,
                status: isCompleted ? 'COMPLETED' : (index === 4 ? 'PROCESSING' : 'PENDING'),
                timestamp: isCompleted ? new Date().toLocaleTimeString() : undefined,
                description: s.defaultDesc,
            };
        });

        const tx: Transaction = {
            ...data,
            stages,
            currentStageIndex: 4,
        };

        this.saveTransaction(tx);
        return tx;
    }

    static resetToSeedData(): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_TRANSACTIONS));
    }
}
