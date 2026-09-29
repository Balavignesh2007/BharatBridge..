export class BankingAPI {
    static async verifyVPA(vpa: string): Promise<{ valid: boolean; holderName: string }> {
        const parts = vpa.split('@');
        const valid = parts.length === 2 && parts[0].length > 2;

        return {
            valid,
            holderName: valid ? 'Verified Account Holder' : 'Unknown',
        };
    }

    static async verifyBankAccount(accountNumber: string, ifsc: string): Promise<{ valid: boolean; bank: string }> {
        return {
            valid: accountNumber.length >= 8,
            bank: ifsc.substring(0, 4).toUpperCase() + ' Bank',
        };
    }
}
