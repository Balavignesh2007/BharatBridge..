export const SANCTIONED_WALLETS = new Set<string>([
    '0x098ea7004f88da353f2304195b69966d2d414740'.toLowerCase(),
    '0xd90e2f925da726b50c4ed8d0fb90ad053324f31b'.toLowerCase(),
    '0x72a5843cc08275c8171e54977b4250274fc738f1'.toLowerCase(),
]);

export class WalletScreening {
    static screenWallet(address: string): { clean: boolean; reason?: string } {
        if (!address) return { clean: true };

        const cleanAddr = address.toLowerCase();
        if (SANCTIONED_WALLETS.has(cleanAddr)) {
            return {
                clean: false,
                reason: 'Wallet flagged under simulated OFAC / FATF sanctions blacklist',
            };
        }

        return { clean: true };
    }
}
