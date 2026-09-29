/**
 * BharatBridge XCM (Cross-Consensus Messaging) Layer
 * Handles cross-chain asset routing between Polkadot Asset Hub and connected parachains.
 */

export interface XcmMultiLocation {
    parents: number;
    interior: any[];
}

export interface XcmTransferParams {
    destChainId: number;
    recipientAddress: string;
    assetId: string;
    amount: bigint;
    fee: bigint;
}

export class XcmService {
    public static readonly XCM_PRECOMPILE_ADDRESS = '0x0000000000000000000000000000000000000803';

    /**
     * Construct MultiLocation for destination parachain
     */
    static buildDestLocation(parachainId: number): XcmMultiLocation {
        return {
            parents: 1,
            interior: [{ Parachain: parachainId }],
        };
    }

    /**
     * Construct MultiLocation for beneficiary
     */
    static buildBeneficiaryLocation(address: string): XcmMultiLocation {
        return {
            parents: 0,
            interior: [{ AccountKey20: { network: null, key: address } }],
        };
    }

    /**
     * Prepare XCM transfer transaction parameters
     */
    static prepareTransfer(params: XcmTransferParams) {
        return {
            precompileAddress: this.XCM_PRECOMPILE_ADDRESS,
            dest: this.buildDestLocation(params.destChainId),
            beneficiary: this.buildBeneficiaryLocation(params.recipientAddress),
            amount: params.amount.toString(),
            fee: params.fee.toString(),
        };
    }
}
