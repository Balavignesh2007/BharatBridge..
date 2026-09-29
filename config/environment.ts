/**
 * BharatBridge Environment & Runtime Settings
 */

export const ENV = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    IS_PRODUCTION: process.env.NODE_ENV === 'production',
    IS_DEMO: process.env.NEXT_PUBLIC_DEMO_MODE !== 'false',
    BACKEND_PORT: parseInt(process.env.BACKEND_PORT || '5000', 10),
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
    POLKADOT_HUB_RPC: process.env.POLKADOT_HUB_RPC_URL || 'https://polkadot-asset-hub-eth-rpc.polkadot.io',
    WESTEND_RPC: process.env.WESTEND_RPC_URL || 'https://westend-asset-hub-eth-rpc.polkadot.io',
    PRIVATE_KEY: process.env.PRIVATE_KEY || '',
    JWT_SECRET: process.env.JWT_SECRET || 'bharatbridge-secure-jwt-secret-dev',
    XCM_PRECOMPILE: '0x0000000000000000000000000000000000000803',
};
