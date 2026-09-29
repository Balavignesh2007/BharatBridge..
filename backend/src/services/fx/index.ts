import { FXOracle } from '../../fx/fxOracle';

export interface ConversionQuote {
    sourceCurrency: string;
    destCurrency: string;
    sourceAmount: number;
    exchangeRate: number;
    feeAmount: number;
    feePercent: number;
    recipientAmount: number;
    guaranteedUntil: string;
}

export class FXService {
    static convert(from: string, to: string, amount: number, feePercent: number = 0.30): ConversionQuote {
        const rate = FXOracle.getPairRate(from, to);
        const feeAmount = (amount * feePercent) / 100;
        const netAmount = amount - feeAmount;
        const recipientAmount = Math.round(netAmount * rate * 100) / 100;

        const guaranteedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();

        return {
            sourceCurrency: from,
            destCurrency: to,
            sourceAmount: amount,
            exchangeRate: rate,
            feeAmount,
            feePercent,
            recipientAmount,
            guaranteedUntil,
        };
    }
}
