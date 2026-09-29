import { RemittanceController } from '../controllers/remittanceController';
import { FXOracle } from '../fx/fxOracle';
import { FeeEngine } from '../services/fees/feeEngine';
import { WalletAuthMiddleware } from '../middleware/auth';

export class RemittanceRoutes {
    static async handleRequest(url: string, method: string, body?: any) {
        const parsedUrl = new URL(url, 'http://localhost:5000');
        const pathname = parsedUrl.pathname;

        if (method === 'GET' && pathname === '/api/v1/rates') {
            const from = parsedUrl.searchParams.get('from') || 'USD';
            const to = parsedUrl.searchParams.get('to') || 'INR';
            const rate = FXOracle.getPairRate(from, to);
            return { success: true, from, to, rate, feePercent: 0.30 };
        }

        if (method === 'POST' && pathname === '/api/v1/remit') {
            return await RemittanceController.handleRemittance(body || {});
        }

        if (method === 'POST' && pathname === '/api/v1/auth/verify') {
            const { message, signature, address } = body || {};
            const isValid = WalletAuthMiddleware.verifySignature(message, signature, address);
            return { success: isValid, authenticated: isValid, address };
        }

        if (method === 'GET' && pathname === '/api/v1/fees') {
            const amount = parseFloat(parsedUrl.searchParams.get('amount') || '1000');
            return { success: true, fees: FeeEngine.calculateFee(amount) };
        }

        return { error: 'Not found', path: pathname };
    }
}
