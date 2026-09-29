import { RiskCheckResult, RiskLevel, Currency } from '../types';

/**
 * BharatBridge Rule-Based Risk Engine
 * NOTE: This is a deterministic, rule-based risk engine (NOT AI/ML).
 * Evaluates transaction parameters against security and AML rules.
 */

// Simulated blacklisted/sanctioned addresses for testing
export const BLACKLISTED_ADDRESSES = new Set<string>([
    '0x000000000000000000000000000000000000dead',
    '0x1111111111111111111111111111111111111111',
    '0xbad0000000000000000000000000000000000bad',
]);

// Restricted or embargoed corridors
export const RESTRICTED_CORRIDORS = new Set<string>(['IRN', 'PRK', 'SYR', 'RUS']);

export interface RiskEvaluationParams {
    amountUSD: number;
    walletAddress?: string;
    corridorCode?: string;
    isNewWallet?: boolean;
    consecutiveTxCount24h?: number;
    dailyVolumeUSD?: number;
    monthlyVolumeUSD?: number;
    sourceCurrency: Currency;
    destCurrency: Currency;
}

export class RiskService {
    /**
     * Evaluate transaction risk using deterministic rule set
     */
    static evaluateRisk(params: RiskEvaluationParams): RiskCheckResult {
        const reasons: string[] = [];
        let riskScore = 0; // 0 - 100

        const {
            amountUSD,
            walletAddress = '',
            corridorCode = '',
            isNewWallet = false,
            consecutiveTxCount24h = 1,
            dailyVolumeUSD = 0,
            monthlyVolumeUSD = 0,
        } = params;

        // Rule 1: Blacklist / Sanctioned Wallet Check
        const cleanAddress = walletAddress.toLowerCase();
        if (cleanAddress && BLACKLISTED_ADDRESSES.has(cleanAddress)) {
            reasons.push('CRITICAL: Wallet address flagged on sanctions blacklist');
            return {
                level: 'HIGH',
                score: 100,
                reasons,
                isBlocked: true,
                requiresReview: true,
                engineType: 'RULE_BASED',
            };
        }

        // Rule 2: Restricted Corridor Check
        if (corridorCode && RESTRICTED_CORRIDORS.has(corridorCode.toUpperCase())) {
            reasons.push(`CRITICAL: Corridor ${corridorCode} is currently restricted by jurisdiction policy`);
            return {
                level: 'HIGH',
                score: 95,
                reasons,
                isBlocked: true,
                requiresReview: true,
                engineType: 'RULE_BASED',
            };
        }

        // Rule 3: Single Transaction Hard Cap (> $50,000 USD)
        if (amountUSD > 50000) {
            riskScore += 60;
            reasons.push(`Amount ($${amountUSD.toLocaleString()}) exceeds single-transaction risk cap ($50,000)`);
        } else if (amountUSD > 10000) {
            // Rule 4: High Value Threshold ($10,000 - $50,000)
            riskScore += 30;
            reasons.push(`High-value transaction ($${amountUSD.toLocaleString()}) requires secondary compliance review`);
        } else {
            reasons.push('Transaction amount within standard retail limits (< $10,000)');
        }

        // Rule 5: Daily Limit Exceeded (> $25,000)
        const projectedDaily = dailyVolumeUSD + amountUSD;
        if (projectedDaily > 25000) {
            riskScore += 35;
            reasons.push(`Projected 24-hour volume ($${projectedDaily.toLocaleString()}) exceeds daily threshold ($25,000)`);
        }

        // Rule 6: Monthly Limit Exceeded (> $100,000)
        const projectedMonthly = monthlyVolumeUSD + amountUSD;
        if (projectedMonthly > 100000) {
            riskScore += 40;
            reasons.push(`Monthly remittance cap ($100,000) exceeded`);
        }

        // Rule 7: New Wallet with High Value
        if (isNewWallet && amountUSD > 3000) {
            riskScore += 25;
            reasons.push('Unverified newly connected wallet initiating transfer > $3,000');
        }

        // Rule 8: Velocity / Rapid Consecutive Transfers
        if (consecutiveTxCount24h > 5) {
            riskScore += 30;
            reasons.push(`High transfer frequency detected (${consecutiveTxCount24h} transfers in 24 hours)`);
        } else if (consecutiveTxCount24h > 1) {
            reasons.push(`Normal transfer frequency (${consecutiveTxCount24h} transfers today)`);
        } else {
            reasons.push('Normal transaction frequency');
        }

        // Positive checks if no adverse flags
        if (cleanAddress && !BLACKLISTED_ADDRESSES.has(cleanAddress)) {
            reasons.push('Wallet verified: not present on sanctions blacklist');
        }
        reasons.push('Approved bilateral corridor');

        // Determine outcome level
        let level: RiskLevel = 'LOW';
        let isBlocked = false;
        let requiresReview = false;

        if (riskScore >= 60) {
            level = 'HIGH';
            isBlocked = true;
            requiresReview = true;
        } else if (riskScore >= 25) {
            level = 'MEDIUM';
            requiresReview = true;
        } else {
            level = 'LOW';
        }

        return {
            level,
            score: Math.min(100, riskScore),
            reasons,
            isBlocked,
            requiresReview,
            engineType: 'RULE_BASED',
        };
    }
}
