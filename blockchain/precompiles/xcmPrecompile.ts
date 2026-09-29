/**
 * IXcmPrecompile Contract ABI & Helpers
 * Target address on Polkadot Asset Hub / Moonbeam PVM:
 * 0x0000000000000000000000000000000000000803
 */

export const XCM_PRECOMPILE_ADDRESS = '0x0000000000000000000000000000000000000803';

export const XCM_PRECOMPILE_ABI = [
    {
        name: 'transfer',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            {
                name: 'dest',
                type: 'tuple',
                components: [
                    { name: 'parents', type: 'uint8' },
                    { name: 'interior', type: 'bytes[]' },
                ],
            },
            {
                name: 'beneficiary',
                type: 'tuple',
                components: [
                    { name: 'parents', type: 'uint8' },
                    { name: 'interior', type: 'bytes[]' },
                ],
            },
            {
                name: 'assets',
                type: 'tuple[]',
                components: [
                    {
                        name: 'id',
                        type: 'tuple',
                        components: [
                            { name: 'parents', type: 'uint8' },
                            { name: 'interior', type: 'bytes[]' },
                        ],
                    },
                    { name: 'fun', type: 'uint128' },
                ],
            },
            { name: 'feeAssetItem', type: 'uint32' },
            { name: 'weightLimit', type: 'uint64' },
        ],
        outputs: [],
    },
] as const;
