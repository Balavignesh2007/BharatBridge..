export class FeeEngine {
    public static readonly PROTOCOL_FEE_PERCENT = 0.30;
    public static readonly TRADITIONAL_BANK_FEE_PERCENT = 5.30;

    static calculateFee(amountUSD: number) {
        const protocolFee = (amountUSD * this.PROTOCOL_FEE_PERCENT) / 100;
        const traditionalFee = (amountUSD * this.TRADITIONAL_BANK_FEE_PERCENT) / 100;
        const userSavings = traditionalFee - protocolFee;

        return {
            protocolFeeUSD: Math.round(protocolFee * 100) / 100,
            protocolFeePercent: this.PROTOCOL_FEE_PERCENT,
            traditionalFeeUSD: Math.round(traditionalFee * 100) / 100,
            userSavingsUSD: Math.round(userSavings * 100) / 100,
            savingsPercent: Math.round(((traditionalFee - protocolFee) / traditionalFee) * 100),
        };
    }
}
