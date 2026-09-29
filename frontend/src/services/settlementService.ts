import { Contract, parseUnits, formatUnits } from 'ethers';
import { CONTRACTS, BHARATBRIDGE_ABI, ERC20_ABI } from '../constants';
import { Currency } from '../types';

export interface SettlementParams {
    tokenSymbol: 'USDT' | 'USDC';
    amount: number;
    recipientAddress: string;
    destChainId: number;
    destCurrency: Currency;
    signer?: any;
    account?: string;
    isSimulated?: boolean;
}

export interface SettlementResult {
    success: boolean;
    remittanceId: string;
    txHash: string;
    blockNumber?: number;
    feePaid: number;
    amountReceived: number;
    isSimulated: boolean;
    network: string;
    errorMessage?: string;
}

export class SettlementService {
    /**
     * Execute settlement either through live Web3 contracts or simulated engine
     */
    static async executeSettlement(params: SettlementParams): Promise<SettlementResult> {
        const {
            tokenSymbol,
            amount,
            recipientAddress,
            destChainId,
            destCurrency,
            signer,
            account,
            isSimulated = false,
        } = params;

        // If signer and account are available and not forced simulation, try real contract call
        if (!isSimulated && signer && account) {
            try {
                const tokenAddress = tokenSymbol === 'USDT' ? CONTRACTS.MockUSDT : CONTRACTS.MockUSDC;
                const tokenContract = new Contract(tokenAddress, ERC20_ABI, signer);
                const bridgeContract = new Contract(CONTRACTS.BharatBridge, BHARATBRIDGE_ABI, signer);

                const decimals = await tokenContract.decimals();
                const parsedAmount = parseUnits(amount.toString(), decimals);

                // 1. Check allowance and approve
                const allowance = await tokenContract.allowance(account, CONTRACTS.BharatBridge);
                if (allowance < parsedAmount) {
                    const approveTx = await tokenContract.approve(CONTRACTS.BharatBridge, parsedAmount);
                    await approveTx.wait();
                }

                // 2. Dispatch remittance
                let tx;
                if (destChainId > 0) {
                    tx = await bridgeContract.sendCrossChainRemittance(
                        tokenAddress,
                        parsedAmount,
                        recipientAddress,
                        destChainId,
                        destCurrency
                    );
                } else {
                    tx = await bridgeContract.sendRemittance(
                        tokenAddress,
                        parsedAmount,
                        recipientAddress,
                        destCurrency
                    );
                }

                const receipt = await tx.wait();

                // 3. Parse RemittanceSent event
                let remittanceId = `${Date.now().toString().slice(-5)}`;
                let feePaid = +(amount * 0.003).toFixed(2);
                let amountReceived = +(amount - feePaid).toFixed(2);

                for (const log of receipt.logs) {
                    try {
                        const parsed = bridgeContract.interface.parseLog({
                            topics: log.topics as string[],
                            data: log.data,
                        });
                        if (parsed && parsed.name === 'RemittanceSent') {
                            remittanceId = parsed.args[0].toString();
                            feePaid = parseFloat(formatUnits(parsed.args[6], decimals));
                            amountReceived = parseFloat(formatUnits(parsed.args[5], decimals));
                        }
                    } catch {
                        // ignore non-matching logs
                    }
                }

                return {
                    success: true,
                    remittanceId,
                    txHash: receipt.hash,
                    blockNumber: receipt.blockNumber,
                    feePaid,
                    amountReceived,
                    isSimulated: false,
                    network: 'Polkadot Asset Hub / Local Testnet',
                };
            } catch (err: any) {
                console.warn('Real contract settlement failed or rejected; returning error or simulation info:', err);
                // Return failed result with clear message
                return {
                    success: false,
                    remittanceId: '0',
                    txHash: '',
                    feePaid: 0,
                    amountReceived: 0,
                    isSimulated: false,
                    network: 'Polkadot Asset Hub',
                    errorMessage: err.reason || err.message || 'On-chain transaction was rejected or failed',
                };
            }
        }

        // SIMULATED SETTLEMENT (Demo / Hackathon fallback when no wallet connected)
        await new Promise(resolve => setTimeout(resolve, 800)); // Brief realistic simulation delay

        const feePaid = +(amount * 0.003).toFixed(2);
        const amountReceived = +(amount - feePaid).toFixed(2);
        const simulatedId = `${Math.floor(10000 + Math.random() * 90000)}`;
        const simulatedTxHash = `0xsim_${Date.now().toString(16)}${Math.random().toString(16).slice(2, 10)}`;

        return {
            success: true,
            remittanceId: simulatedId,
            txHash: simulatedTxHash,
            feePaid,
            amountReceived,
            isSimulated: true,
            network: destChainId > 0 ? 'Polkadot XCM Simulated Parachain' : 'Polkadot Asset Hub (Simulated)',
        };
    }
}
