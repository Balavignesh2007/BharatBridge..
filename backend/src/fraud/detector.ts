export interface FraudCheckParams {
    amountUSD: number;
    consecutiveTxCount24h: number;
    dailyVolumeUSD: number;
    monthlyVolumeUSD: number;
    isNewWallet?: boolean;
}

export interface FraudCheckResult {
    passed: boolean;
    riskScore: number; // 0 - 100
    riskTier: 'LOW' | 'MEDIUM' | 'HIGH' | 'BLOCKED';
    flags: string[];
}

export class FraudDetector {
    static evaluate(params: FraudCheckParams): FraudCheckResult {
        const flags: string[] = [];
        let riskScore = 5; // Base low baseline

        // Rule 1: High single transaction amount
        if (params.amountUSD > 10000) {
            riskScore += 45;
            flags.push('Single transfer exceeds $10,000 threshold');
        } else if (params.amountUSD > 5000) {
            riskScore += 20;
            flags.push('Single transfer exceeds $5,000 elevated threshold');
        }

        // Rule 2: Transaction velocity within 24h
        if (params.consecutiveTxCount24h > 5) {
            riskScore += 40;
            flags.push('Excessive transfer frequency within 24h (> 5)');
        } else if (params.consecutiveTxCount24h > 3) {
            riskScore += 15;
            flags.push('Elevated transfer velocity (3+ in 24h)');
        }

        // Rule 3: 24h aggregate volume
        if (params.dailyVolumeUSD > 25000) {
            riskScore += 50;
            flags.push('Daily volume exceeds $25,000 cap');
        }

        let riskTier: 'LOW' | 'MEDIUM' | 'HIGH' | 'BLOCKED' = 'LOW';
        if (riskScore >= 75) riskTier = 'BLOCKED';
        else if (riskScore >= 45) riskTier = 'HIGH';
        else if (riskScore >= 25) riskTier = 'MEDIUM';

        return {
            passed: riskTier !== 'BLOCKED',
            riskScore: Math.min(riskScore, 100),
            riskTier,
            flags,
        };
    }
}
