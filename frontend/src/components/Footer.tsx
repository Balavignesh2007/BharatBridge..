import Link from 'next/link';

export default function Footer() {
    return (
        <footer style={{
            background: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            padding: '36px 20px 24px',
            marginTop: 'auto',
            fontSize: '0.85rem',
            color: '#64748b'
        }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 24,
                    marginBottom: 24
                }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>
                            BharatBridge 🇮🇳
                        </div>
                        <p style={{ marginTop: 4, color: '#475569', fontSize: '0.88rem' }}>
                            India to the World. The Bridge for Global Money.
                        </p>
                        <p style={{ marginTop: 2, fontSize: '0.78rem', color: '#94a3b8' }}>
                            India-First Cross-Border Remittance & Settlement Platform on Polkadot PVM
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                        <div>
                            <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 8, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Navigation
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <Link href="/dashboard" style={{ color: '#475569' }}>Dashboard</Link>
                                <Link href="/send" style={{ color: '#475569' }}>Send Money</Link>
                                <Link href="/transactions" style={{ color: '#475569' }}>Transaction History</Link>
                                <Link href="/corridors" style={{ color: '#475569' }}>Supported Corridors</Link>
                            </div>
                        </div>

                        <div>
                            <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 8, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Core Technology
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <span>Polkadot Asset Hub</span>
                                <span>XCM Cross-Chain Messaging</span>
                                <span>Deterministic Risk Engine</span>
                                <span>Simulated Payment Rails</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    padding: '12px 16px',
                    fontSize: '0.78rem',
                    color: '#64748b',
                    lineHeight: 1.5,
                    marginBottom: 20
                }}>
                    <strong style={{ color: '#334155' }}>⚠️ DEMO & TESTNET NOTICE:</strong> BharatBridge is an advanced hackathon demonstration prototype. Exchange rates are configured demo rates, compliance validations and domestic fiat banking payouts (IMPS/UPI) are simulated abstractions, and blockchain settlement targets the Polkadot Asset Hub testnet and simulated local contracts. No real financial obligations or unauthorized banking claims are made.
                </div>

                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: 16,
                    borderTop: '1px solid #f1f5f9',
                    fontSize: '0.75rem',
                    color: '#94a3b8'
                }}>
                    <div>
                        © {new Date().getFullYear()} BharatBridge 🇮🇳. MIT License.
                    </div>
                    <div>
                        Sub-1% Transparent Cross-Border Settlement
                    </div>
                </div>
            </div>
        </footer>
    );
}
