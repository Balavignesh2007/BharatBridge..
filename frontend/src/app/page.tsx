"use client";

import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useWallet } from '../hooks/useWallet';
import { CorridorService } from '../services/corridorService';
import { FEE_COMPARISON } from '../constants';

export default function Home() {
    const wallet = useWallet();
    const corridors = CorridorService.getAllCorridors();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc' }}>
            <Header wallet={wallet} />

            {/* Hero Section */}
            <section style={{
                background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)',
                borderBottom: '1px solid #e2e8f0',
                padding: '64px 20px 72px',
                textAlign: 'center',
            }}>
                <div style={{ maxWidth: 920, margin: '0 auto' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        background: '#fff7ed',
                        border: '1px solid #fed7aa',
                        color: '#9a3412',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        padding: '6px 14px',
                        borderRadius: 9999,
                        marginBottom: 20,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                    }}>
                        <span>🇮🇳 India-First Cross-Border Infrastructure</span>
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
                        fontWeight: 900,
                        letterSpacing: '-0.035em',
                        color: '#0f172a',
                        lineHeight: 1.15,
                        marginBottom: 18,
                    }}>
                        India to the World.<br />
                        <span style={{ color: '#2563eb' }}>The Bridge for Global Money.</span>
                    </h1>

                    <p style={{
                        fontSize: '1.15rem',
                        color: '#475569',
                        maxWidth: 720,
                        margin: '0 auto 32px',
                        lineHeight: 1.6,
                    }}>
                        BharatBridge simplifies cross-border remittances with transparent FX conversion,
                        rule-based risk controls, simulated compliance checks, and Polkadot blockchain settlement.
                    </p>

                    <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/send" className="btn btn-primary btn-lg">
                            Send Money Now →
                        </Link>
                        <Link href="/dashboard" className="btn btn-secondary btn-lg">
                            Explore Dashboard
                        </Link>
                    </div>

                    {/* Quick Hackathon Demo Callout */}
                    <div style={{
                        marginTop: 36,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 12,
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: 12,
                        padding: '10px 18px',
                        fontSize: '0.82rem',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                    }}>
                        <span style={{ fontWeight: 700, color: '#0f172a' }}>⚡ Primary Demo:</span>
                        <span style={{ color: '#475569' }}>USA → India ($1,000 USD @ ₹84.50 = ₹84,246.50)</span>
                        <Link href="/send?demo=primary" style={{ color: '#2563eb', fontWeight: 700 }}>
                            Launch Demo Flow →
                        </Link>
                    </div>
                </div>
            </section>

            {/* Live Corridors Bar */}
            <section style={{
                background: '#ffffff',
                borderBottom: '1px solid #e2e8f0',
                padding: '16px 20px',
                overflowX: 'auto',
            }}>
                <div style={{
                    maxWidth: 1200,
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 24,
                    whiteSpace: 'nowrap',
                    fontSize: '0.82rem',
                }}>
                    <span style={{ fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Live Demo FX Rates:
                    </span>
                    {corridors.map((c) => (
                        <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#334155' }}>
                            <span>{c.flag}</span>
                            <span style={{ fontWeight: 600 }}>{c.sourceCurrency}/INR:</span>
                            <span className="num-mono" style={{ fontWeight: 700, color: '#0f172a' }}>
                                ₹{c.demoRate.toFixed(2)}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Core Capabilities */}
            <section style={{ padding: '64px 20px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: 44 }}>
                    <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                        Enterprise-Grade Remittance Infrastructure
                    </h2>
                    <p style={{ color: '#64748b', marginTop: 6, fontSize: '0.98rem' }}>
                        Built ground-up with transparent economics, compliance verification, and blockchain finality.
                    </p>
                </div>

                <div className="grid-3">
                    <div className="fin-card">
                        <div style={{ fontSize: '1.75rem', marginBottom: 12 }}>⚡</div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 8, color: '#0f172a' }}>
                            Cross-Border Remittances
                        </h3>
                        <p style={{ color: '#475569', fontSize: '0.9rem' }}>
                            Seamless bilateral transfers connecting the global Indian diaspora to domestic banking systems with sub-1% fees.
                        </p>
                    </div>

                    <div className="fin-card">
                        <div style={{ fontSize: '1.75rem', marginBottom: 12 }}>📊</div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 8, color: '#0f172a' }}>
                            Transparent FX Engine
                        </h3>
                        <p style={{ color: '#475569', fontSize: '0.9rem' }}>
                            Guaranteed exchange rate calculations without hidden markups or surprise fees. Clear 0.30% flat fee structure.
                        </p>
                    </div>

                    <div className="fin-card">
                        <div style={{ fontSize: '1.75rem', marginBottom: 12 }}>🛡️</div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 8, color: '#0f172a' }}>
                            Rule-Based Risk Controls
                        </h3>
                        <p style={{ color: '#475569', fontSize: '0.9rem' }}>
                            Deterministic security rules evaluating transaction amounts, transfer velocity, sanctions lists, and frequency limits.
                        </p>
                    </div>

                    <div className="fin-card">
                        <div style={{ fontSize: '1.75rem', marginBottom: 12 }}>⚖️</div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 8, color: '#0f172a' }}>
                            Simulated Compliance Layer
                        </h3>
                        <p style={{ color: '#475569', fontSize: '0.9rem' }}>
                            Simulated AML watchlist screening, RBI LRS threshold verification, and travel rule compliance checks.
                        </p>
                    </div>

                    <div className="fin-card">
                        <div style={{ fontSize: '1.75rem', marginBottom: 12 }}>⛓️</div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 8, color: '#0f172a' }}>
                            Polkadot Blockchain Settlement
                        </h3>
                        <p style={{ color: '#475569', fontSize: '0.9rem' }}>
                            Asset Hub native stablecoin integration (USDT/USDC) providing verifiable, decentralized on-chain finality.
                        </p>
                    </div>

                    <div className="fin-card">
                        <div style={{ fontSize: '1.75rem', marginBottom: 12 }}>🌐</div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 8, color: '#0f172a' }}>
                            Cross-Chain XCM Architecture
                        </h3>
                        <p style={{ color: '#475569', fontSize: '0.9rem' }}>
                            Polkadot Cross-Consensus Messaging (XCM) enables settlement across parachains like Moonbeam, Astar, and Hydration.
                        </p>
                    </div>
                </div>
            </section>

            {/* Fee Comparison Benchmarks */}
            <section style={{ background: '#ffffff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '64px 20px' }}>
                <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>
                        Industry Fee Comparison
                    </h2>
                    <p style={{ color: '#64748b', marginTop: 4, marginBottom: 32, fontSize: '0.95rem' }}>
                        Sending $1,000 USD to India (INR) — See how BharatBridge eliminates legacy banking markups
                    </p>

                    <div className="table-wrap">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Provider</th>
                                    <th>Fee on $1,000</th>
                                    <th>Effective %</th>
                                    <th>Transfer Speed</th>
                                    <th>Recipient Receives</th>
                                </tr>
                            </thead>
                            <tbody>
                                {FEE_COMPARISON.map((p) => {
                                    const netAmount = 1000 - p.fee;
                                    const inrAmount = (netAmount * 84.50).toFixed(2);
                                    return (
                                        <tr key={p.provider} style={{ background: p.isUs ? '#f0fdf4' : undefined }}>
                                            <td style={{ fontWeight: p.isUs ? 800 : 600 }}>
                                                {p.provider}
                                            </td>
                                            <td className="num-mono" style={{ color: p.isUs ? '#15803d' : '#b91c1c', fontWeight: 700 }}>
                                                ${p.fee.toFixed(2)}
                                            </td>
                                            <td className="num-mono">{p.feePercent.toFixed(2)}%</td>
                                            <td>{p.speed}</td>
                                            <td className="num-mono" style={{ fontWeight: 800, color: p.isUs ? '#15803d' : '#334155' }}>
                                                ₹{parseFloat(inrAmount).toLocaleString()}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* End-to-End Lifecycle Preview */}
            <section style={{ padding: '64px 20px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>
                        9-Stage Settlement Lifecycle
                    </h2>
                    <p style={{ color: '#64748b', marginTop: 4, fontSize: '0.95rem' }}>
                        Every transaction is transparently verified from initiation to simulated domestic IMPS/UPI payout.
                    </p>
                </div>

                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: 12,
                }}>
                    {[
                        '1. Initiated',
                        '2. Fraud Risk Check',
                        '3. Compliance Check',
                        '4. FX Quote Locked',
                        '5. Stablecoin Transfer',
                        '6. Cross-Chain XCM',
                        '7. Currency Conversion',
                        '8. Payment Processing',
                        '9. Recipient Payout',
                    ].map((step, idx) => (
                        <div key={step} style={{
                            background: '#ffffff',
                            border: '1px solid #cbd5e1',
                            borderRadius: 8,
                            padding: '10px 16px',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            color: idx === 8 ? '#15803d' : '#334155',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                        }}>
                            <span style={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: idx === 8 ? '#10b981' : '#2563eb',
                            }} />
                            {step}
                        </div>
                    ))}
                </div>

                <div style={{ textAlign: 'center', marginTop: 44 }}>
                    <Link href="/send" className="btn btn-primary btn-lg">
                        Test the Live Transfer Pipeline →
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
}
