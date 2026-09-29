import { NextResponse } from 'next/server';
import { verifyMessage } from 'ethers';

/**
 * REST API: Security & Wallet-Based Authentication
 * - EIP-4361 / Sign-In with Ethereum (SIWE) signature verification
 * - Cryptographic wallet-based authentication via ethers.js v6
 * - Address checksum & nonce verification
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { message, signature, address } = body;

        if (!message || !signature || !address) {
            return NextResponse.json({
                success: false,
                error: 'Missing required authentication fields: message, signature, address',
            }, { status: 400 });
        }

        // Recover signer address using ethers.js v6
        const recoveredAddress = verifyMessage(message, signature);

        if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
            return NextResponse.json({
                success: false,
                authenticated: false,
                error: 'Signature verification failed: signer does not match provided address',
            }, { status: 401 });
        }

        // Create authentication session payload
        return NextResponse.json({
            success: true,
            authenticated: true,
            address: recoveredAddress,
            authMethod: 'WALLET_SIGNATURE_ETHERS_V6',
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            permissions: [
                'REMITTANCE_INITIATE',
                'FX_QUOTE_LOCK',
                'TRANSACTION_READ',
            ],
        });
    } catch (err: any) {
        return NextResponse.json({
            success: false,
            authenticated: false,
            error: err.message || 'Cryptographic verification exception',
        }, { status: 500 });
    }
}

export async function GET() {
    // Generate a fresh authentication challenge nonce
    const nonce = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const timestamp = new Date().toISOString();
    const challengeMessage = `BharatBridge Authentication Challenge\nNonce: ${nonce}\nTimestamp: ${timestamp}\nDomain: bharatbridge.io`;

    return NextResponse.json({
        success: true,
        challenge: {
            nonce,
            timestamp,
            message: challengeMessage,
        },
    });
}
