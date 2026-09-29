import { Currency, FXQuote } from '../types';

/**
 * BharatBridge FX Service
 * Provides transparent FX rates, conversions, and fee calculations.
 * NOTE: Uses configured DEMO FX Rates for hackathon demonstration.
 */

// Demo FX Rates configured against INR
export const DEMO_FX_RATES: Record<string, number> = {
    'USD_INR': 84.50,
    'GBP_INR': 107.20,
    'EUR_INR': 91.80,
    'AED_INR': 23.01,
    'SGD_INR': 62.80,
    'CAD_INR': 61.50,
    'AUD_INR': 54.90,
    'JPY_INR': 0.56,

    // Reverse corridors (INR to Global)
    'INR_USD': 1 / 84.50,
    'INR_GBP': 1 / 107.20,
    'INR_EUR': 1 / 91.80,
    'INR_AED': 1 / 23.01,
    'INR_SGD': 1 / 62.80,
    'INR_CAD': 1 / 61.50,
    'INR_AUD': 1 / 54.90,
    'INR_JPY': 1 / 0.56,

    // Stablecoins 1:1
    'USDT_USD': 1.0,
    'USDC_USD': 1.0,
    'USDT_INR': 84.50,
    'USDC_INR': 84.50,
};

export const BASE_FEE_BPS = 30; // 0.30% (30 basis points)

export class FXService {
    /**
     * Get the configured demo exchange rate for a currency pair
     */
    static getRate(from: Currency | string, to: Currency | string): number {
        if (from === to) return 1.0;
        const key = `${from}_${to}`;
        if (DEMO_FX_RATES[key]) {
            return DEMO_FX_RATES[key];
        }

        // Bridge via INR if indirect pair
        const fromToInr = DEMO_FX_RATES[`${from}_INR`];
        const inrToDest = DEMO_FX_RATES[`INR_${to}`];
        if (fromToInr && inrToDest) {
            return fromToInr * inrToDest;
        }

        return 84.50; // Fallback demo rate
    }

    /**
     * Calculate fee for a given amount
     * 0.30% standard BharatBridge fee
     */
    static calculateFee(amount: number, feeBps: number = BASE_FEE_BPS): { fee: number; feePercent: number } {
        if (!amount || amount <= 0) {
            return { fee: 0, feePercent: feeBps / 100 };
        }
        const fee = +(amount * (feeBps / 10000)).toFixed(2);
        return { fee, feePercent: feeBps / 100 };
    }

    /**
     * Convert an amount with full transparent quote breakdown
     */
    static convert(
        from: Currency,
        to: Currency,
        amount: number,
        customFeeBps: number = BASE_FEE_BPS
    ): FXQuote {
        const rate = this.getRate(from, to);
        const { fee, feePercent } = this.calculateFee(amount, customFeeBps);
        const netAmount = Math.max(0, amount - fee);
        const recipientAmount = +(netAmount * rate).toFixed(2);
        const effectiveRate = amount > 0 ? +(recipientAmount / amount).toFixed(4) : rate;

        return {
            sourceAmount: amount,
            sourceCurrency: from,
            destCurrency: to,
            rate,
            fee,
            feePercent,
            recipientAmount,
            effectiveRate,
            isDemoRate: true,
            timestamp: Date.now(),
        };
    }
}
