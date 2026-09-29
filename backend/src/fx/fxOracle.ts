/**
 * FX Oracle Engine
 * Configured multi-currency rates for all 8 India remittance corridors
 */

export const FX_RATES_INR: Record<string, number> = {
    USD: 84.50,
    GBP: 107.20,
    EUR: 91.80,
    AED: 23.01,
    SGD: 62.80,
    CAD: 61.50,
    AUD: 54.90,
    JPY: 0.56,
};

export class FXOracle {
    static getRate(currency: string): number {
        return FX_RATES_INR[currency.toUpperCase()] || 84.50;
    }

    static getPairRate(from: string, to: string): number {
        const fromUpper = from.toUpperCase();
        const toUpper = to.toUpperCase();

        if (fromUpper === toUpper) return 1.0;
        if (toUpper === 'INR') return this.getRate(fromUpper);
        if (fromUpper === 'INR') return 1 / this.getRate(toUpper);

        const rateFromInr = this.getRate(fromUpper);
        const rateToInr = this.getRate(toUpper);
        return rateFromInr / rateToInr;
    }
}
