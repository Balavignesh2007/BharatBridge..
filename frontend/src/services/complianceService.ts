import { ComplianceCheckResult, ComplianceStatus, ComplianceCheckItem } from '../types';
import { BLACKLISTED_ADDRESSES, RESTRICTED_CORRIDORS } from './riskService';

/**
 * BharatBridge Compliance Service
 * Evaluates compliance parameters against regulatory rules (AML, OFAC, RBI/FEMA limits).
 * NOTE: Explicitly marked as SIMULATED COMPLIANCE CHECK for hackathon demonstration.
 */

export interface ComplianceParams {
    amountUSD: number;
    walletAddress?: string;
    corridorCode?: string;
    recipientName?: string;
    senderCountry?: string;
    destCountry?: string;
}

export class ComplianceService {
    static checkCompliance(params: ComplianceParams): ComplianceCheckResult {
        const {
            amountUSD,
            walletAddress = '',
            corridorCode = 'IN',
            recipientName = '',
            senderCountry = 'USA',
            destCountry = 'India',
        } = params;

        const checks: ComplianceCheckItem[] = [];
        const reasons: string[] = [];

        // 1. Sanctions / OFAC Check
        const cleanAddr = walletAddress.toLowerCase();
        if (cleanAddr && BLACKLISTED_ADDRESSES.has(cleanAddr)) {
            checks.push({
                name: 'Sanctions & Watchlist Screening (OFAC/UN)',
                status: 'FAILED',
                detail: 'Sender address matched simulated OFAC sanctions entity',
            });
            reasons.push('Sanctioned entity violation: Transfer blocked');
        } else {
            checks.push({
                name: 'Sanctions & Watchlist Screening (OFAC/UN)',
                status: 'PASSED',
                detail: 'Clean record: No adverse sanctions matches identified',
            });
            reasons.push('Simulated OFAC/UN sanctions check cleared');
        }

        // 2. Regulatory Corridor Authorization (e.g. RBI LRS / Inward Remittance)
        if (RESTRICTED_CORRIDORS.has(corridorCode.toUpperCase())) {
            checks.push({
                name: 'Bilateral Corridor Authorization',
                status: 'FAILED',
                detail: `Jurisdiction ${corridorCode} lacks bilateral settlement authorization`,
            });
            reasons.push(`Corridor ${corridorCode} is unauthorized under current regulatory guidelines`);
        } else {
            checks.push({
                name: 'Bilateral Corridor Authorization',
                status: 'PASSED',
                detail: `Approved remittance corridor (${senderCountry} ↔ ${destCountry})`,
            });
            reasons.push(`Corridor authorized for outward/inward cross-border settlement`);
        }

        // 3. AML Threshold Check (Standard Travel Rule: $10,000 USD / INR equivalent)
        const travelRuleLimit = 10000;
        if (amountUSD > 50000) {
            checks.push({
                name: 'Anti-Money Laundering (AML) Tier 3 Threshold',
                status: 'FAILED',
                detail: `Transfer amount ($${amountUSD.toLocaleString()}) exceeds maximum unverified tier limit ($50,000)`,
            });
            reasons.push('Exceeds statutory single transaction threshold: Manual enhanced due diligence needed');
        } else if (amountUSD > travelRuleLimit) {
            checks.push({
                name: 'Travel Rule / CTR Reporting Threshold ($10,000)',
                status: 'WARNING',
                detail: `Amount triggers statutory reporting threshold ($${amountUSD.toLocaleString()} >= $10,000)`,
            });
            reasons.push('Statutory reporting threshold met: Requires originator/beneficiary verification log');
        } else {
            checks.push({
                name: 'Standard AML Reporting Threshold',
                status: 'PASSED',
                detail: `Amount ($${amountUSD.toLocaleString()}) is below the $10,000 travel-rule verification threshold`,
            });
            reasons.push('Below regulatory mandatory reporting cap');
        }

        // 4. Beneficiary Information Verification
        if (!recipientName || recipientName.trim().length < 2) {
            checks.push({
                name: 'Beneficiary Information Verification',
                status: 'WARNING',
                detail: 'Incomplete recipient identity provided',
            });
            reasons.push('Beneficiary details required for complete payment routing');
        } else {
            checks.push({
                name: 'Beneficiary Information Verification',
                status: 'PASSED',
                detail: `Recipient identified: ${recipientName}`,
            });
        }

        // Determine final compliance outcome
        let status: ComplianceStatus = 'PASSED';
        const hasFailed = checks.some(c => c.status === 'FAILED');
        const hasWarning = checks.some(c => c.status === 'WARNING');

        if (hasFailed) {
            status = 'BLOCKED';
        } else if (hasWarning) {
            status = 'REVIEW REQUIRED';
        } else {
            status = 'PASSED';
        }

        return {
            status,
            checks,
            reasons,
            isSimulated: true,
            thresholdUSD: travelRuleLimit,
        };
    }
}
