import { verifyMessage } from 'ethers';

export class WalletAuthMiddleware {
    static verifySignature(message: string, signature: string, expectedAddress: string): boolean {
        try {
            const recoveredAddress = verifyMessage(message, signature);
            return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
        } catch {
            return false;
        }
    }
}
