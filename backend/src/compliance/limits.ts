export const CORRIDOR_LIMITS = {
    USA_IND: { singleTxMaxUSD: 10000, dailyMaxUSD: 25000, lrsApplicable: false },
    GBR_IND: { singleTxMaxUSD: 10000, dailyMaxUSD: 25000, lrsApplicable: false },
    EUR_IND: { singleTxMaxUSD: 10000, dailyMaxUSD: 25000, lrsApplicable: false },
    ARE_IND: { singleTxMaxUSD: 10000, dailyMaxUSD: 25000, lrsApplicable: false },
    SGP_IND: { singleTxMaxUSD: 10000, dailyMaxUSD: 25000, lrsApplicable: false },
    CAN_IND: { singleTxMaxUSD: 10000, dailyMaxUSD: 25000, lrsApplicable: false },
    AUS_IND: { singleTxMaxUSD: 10000, dailyMaxUSD: 25000, lrsApplicable: false },
    JPN_IND: { singleTxMaxUSD: 10000, dailyMaxUSD: 25000, lrsApplicable: false },
    IND_GLOBAL: { singleTxMaxUSD: 25000, dailyMaxUSD: 250000, lrsApplicable: true, lrsAnnualCapUSD: 250000 },
};

export class CorridorControls {
    static validateLimits(corridorId: string, amountUSD: number): { allowed: boolean; reason?: string } {
        const config = (CORRIDOR_LIMITS as any)[corridorId] || CORRIDOR_LIMITS.USA_IND;

        if (amountUSD > config.singleTxMaxUSD) {
            return {
                allowed: false,
                reason: `Amount exceeds single transfer limit of $${config.singleTxMaxUSD.toLocaleString()} USD for corridor`,
            };
        }

        return { allowed: true };
    }
}
