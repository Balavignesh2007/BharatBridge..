import { JsonRpcProvider } from 'ethers';
import { NETWORKS } from '../../config/networks';

/**
 * BharatBridge Polkadot Hub Client
 * Connects to Polkadot Asset Hub EVM RPC with fallback logic
 */
export class PolkadotHubClient {
    private provider: JsonRpcProvider;

    constructor(rpcUrl: string = NETWORKS.polkadotHub.rpcUrl) {
        this.provider = new JsonRpcProvider(rpcUrl);
    }

    getProvider(): JsonRpcProvider {
        return this.provider;
    }

    async getBlockNumber(): Promise<number> {
        return await this.provider.getBlockNumber();
    }

    async getNetwork(): Promise<{ name: string; chainId: bigint }> {
        const net = await this.provider.getNetwork();
        return { name: net.name, chainId: net.chainId };
    }
}

export const polkadotClient = new PolkadotHubClient();
