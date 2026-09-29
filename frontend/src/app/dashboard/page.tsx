"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useWallet } from '../../hooks/useWallet';
import { TransactionService } from '../../services/transactionService';
import { CorridorService } from '../../services/corridorService';
import { Transaction, Corridor } from '../../types';

export default function DashboardPage() {
    const wallet = useWallet();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [corridors, setCorridors] = useState<Corridor[]>([]);

    useEffect(() => {
        setTransactions(TransactionService.getTransactions());
        setCorridors(CorridorService.getAllCorridors());
    }, []);

    const totalVolume = transactions.reduce((acc, t) => acc + (t.sourceCurrency === 'USD' ? t.sourceAmount : (t.sourceAmount * 0.012)), 0);
    const completedCount = transactions.filter(t => t.status === 'COMPLETED').length;
    const activeCount = transactions.filter(t => t.status === 'PROCESSING' || t.status === 'PENDING').length;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc' }}>
            <Header wallet={wallet} />

            <main className="page-container">
                {/* Header Row */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 16,
                    marginBottom: 24
                }}>
                    <div>
                        <h1 className="page-title">
                            BharatBridge Dashboard
                        </h1>
                        <p className="page-subtitle">
                            Cross-Border Remittance & Settlement Platform Overview (Demo Mode Active)
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <Link href="/send?demo=primary" className="btn btn-secondary btn-sm" style={{ border: '1px solid #f97316', color: '#ea580c' }}>
                            ⚡ Load Primary Demo ($1,000)
                        </Link>
                        <Link href="/send" className="btn btn-primary btn-sm">
                            + Send Money
                        </Link>
                    </div>
                </div>

                {/* Honesty Demo Notice Banner */}
                <div className="demo-banner">
                    <div>
                        <strong>DEMO ENVIRONMENT:</strong> Operational metrics and corridor rates shown below are based on configured demo parameters and testnet blockchain activity.
                    </div>
                    <span className="badge badge-demo">TESTNET / SIMULATED</span>
                </div>

                {/* Top Metrics Cards */}
                <div className="grid-3" style={{ marginBottom: 24 }}>
                    <div className="fin-card">
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Total Remittance Volume
                        </div>
                        <div className="num-mono" style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', marginTop: 4 }}>
                            ${totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#16a34a', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span>●</span> All transactions verified on-chain / simulated
                        </div>
                    </div>

                    <div className="fin-card">
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Completed Transfers
                        </div>
                        <div className="num-mono" style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', marginTop: 4 }}>
                            {completedCount} <span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 500 }}>({activeCount} active)</span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 4 }}>
                            100% settlement success rate in demo suite
                        </div>
                    </div>

                    <div className="fin-card">
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Active Corridors & Avg Speed
                        </div>
                        <div className="num-mono" style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', marginTop: 4 }}>
                            8 <span style={{ fontSize: '1.1rem', color: '#2563eb', fontWeight: 700 }}>• &lt; 12s avg</span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 4 }}>
                            Polkadot Asset Hub + XCM Parachains
                        </div>
                    </div>
                </div>

                {/* Secondary Status Row */}
                <div className="grid-3" style={{ marginBottom: 32 }}>
                    <div className="fin-card" style={{ padding: '16px 20px' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Current Risk Status</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                            <span className="badge badge-low">LOW RISK / NORMAL</span>
                            <span style={{ fontSize: '0.82rem', color: '#475569' }}>0 flagged blocks</span>
                        </div>
                    </div>

                    <div className="fin-card" style={{ padding: '16px 20px' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Compliance Engine</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                            <span className="badge badge-simulated">AML / OFAC ACTIVE</span>
                            <span style={{ fontSize: '0.82rem', color: '#475569' }}>Simulated Layer</span>
                        </div>
                    </div>

                    <div className="fin-card" style={{ padding: '16px 20px' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Default Protocol Fee</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                            <span className="badge badge-saffron">0.30% FLAT</span>
                            <span style={{ fontSize: '0.82rem', color: '#475569' }}>Save ~94% vs Banks</span>
                        </div>
                    </div>
                </div>

                {/* Main Content Layout: Transactions + Corridors */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
                    {/* Left Column: Recent Transactions Table */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                                Recent Cross-Border Transfers
                            </h2>
                            <Link href="/transactions" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#2563eb' }}>
                                View All ({transactions.length}) →
                            </Link>
                        </div>

                        <div className="table-wrap">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Tx ID</th>
                                        <th>Direction</th>
                                        <th>Amount</th>
                                        <th>Recipient</th>
                                        <th>Risk</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.slice(0, 5).map((tx) => (
                                        <tr key={tx.id}>
                                            <td>
                                                <Link href={`/transactions/${tx.id}`} style={{ fontWeight: 700, color: '#2563eb' }}>
                                                    {tx.id}
                                                </Link>
                                                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                                                    {tx.date.split(',')[0]}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                                                    {tx.direction === 'GLOBAL_TO_INDIA' ? 'Global → India' : 'India → Global'}
                                                </div>
                                                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                                                    {tx.sourceCurrency} → {tx.destCurrency}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="num-mono" style={{ fontWeight: 700 }}>
                                                    {tx.sourceAmount.toLocaleString()} {tx.sourceCurrency}
                                                </div>
                                                <div className="num-mono" style={{ fontSize: '0.75rem', color: '#16a34a' }}>
                                                    ≈ {tx.destCurrency === 'INR' ? '₹' : ''}{tx.destAmount.toLocaleString()} {tx.destCurrency}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{tx.recipient.name}</div>
                                                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                                                    {tx.recipient.identifier.slice(0, 16)}...
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge badge-${tx.risk.level.toLowerCase()}`}>
                                                    {tx.risk.level}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="badge badge-completed">
                                                    {tx.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Right Column: Live Corridors & Quick Actions */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                                Supported Corridors
                            </h2>
                            <Link href="/corridors" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#2563eb' }}>
                                All Corridors →
                            </Link>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {corridors.slice(0, 6).map((c) => (
                                <div key={c.id} className="fin-card" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '0.9rem' }}>
                                            <span>{c.flag}</span>
                                            <span>{c.name}</span>
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
                                            1 {c.sourceCurrency} = ₹{c.demoRate.toFixed(2)} INR
                                        </div>
                                    </div>
                                    <Link href={`/send?corridor=${c.id}`} className="btn btn-secondary btn-sm" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                                        Send →
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
