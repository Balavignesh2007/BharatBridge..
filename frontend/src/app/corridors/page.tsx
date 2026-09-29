"use client";

import { useState } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useWallet } from '../../hooks/useWallet';
import { CorridorService } from '../../services/corridorService';

export default function CorridorsPage() {
    const wallet = useWallet();
    const corridors = CorridorService.getAllCorridors();
    const [calcAmounts, setCalcAmounts] = useState<Record<string, number>>({
        'USA_IND': 1000,
        'UK_IND': 500,
        'EUR_IND': 1000,
        'UAE_IND': 2500,
        'SGP_IND': 1500,
        'CAN_IND': 1000,
        'AUS_IND': 1000,
        'JPN_IND': 100000,
    });

    const handleAmountChange = (id: string, val: string) => {
        const num = parseFloat(val) || 0;
        setCalcAmounts(prev => ({ ...prev, [id]: num }));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc' }}>
            <Header wallet={wallet} />

            <main className="page-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <h1 className="page-title">
                            Supported Remittance Corridors
                        </h1>
                        <p className="page-subtitle">
                            Bilateral Global ↔ India Currency Rails Powered by Polkadot Asset Hub &amp; XCM
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                        <Link href="/send?demo=primary" className="btn btn-secondary btn-sm" style={{ border: '1px solid #f97316', color: '#ea580c' }}>
                            ⚡ Test Primary Corridor (USA → India)
                        </Link>
                    </div>
                </div>

                {/* Honesty Banner */}
                <div className="demo-banner">
                    <div>
                        <strong>DEMO FX RATES:</strong> Exchange rates below reflect configured benchmark quotes. BharatBridge charges a transparent flat fee of 0.30% with no hidden spreads.
                    </div>
                    <span className="badge badge-demo">DEMO RATES</span>
                </div>

                {/* Corridors Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
                    {corridors.map((c) => {
                        const amount = calcAmounts[c.id] ?? 1000;
                        const fee = amount * 0.003;
                        const netAmount = Math.max(0, amount - fee);
                        const inrReceived = netAmount * c.demoRate;

                        return (
                            <div key={c.id} className="fin-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span style={{ fontSize: '1.4rem' }}>{c.flag}</span>
                                            <div>
                                                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>
                                                    {c.name}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                                    {c.country} ({c.sourceCurrency}) ↔ India (INR)
                                                </div>
                                            </div>
                                        </div>

                                        <span className="badge badge-low" style={{ fontSize: '0.68rem' }}>
                                            ACTIVE
                                        </span>
                                    </div>

                                    {/* Rate & Fee Details */}
                                    <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 16 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 6 }}>
                                            <span style={{ color: '#64748b' }}>Demo FX Rate:</span>
                                            <span className="num-mono" style={{ fontWeight: 700 }}>
                                                1 {c.sourceCurrency} = ₹{c.demoRate.toFixed(2)} INR
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 6 }}>
                                            <span style={{ color: '#64748b' }}>Protocol Fee:</span>
                                            <span className="num-mono" style={{ fontWeight: 700, color: '#16a34a' }}>
                                                {c.feePercent.toFixed(2)}% Flat (No spread)
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                                            <span style={{ color: '#64748b' }}>Settlement Speed:</span>
                                            <span style={{ fontWeight: 600 }}>{c.speed}</span>
                                        </div>
                                    </div>

                                    {/* Interactive Quick Calculator */}
                                    <div style={{ marginBottom: 16 }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                                            Quick Converter ({c.sourceCurrency})
                                        </label>
                                        <input
                                            type="number"
                                            className="input-field num-mono"
                                            style={{ marginTop: 4, padding: '8px 12px' }}
                                            value={amount}
                                            onChange={(e) => handleAmountChange(c.id, e.target.value)}
                                            min="1"
                                        />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: '0.8rem' }}>
                                            <span style={{ color: '#64748b' }}>Recipient gets:</span>
                                            <span className="num-mono" style={{ fontWeight: 800, color: '#16a34a' }}>
                                                ₹{inrReceived.toLocaleString('en-IN', { maximumFractionDigits: 2 })} INR
                                            </span>
                                        </div>
                                    </div>

                                    {/* Rail Details */}
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 16 }}>
                                        <strong>Rails: </strong>
                                        {c.settlementMethods.join(' • ')}
                                    </div>
                                </div>

                                <Link
                                    href={`/send?corridor=${c.id}`}
                                    className="btn btn-primary"
                                    style={{ width: '100%', justifyContent: 'center', fontSize: '0.82rem' }}
                                >
                                    Transfer in this Corridor →
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </main>

            <Footer />
        </div>
    );
}
